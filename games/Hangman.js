import { store } from '../store.js';

export function startHangman(container) {
    const categories = {
        'Fruits': ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "kiwi", "lemon", "mango", "orange", "pear", "quince", "raspberry", "strawberry", "tangerine", "watermelon"],
        'Animals': ["elephant", "giraffe", "hippopotamus", "kangaroo", "lion", "monkey", "penguin", "rhinoceros", "snake", "tiger", "zebra", "cheetah", "leopard", "jaguar"],
        'Colors': ["red", "orange", "yellow", "green", "blue", "indigo", "violet", "purple", "pink", "brown", "black", "white", "gray", "cyan", "magenta"],
        'Tech': ["computer", "keyboard", "mouse", "monitor", "laptop", "tablet", "smartphone", "smartwatch", "headphones", "speaker", "router", "modem", "server", "cloud", "internet"]
    };

    let words = categories['Fruits']; // Default
    const maxWrong = 6;
    let wrongGuesses = 0;
    let pickedWord = '';
    let guessedLetters = [];
    let hintsUsed = 0;

    container.innerHTML = `
        <h2 class="game-title">Hangman</h2>
        
        <div id="setup-screen" style="text-align: center; margin-bottom: 2rem;">
            <h3>Select Category</h3>
            <div id="categories" style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem;">
                ${Object.keys(categories).map(cat => `<button class="game-btn cat-btn" data-cat="${cat}">${cat}</button>`).join('')}
            </div>
        </div>

        <div id="game-screen" style="display: none;">
            <div class="game-layout" style="display: flex; gap: 2rem; align-items: flex-start; flex-wrap: wrap; justify-content: center;">
                <div class="hangman-figure" style="min-width: 200px; min-height: 250px; position: relative;">
                    <!-- SVG Hangman -->
                    <svg width="200" height="250" viewBox="0 0 200 250">
                        <line x1="20" y1="230" x2="180" y2="230" stroke="white" stroke-width="4"/>
                        <line x1="50" y1="230" x2="50" y2="20" stroke="white" stroke-width="4"/>
                        <line x1="50" y1="20" x2="150" y2="20" stroke="white" stroke-width="4"/>
                        <line x1="150" y1="20" x2="150" y2="50" stroke="white" stroke-width="4"/>
                        
                        <!-- Parts -->
                        <circle id="head" cx="150" cy="80" r="30" stroke="white" stroke-width="4" fill="none" style="display: none;"/>
                        <line id="body" x1="150" y1="110" x2="150" y2="170" stroke="white" stroke-width="4" style="display: none;"/>
                        <line id="arm-l" x1="150" y1="130" x2="120" y2="160" stroke="white" stroke-width="4" style="display: none;"/>
                        <line id="arm-r" x1="150" y1="130" x2="180" y2="160" stroke="white" stroke-width="4" style="display: none;"/>
                        <line id="leg-l" x1="150" y1="170" x2="120" y2="210" stroke="white" stroke-width="4" style="display: none;"/>
                        <line id="leg-r" x1="150" y1="170" x2="180" y2="210" stroke="white" stroke-width="4" style="display: none;"/>
                    </svg>
                </div>
                
                <div class="word-area" style="text-align: center;">
                    <button id="hint-btn" class="game-btn secondary" style="margin-bottom: 2rem;">Buy Hint (-10 pts)</button>
                    <div id="word-display" class="hangman-display" style="font-size: 3rem; letter-spacing: 0.5rem; margin-bottom: 2rem;"></div>
                    <div id="keyboard" class="alphabet-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem;"></div>
                    <div id="game-status" class="game-message" style="margin-top: 1rem;"></div>
                    <button id="restart-btn" class="game-btn" style="display: none;">Play Again</button>
                </div>
            </div>
        </div>
    `;

    container.querySelectorAll('.cat-btn').forEach(btn => {
        btn.onclick = () => {
            words = categories[btn.dataset.cat];
            container.querySelector('#setup-screen').style.display = 'none';
            container.querySelector('#game-screen').style.display = 'block';
            reset();
        };
    });

    container.querySelector('#hint-btn').onclick = useHint;

    function useHint() {
        if (store.state.points < 10) {
            container.querySelector('#game-status').textContent = "Not enough points for hint!";
            return;
        }

        // Find unguessed letter
        const unguessed = pickedWord.split('').filter(char => !guessedLetters.includes(char));
        if (unguessed.length > 0) {
            store.addPoints(-10, "Hint Used");
            hintsUsed++;
            const hintChar = unguessed[Math.floor(Math.random() * unguessed.length)];
            guessedLetters.push(hintChar);
            renderWord();
            renderKeyboard();
            checkWinLoss();
        }
    }

    function reset() {
        wrongGuesses = 0;
        guessedLetters = [];
        hintsUsed = 0;
        pickedWord = words[Math.floor(Math.random() * words.length)].toUpperCase();

        container.querySelectorAll('#head, #body, #arm-l, #arm-r, #leg-l, #leg-r').forEach(el => el.style.display = 'none');
        container.querySelector('#game-status').textContent = "Guess a letter!";
        container.querySelector('#restart-btn').style.display = 'none';

        renderWord();
        renderKeyboard();
    }

    function handleGuess(letter) {
        if (wrongGuesses >= maxWrong || !pickedWord) return;

        guessedLetters.push(letter);

        if (!pickedWord.includes(letter)) {
            wrongGuesses++;
            showPart(wrongGuesses);
        }

        renderWord();
        renderKeyboard();
        checkWinLoss();
    }

    function showPart(n) {
        const parts = ['head', 'body', 'arm-l', 'arm-r', 'leg-l', 'leg-r'];
        const partId = parts[n - 1];
        if (partId) container.querySelector(`#${partId}`).style.display = 'block';
    }

    function renderWord() {
        const display = pickedWord
            .split('')
            .map(char => guessedLetters.includes(char) ? char : '_')
            .join(' ');
        container.querySelector('#word-display').textContent = display;
    }

    function renderKeyboard() {
        const keyboard = container.querySelector('#keyboard');
        keyboard.innerHTML = '';
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

        alphabet.forEach(letter => {
            const btn = document.createElement('button');
            btn.textContent = letter;
            btn.className = 'alphabet-btn';
            btn.disabled = guessedLetters.includes(letter) || wrongGuesses >= maxWrong;
            if (!btn.disabled) {
                btn.onclick = () => handleGuess(letter);
            }
            keyboard.appendChild(btn);
        });
    }

    function checkWinLoss() {
        const isWin = pickedWord.split('').every(char => guessedLetters.includes(char));
        const isLoss = wrongGuesses >= maxWrong;

        if (isWin) {
            const points = pickedWord.length * 2;
            store.addPoints(points, "Word Solved");
            store.unlockBadge("Vocab Master");

            container.querySelector('#game-status').innerHTML = `<span style="color:#00ff00">You Won! The word was ${pickedWord} (+${points} pts)</span>`;
            disableAll();
            container.querySelector('#restart-btn').style.display = 'inline-block';
        } else if (isLoss) {
            container.querySelector('#game-status').innerHTML = `<span style="color:var(--secondary)">Game Over! The word was ${pickedWord}</span>`;
            disableAll();
            container.querySelector('#restart-btn').style.display = 'inline-block';
        }
    }

    function disableAll() {
        container.querySelectorAll('.alphabet-btn').forEach(btn => btn.disabled = true);
    }

    container.querySelector('#restart-btn').onclick = reset;
}
