# 🕹️ Pong Practice Game

Welcome to the **Pong Practice Game**, a browser-based pong clone built with HTML5 Canvas and vanilla JavaScript. It includes multi-ball mode, keyboard controls, randomized player names, and a simple tabbed navigation system.

---

## 🎮 Features

- **Practice Tab View** using hash-based routing (`#practice`)
- **Classic Pong Mechanics**: paddle and ball physics using Canvas
- **Multi-ball Mode** with dynamic color and direction
- **Keyboard Controls** for both paddles:
  - `W` / `S` — Left Player
  - `↑` / `↓` — Right Player
- **Randomized Funny Player Names**
- **Start/Stop Control Buttons**
- **Responsive UI** using Flexbox and CSS `clamp`

---

## 🚀 Getting Started
```bash
git clone https://github.com/akrepkov/crazy_pong.git
cd public

open index.html       # macOS
start index.html      # Windows
xdg-open index.html   # Linux
 ```
## 🧠 How It Works
- Routing: Hash-based navigation controls view switching
- Rendering: HTML5 Canvas used for drawing paddles and balls
- Game Loop: requestAnimationFrame runs continuous updates
- Ball & Paddle: Defined using ES6 classes
- Score: Updated when a ball passes a paddle
- Game End: When a player reaches maxScore, game stops
- Visibility: Logs tab visibility changes using visibilitychange
