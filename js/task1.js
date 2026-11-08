const GAME_POOL = [
    { name: "Neon Vice: 2026",      price: 69.99, genre: "Action",   platform: "PC/PS5/Xbox" },
    { name: "Echoes of Aethelgard", price: 59.99, genre: "RPG",      platform: "PC/PS5"     },
    { name: "Whispers in Pines",    price: 19.99, genre: "Cozy",     platform: "PC"         },
    { name: "Chrono Tactics",       price: 29.99, genre: "Strategy", platform: "PC"         },
    { name: "Cyber Drift",          price: 39.99, genre: "Racing",   platform: "PC/Xbox"    },
    { name: "Space Odyssey",        price: 49.99, genre: "Sci-Fi",   platform: "PC/PS5"     },
    { name: "Pixel Dungeon",        price: 14.99, genre: "Roguelike",platform: "PC"         },
    { name: "Kingdom Fall",         price: 54.99, genre: "Strategy", platform: "PC/PS5"     },
    { name: "Speed Racer X",        price: 24.99, genre: "Racing",   platform: "PC/Xbox"    },
    { name: "Mystery Box",          price: 9.99,  genre: "Puzzle",   platform: "PC"         }
];
const MAX_LIVES = 3;
const DELAY_MS  = 900;

var lives      = MAX_LIVES;
var streak     = 0;
var best       = 0;
var current    = null;
var next       = null;
var processing = false;

function randItem(excludeName) {
    var pool = [];
    for (var i = 0; i < GAME_POOL.length; i++) {
        if (GAME_POOL[i].name !== excludeName) pool.push(GAME_POOL[i]);
    }
    if (pool.length === 0) pool = GAME_POOL;
    return pool[Math.floor(Math.random() * pool.length)];
}

function gameSetEl(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
}

function gameRenderHearts() {
    var hearts = '';
    for (var i = 0; i < MAX_LIVES; i++) {
        hearts += (i < lives) ? '\u2764\uFE0F' : '\uD83D\uDDA4';
    }
    gameSetEl('ui-lives', hearts);
}

function gameRender() {
    gameRenderHearts();
    gameSetEl('ui-streak', streak);
    gameSetEl('ui-best',   best);
    gameSetEl('ui-current-name',  current.name);
    gameSetEl('ui-current-price', '$' + current.price.toFixed(2));

    var btns = document.querySelectorAll('.game-btn');
    for (var j = 0; j < btns.length; j++) {
        btns[j].disabled = processing || lives <= 0;
    }
}

function gameShowMsg(text, cls) {
    var el = document.getElementById('ui-message');
    if (!el) return;
    el.textContent = text;
    el.className   = 'mt-3 fw-bold ' + (cls || '');
}

function initGame() {
    lives      = MAX_LIVES;
    streak     = 0;
    processing = false;
    current    = GAME_POOL[Math.floor(Math.random() * GAME_POOL.length)];
    next       = randItem(current.name);
    var restartArea = document.getElementById('ui-restart-area');
    if (restartArea) restartArea.classList.add('d-none');
    gameShowMsg('', '');
    gameRender();
}

function handleGuess(guess) {
    if (processing || lives <= 0) return;
    processing = true;

    var isHigherCorrect = (guess === 'higher') && (next.price >= current.price);
    var isLowerCorrect  = (guess === 'lower')  && (next.price <  current.price);
    var correct = isHigherCorrect || isLowerCorrect;

    var btns = document.querySelectorAll('.game-btn');
    for (var k = 0; k < btns.length; k++) { btns[k].disabled = true; }

    if (correct) {
        streak++;
        if (streak > best) best = streak;
        gameShowMsg('\u2705 Correct! Next was $' + next.price.toFixed(2) + ' \u2014 +1 streak', 'text-success');
    } else {
        lives--;
        streak = 0;
        gameRenderHearts();
        gameShowMsg('\u274C Wrong! Next was $' + next.price.toFixed(2), 'text-danger');
    }

    gameSetEl('ui-streak', streak);
    gameSetEl('ui-best',   best);

    if (lives <= 0) {
        gameShowMsg('\uD83D\uDC80 Game Over! Best Streak: ' + best, 'text-danger');
        var ra = document.getElementById('ui-restart-area');
        if (ra) ra.classList.remove('d-none');
        processing = false;
        return;
    }

    setTimeout(function () {
        current    = next;
        next       = randItem(current.name);
        processing = false;
        gameShowMsg('', '');
        gameRender();
    }, DELAY_MS);
}

var boardEl   = document.getElementById('game-board');
var restartEl = document.getElementById('btn-restart');

if (boardEl) {
    boardEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.game-btn');
        if (btn && !btn.disabled) handleGuess(btn.dataset.guess);
    });
}

if (restartEl) {
    restartEl.addEventListener('click', initGame);
}

if (boardEl) {
    initGame();
}
