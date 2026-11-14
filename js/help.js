const faqSearch = document.getElementById('faq-search');
const faqItems = [...document.querySelectorAll('.faq-item')];
function filterFAQs() {
    const query = faqSearch.value.trim().toLowerCase();
    let count = 0;
    for (const item of faqItems) {
        item.hidden = !item.textContent.toLowerCase().includes(query);
        if (!item.hidden) count++;
    }
    document.getElementById('faq-count').textContent = count + ' questions';
    document.getElementById('faq-empty').hidden = count > 0;
}
function openLinkedFAQ() {
    const item = document.getElementById(location.hash.slice(1));
    if (!item?.classList.contains('faq-item')) return;
    const button = item.querySelector('button');
    if (button.getAttribute('aria-expanded') !== 'true') button.click();
}
faqSearch.addEventListener('input', filterFAQs);
window.addEventListener('hashchange', openLinkedFAQ);
filterFAQs();
openLinkedFAQ();
