// @ts-check
import { els } from './dom.js';

/** @typedef {'light' | 'dark'} Theme */

/**
 * Apply a theme to the document and persist the choice.
 * @param {Theme} theme
 */
export function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme', theme);
  els.themeBtn.textContent = theme === 'dark' ? '☾' : '☀';
  els.themeBtn.title =
    theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
}

/** Apply the saved theme and wire up the toggle button. */
export function initTheme() {
  const saved = /** @type {Theme | null} */ (localStorage.getItem('theme'));
  setTheme(saved || 'light');

  els.themeBtn.addEventListener('click', () => {
    const isDark = document.documentElement.dataset.theme === 'dark';
    setTheme(isDark ? 'light' : 'dark');
  });
}
