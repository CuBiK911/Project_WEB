const GAME_POOL = [
    ...GAMES.map((game) => ({ name: game.title, price: game.price })),
    { name: 'Cyber Drift', price: 3999 },
    { name: 'Space Odyssey', price: 4999 },
    { name: 'Pixel Dungeon', price: 1499 },
    { name: 'Kingdom Fall', price: 5499 },
    { name: 'Speed Racer X', price: 2499 },
    { name: 'Mystery Box', price: 999 },
];
let lives = 3;
let streak = 0;
let best = Math.max(0, Math.floor(readData('best-streak', 0)));
let current;
let next;
let processing = false;
let roundTimer;
function randomGame(exclude) {
    const pool = GAME_POOL.filter((game) => game.name !== exclude);
    return pool[Math.floor(Math.random() * pool.length)];
}
function renderChallenge() {
    document.getElementById('ui-lives').textContent = lives + ' / 3';
    document.getElementById('ui-streak').textContent = streak;
    document.getElementById('ui-best').textContent = best;
    document.getElementById('ui-current-name').textContent = current.name;
    document.getElementById('ui-current-price').textContent = money(current.price);
    document.getElementById('ui-next-name').textContent = next.name;
    document.querySelectorAll('.game-btn').forEach((button) => {
        button.disabled = processing || lives === 0;
    });
    document.getElementById('ui-restart-area').classList.toggle('d-none', lives > 0);
}
function startChallenge() {
    clearTimeout(roundTimer);
    lives = 3;
    streak = 0;
    processing = false;
    current = randomGame('');
    next = randomGame(current.name);
    document.getElementById('ui-message').textContent = '';
    renderChallenge();
}
function guessPrice(guess) {
    if (processing || lives === 0) return;
    processing = true;
    const correct = guess === 'higher' ? next.price >= current.price : next.price < current.price;
    const message = document.getElementById('ui-message');
    if (correct) {
        streak++;
        if (streak > best) {
            best = streak;
            writeData('best-streak', best);
        }
    } else {
        lives--;
        streak = 0;
    }
    message.textContent = `${correct ? 'Correct!' : 'Not this time.'} ${next.name} costs ${money(next.price)}.${lives === 0 ? ' Game over. Try again!' : ''}`;
    message.className = 'status ' + (correct ? 'success' : 'error');
    renderChallenge();
    if (lives === 0) {
        processing = false;
        document.getElementById('btn-restart').focus({ preventScroll: true });
        return;
    }
    roundTimer = setTimeout(() => {
        current = next;
        next = randomGame(current.name);
        processing = false;
        renderChallenge();
    }, 900);
}
document
    .querySelectorAll('.game-btn')
    .forEach((button) => button.addEventListener('click', () => guessPrice(button.dataset.guess)));
document.getElementById('btn-restart').addEventListener('click', startChallenge);
startChallenge();
