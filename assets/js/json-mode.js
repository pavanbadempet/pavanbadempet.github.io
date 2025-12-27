/**
 * JSON Mode for Data Engineer Portfolio
 * Converts the visual portfolio into a raw JSON representation.
 */

const portfolioData = {
    "metadata": {
        "role": "Data Engineer",
        "status": "Available for opportunities",
        "generated_at": new Date().toISOString()
    },
    "profile": {
        "name": "Pavan Badempet",
        "title": "Data Engineer",
        "location": "India",
        "summary": "Data Engineer with expertise in building scalable ETL pipelines, data warehousing, and cloud infrastructure."
    },
    "skills": [
        "Python", "SQL", "Apache Airflow", "AWS", "Spark", "Kafka", "Data Modeling"
    ],
    "experience": [
        {
            "role": "Data Engineer",
            "company": "Current Company",
            "year": "2023 - Present"
        }
    ],
    "contact": {
        "email": "pavanbadempet@gmail.com",
        "github": "github.com/pavanbadempet"
    }
};

function toggleJsonMode() {
    let container = document.getElementById('json-view-container');
    const wrapper = document.querySelector('.wrapper'); // Main site wrapper

    // Create container if it doesn't exist
    if (!container) {
        container = document.createElement('div');
        container.id = 'json-view-container';

        // Add a close button/instruction
        const header = document.createElement('div');
        header.style.marginBottom = '20px';
        header.style.color = '#6a9955'; // Comment color
        header.innerHTML = '// JSON View Active. Click the { } toggle again to return to graphical mode.<br><br>';
        container.appendChild(header);

        const pre = document.createElement('pre');
        pre.id = 'json-content';
        container.appendChild(pre);
        document.body.appendChild(container);

        // Populate dynamic data
        updateJsonContent();
    }

    if (container.style.display === 'block') {
        // Switch back to GUI
        container.style.opacity = '0';
        setTimeout(() => {
            container.style.display = 'none';
            if (wrapper) wrapper.style.display = 'block';
            setTimeout(() => { if (wrapper) wrapper.style.opacity = '1'; }, 50);
        }, 500);
    } else {
        // Switch to JSON
        if (wrapper) {
            wrapper.style.transition = 'opacity 0.5s ease';
            wrapper.style.opacity = '0';
        }

        setTimeout(() => {
            if (wrapper) wrapper.style.display = 'none';
            container.style.display = 'block';
            // Trigger reflow
            container.offsetHeight;
            container.style.opacity = '1';
        }, 500);
    }
}

function updateJsonContent() {
    const pre = document.getElementById('json-content');
    if (!pre) return;

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
