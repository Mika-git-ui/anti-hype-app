// 1. Grab our UI Elements from the HTML page
const mediaInput = document.getElementById('media-input');
const mediaType = document.getElementById('media-type');
const mediaPriority = document.getElementById('media-priority');
const addBtn = document.getElementById('add-btn');
const lockedList = document.getElementById('locked-list');
const unlockedList = document.getElementById('unlocked-list'); // Added for the Decision Desk list

// 2. Listen for when the user clicks the "Track Pulse" button
addBtn.addEventListener('click', () => {
    const title = mediaInput.value.trim();
    const type = mediaType.value;
    const priority = mediaPriority.value;

    // Validation: Don't allow empty inputs
    if (title === "") {
        alert("Please enter a title first!");
        return;
    }

    // 3. Create a brand new real-time card dynamically
    const newCard = document.createElement('div');
    newCard.className = 'media-card';

    // Set up the type badge icon text
    let typeBadgeHtml = `<span class="badge badge-tv">📺 TV Show</span>`;
    if (type === 'game') typeBadgeHtml = `<span class="badge badge-game">🎮 Video Game</span>`;
    if (type === 'movie') typeBadgeHtml = `<span class="badge badge-tv" style="color:#60a5fa;">🎬 Movie</span>`;
    if (type === 'book') typeBadgeHtml = `<span class="badge badge-game" style="color:#a78bfa;">📚 Book</span>`;

    // Style boundary for extreme hype items
    const titleStyle = priority === 'high' ? 'color: #ef4444; font-weight: bold;' : '';

    newCard.innerHTML = `
        <div class="card-header">
            <span class="media-title" style="${titleStyle}">${title}</span>
            ${typeBadgeHtml}
        </div>
        <div class="text-muted" style="font-size: 0.85rem;">Remaining: 7 days, 0 hours</div>
        <div class="countdown-bar">
            <div class="progress-fill" style="width: 0%;"></div>
        </div>
    `;

    // 4. Inject this new card directly into "The Cooldown Chamber" column!
    lockedList.appendChild(newCard);

    // 5. Clear the input box so you can type the next item
    mediaInput.value = "";
});

if (unlockedList) {
    unlockedList.addEventListener('click', (event) => {
        // Find the closest media card container that holds the clicked button
        const card = event.target.closest('.media-card');
        if (!card) return;

        // Check if the clicked button or its text matches "Consume"
        if (event.target.classList.contains('btn-consume') || event.target.innerText.includes('Consume')) {
            card.style.transition = 'all 0.3s ease';
            card.style.transform = 'scale(0.9)';
            card.style.opacity = '0';
            setTimeout(() => {
                card.remove();
                alert("Enjoy watching/playing! Hope it lives up to the expectations! 🎉");
            }, 300);
        }

        // Check if the clicked button or its text matches "Drop Hype"
        if (event.target.classList.contains('btn-trash') || event.target.innerText.includes('Drop Hype')) {
            card.style.transition = 'all 0.3s ease';
            card.style.transform = 'scale(0.9)';
            card.style.opacity = '0';
            setTimeout(() => {
                card.remove();
                alert("Hype defeated! Saved you some valuable time. 🧠✨");
            }, 300);
        }
    });
}