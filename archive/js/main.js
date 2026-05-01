/**
 * Felix Prince Portfolio - Interactive Enhancements
 */

(function() {
    'use strict';

    // ==================== Mouse Parallax Effect for Gradient Orbs ====================
    function initParallaxOrbs() {
        const orbs = document.querySelectorAll('.orb');
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        document.addEventListener('mousemove', function(e) {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        function animate() {
            currentX += (mouseX - currentX) * 0.05;
            currentY += (mouseY - currentY) * 0.05;

            orbs.forEach((orb, index) => {
                const factor = (index + 1) * 20;
                orb.style.transform = `translate(${currentX * factor}px, ${currentY * factor}px)`;
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    // ==================== Ripple Effect on Click ====================
    function initRippleEffect() {
        const cards = document.querySelectorAll('.project-card:not(.placeholder-card)');

        cards.forEach(card => {
            card.addEventListener('click', function(e) {
                const cardInner = this.querySelector('.card-inner');
                if (!cardInner) return;

                const ripple = document.createElement('span');
                ripple.className = 'ripple';

                const rect = cardInner.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';

                cardInner.appendChild(ripple);

                setTimeout(() => ripple.remove(), 700);
            });
        });
    }

    // ==================== Card Tilt Effect ====================
    function initCardTilt() {
        const cards = document.querySelectorAll('.project-card:not(.placeholder-card)');

        cards.forEach(card => {
            const inner = card.querySelector('.card-inner');
            if (!inner) return;

            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });

            card.addEventListener('mouseleave', function() {
                inner.style.transform = '';
            });
        });
    }

    // ==================== Staggered Reveal Animation ====================
    function initStaggeredReveal() {
        const cards = document.querySelectorAll('.project-card');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';

                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        cards.forEach(card => observer.observe(card));
    }

    // ==================== Smooth Cursor Indication ====================
    function initCursorEnhancements() {
        const interactiveElements = document.querySelectorAll('.project-card:not(.placeholder-card), .social-link');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', function() {
                document.body.style.cursor = 'pointer';
            });

            el.addEventListener('mouseleave', function() {
                document.body.style.cursor = '';
            });
        });
    }

    // ==================== Initialize All ====================
    function init() {
        initParallaxOrbs();
        initRippleEffect();
        initCardTilt();
        initStaggeredReveal();
        initCursorEnhancements();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
