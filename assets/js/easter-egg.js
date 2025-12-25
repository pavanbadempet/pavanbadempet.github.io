(function () {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let cursor = 0;

    document.addEventListener('keydown', function (e) {
        if (e.key === konamiCode[cursor]) {
            cursor++;
            if (cursor === konamiCode.length) {
                activateTerminalMode();
                cursor = 0;
            }
        } else {
            cursor = 0;
        }
    });

    function activateTerminalMode() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'black';
        overlay.style.color = '#0f0';
        overlay.style.fontFamily = 'monospace';
        overlay.style.padding = '20px';
        overlay.style.zIndex = '99999';
        overlay.style.boxSizing = 'border-box';
        overlay.style.overflow = 'hidden';
        overlay.innerHTML = '<div id="terminal-text"></div>';
        document.body.appendChild(overlay);

        const messages = [
            "Accessing Mainframe...",
            "Bypassing Firewalls...",
            "Downloading Confidential Assets...",
            "...",
            "ACCESS GRANTED.",
            "Welcome, Admin."
        ];

        let i = 0;
        const output = document.getElementById('terminal-text');

        function typeWriter() {
            if (i < messages.length) {
                const p = document.createElement('p');
                p.textContent = "> " + messages[i];
                output.appendChild(p);
                i++;
                setTimeout(typeWriter, 800);
            } else {
                setTimeout(() => {
                    overlay.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100%;flex-direction:column;">' +
                        '<h1 style="font-size:3em;text-shadow:0 0 10px #0f0;">YOU FOUND THE SECRET!</h1>' +
                        '<p>You are clearly the engineer we are looking for.</p>' +
                        '<p>Let\'s build something improved together.</p>' +
                        '<button onclick="location.reload()" style="margin-top:20px;padding:10px 20px;background:#0f0;color:black;border:none;font-weight:bold;cursor:pointer;">RETURN TO SITE</button>' +
                        '</div>';
                }, 1500);
            }
        }

        typeWriter();
    }
})();
