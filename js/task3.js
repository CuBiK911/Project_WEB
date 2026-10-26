
const PROMO_CODES = ['NEON20', 'VAULT10', 'GV2026'];

var form        = document.getElementById('validation-form');
var editionEl   = document.getElementById('edition');
var quantityEl  = document.getElementById('quantity');
var nameEl      = document.getElementById('name');
var emailEl     = document.getElementById('email');
var platformEl  = document.getElementById('platform');
var promoEl     = document.getElementById('promo');
var errorSummary = document.getElementById('error-summary');

form.noValidate = true;


function updatePreview() {
    var opt   = editionEl.options[editionEl.selectedIndex];
    var price = parseFloat(opt.dataset.price) || 0;
    var qty   = parseInt(quantityEl.value) || 0;
    var total = price * qty;
    var promoApplied = PROMO_CODES.indexOf(promoEl.value.toUpperCase()) !== -1;

    if (promoApplied && total > 0) total = total * 0.8;

    document.getElementById('preview-edition').textContent  = opt.value ? opt.text : 'Select an edition...';
    document.getElementById('preview-name').textContent     = 'Name: '     + (nameEl.value     || '—');
    document.getElementById('preview-platform').textContent = 'Platform: ' + (platformEl.value || '—');
    document.getElementById('preview-qty').textContent      = 'Qty: '      + (quantityEl.value || '—');
    document.getElementById('preview-promo').textContent    = promoApplied && promoEl.value ? '20% discount applied!' : '';
    document.getElementById('preview-total').textContent    = '$' + total.toFixed(2);
}
function validateField(field) {
    var val     = field.value.trim();
    var isValid = true;
    var message = '';

    if (field === editionEl) {
        if (!val) {
            isValid = false;
            message = 'Please select an edition.';
        }
    }

    if (field === quantityEl) {
        var qty      = parseInt(val);
        var opt      = editionEl.options[editionEl.selectedIndex];
        var seats    = parseInt(opt.dataset.seats) || 0;
        if (!val || isNaN(qty) || qty < 1) {
            isValid = false;
            message = 'Quantity must be at least 1.';
        } else if (qty > 10) {
            isValid = false;
            message = 'Maximum 10 copies per order.';
        } else if (seats > 0 && qty > seats) {
            isValid = false;
            message = 'Only ' + seats + ' copies left for this edition.';
        }
    }

    if (field === nameEl) {
        if (val.length < 3) {
            isValid = false;
            message = 'Name must be at least 3 characters.';
        } else if (!/^[a-zA-Z\s]+$/.test(val)) {
            isValid = false;
            message = 'Name must contain letters only (no numbers or symbols).';
        }
    }

    if (field === emailEl) {
        if (!/^[^\s@]+@[^\s@]+\.(com|kz)$/.test(val)) {
            isValid = false;
            message = 'Email must be valid contain @ and end with .com or etc.';
        }
    }

    if (field === platformEl) {
        if (!val) {
            isValid = false;
            message = 'Please select a platform.';
        }
    }

    if (field === promoEl && val !== '') {
        if (PROMO_CODES.indexOf(val.toUpperCase()) === -1) {
            isValid = false;
            message = 'Invalid promo code.';
            
        }
    }

  
    var feedback = field.nextElementSibling;
    if (!isValid && val !== '') {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        field.setAttribute('aria-invalid', 'true');
        if (feedback) feedback.textContent = message;
    } else if (isValid && val !== '') {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        field.setAttribute('aria-invalid', 'false');
        if (feedback) feedback.textContent = '';
    } else {
        field.classList.remove('is-invalid', 'is-valid');
        field.removeAttribute('aria-invalid');
        if (feedback) feedback.textContent = '';
    }

    return isValid;
}


var allFields = [editionEl, quantityEl, nameEl, emailEl, platformEl, promoEl];

for (var i = 0; i < allFields.length; i++) {
    allFields[i].addEventListener('input',  updatePreview);
    allFields[i].addEventListener('change', updatePreview);
    (function(f) {
        f.addEventListener('blur',  function() { validateField(f); });
        f.addEventListener('input', function() { validateField(f); });
    })(allFields[i]);
}


