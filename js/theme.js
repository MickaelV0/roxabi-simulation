(() => {
  const THEME_KEY = 'roxabi-simulation-theme';
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.textContent = saved === 'dark' ? '◑ light' : '◑ dark';
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(THEME_KEY, next);
      btn.textContent = next === 'dark' ? '◑ light' : '◑ dark';
    });
  });
})();
