// Prices are integer cents so every page uses the same calculations.
const GAMES = [
    {
        id: 'mta6',
        title: 'Major Theft Auto 6: 2026',
        genre: 'Action',
        price: 6999,
        description:
            'Find your own way through a neon-lit coastal city. Build a crew, take on daring missions, and explore streets that change after dark.',
        short: 'An open city. A new crew. Your rules.',
        developer: 'Neon Studios',
        platforms: ['pc', 'ps5', 'xbox'],
        image: 'assets/images/gaming-stage.jpg',
        alt: 'A player wearing a headset at an esports tournament',
        tags: ['Open world', 'Action', 'Multiplayer'],
        requirements: [
            ['OS', 'Windows 10', 'Windows 11'],
            ['Processor', 'Core i5-8400', 'Core i7-10700K'],
            ['Memory', '12 GB RAM', '16 GB RAM'],
            ['Graphics', 'GTX 1060', 'RTX 3070'],
            ['Storage', '150 GB SSD', '150 GB NVMe'],
        ],
    },
    {
        id: 'echoes',
        title: 'Echoes of Aethelgard',
        genre: 'RPG',
        price: 5999,
        description:
            'Explore a kingdom shaped by forgotten magic. Forge alliances, learn forbidden spells, and decide which stories survive in this dark fantasy action RPG.',
        short: 'A cursed kingdom shaped by your choices.',
        developer: 'Ironveil Games',
        platforms: ['pc', 'ps5'],
        image: 'assets/images/arcade.jpg',
        alt: 'A mechanical gaming keyboard with colorful backlighting',
        tags: ['Dark fantasy', 'RPG', 'Single player'],
        requirements: [
            ['OS', 'Windows 10', 'Windows 11'],
            ['Processor', 'Core i5-6600', 'Core i7-9700K'],
            ['Memory', '8 GB RAM', '16 GB RAM'],
            ['Graphics', 'GTX 970', 'RTX 2070'],
            ['Storage', '80 GB SSD', '80 GB NVMe'],
        ],
    },
    {
        id: 'whispers',
        title: 'Whispers in the Pines',
        genre: 'Cozy',
        price: 1999,
        description:
            'Make a home in a quiet mountain town. Grow a garden, get to know your neighbors, and follow a trail of clues into the forest beyond your farm.',
        short: 'Grow a garden. Uncover a forest secret.',
        developer: 'Mossy Creek Studio',
        platforms: ['pc'],
        image: 'assets/images/controllers.jpg',
        alt: 'Illuminated gaming machines in a dark arcade',
        tags: ['Farming', 'Mystery', 'Single player'],
        requirements: [
            ['OS', 'Windows 10', 'Windows 11'],
            ['Processor', 'Core i3-4130', 'Core i5-8400'],
            ['Memory', '4 GB RAM', '8 GB RAM'],
            ['Graphics', 'GTX 750', 'GTX 1060'],
            ['Storage', '4 GB SSD', '4 GB SSD'],
        ],
    },
    {
        id: 'chrono',
        title: 'Chrono Tactics',
        genre: 'Strategy',
        price: 2999,
        description:
            'Time is your most powerful move. Lead your squad through turn-based battles, rewind a mistake, and find a clever path to victory.',
        short: 'Rewind a move. Rewrite the battle.',
        developer: 'Paradox Shift Labs',
        platforms: ['pc'],
        image: 'assets/images/gaming-desk.jpg',
        alt: 'Two players holding controllers in front of a football game',
        tags: ['Turn-based', 'Strategy', 'Sci-fi'],
        requirements: [
            ['OS', 'Windows 10', 'Windows 11'],
            ['Processor', 'Core i5-7400', 'Core i7-8700'],
            ['Memory', '8 GB RAM', '16 GB RAM'],
            ['Graphics', 'GTX 1050 Ti', 'RTX 2060'],
            ['Storage', '20 GB SSD', '20 GB NVMe'],
        ],
    },
];
const BUNDLE_PRODUCTS = [
    ...GAMES.map((game) => ({ id: game.id, name: game.title, category: 'game', price: game.price })),
    { id: 'soundtrack', name: 'Original soundtrack', category: 'dlc', price: 999 },
    { id: 'artbook', name: 'Digital art book', category: 'dlc', price: 1499 },
    { id: 'shirt', name: 'Glitch Vault T-shirt', category: 'merch', price: 2499 },
    { id: 'mousepad', name: 'XL desk mat', category: 'merch', price: 1500 },
    { id: 'pins', name: 'Collector pin set', category: 'merch', price: 599 },
];
const EDITIONS = {
    standard: { name: 'Standard', extra: 0, limit: 5 },
    ultimate: { name: 'Ultimate', extra: 3000, limit: 2 },
    collectors: { name: "Collector's", extra: 8000, limit: 1 },
};
const PROMOS = { NEON20: 20, VAULT10: 10, GV2026: 20 };
const PLATFORM_NAMES = { pc: 'PC', ps5: 'PlayStation 5', xbox: 'Xbox Series X / S' };
