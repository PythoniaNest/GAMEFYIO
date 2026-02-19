import { store } from '../store.js';

export function startBlackjack(container) {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    let deck = [];
    let playerHand = [];
    let dealerHand = [];
    let gameOver = false;
    let bet = 0;
    let chips = 0;

    // Convert Points to "Chips" for session
    // Or just use points directly. Let's use points directly as "Chips"

    container.innerHTML = `
        <h2 class="game-title">Blackjack (Dealer stands on 17)</h2>
        
        <div id="betting-screen" style="text-align: center; margin-bottom: 2rem;">
            <h3>Place Your Bet</h3>
            <p>Your Points: <span id="current-points">${store.state.points}</span></p>
            <div style="margin: 1rem;">
                <button class="game-btn bet-btn" data-amt="10">10</button>
                <button class="game-btn bet-btn" data-amt="50">50</button>
                <button class="game-btn bet-btn" data-amt="100">100</button>
            </div>
             <p id="bet-msg" style="color: var(--secondary); height: 1.5rem;"></p>
        </div>

        <div id="game-table" style="display: none; flex-direction: column; align-items: center; gap: 2rem;">
            <div class="hand-area">
                <h3>Dealer's Hand <span id="dealer-score"></span></h3>
                <div id="dealer-cards" class="cards-area"></div>
            </div>

            <div class="message-area" style="min-height: 3rem;">
                <div id="game-result" class="game-message"></div>
            </div>

            <div class="hand-area">
                <h3>Your Hand <span id="player-score"></span></h3>
                <div id="player-cards" class="cards-area"></div>
            </div>

            <div class="controls" style="display: flex; gap: 1rem;">
                <button id="hit-btn" class="game-btn">Hit</button>
                <button id="stand-btn" class="game-btn">Stand</button>
                <button id="dd-btn" class="game-btn">Double Down</button>
                <button id="new-game-btn" class="game-btn secondary" style="display: none;">New Game</button>
            </div>
            <p>Current Bet: <span id="active-bet" style="color: gold">0</span></p>
        </div>
    `;

    // Betting UI Logic
    container.querySelectorAll('.bet-btn').forEach(btn => {
        btn.onclick = () => {
            const amt = parseInt(btn.dataset.amt);
            if (store.state.points >= amt) {
                bet = amt;
                store.addPoints(-amt, "Blackjack Bet");
                startGame();
            } else {
                container.querySelector('#bet-msg').textContent = "Not enough points!";
            }
        };
    });

    const dealerCardsDiv = container.querySelector('#dealer-cards');
    const playerCardsDiv = container.querySelector('#player-cards');
    const dealerScoreSpan = container.querySelector('#dealer-score');
    const playerScoreSpan = container.querySelector('#player-score');
    const resultDiv = container.querySelector('#game-result');
    const hitBtn = container.querySelector('#hit-btn');
    const standBtn = container.querySelector('#stand-btn');
    const ddBtn = container.querySelector('#dd-btn');
    const newGameBtn = container.querySelector('#new-game-btn');

    function startGame() {
        container.querySelector('#betting-screen').style.display = 'none';
        container.querySelector('#game-table').style.display = 'flex';
        container.querySelector('#active-bet').textContent = bet;
        startNewGame();
    }

    function createDeck() {
        deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ suit, value });
            }
        }
        deck.sort(() => Math.random() - 0.5);
    }

    function getCardValue(card) {
        if (['J', 'Q', 'K'].includes(card.value)) return 10;
        if (card.value === 'A') return 11;
        return parseInt(card.value);
    }

    function calculateScore(hand) {
        let score = 0;
        let aces = 0;
        for (let card of hand) {
            score += getCardValue(card);
            if (card.value === 'A') aces++;
        }
        while (score > 21 && aces > 0) {
            score -= 10;
            aces--;
        }
        return score;
    }

    function renderCard(card, hidden = false) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'playing-card';
        // Add subtle animation
        cardDiv.style.animation = "fadeIn 0.3s";

        if (hidden) {
            cardDiv.style.background = '#333';
            cardDiv.textContent = '?';
        } else {
            cardDiv.textContent = `${card.value}${card.suit}`;
            if (['♥', '♦'].includes(card.suit)) {
                cardDiv.style.color = 'red';
            }
        }
        return cardDiv;
    }

    function updateUI(showDealer = false) {
        dealerCardsDiv.innerHTML = '';
        dealerHand.forEach((card, index) => {
            dealerCardsDiv.appendChild(renderCard(card, !showDealer && index === 0));
        });

        playerCardsDiv.innerHTML = '';
        playerHand.forEach(card => {
            playerCardsDiv.appendChild(renderCard(card));
        });

        playerScoreSpan.textContent = `(${calculateScore(playerHand)})`;
        if (showDealer) {
            dealerScoreSpan.textContent = `(${calculateScore(dealerHand)})`;
        } else {
            dealerScoreSpan.textContent = '(?)';
        }

        if (gameOver) {
            hitBtn.disabled = true;
            standBtn.disabled = true;
            ddBtn.disabled = true;
            newGameBtn.style.display = 'inline-block';
        } else {
            hitBtn.disabled = false;
            standBtn.disabled = false;
            ddBtn.disabled = playerHand.length !== 2; // Only allow DD on first turn
            newGameBtn.style.display = 'none';
        }
    }

    function checkBlackjack() {
        const pScore = calculateScore(playerHand);
        if (pScore === 21) {
            const winAmt = Math.floor(bet * 2.5);
            store.addPoints(winAmt, "Blackjack!");
            endGame(`Blackjack! You win ${winAmt} pts!`, "win");
        }
    }

    function endGame(message, type) {
        gameOver = true;
        updateUI(true);
        resultDiv.textContent = message;
        if (type === 'win') resultDiv.style.color = '#00ff00';
        else if (type === 'lose') resultDiv.style.color = 'var(--secondary)';
        else resultDiv.style.color = 'white';
    }

    hitBtn.onclick = () => {
        playerHand.push(deck.pop());
        const score = calculateScore(playerHand);
        if (score > 21) {
            endGame("Bust! You lose.", "lose");
        } else {
            updateUI();
        }
    };

    ddBtn.onclick = () => {
        if (store.state.points >= bet) {
            store.addPoints(-bet, "Double Down");
            bet *= 2;
            container.querySelector('#active-bet').textContent = bet;
            playerHand.push(deck.pop());
            const score = calculateScore(playerHand);
            if (score > 21) {
                endGame("Bust! You lose.", "lose");
            } else {
                standBtn.click(); // Force stand after DD card
            }
        } else {
            alert("Not enough points to Double Down!");
        }
    }

    standBtn.onclick = () => {
        let dScore = calculateScore(dealerHand);
        while (dScore < 17) {
            dealerHand.push(deck.pop());
            dScore = calculateScore(dealerHand);
        }

        const pScore = calculateScore(playerHand);
        updateUI(true);

        if (dScore > 21) {
            const win = bet * 2;
            store.addPoints(win, "Dealer Bust");
            endGame(`Dealer busts! You win ${win} pts!`, "win");
        } else if (dScore > pScore) {
            endGame("Dealer wins!", "lose");
        } else if (dScore < pScore) {
            const win = bet * 2;
            store.addPoints(win, "Hand Won");
            endGame(`You win ${win} pts!`, "win");
        } else {
            store.addPoints(bet, "Push"); // Return bet
            endGame("Push! Bet returned.", "tie");
        }
    };

    newGameBtn.onclick = () => {
        container.querySelector('#current-points').textContent = store.state.points;
        container.querySelector('#betting-screen').style.display = 'block';
        container.querySelector('#game-table').style.display = 'none';
    };

    function startNewGame() {
        gameOver = false;
        createDeck();
        playerHand = [deck.pop(), deck.pop()];
        dealerHand = [deck.pop(), deck.pop()];
        resultDiv.textContent = '';
        updateUI();
        checkBlackjack();
    }
}
