# Gamify - Browser Games Collection

A modern, gamified website hosting classic games ported to the browser.
Developed with Vanilla JavaScript, HTML5, and CSS3.

## Features

- **Guess The Number**: Test your intuition.
- **Rock Paper Scissors**: Classic hand game against AI.
- **Hangman**: Word guessing game with visual feedback.
- **Blackjack**: Card game against a dealer.
- **Music Section**: Curated gaming tracks with a built-in player.
- **Responsive Design**: Works on desktop and mobile.
- **Dark Mode**: Sleek, modern aesthetic.

## How to Run

Since modern browsers restrict JavaScript modules for security when opening files directly (`file://`), you need to run a local web server.

### Using Python (Recommended)

1.  Open a terminal in this directory (`d:\DATA\GAMEFY`).
2.  Run the following command:
    ```bash
    python -m http.server 8000
    ```
3.  Open your browser and navigate to:
    [http://localhost:8000](http://localhost:8000)

### No Python?

If you cannot run Python, you can use extensions like "Live Server" in VS Code, or install Node.js and use `npx serve`.

## Project Structure

- `index.html`: Main entry point.
- `style.css`: Global styles and themes.
- `script.js`: Main logic and navigation.
- `games/`: Individual game modules.
- `components/`: UI components.
    - `Profile.js`: User profile and stats.
    - `Music.js`: Music player and track list.
