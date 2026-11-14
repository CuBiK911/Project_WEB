function readData(key, fallback) {
    try {
        const value = JSON.parse(localStorage.getItem('gv-' + key));
        if (
            value === null ||
            typeof value !== typeof fallback ||
            Array.isArray(value) !== Array.isArray(fallback)
        )
            return fallback;
        return value;
    } catch {
        return fallback;
    }
}
function writeData(key, value) {
    try {
        localStorage.setItem('gv-' + key, JSON.stringify(value));
        return true;
    } catch {
        notify('Browser storage is unavailable or full. This change could not be saved.');
        return false;
    }
}
function money(cents) {
    return '$' + (cents / 100).toFixed(2);
}
function escapeHTML(value) {
    return String(value).replace(
        /[&<>"']/g,
        (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character],
    );
}
function getAccounts() {
    return readData('accounts', []).filter(
        (account) =>
            account &&
            typeof account.email === 'string' &&
            typeof account.name === 'string' &&
            typeof account.hash === 'string' &&
            typeof account.salt === 'string',
    );
}
function currentUser() {
    const email = readData('session', '');
    return getAccounts().find((account) => account.email === email);
}
function getCollection() {
    const saved = readData('collection', { games: [], bundles: [] });
    return {
        games: [
            ...new Set(
                Array.isArray(saved.games)
                    ? saved.games.filter((id) => GAMES.some((game) => game.id === id))
                    : [],
            ),
        ],
        bundles: Array.isArray(saved.bundles)
            ? saved.bundles.filter(
                  (bundle) =>
                      bundle &&
                      typeof bundle.id === 'string' &&
                      Array.isArray(bundle.items) &&
                      bundle.items.length &&
                      bundle.items.every((id) => BUNDLE_PRODUCTS.some((item) => item.id === id)),
              )
            : [],
    };
}
function bundleTotal(bundle) {
    return bundle.items.reduce(
        (total, id) => total + BUNDLE_PRODUCTS.find((item) => item.id === id).price,
        0,
    );
}
function getOrders() {
    return readData('orders', []).filter(
        (order) =>
            order &&
            typeof order.id === 'string' &&
            GAMES.some((game) => game.id === order.game) &&
            Number.isInteger(order.total) &&
            typeof order.owner === 'string',
    );
}
function updateNavigation() {
    const collection = getCollection();
    document.querySelectorAll('.saved-count').forEach((counter) => {
        counter.textContent = collection.games.length + collection.bundles.length;
    });
    const accountLink = document.querySelector('[data-account-link]');
    const user = currentUser();
    accountLink.textContent = user ? 'Profile' : 'Account';
    accountLink.href = user ? 'profile.html' : 'account.html';
    document.querySelectorAll('[data-save-game]').forEach((button) => {
        const saved = collection.games.includes(button.dataset.saveGame);
        button.textContent = saved ? 'Saved ✓' : 'Save';
        button.setAttribute('aria-pressed', String(saved));
        button.setAttribute(
            'aria-label',
            (saved ? 'Remove ' : 'Save ') + GAMES.find((game) => game.id === button.dataset.saveGame).title,
        );
        button.classList.toggle('selected', saved);
    });
}
function toggleSavedGame(id) {
    if (!GAMES.some((game) => game.id === id)) return;
    const collection = getCollection();
    const exists = collection.games.includes(id);
    collection.games = exists
        ? collection.games.filter((gameId) => gameId !== id)
        : [...collection.games, id];
    if (!writeData('collection', collection)) return;
    updateNavigation();
    notify(exists ? 'Game removed from your collection.' : 'Game saved. Find it on the Saved page.');
    document.dispatchEvent(new Event('collectionchange'));
}
function gameCard(game) {
    return `<article class="col-sm-6 col-lg-3"><div class="game-card"><a href="game-details.html?game=${game.id}" tabindex="-1" aria-hidden="true"><img class="game-image" src="${game.image}" alt="${game.alt}"></a><div class="game-card-body"><span class="tag">${game.genre}</span><h3>${game.title}</h3><p>${game.short}</p><span class="price">${money(game.price)}</span><div class="button-row"><a class="btn btn-accent btn-sm" href="game-details.html?game=${game.id}">Details</a><button class="btn btn-quiet btn-sm" data-save-game="${game.id}" aria-label="Save ${game.title}" aria-pressed="false">Save</button></div></div></div></article>`;
}
function fieldError(field, message) {
    field.setAttribute('aria-invalid', String(Boolean(message)));
    const error = document.getElementById(field.id + '-error');
    if (error) error.textContent = message;
    return !message;
}
function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 120;
}
let toastTimer;
function notify(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    if (window.jQuery) {
        jQuery(toast).stop(true, true).fadeIn(160);
        toastTimer = setTimeout(() => jQuery(toast).stop(true, true).fadeOut(240), 3500);
    } else {
        toast.style.display = 'block';
        toastTimer = setTimeout(() => {
            toast.style.display = 'none';
        }, 3500);
    }
}
function refreshThemeButton() {
    const dark = document.documentElement.dataset.bsTheme === 'dark';
    const button = document.getElementById('theme-toggle');
    button.textContent = dark ? 'Light mode ◐' : 'Dark mode ◑';
    button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    button.setAttribute('aria-pressed', String(dark));
}
document.getElementById('theme-toggle').addEventListener('click', () => {
    const theme = document.documentElement.dataset.bsTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.bsTheme = theme;
    writeData('theme', theme);
    refreshThemeButton();
});
document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-save-game]');
    if (button) toggleSavedGame(button.dataset.saveGame);
});
window.addEventListener('storage', () => {
    document.documentElement.dataset.bsTheme = readData('theme', 'dark') === 'light' ? 'light' : 'dark';
    refreshThemeButton();
    updateNavigation();
    document.dispatchEvent(new Event('collectionchange'));
});
// Keep the menu usable if the Bootstrap CDN is temporarily unavailable.
if (!window.bootstrap) {
    document.querySelector('.navbar-toggler').addEventListener('click', (event) => {
        const expanded = document.getElementById('navigation').classList.toggle('show');
        event.currentTarget.setAttribute('aria-expanded', String(expanded));
    });
}
refreshThemeButton();
updateNavigation();
