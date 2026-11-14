// Local demonstration only. This is not server authentication.
async function passwordHash(password, salt) {
    const bytes = new TextEncoder().encode(salt + ':' + password);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}
function validateAccountField(field) {
    const value = field.value.trim();
    let message = '';
    if (field.type === 'email' && !validEmail(value)) message = 'Enter a valid email address.';
    if (field.id === 'register-name' && (value.length < 2 || value.length > 40))
        message = 'Use 2–40 characters for your display name.';
    if (field.id === 'register-password' && (field.value.length < 8 || !value))
        message = 'Use a made-up password of at least 8 characters.';
    if (field.id === 'login-password' && !field.value) message = 'Enter your demo password.';
    if (
        field.id === 'register-confirm' &&
        (!field.value || field.value !== document.getElementById('register-password').value)
    )
        message = 'Passwords must match.';
    if (field.id === 'register-terms' && !field.checked) message = 'Please accept the demo policy.';
    return fieldError(field, message);
}
function renderProfile() {
    const profile = document.getElementById('profile-content');
    if (!profile) return;
    const user = currentUser();
    const owner = user?.email || '';
    const orders = getOrders().filter((order) => order.owner === owner);
    profile.innerHTML = user
        ? `<div class="profile-data"><h2>${escapeHTML(user.name)}</h2><p>${escapeHTML(user.email)}</p><div class="button-row"><a href="saved.html" class="btn btn-accent">View saved collection</a><button id="logout" class="btn btn-quiet">Log out</button></div></div>`
        : '<h2>You are browsing as a guest</h2><p>Log in to see your profile and account reservations. Guest reservations appear below.</p><a class="btn btn-accent" href="account.html">Log in or register</a>';
    profile.insertAdjacentHTML(
        'beforeend',
        `<section class="mt-5"><h2>Reservation history</h2><p>${orders.length} demo reservations · Total ${money(orders.reduce((sum, order) => sum + order.total, 0))}</p>${
            orders.length
                ? orders
                      .slice()
                      .reverse()
                      .map(
                          (order) =>
                              `<article class="order-record"><h3>${GAMES.find((game) => game.id === order.game).title}</h3><p>${escapeHTML(order.id)} · ${escapeHTML(order.quantity)} copies · ${money(order.total)}</p><button class="btn btn-quiet btn-sm" data-remove-order="${escapeHTML(order.id)}">Remove reservation</button></article>`,
                      )
                      .join('') +
                  '<button id="clear-orders" class="btn btn-quiet mt-3">Clear reservation history</button>'
                : '<p class="empty-state">No reservations yet. <a href="task3-form.html">Try a demo reservation</a>.</p>'
        }</section>`,
    );
    document.getElementById('logout')?.addEventListener('click', () => {
        if (writeData('session', '')) location.href = 'account.html#login';
    });
    document.getElementById('clear-orders')?.addEventListener('click', () => {
        if (
            writeData(
                'orders',
                getOrders().filter((order) => order.owner !== owner),
            )
        ) {
            renderProfile();
            notify('Reservation history cleared.');
        }
    });
}
if (document.getElementById('profile-content')) {
    renderProfile();
    window.addEventListener('storage', renderProfile);
    document.getElementById('profile-content').addEventListener('click', (event) => {
        const button = event.target.closest('[data-remove-order]');
        if (!button) return;
        const owner = currentUser()?.email || '';
        if (
            writeData(
                'orders',
                getOrders().filter(
                    (order) => order.id !== button.dataset.removeOrder || order.owner !== owner,
                ),
            )
        ) {
            renderProfile();
            notify('Reservation removed.');
        }
    });
}
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
if (loginForm) {
    function showAccountForm() {
        const register = location.hash === '#register';
        registerForm.hidden = !register;
        loginForm.hidden = register;
        document.getElementById('register-tab').classList.toggle('active', register);
        document.getElementById('login-tab').classList.toggle('active', !register);
        document.getElementById('register-tab').setAttribute('aria-current', register ? 'true' : 'false');
        document.getElementById('login-tab').setAttribute('aria-current', register ? 'false' : 'true');
    }
    window.addEventListener('hashchange', showAccountForm);
    showAccountForm();
    for (const form of [loginForm, registerForm]) {
        const fields = [...form.querySelectorAll('input')];
        for (const field of fields) {
            field.addEventListener('blur', () => validateAccountField(field));
            field.addEventListener('input', () => {
                if (field.hasAttribute('aria-invalid')) validateAccountField(field);
            });
        }
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const status = form.querySelector('[role="status"]');
            status.textContent = '';
            const valid = fields.map(validateAccountField).every(Boolean);
            if (!valid) {
                form.querySelector('[aria-invalid="true"]').focus();
                return;
            }
            const submit = form.querySelector('[type="submit"]');
            if (submit.disabled) return;
            submit.disabled = true;
            const register = form === registerForm;
            const prefix = register ? 'register' : 'login';
            const emailField = document.getElementById(prefix + '-email');
            const email = emailField.value.trim().toLowerCase();
            const password = document.getElementById(prefix + '-password').value;
            try {
                const accounts = getAccounts();
                const existing = accounts.find((account) => account.email === email);
                if (register) {
                    if (existing) {
                        fieldError(emailField, 'This email is registered. Log in instead.');
                        emailField.focus();
                        return;
                    }
                    const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
                        byte.toString(16).padStart(2, '0'),
                    ).join('');
                    const hash = await passwordHash(password, salt);
                    const latestAccounts = getAccounts();
                    if (latestAccounts.some((account) => account.email === email)) {
                        fieldError(emailField, 'This email is already registered.');
                        return;
                    }
                    if (
                        !writeData('accounts', [
                            ...latestAccounts,
                            {
                                name: document.getElementById('register-name').value.trim(),
                                email,
                                salt,
                                hash,
                            },
                        ])
                    )
                        throw new Error('Storage unavailable');
                    registerForm.reset();
                    document.getElementById('login-email').value = email;
                    location.hash = 'login';
                    showAccountForm();
                    document.getElementById('login-status').textContent =
                        'Account created. You can now log in.';
                    document.getElementById('login-status').className = 'status success';
                    document.getElementById('login-password').focus();
                } else {
                    if (!existing || (await passwordHash(password, existing.salt)) !== existing.hash) {
                        fieldError(
                            document.getElementById('login-password'),
                            'Email or password is incorrect. Please try again.',
                        );
                        document.getElementById('login-password').focus();
                        return;
                    }
                    if (!writeData('session', email)) throw new Error('Storage unavailable');
                    status.textContent = 'Login successful. Opening your profile…';
                    status.className = 'status success';
                    updateNavigation();
                    setTimeout(() => {
                        location.href = 'profile.html';
                    }, 450);
                }
            } catch {
                status.textContent =
                    'Could not save or check this account. Use HTTPS or localhost and allow browser storage.';
                status.className = 'status error';
            } finally {
                submit.disabled = false;
            }
        });
    }
}
