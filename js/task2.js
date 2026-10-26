const BUNDLE_PRODUCTS = [
    { id: 101, name: "Neon Vice: 2026",      category: "game",  price: 69.99, icon: "fa-car-side" },
    { id: 102, name: "Echoes of Aethelgard", category: "game",  price: 59.99, icon: "fa-dragon" },
    { id: 103, name: "Chrono Tactics",        category: "game",  price: 29.99, icon: "fa-clock" },
    { id: 104, name: "Pro Soccer 2026",       category: "game",  price: 0.00,  icon: "fa-futbol" },
    { id: 105, name: "Official OST Vol. 1",   category: "dlc",   price: 9.99,  icon: "fa-music" },
    { id: 106, name: "Season Pass Alpha",     category: "dlc",   price: 19.99, icon: "fa-ticket-alt" },
    { id: 107, name: "Digital Art Book",      category: "dlc",   price: 14.99, icon: "fa-book" },
    { id: 108, name: "Glitch Vault Tee",      category: "merch", price: 24.99, icon: "fa-tshirt" },
    { id: 109, name: "XL Mousepad",           category: "merch", price: 15.00, icon: "fa-vector-square" },
    { id: 110, name: "Collector Pin Set",     category: "merch", price: 5.99,  icon: "fa-thumbtack" }
];

const MAX_SAVED = 3;

let bundleState = { budget: 100, filter: 'all', selected: [], saved: [] };

function fmt(price) { return price === 0 ? 'FREE' : `$${price.toFixed(2)}`; }

function calcTotal() {
    let total = 0;
    for (const item of bundleState.selected) {
        total += item.price;
    }
    return total;
}

