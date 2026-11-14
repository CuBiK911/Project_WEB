// Apply the saved mode before the page is painted.
try {
    const theme = JSON.parse(localStorage.getItem('gv-theme'));
    document.documentElement.dataset.bsTheme = theme === 'light' ? 'light' : 'dark';
} catch {
    document.documentElement.dataset.bsTheme = 'dark';
}
