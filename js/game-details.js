const slug = new URLSearchParams(location.search).get('game') || 'mta6';
const game = GAMES.find((item) => item.id === slug);
const details = document.getElementById('game-details');
if (!game) {
    details.innerHTML =
        '<div class="empty-state"><h1>Game not found</h1><p>This title is not in the vault. Browse our current collection.</p><a class="btn btn-accent" href="index.html#catalog">Back to the store</a></div>';
    document.getElementById('requirements-section').hidden = true;
} else {
    document.title = game.title + ' | Glitch Vault';
    details.innerHTML = `<a href="index.html#catalog" class="subtle-link mb-4 text-start">Back to store</a><div class="row g-5 align-items-center"><div class="col-lg-6"><img class="detail-cover" src="${game.image}" alt="${game.alt}"></div><div class="col-lg-6"><h1>${game.title}</h1><p>${game.description}</p><dl class="detail-meta"><div><dt>Developer</dt><dd>${game.developer}</dd></div><div><dt>Platforms</dt><dd>${game.platforms.map((platform) => PLATFORM_NAMES[platform]).join(', ')}</dd></div></dl><div class="tag-list">${game.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}</div><div class="detail-price">${money(game.price)}</div><div class="button-row"><a class="btn btn-accent" href="task3-form.html?game=${game.id}">Pre-order</a><button class="btn btn-quiet" data-save-game="${game.id}" aria-pressed="false">Save</button></div></div></div>`;
    document.getElementById('requirements-body').innerHTML = game.requirements
        .map((row) => `<tr><th scope="row">${row[0]}</th><td>${row[1]}</td><td>${row[2]}</td></tr>`)
        .join('');
    updateNavigation();
}
