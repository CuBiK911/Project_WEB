


const CONFIG = {
    MAX_LIVES: 3,
    DELAY_MS: 800 
};


const GAME_POOL = [
    { name: "Neon Vice: 2026", price: 69 },
    { name: "Echoes of Aethelgard", price: 59 },
    { name: "Whispers in Pines", price: 19 },
    { name: "Chrono Tactics", price: 29 },
    { name: "Cyber Drift", price: 39 },
    { name: "Space Odyssey", price: 49 },
    { name: "Pixel Dungeon", price: 14 },
    { name: "Kingdom Fall", price: 54 },
    { name: "Speed Racer X", price: 24 },
    { name: "Mystery Box", price: 9 }
];


let state = {
    lives: CONFIG.MAX_LIVES,
    streak: 0,
    bestStreak: 0,
    currentRound: null,
    nextRound: null,
    isProcessing: false
};


let els = {};

function initDOM() {
    els.board = document.getElementById('game-board');
    els.uiLives = document.getElementById('ui-lives');
    els.uiStreak = document.getElementById('ui-streak');
    els.uiBest = document.getElementById('ui-best');
    els.uiName = document.getElementById('ui-current-name');
    els.uiPrice = document.getElementById('ui-current-price');
    els.uiMessage = document.getElementById('ui-message');
    els.restartArea = document.getElementById('ui-restart-area');
    els.btnRestart = document.getElementById('btn-restart');

  
    if (!els.board || !els.uiLives) {
        console.error("Game Elements Not Found!");
        return false;
    }
    return true;
}


function getRandomItem(excludeName) {
    const pool = excludeName ? GAME_POOL.filter(i => i.name !== excludeName) : GAME_POOL;
    const randomIndex = Math.floor(Math.random() * pool.length);
    return { ...pool[randomIndex] };
}

function updateUI() {
    if (!els.uiLives) return;

   
    let hearts = "";
    for(let i=0; i<CONFIG.MAX_LIVES; i++) {
        hearts += i < state.lives ? "❤️" : "🖤";
    }
    els.uiLives.textContent = hearts;
    
    
    els.uiStreak.textContent = state.streak;
    els.uiBest.textContent = state.bestStreak;
    
    
    if (state.currentRound) {
        els.uiName.textContent = state.currentRound.name;
        els.uiPrice.textContent = `$${state.currentRound.price}`;
    }

  
    const buttons = document.querySelectorAll('.game-btn');
    buttons.forEach(btn => {
        btn.disabled = state.isProcessing || state.lives <= 0;
    });
}

function showMessage(text, colorClass) {
    if(!els.uiMessage) return;
    els.uiMessage.textContent = text;
    els.uiMessage.className = `mt-3 fw-bold ${colorClass}`;
}

function endGame() {
    state.isProcessing = false;
    showMessage("💀 Game Over! Final Streak: " + state.bestStreak, "text-danger");
    els.restartArea.classList.remove('d-none');
    updateUI();
}

function initGame() {
    state.lives = CONFIG.MAX_LIVES;
    state.streak = 0;
    state.isProcessing = false;
    
    state.currentRound = getRandomItem();
    state.nextRound = getRandomItem(state.currentRound.name);
    
    els.restartArea.classList.add('d-none');
    els.uiMessage.textContent = "";
    
    updateUI();
}

function handleGuess(guessType) {
    if (state.isProcessing || state.lives <= 0) return;
    state.isProcessing = true;

    const curr = state.currentRound.price;
    const next = state.nextRound.price;
    
    
    let isCorrect = false;
    if (guessType === 'higher') {
        isCorrect = (next >= curr); 
    } else if (guessType === 'lower') {
        isCorrect = (next < curr);
    }

    if (isCorrect) {
        state.streak++;
        if (state.streak > state.bestStreak) state.bestStreak = state.streak;
        showMessage("✅ Correct!", "text-success");
        
        setTimeout(() => {
            state.currentRound = state.nextRound;
            state.nextRound = getRandomItem(state.currentRound.name);
            state.isProcessing = false;
            updateUI();
        }, CONFIG.DELAY_MS);
    } else {
        state.lives--;
        state.streak = 0;
        
        if (state.lives <= 0) {
            endGame();
        } else {
            showMessage(`❌ Wrong! Next was $${next}`, "text-danger");
            setTimeout(() => {
                state.currentRound = state.nextRound;
                state.nextRound = getRandomItem(state.currentRound.name);
                state.isProcessing = false;
                updateUI();
            }, CONFIG.DELAY_MS);
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    if (!initDOM()) return;

   
    els.board.addEventListener('click', (e) => {
        const btn = e.target.closest('.game-btn');
        if (!btn || btn.disabled) return;
        
        const guess = btn.dataset.guess;
        handleGuess(guess);
    });

    
    els.btnRestart.addEventListener('click', initGame);

    
    initGame();
    console.log("✅ Task 1 Game Loaded");
});