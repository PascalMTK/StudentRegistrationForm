document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');

    themeToggleBtn?.addEventListener('click', () => {
    const currentTheme = document.documentElement.dataset.theme || "light";
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = newTheme;
    themeToggleBtn.querySelector('.icon').textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
});
