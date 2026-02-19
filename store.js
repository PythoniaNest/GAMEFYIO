const defaultState = {
    points: 0,
    level: 1,
    xp: 0, // Experience points for leveling
    gamesPlayed: 0,
    badges: [],
    streak: 0,
    lastLogin: null, // Timestamp
    inventory: [] // For unlocking themes/hints
};

const LEVEL_THRESHOLDS = {
    1: 0,
    2: 100,
    3: 500,
    4: 1000,
    5: 2500,
    6: 5000
};

class GameStore {
    constructor() {
        this.state = this.loadProgress();
        this.listeners = [];
        this.checkStreak();
    }

    loadProgress() {
        const stored = localStorage.getItem('gamify_save');
        return stored ? { ...defaultState, ...JSON.parse(stored) } : defaultState;
    }

    saveProgress() {
        localStorage.setItem('gamify_save', JSON.stringify(this.state));
        this.notify();
    }

    checkStreak() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        if (this.state.lastLogin) {
            const last = new Date(this.state.lastLogin);
            const lastDate = new Date(last.getFullYear(), last.getMonth(), last.getDate()).getTime();

            const diffDays = (today - lastDate) / (1000 * 60 * 60 * 24);

            if (diffDays === 1) {
                this.state.streak++;
                this.addPoints(50, "Daily Streak Bonus!"); // Bonus
            } else if (diffDays > 1) {
                this.state.streak = 1; // Reset
            }
            // If diffDays === 0, same day, do nothing
        } else {
            this.state.streak = 1;
        }

        this.state.lastLogin = now.getTime();
        this.saveProgress();
    }

    addPoints(amount, reason = "") {
        this.state.points += amount;
        this.state.xp += amount;
        this.checkLevelUp();
        this.saveProgress();
        if (reason) this.showToast(`+${amount} pts: ${reason}`);
    }

    checkLevelUp() {
        const currentLevel = this.state.level;
        let newLevel = currentLevel;

        // Simple check against thresholds
        for (const [lvl, threshold] of Object.entries(LEVEL_THRESHOLDS)) {
            if (this.state.xp >= threshold) {
                newLevel = Math.max(newLevel, parseInt(lvl));
            }
        }

        if (newLevel > currentLevel) {
            this.state.level = newLevel;
            this.showToast(`🎉 Level Up! You are now Level ${newLevel}!`);
            this.unlockBadge(`Level ${newLevel} Reached`);
        }
    }

    unlockBadge(badgeName) {
        if (!this.state.badges.includes(badgeName)) {
            this.state.badges.push(badgeName);
            this.showToast(`🏆 Badge Unlocked: ${badgeName}`);
            this.saveProgress();
        }
    }

    // Subscriptions for UI updates
    subscribe(listener) {
        this.listeners.push(listener);
        listener(this.state); // Initial call
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(l => l(this.state));
    }

    showToast(msg) {
        // Simple global toast handler
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = msg;
        document.body.appendChild(toast);

        setTimeout(() => toast.style.opacity = '1', 100);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
}

export const store = new GameStore();
