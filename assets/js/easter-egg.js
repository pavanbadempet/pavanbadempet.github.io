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
        const terminalText = document.createElement('div');
        terminalText.id = 'terminal-text';
        overlay.appendChild(terminalText);
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
                    overlay.innerHTML = '';

                    const container = document.createElement('div');
                    container.style.display = 'flex';
                    container.style.justifyContent = 'center';
                    container.style.alignItems = 'center';
                    container.style.height = '100%';
                    container.style.flexDirection = 'column';

                    const h1 = document.createElement('h1');
                    h1.style.fontSize = '3em';
                    h1.style.textShadow = '0 0 10px #0f0';
                    h1.textContent = 'YOU FOUND THE SECRET!';

                    const p1 = document.createElement('p');
                    p1.textContent = 'You are clearly the engineer we are looking for.';

                    const p2 = document.createElement('p');
                    p2.textContent = "Let\'s build something improved together.";

                    const btn = document.createElement('button');
                    btn.style.marginTop = '20px';
                    btn.style.padding = '10px 20px';
                    btn.style.background = '#0f0';
                    btn.style.color = 'black';
                    btn.style.border = 'none';
                    btn.style.fontWeight = 'bold';
                    btn.style.cursor = 'pointer';
                    btn.textContent = 'RETURN TO SITE';
                    btn.onclick = () => location.reload();

                    container.appendChild(h1);
                    container.appendChild(p1);
                    container.appendChild(p2);
                    container.appendChild(btn);

                    overlay.appendChild(container);
                }, 1500);
            }
        }

        typeWriter();
    }
})();
