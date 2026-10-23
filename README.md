# fun_with_git

A clean, modern, zero-dependency full-stack application built using native HTML, CSS, JavaScript, and Node.js.


## 🚀 Quick Start

Run the backend server directly with Node:

```bash
node server.js
```

Or using npm:

```bash
npm start
```

Then open your browser at:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📁 Architecture

- **`server.js`**: Built using Node.js built-in standard library (`node:http`, `node:fs`). Requires zero external `npm` packages or installations.
  - Serves static assets from the `public/` folder.
  - `GET /api/status`: Returns server health, uptime, and timestamp.
  - `POST /api/greet`: Receives a JSON payload and returns personalized response.
  - `GET /api/quote`: Returns random quotes dynamically.
- **`public/index.html`**: Semantic HTML5 page layout with live status indicators and interactive cards.
- **`public/style.css`**: Vanilla CSS with modern dark mode, glassmorphism, responsive grid, and fluid micro-animations.
- **`public/app.js`**: Native async/await client logic fetching and rendering server data in real-time.
