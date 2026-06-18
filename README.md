 🚀 Real-Time Media Hype Tracker

A full-stack web application designed to track media consumption with a built-in "cooldown" engine. It locks newly tracked media items into a buffer zone before allowing them to be processed or discarded, helping users overcome impulse viewing.

🛠️ Tech Stack
- **Frontend:** HTML5, CSS3 (Custom UI), JavaScript (Fetch API, DOM Manipulation)
- **Backend:** Node.js, Express.js (REST API architecture)
- **Networking:** CORS middleware, RESTful Routing (`GET`, `POST`, `DELETE`)

 ⚡ Features
- **Full-Stack Architecture:** Frontend dynamically communicates with an Express backend server.
- **Live Cooldown Engine:** JavaScript timer ticks down states in real-time before releasing items to the Decision Desk.
- **RESTful State Sync:** Automatically updates and persists item states across client and server arrays via network endpoints.
