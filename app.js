// ---------- State ----------
let tracks = [
    {
        id: "1",
        name: "SoundHelix Song 1",
        artist_name: "SoundHelix",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        album_image: "https://picsum.photos/200/200?random=1"
    },
    {
        id: "2",
        name: "SoundHelix Song 2",
        artist_name: "SoundHelix",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        album_image: "https://picsum.photos/200/200?random=2"
    },
    {
        id: "3",
        name: "SoundHelix Song 3",
        artist_name: "SoundHelix",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        album_image: "https://picsum.photos/200/200?random=3"
    }
];

let currentIndex = 0;
let isPlaying = false;
let shuffleMode = false;
let audio = new Audio();
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// ---------- DOM Elements ----------
const playlistEl = document.getElementById("playlist");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const shuffleBtn = document.getElementById("shuffle");
const albumArtEl = document.getElementById("albumArt");
const songTitleEl = document.getElementById("songTitle");
const songArtistEl = document.getElementById("songArtist");
const searchEl = document.getElementById("search");

const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const seekBar = document.getElementById("seekBar");

// ---------- Functions ----------
function renderPlaylist(list) {
    playlistEl.innerHTML = "";
    list.forEach((track, index) => {
        const songEl = document.createElement("div");
        songEl.classList.add("song");
        songEl.innerHTML = `
            <img src="${track.album_image}" alt="Album">
            <div class="song-info">
                <h4>${track.name}</h4>
                <p>${track.artist_name}</p>
            </div>
            <button class="fav-btn">${favorites.includes(track.id) ? "❤️" : "🤍"}</button>
        `;
        // Play on click
        songEl.addEventListener("click", () => {
            currentIndex = index;
            loadTrack(currentIndex);
            playAudio();
        });
        // Favorite button
        const favBtn = songEl.querySelector(".fav-btn");
        favBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleFavorite(track.id, favBtn);
        });
        playlistEl.appendChild(songEl);
    });
}

function loadTrack(index) {
    const track = tracks[index];
    audio.src = track.audio;
    songTitleEl.textContent = track.name;
    songArtistEl.textContent = track.artist_name;
    albumArtEl.src = track.album_image;

    // Update timer and seek bar
    audio.addEventListener("loadedmetadata", () => {
        durationEl.textContent = formatTime(audio.duration);
        seekBar.max = Math.floor(audio.duration);
    });

    // Dynamic background
    document.body.style.background = `linear-gradient(135deg, #${Math.floor(Math.random()*16777215).toString(16)}, #${Math.floor(Math.random()*16777215).toString(16)})`;
}

function playAudio() {
    if (isPlaying) {
        audio.pause();
        playBtn.textContent = "▶️";
    } else {
        audio.play();
        playBtn.textContent = "⏸️";
    }
    isPlaying = !isPlaying;
}

function nextTrack() {
    if (shuffleMode) {
        currentIndex = Math.floor(Math.random() * tracks.length);
    } else {
        currentIndex = (currentIndex + 1) % tracks.length;
    }
    loadTrack(currentIndex);
    playAudio();
}

function prevTrack() {
    currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentIndex);
    playAudio();
}

function toggleShuffle() {
    shuffleMode = !shuffleMode;
    shuffleBtn.style.color = shuffleMode ? "#f9d423" : "#fff";
}

function toggleFavorite(trackId, btnEl) {
    if (favorites.includes(trackId)) {
        favorites = favorites.filter(id => id !== trackId);
        btnEl.textContent = "🤍";
    } else {
        favorites.push(trackId);
        btnEl.textContent = "❤️";
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Timer & Seek
audio.addEventListener("timeupdate", () => {
    currentTimeEl.textContent = formatTime(audio.currentTime);
    seekBar.value = Math.floor(audio.currentTime);
});

seekBar.addEventListener("input", () => {
    audio.currentTime = seekBar.value;
});

function formatTime(sec) {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Search
searchEl.addEventListener("input", () => {
    const query = searchEl.value.toLowerCase();
    const filtered = tracks.filter(track => 
        track.name.toLowerCase().includes(query) || 
        track.artist_name.toLowerCase().includes(query)
    );
    renderPlaylist(filtered);
});

// Event listeners
playBtn.addEventListener("click", playAudio);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);
shuffleBtn.addEventListener("click", toggleShuffle);
audio.addEventListener("ended", nextTrack);

// Initialize
renderPlaylist(tracks);
loadTrack(currentIndex);
