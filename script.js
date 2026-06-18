const mediaInput = document.getElementById('media-input');
const mediaType = document.getElementById('media-type');
const mediaPriority = document.getElementById('media-priority');
const addBtn = document.getElementById('add-btn');
const lockedList = document.getElementById('locked-list');
const unlockedList = document.getElementById('unlocked-list'); 

// --- Function to draw a card on the screen ---
// --- Function to draw a card on the screen ---
function renderCard(id, title, type, priority) {
    const newCard = document.createElement('div');
    newCard.className = 'media-card';
    newCard.setAttribute('data-id', id);

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
        <div class="text-muted status-text" style="font-size: 0.85rem;">Remaining: 3 seconds</div>
        <div class="countdown-bar">
            <div class="progress-fill" style="width: 0%;"></div>
        </div>
    `;

    // Diagnostic Check: Verify if the container actually exists
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
        // Pass the new backend-generated ID into the card UI
        renderCard(savedItem.id, savedItem.title, savedItem.type, savedItem.priority);
    })
    .catch(error => console.error("Error saving:", error));

    mediaInput.value = "";
});

// Helper function to handle network deletion
function deleteCardFromServer(cardElement, alertMessage) {
    const itemId = cardElement.getAttribute('data-id');

    // Shoot a DELETE request over the wire
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
            deleteCardFromServer(card, "Enjoy watching/playing! Hope it lives up to the expectations! 🎉");
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
                renderCard(item.id, item.title, item.type, item.priority);
            });
        })
        .catch(err => console.log("Backend offline, skipping initial load."));
}

loadInitialMedia();


// --- LIVE TICK ENGINE (FAST 3-SECOND COOLDOWN FOR TESTING) ---
// --- DIAGNOSTIC LIVE TICK ENGINE ---
setInterval(() => {
    const cards = document.querySelectorAll('.media-card');
    
    cards.forEach(card => {
        if (card.closest('#unlocked-list')) return;

        if (!card.totalTimeElapsed) {
            card.totalTimeElapsed = 0;
            card.maxDuration = 3; 
        }

        card.totalTimeElapsed++;

        const remainingTime = card.maxDuration - card.totalTimeElapsed;
        const progressPercentage = (card.totalTimeElapsed / card.maxDuration) * 100;

        const statusText = card.querySelector('.status-text');
        const progressFill = card.querySelector('.progress-fill');

        // Safety Check: If HTML elements inside the card are missing, log it!
        if (!statusText || !progressFill) {
            console.error("ERROR: Missing '.status-text' or '.progress-fill' classes inside your card HTML structure!");
            return;
        }

        if (remainingTime > 0) {
            statusText.innerText = `Remaining: ${remainingTime} seconds`;
            progressFill.style.width = `${progressPercentage}%`;
        } else {
            statusText.innerText = `🔓 Unlocked! Ready to decide.`;
            statusText.style.color = '#22c55e';
            progressFill.style.width = '100%';
            progressFill.style.backgroundColor = '#22c55e';

            // Safety Check: If the destination list doesn't exist, log it!
            if (!unlockedList) {
                console.error("ERROR: Could not find an HTML element with id='unlocked-list' to move the card into!");
                return;
            }

            if (!card.alreadyMoved) {
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

// --- EMERGENCY TIMER TEST ---
setInterval(() => {
    console.log("⏰ SYSTEM CHECK: The loop is ticking live every second!");
}, 1000);