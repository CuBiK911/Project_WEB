let selectedItems = [];
const budgetSlider = document.getElementById('bundle-slider');
const bundleFilter = document.getElementById('bundle-filter');
function renderBundle() {
    const visible = BUNDLE_PRODUCTS.filter(
        (item) => bundleFilter.value === 'all' || item.category === bundleFilter.value,
    );
    document.getElementById('bundle-grid').innerHTML = visible
        .map((item) => {
            const selected = selectedItems.includes(item.id);
            return `<div class="col-md-6"><article class="panel bundle-item ${selected ? 'selected' : ''}"><div class="split-line"><span class="tag">${item.category === 'dlc' ? 'Extra' : item.category}</span><span class="price">${money(item.price)}</span></div><h3>${item.name}</h3><button class="btn btn-quiet btn-sm" data-bundle-item="${item.id}" aria-pressed="${selected}">${selected ? 'Remove' : 'Add to bundle'}</button></article></div>`;
        })
        .join('');
    const items = selectedItems.map((id) => BUNDLE_PRODUCTS.find((item) => item.id === id));
    const total = items.reduce((sum, item) => sum + item.price, 0);
    const budget = Number(budgetSlider.value) * 100;
    document.getElementById('bundle-list').innerHTML = items.length
        ? items
              .map(
                  (item) =>
                      `<li><div class="split-line"><span>${item.name}</span><strong>${money(item.price)}</strong></div><button data-bundle-item="${item.id}" aria-label="Remove ${item.name}">Remove</button></li>`,
              )
              .join('')
        : '<li class="muted">Choose something to start your bundle.</li>';
    document.getElementById('bundle-budget-val').textContent = money(budget);
    document.getElementById('bundle-total-price').textContent = money(total);
    const status = document.getElementById('bundle-status');
    status.textContent =
        total > budget
            ? money(total - budget) + ' over budget. Adjust your selection.'
            : money(budget - total) + ' left in your budget.';
    status.className = 'status ' + (total > budget ? 'error' : 'success');
    document.getElementById('bundle-save-btn').disabled = !items.length || total > budget;
}
document.getElementById('bundle-section').addEventListener('click', (event) => {
    const button = event.target.closest('[data-bundle-item]');
    if (!button) return;
    const id = button.dataset.bundleItem;
    const product = BUNDLE_PRODUCTS.find((item) => item.id === id);
    if (selectedItems.includes(id)) selectedItems = selectedItems.filter((itemId) => itemId !== id);
    else {
        selectedItems = selectedItems.filter(
            (itemId) => BUNDLE_PRODUCTS.find((item) => item.id === itemId).category !== product.category,
        );
        selectedItems.push(id);
    }
    renderBundle();
    // Rendering replaces the button, so restore keyboard focus to its replacement.
    document.querySelector(`#bundle-grid [data-bundle-item="${id}"]`)?.focus({ preventScroll: true });
});
budgetSlider.addEventListener('input', renderBundle);
bundleFilter.addEventListener('change', renderBundle);
document.getElementById('bundle-save-btn').addEventListener('click', () => {
    const collection = getCollection();
    if (
        collection.bundles.some(
            (bundle) => [...bundle.items].sort().join() === [...selectedItems].sort().join(),
        )
    ) {
        notify('This bundle is already saved. View it on the Saved page.');
        return;
    }
    collection.bundles.push({
        id: 'bundle-' + Date.now(),
        items: [...selectedItems],
        budget: Number(budgetSlider.value) * 100,
    });
    if (!writeData('collection', collection)) return;
    notify('Bundle saved. Find it on the Saved page.');
    updateNavigation();
});
renderBundle();
