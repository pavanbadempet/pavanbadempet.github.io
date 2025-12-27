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

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Trigger & Palette
    const trigger = document.createElement('div');
    trigger.className = 'theme-trigger';
    trigger.innerHTML = '<i class="fas fa-palette"></i>';
    trigger.title = "Change Theme Color";

    const palette = document.createElement('div');
    palette.id = 'theme-palette';

    // Create swatches
    colors.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color;
        swatch.onclick = () => setTheme(color);
        palette.appendChild(swatch);
    });

    document.body.appendChild(trigger);
    document.body.appendChild(palette);

    // 2. Toggle Logic
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        palette.classList.toggle('visible');
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!palette.contains(e.target) && e.target !== trigger) {
            palette.classList.remove('visible');
        }
    });

    // 3. Load Saved Theme
    const savedColor = localStorage.getItem('theme-color');
    if (savedColor) {
        setTheme(savedColor);
    }
});

function setTheme(color) {
    document.documentElement.style.setProperty('--active-color', color);
    localStorage.setItem('theme-color', color);

    // Optional: Update particles if they exist
    // This requires data-particles.js to expose an update method or we reload
    // For now, simple CSS change is instant.
}
