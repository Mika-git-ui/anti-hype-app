const express = require('express');
// 1. Import the CORS package
const cors = require('cors'); 

const app = express();
const PORT = 3000;

// 2. Open the gates so your frontend can connect!
app.use(cors()); 
app.use(express.json());

// This array is our temporary database holding our media items!
let mediaItems = [
    { id: 1, title: "Elden Ring DLC", type: "game", priority: "high" }
];

// GET Route: Sends all current media items back to whoever asks for them
app.get('/api/media', (req, res) => {
    res.json(mediaItems);
});

// POST Route: Accepts a new media item from the frontend and saves it
app.post('/api/media', (req, res) => {
    const newItem = {
        id: mediaItems.length + 1,
        title: req.body.title,
        type: req.body.type,
        priority: req.body.priority
    };
    
    mediaItems.push(newItem);
    console.log("Saved new item to backend:", newItem);
    
    res.status(201).json(newItem);
});

// DELETE Route: Removes an item from our array using its unique ID
app.delete('/api/media/:id', (req, res) => {
    const idToIdenitfy = parseInt(req.params.id);
    
    // Filter out the item with the matching ID
    mediaItems = mediaItems.filter(item => item.id !== idToIdenitfy);
    
    console.log(`Item with ID ${idToIdenitfy} deleted from backend.`);
    res.status(200).json({ message: "Item successfully removed from backend!" });
});

app.listen(PORT, () => {
    console.log(`Backend server is running live at http://localhost:${PORT}`);
});