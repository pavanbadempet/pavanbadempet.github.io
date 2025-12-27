/**
 * Interactive Data Particles for Data Engineer Portfolio
 * Creates a network graph effect with nodes and connections.
 */

(function () {
    const canvas = document.createElement('canvas');
    const container = document.getElementById('section-started');

    // If container doesn't exist, exit
    if (!container) return;

    // Insert canvas as the first child
    canvas.id = 'data-particles-bg';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0'; // Behind content but in front of base background
    canvas.style.opacity = '1';
    canvas.style.pointerEvents = 'none'; // Allow clicking through to text

    // Insert before the existing video-bg or simple prepend
    const videoBg = container.querySelector('.video-bg');
    if (videoBg) {
        // Hide original video-bg but keep it in DOM just in case
        videoBg.style.display = 'none';
        container.insertBefore(canvas, videoBg);
    } else {
        container.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Configuration
    const config = {
        particleCount: window.innerWidth < 768 ? 40 : 80, // Fewer on mobile
        connectionDistance: 150,
        mouseDistance: 200,
        particleColor: 'rgba(75, 255, 165, 0.7)', // Data Green/Teal
        lineColor: 'rgba(75, 255, 165, 0.2)',
        particleSpeed: 0.5,
        mouseRepelForce: 3
    };

    // Mouse setup
    let mouse = { x: -9999, y: -9999 };

    // Track mouse over the container specifically? Or window?
    // Window is better for full screen effect
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    class Particle {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * config.particleSpeed;
            this.vy = (Math.random() - 0.5) * config.particleSpeed;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            // Basic movement
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse interaction (Repel/Attract)
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.mouseDistance) {
                // Calculate repulsion angle
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (config.mouseDistance - distance) / config.mouseDistance;
                const directionX = forceDirectionX * force * config.mouseRepelForce;
                const directionY = forceDirectionY * force * config.mouseRepelForce;

                // Move away from mouse
                this.x -= directionX;
                this.y -= directionY;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = config.particleColor;
            ctx.fill();
        }
    }

    function init() {
        resize();
        createParticles();
        animate();
    }

    function resize() {
        width = canvas.width = container.offsetWidth;
        height = canvas.height = container.offsetHeight;

        // Re-adjust particle count on huge resizes
        const newCount = window.innerWidth < 768 ? 40 : 80;
        if (particles.length !== newCount) {
            createParticles(); // Reset if screen category changes significantly
        }
    }

    function createParticles() {
        particles = [];
        // Recalculate count based on current width
        const count = window.innerWidth < 768 ? 40 : 100;
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw edges first (so they are behind nodes)
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = config.lineColor;
                    ctx.lineWidth = 1 - (distance / config.connectionDistance);
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    // Handle Resize
    window.addEventListener('resize', resize);

    // Start
    init();

})();
