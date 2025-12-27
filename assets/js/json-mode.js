/**
 * JSON Mode for Data Engineer Portfolio
 * Dynamically scrapes the site content to build a JSON representation.
 */

function getPortfolioData() {
    const data = {
        "metadata": {
            "role": "Data Engineer",
            "source": window.location.href,
            "generated_at": new Date().toISOString()
        },
        "profile": {},
        "skills": {},
        "experience": [],
        "education": []
    };

    // 1. Scrape Profile (About Section)
    const aboutSection = document.querySelector('.section.about');
    if (aboutSection) {
        const desc = aboutSection.querySelector('.desc p');
        data.profile.summary = desc ? desc.innerText.trim() : "";

        const infoList = aboutSection.querySelectorAll('.info-list li');
        infoList.forEach(li => {
            const text = li.innerText;
            const parts = text.split(':');
            if (parts.length > 1) {
                const key = parts[0].trim().toLowerCase().replace(/\s+/g, '_');
                const value = parts.slice(1).join(':').trim();
                data.profile[key] = value;
            }
        });
    }

    // 2. Scrape Skills
    const skillSections = document.querySelectorAll('.section.skills .content-box');
    skillSections.forEach(section => {
        // Try to find the title previous to this box (navigating up DOM tree slightly)
        const parent = section.closest('.section.skills');
        const titleEl = parent.querySelector('.title_inner');
        const category = titleEl ? titleEl.innerText.trim() : "general";

        const skills = [];
        const items = section.querySelectorAll('li .name');
        items.forEach(item => skills.push(item.innerText.trim()));

        if (skills.length > 0) {
            data.skills[category] = skills;
        }
    });

    // 3. Scrape Experience & Education
    // Assuming they are in .resume-items containers
    const resumeCols = document.querySelectorAll('.section.resume .col');

    resumeCols.forEach(col => {
        const titleEl = col.querySelector('.title_inner');
        if (!titleEl) return;
        const sectionTitle = titleEl.innerText.trim().toLowerCase();

        const items = col.querySelectorAll('.resume-item');
        items.forEach(item => {
            const entry = {};

            const dateEl = item.querySelector('.date');
            if (dateEl) entry.period = dateEl.innerText.trim();

            const nameEl = item.querySelector('.name'); // Job Title
            if (nameEl) entry.role = nameEl.innerText.trim();

            const companyEl = item.querySelector('.company');
            if (companyEl) entry.company = companyEl.innerText.trim(); // Might be generic text

            // Checking specific education fields based on section-resume.html structure
            if (sectionTitle.includes('education')) {
                const uni = item.querySelector('.university');
                const degree = item.querySelector('.degree');
                if (uni) entry.institution = uni.innerText.trim();
                if (degree) entry.degree = degree.innerText.trim();
            } else {
                // Work experience bullets
                const bullets = [];
                item.querySelectorAll('li').forEach(li => bullets.push(li.innerText.trim()));
                if (bullets.length > 0) entry.highlights = bullets;
            }

            if (sectionTitle.includes('education')) {
                data.education.push(entry);
            } else {
                data.experience.push(entry);
            }
        });
    });

    return data;
}

function toggleJsonMode() {
    let container = document.getElementById('json-view-container');
    const wrapper = document.querySelector('.wrapper');
    const header = document.querySelector('.header');

    // Create container if it doesn't exist
    if (!container) {
        container = document.createElement('div');
        container.id = 'json-view-container';

        // Scroll Area
        const scrollArea = document.createElement('div');
        scrollArea.id = 'json-scroll-area';

        // Header / Instructions
        const info = document.createElement('div');
        info.className = 'json-comment';
        info.innerHTML = '// JSON View Active.<br>// Click the { } toggle again to return to graphical mode.<br><br>';

        // Content Area
        const pre = document.createElement('pre');
        pre.id = 'json-content';

        scrollArea.appendChild(info);
        scrollArea.appendChild(pre);
        container.appendChild(scrollArea);
        document.body.appendChild(container);

        updateJsonContent();
    } else {
        // Refresh data every open to capture any dynamic updates
        updateJsonContent();
    }

    if (container.style.display === 'block') { // CLOSING
        container.style.opacity = '0';
        setTimeout(() => {
            container.style.display = 'none';
        }, 500);
    } else { // OPENING
        container.style.display = 'block';
        // Force reflow
        container.offsetHeight;
        container.style.opacity = '1';
    }
}

function updateJsonContent() {
    const pre = document.getElementById('json-content');
    if (!pre) return;

    // Get Scraped Data
    const portfolioData = getPortfolioData();

    // Convert to JSON string
    const jsonString = JSON.stringify(portfolioData, null, 4);

    // Syntax Highlight
    pre.innerHTML = syntaxHighlight(jsonString);
}

function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'json-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
