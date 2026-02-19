import { store } from '../store.js';

export function startGuessTheNumber(container) {
    let target;
    let attempts = 0;
    let maxRange = 100;
    let timerInterval;
    let timeLeft = 30;

    container.innerHTML = `
        <h2 class="game-title" style="margin-bottom: 2rem;">Guess The Number</h2>
        
        <div id="setup-screen">
            <h3 style="margin-bottom: 1rem;">Select Difficulty</h3>
            <button class="game-btn" onclick="document.dispatchEvent(new CustomEvent('difficulty-select', {detail: 50}))">Easy (1-50)</button>
            <button class="game-btn" onclick="document.dispatchEvent(new CustomEvent('difficulty-select', {detail: 100}))">Medium (1-100)</button>
            <button class="game-btn" onclick="document.dispatchEvent(new CustomEvent('difficulty-select', {detail: 1000}))">Hard (1-1000)</button>
        </div>

        <div id="game-screen" style="display: none;">
            <div style="font-size: 1.5rem; color: var(--text-dim); margin-bottom: 1rem;">Time: <span id="timer" style="color:white">30</span>s</div>
            <p class="game-message">I'm thinking of a number between 1 and <span id="max-range">100</span>.</p>
            <div>
                <input type="number" id="guess-input" placeholder="Enter guess" min="1">
            </div>
            <button id="guess-btn" class="game-btn">Check Guess</button>
            <div id="feedback" style="margin-top: 1rem; font-size: 1.2rem; min-height: 1.5rem; color: var(--primary);"></div>
        </div>
    `;

    document.addEventListener('difficulty-select', (e) => {
        maxRange = e.detail;
        startGame();
    }, { once: true }); // Only listen once per game instance lifecycle effectively

    function startGame() {
        container.querySelector('#setup-screen').style.display = 'none';
        container.querySelector('#game-screen').style.display = 'block';
        container.querySelector('#max-range').textContent = maxRange;

        target = Math.floor(Math.random() * maxRange) + 1;
        attempts = 0;
        timeLeft = 30;

        startTimer();
    }

    function startTimer() {
        const timerEl = container.querySelector('#timer');
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            timerEl.textContent = timeLeft;
            if (timeLeft <= 0) {
                endGame(false, "Time's up!");
            }
        }, 1000);
    }

    const input = container.querySelector('#guess-input');
    const btn = container.querySelector('#guess-btn');
    const feedback = container.querySelector('#feedback');

    function check() {
        const guess = parseInt(input.value);
        if (isNaN(guess)) {
            feedback.textContent = "Please enter a valid number!";
            return;
        }

        attempts++;
        if (guess === target) {
            const rangeMultiplier = maxRange === 1000 ? 5 : (maxRange === 50 ? 0.5 : 1);
            const timeBonus = Math.floor(timeLeft / 2);
            const totalPoints = Math.floor((10 + timeBonus) * rangeMultiplier);

            store.addPoints(totalPoints, `Guessed in ${attempts} tries`);
            store.unlockBadge('Number Ninja');

            endGame(true, `🎉 Correct! You won ${totalPoints} pts!`);
        } else if (guess < target) {
            feedback.textContent = "Too low! Try a bigger number.";
            feedback.style.color = "var(--secondary)";
            store.addPoints(-1); // Small penalty
        } else {
            feedback.textContent = "Too high! Try a smaller number.";
            feedback.style.color = "var(--secondary)";
            store.addPoints(-1);
        }
        input.value = '';
        input.focus();
    }

    function endGame(win, msg) {
        clearInterval(timerInterval);
        feedback.innerHTML = msg;
        feedback.style.color = win ? "#00ff00" : "var(--secondary)";
        btn.textContent = "Play Again";
        btn.onclick = () => startGuessTheNumber(container);
        input.disabled = true;
    }

    btn.onclick = check;
    input.onkeypress = (e) => {
        if (e.key === 'Enter') check();
    };
    if (container.querySelector('#game-screen').style.display === 'block') input.focus();
}
