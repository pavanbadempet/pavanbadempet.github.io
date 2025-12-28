/**
 * Live Data Dashboard
 * Fetches real-time stats for the portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
    const statsContainer = document.getElementById('live-stats-container');
    if (!statsContainer) return;

    // Configuration
    const config = {
        githubUsername: 'pavanbadempet',
        refreshInterval: 60000 * 5 // 5 minutes
    };

    // State
    const state = {
        repos: 0,
        stars: 0,
        followers: 0,
        uptime: 0
    };

    // Animation helper
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end; // Ensure final value is exact
            }
        };
        window.requestAnimationFrame(step);
    }

    // specific method for stars since it's not a direct user property
    async function fetchGitHubStats() {
        try {
            // 1. User Info (Followers, Public Repos)
            const userRes = await fetch(`https://api.github.com/users/${config.githubUsername}`);
            if (!userRes.ok) throw new Error('GitHub User API failed');
            const userData = await userRes.json();

            // 2. Stars (Fetch public repos and sum stars - simplified for portfolio)
            // Note: This only fetches first 100 repos. Good enough for most.
            const reposRes = await fetch(`https://api.github.com/users/${config.githubUsername}/repos?per_page=100`);
            let starsCount = 0;
            if (reposRes.ok) {
                const reposData = await reposRes.json();
                starsCount = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);
            }

            // Update State
            state.repos = userData.public_repos;
            state.followers = userData.followers;
            state.stars = starsCount;

            // Update DOM
            updateDOM();

        } catch (error) {
            console.warn('Live Stats: Using cached/fallback data due to API error', error);
            // Fallback to reasonable numbers if API fails (rate limits)
            state.repos = 35;
            state.stars = 15;
            state.followers = 10;
            updateDOM();
        }
    }

    function updateDOM() {
        const els = {
            repos: document.getElementById('stat-repos'),
            stars: document.getElementById('stat-stars'),
            followers: document.getElementById('stat-followers'),
            uptime: document.getElementById('stat-uptime')
        };

        if (els.repos) animateValue(els.repos, 0, state.repos, 1500);
        if (els.stars) animateValue(els.stars, 0, state.stars, 1500);
        if (els.followers) animateValue(els.followers, 0, state.followers, 1500);
    }

    // Uptime Counter (Time spent on site)
    let seconds = 0;
    setInterval(() => {
        seconds++;
        const el = document.getElementById('stat-uptime');
        if (el) {
            const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
            const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
            const s = (seconds % 60).toString().padStart(2, '0');
            el.innerText = `${h}:${m}:${s}`;
        }
    }, 1000);

    // Init
    fetchGitHubStats();

});
