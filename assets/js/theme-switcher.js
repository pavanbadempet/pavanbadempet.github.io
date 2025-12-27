/**
 * Theme Switcher
 * Handles dynamic color changing and persistence
 */

const colors = [
    '#4bffa5', // Default Neon Green
    '#ff4b4b', // Red
    '#4b9fff', // Blue
    '#ffb84b', // Orange/Gold
    '#d74bff'  // Purple
];

// Expose globally
window.setTheme = function (color) {
    document.documentElement.style.setProperty('--active-color', color);
    localStorage.setItem('theme-color', color);
}

document.addEventListener('DOMContentLoaded', () => {
    // Load Saved Theme
    const savedColor = localStorage.getItem('theme-color');
    if (savedColor) {
        window.setTheme(savedColor);
    }
});
