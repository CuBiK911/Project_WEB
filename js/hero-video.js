const heroVideo = document.getElementById('hero-video');
const playbackButton = document.getElementById('hero-playback');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

if (motionPreference.matches) {
    heroVideo.autoplay = false;
    heroVideo.pause();
}

function showPlaybackState() {
    playbackButton.textContent = heroVideo.paused ? 'Play video' : 'Pause video';
    playbackButton.hidden = false;
}

heroVideo.addEventListener('loadeddata', showPlaybackState);
heroVideo.addEventListener('play', showPlaybackState);
heroVideo.addEventListener('pause', showPlaybackState);
if (heroVideo.readyState >= 2) showPlaybackState();
motionPreference.addEventListener('change', (event) => {
    if (event.matches) heroVideo.pause();
});

playbackButton.addEventListener('click', () => {
    if (heroVideo.paused) {
        heroVideo.play().catch(showPlaybackState);
    } else {
        heroVideo.pause();
    }
});
