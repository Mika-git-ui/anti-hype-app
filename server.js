const express = require('express');
const cors = require('cors'); 

const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json());

// Temporary database array
let mediaItems = [

];

// GET Route
app.get('/api/media', (req, res) => {
    res.json(mediaItems);
});

// POST Route
// POST Route: Saves item with a real creation timestamp
app.post('/api/media', (req, res) => {
    const newItem = {
        id: mediaItems.length + 1,
        title: req.body.title,
        type: req.body.type,
        priority: req.body.priority,
        createdAt: Date.now() // 🕒 Saves the exact millisecond this item was created!
    };
    
    mediaItems.push(newItem);
    console.log("Saved new item with timestamp:", newItem.title);
    res.status(201).json(newItem);
});

// DELETE Route
app.delete('/api/media/:id', (req, res) => {
    const idToIdentify = parseInt(req.params.id);
    mediaItems = mediaItems.filter(item => item.id !== idToIdentify);
    console.log(`Item with ID ${idToIdentify} deleted from backend.`);
    res.status(200).json({ message: "Item successfully removed from backend!" });
});

// Start the server infinite loop
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`Backend server is running live at http://localhost:${PORT}`);
    console.log(`Press Ctrl + C to stop the server loop`);
    console.log(`=========================================`);
});