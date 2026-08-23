/**
 * Ultra-Fast, Battery-Optimized Data Particles for Data Engineer Portfolio
 * Uses squared Euclidean distances, passive throttled mouse tracking, and IntersectionObserver.
 */
(function () {
    'use strict';

    const container = document.getElementById('section-started') || document.getElementById('section-post');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'data-particles-bg';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.opacity = '1';
    canvas.style.pointerEvents = 'none';

    // Remove or hide any conflicting video-bg
    const videoBg = container.querySelector('.video-bg');
    if (videoBg) {
        videoBg.style.display = 'none';
        container.insertBefore(canvas, videoBg);
    } else {
        container.prepend(canvas);
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0, height = 0;
    let particles = [];
    let isVisible = true;
    let animId = null;

    // Configuration
    const isMobile = window.innerWidth < 768;
    const config = {
        particleCount: isMobile ? 35 : 65,
        connectionDistance: 130,
        connectionDistanceSq: 130 * 130,
        mouseDistance: 160,
        mouseDistanceSq: 160 * 160,
        particleColor: 'rgba(75, 255, 165, 0.65)',
        lineColorPrefix: 'rgba(75, 255, 165, ',
        particleSpeed: isMobile ? 0.3 : 0.45,
        mouseRepelForce: 2.5
    };

    // Cached Mouse Coordinates & Canvas Offset
    let canvasRect = { left: 0, top: 0 };
    let mouse = { x: -9999, y: -9999 };
    let targetMouse = { x: -9999, y: -9999 };
    let mouseActive = false;

    function updateCanvasRect() {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        canvasRect.left = rect.left + window.scrollX;
        canvasRect.top = rect.top + window.scrollY;
    }

    window.addEventListener('scroll', updateCanvasRect, { passive: true });
    window.addEventListener('resize', () => {
        resize();
        updateCanvasRect();
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
        targetMouse.x = e.pageX - canvasRect.left;
        targetMouse.y = e.pageY - canvasRect.top;
        mouseActive = true;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        targetMouse.x = -9999;
        targetMouse.y = -9999;
        mouseActive = false;
    }, { passive: true });

    class Particle {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * (width || window.innerWidth);
            this.y = Math.random() * (height || window.innerHeight);
            this.vx = (Math.random() - 0.5) * config.particleSpeed;
            this.vy = (Math.random() - 0.5) * config.particleSpeed;
            this.size = Math.random() * 1.5 + 1.0;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0) { this.x = 0; this.vx = Math.abs(this.vx); }
            else if (this.x > width) { this.x = width; this.vx = -Math.abs(this.vx); }

            if (this.y < 0) { this.y = 0; this.vy = Math.abs(this.vy); }
            else if (this.y > height) { this.y = height; this.vy = -Math.abs(this.vy); }

            // Mouse interaction
            if (mouseActive) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < config.mouseDistanceSq && distSq > 1) {
                    const dist = Math.sqrt(distSq);
                    const force = (config.mouseDistance - dist) / config.mouseDistance;
                    const forceX = (dx / dist) * force * config.mouseRepelForce;
                    const forceY = (dy / dist) * force * config.mouseRepelForce;

                    this.x -= forceX;
                    this.y -= forceY;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, 6.28318530718); // Math.PI * 2
            ctx.fillStyle = config.particleColor;
            ctx.fill();
        }
    }

    function resize() {
        if (!container) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = container.offsetWidth;
        height = container.offsetHeight;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        createParticles();
    }

    function createParticles() {
        particles = [];
        const count = isMobile ? 35 : 65;
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        if (!isVisible) {
            animId = null;
            return;
        }

        ctx.clearRect(0, 0, width, height);

        // Smooth mouse lerp
        if (mouseActive) {
            mouse.x += (targetMouse.x - mouse.x) * 0.2;
            mouse.y += (targetMouse.y - mouse.y) * 0.2;
        }

        const len = particles.length;

        // Draw connections with squared distance checks
        for (let i = 0; i < len; i++) {
            const p1 = particles[i];
            for (let j = i + 1; j < len; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < config.connectionDistanceSq) {
                    const alpha = (1 - (distSq / config.connectionDistanceSq)) * 0.25;
                    ctx.beginPath();
                    ctx.strokeStyle = config.lineColorPrefix + alpha.toFixed(3) + ')';
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }

        // Update and draw particles
        for (let i = 0; i < len; i++) {
            particles[i].update();
            particles[i].draw();
        }

        animId = requestAnimationFrame(animate);
    }

    // Pause rendering when out of viewport to save 100% CPU/GPU
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
                if (isVisible && !animId) {
                    animId = requestAnimationFrame(animate);
                }
            });
        }, { threshold: 0.05 });
        observer.observe(container);
    }

    // Initial setup
    updateCanvasRect();
    resize();
    animId = requestAnimationFrame(animate);
})();
