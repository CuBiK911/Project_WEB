const searchInput = document.getElementById('game-search');
const genreSelect = document.getElementById('game-filter');
function renderCatalog() {
    const query = searchInput.value.trim().toLowerCase();
    const games = GAMES.filter(
        (game) =>
            (genreSelect.value === 'all' || game.genre === genreSelect.value) &&
            (game.title + ' ' + game.genre).toLowerCase().includes(query),
    );
    document.getElementById('catalog-grid').innerHTML = games.map(gameCard).join('');
    document.getElementById('catalog-empty').hidden = games.length > 0;
    document.getElementById('catalog-count').textContent = games.length + ' of ' + GAMES.length + ' games';
    updateNavigation();
}
searchInput.addEventListener('input', renderCatalog);
genreSelect.addEventListener('change', renderCatalog);
document.getElementById('reset-search').addEventListener('click', () => {
    searchInput.value = '';
    genreSelect.value = 'all';
    renderCatalog();
    searchInput.focus();
});
renderCatalog();
