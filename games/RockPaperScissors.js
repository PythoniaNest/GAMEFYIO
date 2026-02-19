import { store } from '../store.js';

export function startRockPaperScissors(container) {
    let userScore = 0;
    let cpuScore = 0;
    let winStreak = 0;
    const choices = ['Rock', 'Paper', 'Scissors'];
    const emojis = { 'Rock': '✊', 'Paper': '✋', 'Scissors': '✌️' };

    container.innerHTML = `
        <h2 class="game-title">Rock Paper Scissors (Best of 5)</h2>
        <div class="score-board" style="display: flex; justify-content: space-around; font-size: 1.5rem; margin: 2rem 0;">
            <div>You: <span id="user-score" class="big-text">0</span></div>
            <div>CPU: <span id="cpu-score" class="big-text">0</span></div>
        </div>
        <div id="result" class="game-message" style="min-height: 5rem;">Make your move!</div>
        <div class="choices" style="display: flex; gap: 1rem; justify-content: center;">
            <button class="game-btn choice-btn" data-choice="Rock">✊ Rock</button>
            <button class="game-btn choice-btn" data-choice="Paper">✋ Paper</button>
            <button class="game-btn choice-btn" data-choice="Scissors">✌️ Scissors</button>
        </div>
        <button id="reset-btn" class="game-btn secondary" style="margin-top: 2rem;">New Match</button>
    `;

    const resultDiv = container.querySelector('#result');
    const userScoreSpan = container.querySelector('#user-score');
    const cpuScoreSpan = container.querySelector('#cpu-score');

    container.querySelectorAll('.choice-btn').forEach(btn => {
        btn.onclick = () => playRound(btn.dataset.choice);
    });

    container.querySelector('#reset-btn').onclick = resetGame;

    function resetGame() {
        userScore = 0;
        cpuScore = 0;
        winStreak = 0;
        updateScore();
        resultDiv.textContent = "New match! First to 3 wins!";
        resultDiv.style.color = "white";
        container.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = false);
    }

    function updateScore() {
        userScoreSpan.textContent = userScore;
        cpuScoreSpan.textContent = cpuScore;
    }

    function playRound(userChoice) {
        if (userScore >= 3 || cpuScore >= 3) return;

        // Simple predictive AI (mock): if user won last time, they might repeat? 
        // For now, random is fair enough.
        const cpuChoice = choices[Math.floor(Math.random() * 3)];

        let result = "";
        let color = "white";

        if (userChoice === cpuChoice) {
            result = "It's a tie!";
            color = "var(--text-dim)";
            winStreak = 0;
        } else if (
            (userChoice === 'Rock' && cpuChoice === 'Scissors') ||
            (userChoice === 'Paper' && cpuChoice === 'Rock') ||
            (userChoice === 'Scissors' && cpuChoice === 'Paper')
        ) {
            result = "You win this round!";
            userScore++;
            winStreak++;
            color = "#00ff00";

            // Streak Multiplier
            const points = 10 * (winStreak > 2 ? 2 : 1);
            store.addPoints(points, winStreak > 2 ? "Streak Bonus!" : "Round Win");

        } else {
            result = "You lose this round!";
            cpuScore++;
            winStreak = 0;
            color = "var(--secondary)";
        }

        updateScore();
        resultDiv.innerHTML = `
            <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">
                <span class="emoji-animate">${emojis[userChoice]}</span> vs <span class="emoji-animate">${emojis[cpuChoice]}</span>
            </div>
            <div style="font-weight: bold; font-size: 1.5rem; color: ${color};">${result}</div>
        `;

        checkMatchEnd();
    }

    function checkMatchEnd() {
        if (userScore === 3) {
            resultDiv.innerHTML += `<div style="color: #00ff00; margin-top: 1rem;">🏆 MATCH WON! (+50 Bonus)</div>`;
            store.addPoints(50, "Match Victory");
            store.unlockBadge("RPS Champion");
            disableButtons();
        } else if (cpuScore === 3) {
            resultDiv.innerHTML += `<div style="color: var(--secondary); margin-top: 1rem;">💀 MATCH LOST!</div>`;
            disableButtons();
        }
    }

    function disableButtons() {
        container.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = true);
    }
}
