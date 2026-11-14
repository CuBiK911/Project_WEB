// Slide disclosures, fade feedback (common.js), and animate anchor scrolling.
if (window.jQuery) {
    jQuery.fx.off = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
document.addEventListener('click', (event) => {
    const button = event.target.closest('.disclosure');
    if (button) {
        const panel = document.getElementById(button.getAttribute('aria-controls'));
        const open = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(open));
        if (button.classList.contains('faq-question'))
            button.querySelector('span').textContent = open ? '−' : '+';
        else button.textContent = open ? 'Read less −' : 'Read more +';
        if (window.jQuery) {
            const target = jQuery(panel).stop(true, true);
            if (open) target.slideDown(200);
            else target.slideUp(200);
        } else panel.style.display = open ? 'block' : 'none';
    }
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.closest('.account-tabs') || link.classList.contains('skip-link')) return;
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    if (window.jQuery)
        jQuery('html, body')
            .stop(true)
            .animate({ scrollTop: target.getBoundingClientRect().top + window.scrollY - 100 }, 350);
    else target.scrollIntoView();
    history.replaceState(null, '', link.hash);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
});
