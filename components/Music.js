const tracks = [
    {
        id: 1,
        title: "Neon Nights",
        artist: "Synthwave Master",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        art: "🌌"
    },
    {
        id: 2,
        title: "Cyber City",
        artist: "Droid Pulse",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        art: "🏙️"
    },
    {
        id: 3,
        title: "Pixel Quest",
        artist: "8-Bit Hero",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        art: "🎮"
    },
    {
        id: 4,
        title: "Lofi Dungeon",
        artist: "Chill Goblin",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
        art: "🏰"
    }
];

let currentTrackIndex = 0;
let isPlaying = false;
let audio = new Audio(tracks[currentTrackIndex].url);

export function renderMusic(container) {
    container.innerHTML = `
        <div class="music-header" style="text-align: center; padding: 2rem 0;">
            <h1>Rhythm & <span class="highlight">Gaming</span></h1>
            <p style="color: var(--text-dim);">Curated tracks for your gaming session.</p>
        </div>
        
        <div class="music-layout">
            <div class="track-list">
                ${tracks.map((track, index) => `
                    <div class="track-item ${index === currentTrackIndex ? 'active' : ''}" onclick="window.playTrack(${index})">
                        <div class="track-art">${track.art}</div>
                        <div class="track-info">
                            <h4>${track.title}</h4>
                            <p>${track.artist}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="player-card">
                <div class="now-playing-art" id="player-art">${tracks[currentTrackIndex].art}</div>
                <h3 id="player-title" style="margin-bottom: 0.5rem;">${tracks[currentTrackIndex].title}</h3>
                <p id="player-artist" style="color: var(--text-dim); margin-bottom: 1.5rem;">${tracks[currentTrackIndex].artist}</p>
                
                <div class="progress-container" id="progress-container">
                    <div class="progress-bar" id="progress-bar"></div>
                </div>
                <div class="time-info">
                    <span id="current-time">0:00</span>
                    <span id="duration">0:00</span>
                </div>
                
                <div class="player-controls">
                    <button class="control-btn" onclick="window.prevTrack()">⏮</button>
                    <button class="play-pause-btn" id="play-pause-btn" onclick="window.togglePlay()">
                        ${isPlaying ? '⏸' : '▶'}
                    </button>
                    <button class="control-btn" onclick="window.nextTrack()">⏭</button>
                </div>
            </div>
        </div>
    `;

    // Audio event listeners
    audio.ontimeupdate = updateProgress;
    audio.onended = () => window.nextTrack();

    // Register global functions for onclick
    window.togglePlay = togglePlay;
    window.playTrack = playTrack;
    window.nextTrack = nextTrack;
    window.prevTrack = prevTrack;

    const progressContainer = document.getElementById('progress-container');
    if (progressContainer) progressContainer.addEventListener('click', seek);

    // Sync UI if already playing
    if (isPlaying) {
        updateProgress();
    }
}

function togglePlay() {
    const btn = document.getElementById('play-pause-btn');
    if (isPlaying) {
        audio.pause();
        if (btn) btn.innerHTML = '▶';
    } else {
        audio.play().catch(e => console.error("Audio play failed:", e));
        if (btn) btn.innerHTML = '⏸';
    }
    isPlaying = !isPlaying;
}

function playTrack(index) {
    const wasPlaying = isPlaying;
    currentTrackIndex = index;

    audio.src = tracks[currentTrackIndex].url;

    // Update UI
    const trackItems = document.querySelectorAll('.track-item');
    trackItems.forEach((el, i) => {
        el.classList.toggle('active', i === index);
    });

    const playerArt = document.getElementById('player-art');
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');

    if (playerArt) playerArt.innerHTML = tracks[index].art;
    if (playerTitle) playerTitle.textContent = tracks[index].title;
    if (playerArtist) playerArtist.textContent = tracks[index].artist;

    isPlaying = false; // Reset to false and let togglePlay start it
    togglePlay();
}

function nextTrack() {
    let nextIndex = (currentTrackIndex + 1) % tracks.length;
    playTrack(nextIndex);
}

function prevTrack() {
    let prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    playTrack(prevIndex);
}

function updateProgress() {
    const { duration, currentTime } = audio;
    if (isNaN(duration)) return;

    const progressPercent = (currentTime / duration) * 100;
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) progressBar.style.width = `${progressPercent}%`;

    const currTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');

    if (currTimeEl) currTimeEl.textContent = formatTime(currentTime);
    if (durationEl) durationEl.textContent = formatTime(duration);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function seek(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if (!isNaN(duration)) {
        audio.currentTime = (clickX / width) * duration;
    }
}