form.addEventListener('submit', function(e) {
    e.preventDefault();

    var errorCount = 0;
    var firstBad   = null;

    for (var i = 0; i < allFields.length; i++) {
        var f   = allFields[i];
        var ok  = validateField(f);
        
        if (f === promoEl && f.value.trim() === '') continue;
        if (!ok || f.value.trim() === '') {
            errorCount++;
            if (!firstBad) firstBad = f;
        }
    }

    if (errorCount > 0) {
        errorSummary.textContent = 'Please fix ' + errorCount + ' error(s) before submitting.';
        errorSummary.classList.remove('d-none');
        if (firstBad) firstBad.focus();
        return;
    }

    errorSummary.classList.add('d-none');
    form.classList.add('d-none');
    buildSuccess();
});


function buildSuccess() {
    var result = document.getElementById('success-result');
    result.innerHTML = '';
    result.className = 'game-board-card p-5 text-center';

    var opt   = editionEl.options[editionEl.selectedIndex];
    var price = parseFloat(opt.dataset.price) || 0;
    var qty   = parseInt(quantityEl.value) || 1;
    var total = price * qty;
    var promoApplied = PROMO_CODES.indexOf(promoEl.value.toUpperCase()) !== -1;
    if (promoApplied && promoEl.value.trim() !== '') total = total * 0.8;
    var code  = 'GV-' + Math.floor(1000 + Math.random() * 9000);

    var icon = document.createElement('i');
    icon.className = 'fas fa-check-circle';
    icon.style.cssText = 'font-size:3rem;color:#4caf50;display:block;margin-bottom:16px;';

    var heading = document.createElement('h2');
    heading.style.color = 'var(--text-primary)';
    heading.textContent = 'Pre-Order Confirmed!';

    var codeLabel = document.createElement('p');
    codeLabel.style.color = 'var(--text-secondary)';
    codeLabel.textContent = 'Your booking code:';

    var codeEl = document.createElement('div');
    codeEl.style.cssText = 'font-size:2rem;font-weight:800;color:var(--accent);font-family:Montserrat,sans-serif;margin:12px 0;';
    codeEl.textContent = code;

    var detailsTable = document.createElement('table');
    detailsTable.className = 'custom-table mx-auto mt-3';
    detailsTable.style.maxWidth = '360px';

    var rows = [
        ['Name',     nameEl.value],
        ['Email',    emailEl.value],
        ['Edition',  opt.text.split('—')[0].trim()],
        ['Platform', platformEl.value.toUpperCase()],
        ['Quantity', quantityEl.value],
        ['Total',    '$' + total.toFixed(2) + (promoApplied ? ' (20% off)' : '')]
    ];

    var tbody = document.createElement('tbody');
    for (var i = 0; i < rows.length; i++) {
        var tr = document.createElement('tr');
        var td1 = document.createElement('td');
        td1.style.fontWeight = '700';
        td1.textContent = rows[i][0];
        var td2 = document.createElement('td');
        td2.textContent = rows[i][1];
        tr.append(td1, td2);
        tbody.appendChild(tr);
    }
    detailsTable.appendChild(tbody);

    var resetBtn = document.createElement('button');
    resetBtn.className = 'btn btn-outline-light mt-4';
    resetBtn.textContent = 'Make Another Order';
    resetBtn.addEventListener('click', resetForm);

    result.append(icon, heading, codeLabel, codeEl, detailsTable, resetBtn);
}


function resetForm() {
    form.reset();
    form.classList.remove('d-none');

    var result = document.getElementById('success-result');
    result.className = 'd-none';
    result.innerHTML = '';

    for (var i = 0; i < allFields.length; i++) {
        allFields[i].classList.remove('is-valid', 'is-invalid');
        allFields[i].removeAttribute('aria-invalid');
        var fb = allFields[i].nextElementSibling;
        if (fb) fb.textContent = '';
    }
    updatePreview();
}


updatePreview();