function render() {
    const grid = document.getElementById('bundle-grid');
    const list = document.getElementById('bundle-list');
    const savedList = document.getElementById('bundle-saved-list');

    
    const products = BUNDLE_PRODUCTS.filter(p =>
        bundleState.filter === 'all' || p.category === bundleState.filter
    );
    document.getElementById('bundle-empty-msg').classList.toggle('d-none', products.length > 0);
    grid.innerHTML = '';

    for (const p of products) {
        const sel = bundleState.selected.some(s => s.id === p.id);

        const col = document.createElement('div');
        col.className = 'col-md-6';

        const card = document.createElement('div');
        card.className = 'card h-100';
        card.style.backgroundColor = 'var(--bg-card)';
        card.style.border = sel ? '2px solid var(--accent)' : '1px solid var(--border)';

        const body = document.createElement('div');
        body.className = 'card-body d-flex flex-column p-3';

        const header = document.createElement('div');
        header.className = 'd-flex justify-content-between align-items-start mb-2';

        const title = document.createElement('h5');
        title.className = 'mb-0 fw-bold';
        title.style.cssText = 'color:var(--text-primary);font-size:1rem';
        title.textContent = p.name;

        const badge = document.createElement('span');
        badge.className = 'badge bg-dark text-light small ms-2';
        badge.textContent = p.category.toUpperCase();

        header.append(title, badge);

        const price = document.createElement('p');
        price.className = 'mt-auto mb-2 fs-5 fw-bold';
        price.style.color = 'var(--accent)';
        price.textContent = fmt(p.price);

        const btn = document.createElement('button');
        btn.className = `btn btn-sm w-100 ${sel ? 'btn-outline-danger' : 'btn-accent'}`;
        btn.dataset.id = p.id;

        const icon = document.createElement('i');
        icon.className = `fas ${sel ? 'fa-times' : 'fa-plus'} me-1`;
        btn.appendChild(icon);
        btn.appendChild(document.createTextNode(sel ? 'Remove' : 'Add'));

        body.append(header, price, btn);
        card.appendChild(body);
        col.appendChild(card);
        grid.appendChild(col);
    }

   
    const total = calcTotal();
    const over = total > bundleState.budget;

    document.getElementById('bundle-budget-val').textContent = `$${bundleState.budget}`;
    document.getElementById('bundle-total-price').textContent = `$${total.toFixed(2)}`;

    const hint = document.getElementById('bundle-selection-hint');
    hint.style.display = bundleState.selected.length ? 'none' : 'block';
    list.innerHTML = '';

    for (const item of bundleState.selected) {
        const li = document.createElement('li');
        li.className = 'd-flex justify-content-between align-items-center py-2 border-bottom';
        li.style.borderColor = 'var(--border)';

        const left = document.createElement('span');
        left.className = 'small text-white';

        const ico = document.createElement('i');
        ico.className = `fas ${item.icon} me-2`;
        ico.style.color = 'var(--accent)';
        left.appendChild(ico);
        left.appendChild(document.createTextNode(item.name));

        const right = document.createElement('div');
        right.className = 'd-flex align-items-center gap-2';

        const priceSpan = document.createElement('span');
        priceSpan.className = 'small fw-bold';
        priceSpan.style.color = 'var(--accent)';
        priceSpan.textContent = fmt(item.price);

        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn btn-link p-0 text-danger small';
        removeBtn.dataset.id = item.id;
        const trashIcon = document.createElement('i');
        trashIcon.className = 'fas fa-trash';
        removeBtn.appendChild(trashIcon);

        right.append(priceSpan, removeBtn);
        li.append(left, right);
        list.appendChild(li);
    }

    
    const status = document.getElementById('bundle-status');
    const saveBtn = document.getElementById('bundle-save-btn');

    if (over) {
        status.textContent = `⚠️ Over budget by $${(total - bundleState.budget).toFixed(2)}.`;
        status.className = 'alert alert-danger d-block mt-3 py-2 px-3 small fw-bold';
    } else {
        status.className = 'd-none';
    }

    const canSave = !over && bundleState.selected.length > 0;
    saveBtn.disabled = !canSave;
    saveBtn.classList.toggle('disabled', !canSave);
    saveBtn.style.opacity = canSave ? '1' : '0.5';

  
    document.getElementById('bundle-saved-count').textContent = bundleState.saved.length;
    savedList.innerHTML = '';

    if (bundleState.saved.length === 0) {
        const p = document.createElement('p');
        p.className = 'small mb-0';
        p.textContent = '';
        savedList.appendChild(p);
    } else {
        for (let i = 0; i < bundleState.saved.length; i++) {
            const row = document.createElement('div');
            row.className = 'd-flex justify-content-between px-2 py-2 rounded';
            row.style.backgroundColor = 'rgba(255,255,255,0.05)';

            const num = document.createElement('span');
            num.className = 'small ';
            num.textContent = `#${i + 1}`;

            const val = document.createElement('span');
            val.className = 'small fw-bold';
            val.style.color = 'var(--accent)';
            val.textContent = `$${bundleState.saved[i].total.toFixed(2)}`;

            row.append(num, val);
            savedList.appendChild(row);
        }
    }
}

function toggleItem(id) {
    const pid = parseInt(id);
    const idx = bundleState.selected.findIndex(i => i.id === pid);

    if (idx > -1) {
        bundleState.selected.splice(idx, 1);
    } else {
        const product = BUNDLE_PRODUCTS.find(p => p.id === pid);
        const conflict = bundleState.selected.find(s => s.category === product.category);
        if (conflict) {
            const status = document.getElementById('bundle-status');
            status.textContent = `❌ Already have a "${product.category}" item. Remove it first.`;
            status.className = 'alert alert-warning d-block mt-3 py-2 px-3 small fw-bold';
            setTimeout(render, 1500);
            return;
        }
        bundleState.selected.push(product);
    }
    render();
}

document.getElementById('bundle-grid').addEventListener('click', function(e) {
    var btn = e.target.closest('button[data-id]');
    if (btn) toggleItem(btn.dataset.id);
});
document.getElementById('bundle-list').addEventListener('click', function(e) {
    var btn = e.target.closest('button[data-id]');
    if (btn) toggleItem(btn.dataset.id);
});
document.getElementById('bundle-filter').addEventListener('change', function(e) {
    bundleState.filter = e.target.value;
    render();
});
document.getElementById('bundle-slider').addEventListener('input', function(e) {
    bundleState.budget = parseInt(e.target.value);
    render();
});
document.getElementById('bundle-save-btn').addEventListener('click', function() {
    if (bundleState.saved.length >= MAX_SAVED) return;
    bundleState.saved.unshift({ total: calcTotal() });
    bundleState.selected = [];
    render();
});
render();
