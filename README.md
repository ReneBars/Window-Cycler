This repo contains two automation scripts that turn any four Chrome windows into a rotating, self‑scrolling display:

- **Cycle.ahk**: Automatically cycles through four open Chrome windows at a set interval, refreshing each on arrival and injecting the scroll script into window #4.  
- **ScrollScript.js**: A lightweight JS snippet that detects scrollable elements on the page and continuously scrolls up and down at a given scrollSpeed and scrollDuration pausing on any user interaction.

Features:
- Hands‑free cycling through multiple Chrome windows  
- Auto‑refresh on each window switch  
- Smooth bidirectional scrolling on the designated window  
- Configurable intervals and speeds via simple variables

Prerequisites:
- **AutoHotkey v2** (for running `Cycle.ahk`)  
- **Web Browser**  
- (Optional) **TamperMonkey** or DevTools console to load `ScrollScript.js`

