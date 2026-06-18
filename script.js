const mediaInput = document.getElementById('media-input');
const mediaType = document.getElementById('media-type');
const mediaPriority = document.getElementById('media-priority');
const addBtn = document.getElementById('add-btn');
const lockedList = document.getElementById('locked-list');
const unlockedList = document.getElementById('unlocked-list'); 

// --- Function to draw a card on the screen ---
function renderCard(id, title, type, priority, createdAt) {
    const newCard = document.createElement('div');
    newCard.className = 'media-card';
    newCard.setAttribute('data-id', id);
    // 🕒 Crucial: Store the timestamp directly on the element layout
    newCard.setAttribute('data-created-at', createdAt); 

    let typeBadgeHtml = `<span class="badge badge-tv">📺 TV Show</span>`;
    if (type === 'game') typeBadgeHtml = `<span class="badge badge-game">🎮 Video Game</span>`;
    if (type === 'movie') typeBadgeHtml = `<span class="badge badge-tv" style="color:#60a5fa;">🎬 Movie</span>`;
    if (type === 'book') typeBadgeHtml = `<span class="badge badge-game" style="color:#a78bfa;">📚 Book</span>`;

    const titleStyle = priority === 'high' ? 'color: #ef4444; font-weight: bold;' : '';

    newCard.innerHTML = `
        <div class="card-header">
            <span class="media-title" style="${titleStyle}">${title}</span>
            ${typeBadgeHtml}
        </div>
        <div class="text-muted status-text" style="font-size: 0.85rem;">Calculating remaining time...</div>
        <div class="countdown-bar">
            <div class="progress-fill" style="width: 0%;"></div>
        </div>
    `;

    if (lockedList) {
        lockedList.appendChild(newCard);
    } else {
        console.error("CRITICAL ERROR: Could not find an HTML element with id='locked-list'!");
    }
}

// Track Pulse Event Listener (Sends data to Backend)
addBtn.addEventListener('click', () => {
    const title = mediaInput.value.trim();
    const type = mediaType.value;
    const priority = mediaPriority.value;

    if (title === "") {
        alert("Please enter a title first!");
        return;
    }

    fetch('http://localhost:3000/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type, priority })
    })
    .then(response => response.json())
    .then(savedItem => {
        // Pass the backend-generated timestamp into the UI
        renderCard(savedItem.id, savedItem.title, savedItem.type, savedItem.priority, savedItem.createdAt);
    })
    .catch(error => console.error("Error saving:", error));

    mediaInput.value = "";
});

// Helper function to handle network deletion
function deleteCardFromServer(cardElement, alertMessage) {
    const itemId = cardElement.getAttribute('data-id');

    fetch(`http://localhost:3000/api/media/${itemId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        cardElement.style.transition = 'all 0.3s ease';
        cardElement.style.transform = 'scale(0.9)';
        cardElement.style.opacity = '0';
        setTimeout(() => {
            cardElement.remove();
            alert(alertMessage);
        }, 300);
    })
    .catch(err => console.error("Could not delete from backend:", err));
}

// Decision Desk actions linked to Backend
if (unlockedList) {
    unlockedList.addEventListener('click', (event) => {
        const card = event.target.closest('.media-card');
        if (!card) return;

        if (event.target.classList.contains('btn-consume') || event.target.innerText.includes('Consume')) {
            deleteCardFromServer(card, "Enjoy watching/playing! Hope it lives up to expectations! 🎉");
        }

        if (event.target.classList.contains('btn-trash') || event.target.innerText.includes('Drop Hype')) {
            deleteCardFromServer(card, "Hype defeated! Saved you some valuable time. 🧠✨");
        }
    });
}

// Load Initial Setup from server
function loadInitialMedia() {
    fetch('http://localhost:3000/api/media')
        .then(response => response.json())
        .then(itemsList => {
            itemsList.forEach(item => {
                // Read stored creation timestamp or fallback gracefully
                renderCard(item.id, item.title, item.type, item.priority, item.createdAt || Date.now());
            });
        })
        .catch(err => console.log("Backend offline, skipping initial load."));
}

loadInitialMedia();


// --- ⏳ PRODUCTION 2-DAY COOLDOWN TICK ENGINE ---
setInterval(() => {
    const cards = document.querySelectorAll('.media-card');
    
    // 2 Days in milliseconds: (2 * 24 * 60 * 60 * 1000)
    const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000; 

    cards.forEach(card => {
        if (card.closest('#unlocked-list')) return;

        const createdAt = parseInt(card.getAttribute('data-created-at'));
        // If an item doesn't have a valid timestamp yet, skip it for one tick
        if (!createdAt) return; 

        const now = Date.now();
        const timeElapsed = now - createdAt;
        const timeLeft = TWO_DAYS_MS - timeElapsed;

        const statusText = card.querySelector('.status-text');
        const progressFill = card.querySelector('.progress-fill');

        if (!statusText || !progressFill) return;

        if (timeLeft > 0) {
            const totalSecondsLeft = Math.floor(timeLeft / 1000);
            const hours = Math.floor(totalSecondsLeft / 3600);
            const minutes = Math.floor((totalSecondsLeft % 3600) / 60);
            const seconds = totalSecondsLeft % 60;

            statusText.innerText = `Remaining: ${hours}h ${minutes}m ${seconds}s`;
            
            const progressPercentage = (timeElapsed / TWO_DAYS_MS) * 100;
            progressFill.style.width = `${progressPercentage}%`;
        } else {
            statusText.innerText = `🔓 Unlocked! Ready to decide.`;
            statusText.style.color = '#22c55e';
            progressFill.style.width = '100%';
            progressFill.style.backgroundColor = '#22c55e';

            if (unlockedList && !card.alreadyMoved) {
                card.alreadyMoved = true;
                
                const actionsContainer = document.createElement('div');
                actionsContainer.style.marginTop = '10px';
                actionsContainer.style.display = 'flex';
                actionsContainer.style.gap = '10px';
                actionsContainer.innerHTML = `
                    <button class="btn-consume" style="background:#22c55e; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Consume</button>
                    <button class="btn-trash" style="background:#ef4444; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Drop Hype</button>
                `;
                card.appendChild(actionsContainer);
                unlockedList.appendChild(card);
                console.log("Card successfully moved to Decision Desk!");
            }
        }
    });
}, 1000);