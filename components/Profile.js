import { store } from '../store.js';

export function renderProfile(container) {
    const state = store.state;

    // Calculate progress to next level (mock logic)
    const nextLevelThreshold = 100 * Math.pow(2, state.level); // Example scaling
    const progressPercent = Math.min(100, (state.xp / nextLevelThreshold) * 100);

    container.innerHTML = `
        <h2 class="game-title">Player Profile</h2>
        
        <div class="profile-header glass-panel">
            <div class="avatar-circle">${state.level}</div>
            <div class="profile-info">
                <h3>Player One</h3>
                <div class="level-bar-container">
                    <div class="level-bar-fill" style="width: ${progressPercent}%"></div>
                </div>
                <p>Level ${state.level} • ${state.xp} XP / ${nextLevelThreshold} XP</p>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card glass-panel">
                <div class="stat-val">${state.points}</div>
                <div class="stat-label">Total Points</div>
            </div>
            <div class="stat-card glass-panel">
                <div class="stat-val">${state.streak} 🔥</div>
                <div class="stat-label">Day Streak</div>
            </div>
            <div class="stat-card glass-panel">
                <div class="stat-val">${state.gamesPlayed}</div>
                <div class="stat-label">Games Played</div>
            </div>
        </div>

        <h3 style="margin: 2rem 0 1rem;">Achievements</h3>
        <div class="badges-grid">
            ${state.badges.length > 0
            ? state.badges.map(b => `<div class="badge glass-panel">🏆 ${b}</div>`).join('')
            : '<p style="color:var(--text-dim)">No badges yet. Play games to earn them!</p>'}
        </div>
    `;
}
