const orderForm = document.getElementById('order-form');
const orderFields = ['order-game', 'edition', 'quantity', 'platform', 'name', 'email', 'promo'].map((id) =>
    document.getElementById(id),
);
const gameSelect = document.getElementById('order-game');
const editionSelect = document.getElementById('edition');
const quantityInput = document.getElementById('quantity');
const platformSelect = document.getElementById('platform');
gameSelect.innerHTML = GAMES.map(
    (game) => `<option value="${game.id}">${game.title} · ${money(game.price)}</option>`,
).join('');
const requestedGame = new URLSearchParams(location.search).get('game');
if (GAMES.some((game) => game.id === requestedGame)) gameSelect.value = requestedGame;
else if (requestedGame)
    document.getElementById('order-status').textContent =
        'That game was not found. Please choose a game from the list.';
const orderUser = currentUser();
if (orderUser) {
    document.getElementById('name').value = orderUser.name;
    document.getElementById('email').value = orderUser.email;
}
function updatePlatforms() {
    const selectedGame = GAMES.find((game) => game.id === gameSelect.value);
    for (const option of platformSelect.options) {
        option.disabled = Boolean(option.value) && !selectedGame.platforms.includes(option.value);
    }
    if (!selectedGame.platforms.includes(platformSelect.value)) platformSelect.value = '';
}
function calculateOrder() {
    const game = GAMES.find((item) => item.id === gameSelect.value);
    const edition = EDITIONS[editionSelect.value];
    const quantity = Number(quantityInput.value);
    const validQuantity = Number.isInteger(quantity) && quantity >= 1 && quantity <= (edition?.limit || 5);
    const subtotal = edition && validQuantity ? (game.price + edition.extra) * quantity : 0;
    const promo = document.getElementById('promo').value.trim().toUpperCase();
    const discount = Math.round((subtotal * (PROMOS[promo] || 0)) / 100);
    return { game, edition, quantity, subtotal, discount, total: subtotal - discount };
}
function updatePreview() {
    const order = calculateOrder();
    quantityInput.max = order.edition?.limit || 5;
    document.getElementById('preview-game').textContent = order.game.title;
    document.getElementById('preview-details').textContent = order.edition
        ? `${order.edition.name} · Maximum ${order.edition.limit} copies · ${PLATFORM_NAMES[platformSelect.value] || 'Choose a platform'}`
        : 'Choose your edition and platform.';
    document.getElementById('preview-subtotal').textContent = money(order.subtotal);
    document.getElementById('preview-discount').textContent = '−' + money(order.discount);
    document.getElementById('preview-total').textContent = money(order.total);
}
function validateOrderField(field) {
    const value = field.value.trim();
    const order = calculateOrder();
    let message = '';
    switch (field.id) {
        case 'order-game':
            if (!order.game) message = 'Choose a game.';
            break;
        case 'edition':
            if (!order.edition) message = 'Choose an edition.';
            break;
        case 'quantity':
            if (!value || !Number.isInteger(Number(value)) || Number(value) < 1)
                message = 'Enter a whole number of at least 1.';
            else if (Number(value) > (order.edition?.limit || 5))
                message = `This edition allows up to ${order.edition?.limit || 5} copies.`;
            break;
        case 'platform':
            if (!order.game.platforms.includes(value)) message = 'Choose a supported platform.';
            break;
        case 'name':
            if (value.length < 2 || value.length > 80 || !/\p{L}/u.test(value))
                message = 'Enter a name with 2–80 characters, including a letter.';
            break;
        case 'email':
            if (!validEmail(value)) message = 'Enter a valid email address.';
            break;
        case 'promo':
            if (value && !Object.hasOwn(PROMOS, value.toUpperCase()))
                message = 'Use NEON20 or VAULT10, or leave this field empty.';
            break;
    }
    return fieldError(field, message);
}
for (const field of orderFields) {
    field.addEventListener('blur', () => validateOrderField(field));
    field.addEventListener('input', () => {
        if (field === gameSelect) updatePlatforms();
        updatePreview();
        if (field.hasAttribute('aria-invalid')) validateOrderField(field);
        if (field === editionSelect && quantityInput.hasAttribute('aria-invalid'))
            validateOrderField(quantityInput);
    });
}
orderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const valid = orderFields.map(validateOrderField).every(Boolean);
    const status = document.getElementById('order-status');
    if (!valid) {
        status.textContent = 'Please correct the highlighted fields.';
        status.className = 'status error';
        orderForm.querySelector('[aria-invalid="true"]').focus();
        return;
    }
    const order = calculateOrder();
    const user = currentUser();
    const record = {
        id: 'GV-' + Date.now().toString(36).toUpperCase(),
        game: order.game.id,
        edition: editionSelect.value,
        quantity: order.quantity,
        platform: platformSelect.value,
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim().toLowerCase(),
        total: order.total,
        discount: order.discount,
        owner: user?.email || '',
        date: new Date().toISOString(),
    };
    if (!writeData('orders', [...getOrders(), record])) {
        status.textContent = 'Reservation could not be saved. Allow browser storage and try again.';
        status.className = 'status error';
        return;
    }
    const result = document.getElementById('order-success');
    result.innerHTML = `
        <div class="receipt-heading">
            <span class="receipt-check" aria-hidden="true">&#10003;</span>
            <h2>Pre-Order Confirmed!</h2>
            <p>Booking code <strong>${record.id}</strong></p>
        </div>
        <table class="table requirements receipt-table" aria-label="Pre-order receipt">
            <tbody>
                <tr><th scope="row">Game</th><td>${order.game.title}</td></tr>
                <tr><th scope="row">Name</th><td>${escapeHTML(record.name)}</td></tr>
                <tr><th scope="row">Email</th><td>${escapeHTML(record.email)}</td></tr>
                <tr><th scope="row">Edition</th><td>${order.edition.name}</td></tr>
                <tr><th scope="row">Platform</th><td>${PLATFORM_NAMES[record.platform]}</td></tr>
                <tr><th scope="row">Quantity</th><td>${record.quantity}</td></tr>
                ${record.discount ? `<tr><th scope="row">Discount</th><td>-${money(record.discount)}</td></tr>` : ''}
            </tbody>
            <tfoot>
                <tr><th scope="row">Total</th><td>${money(record.total)}</td></tr>
            </tfoot>
        </table>
        <div class="button-row">
            <button id="another-order" class="btn btn-accent">Make Another Order</button>
            <a class="btn btn-quiet" href="profile.html">View reservation history</a>
        </div>`;
    orderForm.hidden = true;
    result.hidden = false;
    result.focus();
    notify('Demo reservation saved.');
    document.getElementById('another-order').addEventListener('click', () => {
        orderForm.reset();
        for (const field of orderFields) {
            fieldError(field, '');
            field.removeAttribute('aria-invalid');
        }
        status.textContent = '';
        result.hidden = true;
        orderForm.hidden = false;
        updatePlatforms();
        updatePreview();
        gameSelect.focus();
    });
});
updatePlatforms();
updatePreview();
