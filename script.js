import { startGuessTheNumber } from './games/GuessTheNumber.js';
import { startRockPaperScissors } from './games/RockPaperScissors.js';
import { startHangman } from './games/Hangman.js';
import { startBlackjack } from './games/Blackjack.js';
import { store } from './store.js';
import { renderProfile } from './components/Profile.js';

const gameRegistry = {
    'guess-number': startGuessTheNumber,
    'rps': startRockPaperScissors,
    'hangman': startHangman,
    'blackjack': startBlackjack
};

// Listen to store changes for NavBar updates
store.subscribe((state) => {
    const navPoints = document.getElementById('nav-points');
    if (navPoints) navPoints.textContent = `${state.points} pts`;
});

// Navigation Logic
window.navigateTo = (viewId) => {
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));

    // Update active nav link if exists
    const navLink = document.querySelector(`.nav-link[data-target="${viewId}"]`);
    if (navLink) navLink.classList.add('active');

    if (viewId === 'home') {
        document.getElementById('home-view').classList.add('active');
    } else if (viewId === 'games') {
        document.getElementById('home-view').classList.add('active');
        document.querySelector('.featured-games').scrollIntoView({ behavior: 'smooth' });
    } else if (viewId === 'profile') {
        document.getElementById('profile-view').classList.add('active');
        renderProfile(document.getElementById('profile-container'));
    } else if (viewId === 'music') {
        document.getElementById('music-view').classList.add('active');
        import('./components/Music.js').then(module => {
            module.renderMusic(document.getElementById('music-container'));
        });
    } else if (viewId === 'about') {
        alert("Gamify - Created by Antigravity.\nVersion 1.0");
    }
};

window.loadGame = (gameId) => {
    const container = document.getElementById('active-game-area');
    container.innerHTML = ''; // Clear previous game

    const gameFunc = gameRegistry[gameId];
    if (gameFunc) {
        // Switch view
        document.getElementById('home-view').classList.remove('active');
        document.getElementById('profile-view').classList.remove('active'); // Ensure profile is closed
        document.getElementById('game-container').classList.add('active');

        // Start game
        gameFunc(container);
    } else {
        console.error(`Game ${gameId} not found!`);
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log("Gamify loaded!");
    store.notify(); // Initial UI update
});
