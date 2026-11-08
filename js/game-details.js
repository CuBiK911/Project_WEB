var GAMES = {
    mta6: {
        badge:  'PRE-ORDER NOW',
        title:  'Major Theft Auto 6: 2026',
        desc:   'The wait is over. Return to Vice City in the most expansive, dynamic open-world game ever created. Rise through the ranks of the criminal underworld, build your empire, and survive the neon nights.',
        dev:    'Neon Studios',
        date:   'Dec 12, 2026',
        rating: '4.9/5',
        price:  '$69.99',
        cover:  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80',
        coverAlt: 'Major Theft Auto 6: 2026 game cover art',
        tags:   ['Open World', 'Action', 'Crime', 'Multiplayer'],
        reqIntro: 'Make sure your rig is ready for the neon lights.',
        reqs: [
            ['OS',        'Windows 10 64-bit',  'Windows 11 64-bit'],
            ['Processor', 'Intel Core i5-8400', 'Intel Core i7-10700K'],
            ['Memory',    '12 GB RAM',           '16 GB RAM'],
            ['Graphics',  'NVIDIA GTX 1060',     'NVIDIA RTX 3070'],
            ['Storage',   '150 GB SSD',          '150 GB NVMe']
        ]
    },
    echoes: {
        badge:  'GAME OF THE YEAR',
        title:  'Echoes of Aethelgard',
        desc:   'A dark fantasy action-RPG set in a cursed kingdom on the brink of collapse. Every choice you make reshapes the world — forge alliances, wield forbidden magic, and decide the fate of thousands.',
        dev:    'Ironveil Games',
        date:   'Mar 5, 2025',
        rating: '4.8/5',
        price:  '$59.99',
        cover:  'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&q=80',
        coverAlt: 'Echoes of Aethelgard dark fantasy RPG cover art',
        tags:   ['RPG', 'Dark Fantasy', 'Action', 'Single Player'],
        reqIntro: 'Venture into the cursed kingdom — check your specs first.',
        reqs: [
            ['OS',        'Windows 10 64-bit',  'Windows 11 64-bit'],
            ['Processor', 'Intel Core i5-6600', 'Intel Core i7-9700K'],
            ['Memory',    '8 GB RAM',            '16 GB RAM'],
            ['Graphics',  'NVIDIA GTX 970',      'NVIDIA RTX 2070'],
            ['Storage',   '80 GB SSD',           '80 GB NVMe']
        ]
    },
    whispers: {
        badge:  'COZY PICK',
        title:  'Whispers in the Pines',
        desc:   'Settle into a quiet mountain town, grow your farm, befriend the locals — and slowly unravel the mystery that has haunted the forest for decades. A cozy mystery farming sim unlike any other.',
        dev:    'Mossy Creek Studio',
        date:   'Jun 20, 2025',
        rating: '4.6/5',
        price:  '$19.99',
        cover:  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80',
        coverAlt: 'Whispers in the Pines cozy farming mystery cover art',
        tags:   ['Farming Sim', 'Mystery', 'Cozy', 'Single Player'],
        reqIntro: 'Low requirements — almost any PC can run this one.',
        reqs: [
            ['OS',        'Windows 8.1 64-bit', 'Windows 10 64-bit'],
            ['Processor', 'Intel Core i3-4130', 'Intel Core i5-8400'],
            ['Memory',    '4 GB RAM',            '8 GB RAM'],
            ['Graphics',  'NVIDIA GTX 750',      'NVIDIA GTX 1060'],
            ['Storage',   '4 GB SSD',            '4 GB SSD']
        ]
    },
    chrono: {
        badge:  'STRATEGY PICK',
        title:  'Chrono Tactics',
        desc:   'A turn-based strategy game where time is your greatest weapon. Rewind your last move, loop enemy turns, and bend the timeline to snatch victory from the jaws of defeat.',
        dev:    'Paradox Shift Labs',
        date:   'Sep 15, 2025',
        rating: '4.7/5',
        price:  '$29.99',
        cover:  'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&q=80',
        coverAlt: 'Chrono Tactics turn-based strategy cover art',
        tags:   ['Strategy', 'Turn-Based', 'Sci-Fi', 'Single Player'],
        reqIntro: 'Tactical precision required — and a decent GPU.',
        reqs: [
            ['OS',        'Windows 10 64-bit',  'Windows 11 64-bit'],
            ['Processor', 'Intel Core i5-7400', 'Intel Core i7-8700'],
            ['Memory',    '8 GB RAM',            '16 GB RAM'],
            ['Graphics',  'NVIDIA GTX 1050 Ti',  'NVIDIA RTX 2060'],
            ['Storage',   '20 GB SSD',           '20 GB NVMe']
        ]
    }
};

var DEFAULT_GAME = 'mta6';

var params = new URLSearchParams(window.location.search);
var slug   = params.get('game') || DEFAULT_GAME;
var game   = GAMES[slug] || GAMES[DEFAULT_GAME];

document.title = game.title + ' - Glitch Vault';

document.getElementById('gd-badge').textContent   = game.badge;
document.getElementById('gd-title').textContent   = game.title;
document.getElementById('gd-desc').textContent    = game.desc;
document.getElementById('gd-dev').textContent     = game.dev;
document.getElementById('gd-date').textContent    = game.date;
document.getElementById('gd-rating').textContent  = game.rating;
document.getElementById('gd-price').textContent   = game.price;

var cover = document.getElementById('gd-cover');
cover.src = game.cover;
cover.alt = game.coverAlt;

var tagsEl = document.getElementById('gd-tags');
for (var i = 0; i < game.tags.length; i++) {
    var span = document.createElement('span');
    span.className = 'badge';
    span.textContent = game.tags[i];
    tagsEl.appendChild(span);
}

document.getElementById('gd-req-intro').textContent = game.reqIntro;

var preorderUrl = 'task3-form.html?game=' + slug;
document.getElementById('gd-preorder-btn').href  = preorderUrl;
document.getElementById('gd-preorder-btn2').href = preorderUrl;

var tbody = document.getElementById('gd-req-body');
for (var j = 0; j < game.reqs.length; j++) {
    var row = document.createElement('tr');
    var th  = document.createElement('td');
    var strong = document.createElement('strong');
    strong.textContent = game.reqs[j][0];
    th.appendChild(strong);
    var tdMin  = document.createElement('td');
    tdMin.textContent  = game.reqs[j][1];
    var tdRec  = document.createElement('td');
    tdRec.textContent  = game.reqs[j][2];
    row.append(th, tdMin, tdRec);
    tbody.appendChild(row);
}
