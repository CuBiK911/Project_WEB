function renderSaved() {
    const collection = getCollection();
    const games = collection.games.map((id) => GAMES.find((game) => game.id === id));
    document.getElementById('saved-games').innerHTML = games.length
        ? games.map(gameCard).join('')
        : '<div class="col-12"><div class="empty-state"><h3>Your next favorite is waiting</h3><p>Save a game from the store to start your collection.</p><a href="index.html#catalog" class="btn btn-accent">Explore games</a></div></div>';
    document.getElementById('saved-bundles').innerHTML = collection.bundles.length
        ? collection.bundles
              .map(
                  (bundle, index) =>
                      `<div class="col-md-6 col-lg-4"><article class="panel saved-bundle"><span class="tag">YOUR BUILD</span><h3>Bundle ${index + 1}</h3><ul>${bundle.items.map((id) => `<li>${BUNDLE_PRODUCTS.find((item) => item.id === id).name}</li>`).join('')}</ul><div class="split-line"><strong class="price">${money(bundleTotal(bundle))}</strong><button class="btn btn-quiet btn-sm" data-remove-bundle="${escapeHTML(bundle.id)}" aria-label="Remove bundle ${index + 1}">Remove</button></div></article></div>`,
              )
              .join('')
        : '<div class="col-12"><div class="empty-state"><h3>No bundles saved yet</h3><p>Build a combination that fits your budget.</p><a href="index.html#bundle-section" class="btn btn-quiet">Build a bundle</a></div></div>';
    const total =
        games.reduce((sum, game) => sum + game.price, 0) +
        collection.bundles.reduce((sum, bundle) => sum + bundleTotal(bundle), 0);
    document.getElementById('saved-summary').textContent =
        `${games.length} games · ${collection.bundles.length} bundles · Combined value ${money(total)}`;
    document.getElementById('clear-saved').disabled = !games.length && !collection.bundles.length;
    updateNavigation();
}
document.addEventListener('collectionchange', renderSaved);
document.getElementById('saved-bundles').addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove-bundle]');
    if (!button) return;
    const collection = getCollection();
    collection.bundles = collection.bundles.filter((bundle) => bundle.id !== button.dataset.removeBundle);
    if (writeData('collection', collection)) {
        renderSaved();
        notify('Bundle removed.');
        document.getElementById('clear-saved').focus();
    }
});
document.getElementById('clear-saved').addEventListener('click', () => {
    if (writeData('collection', { games: [], bundles: [] })) {
        renderSaved();
        notify('Your collection is now empty.');
    }
});
renderSaved();
