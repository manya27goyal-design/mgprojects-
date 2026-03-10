document.addEventListener('DOMContentLoaded', () => {

    // Header Scroll Effect
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Animate burger icon
        const spans = hamburger.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu on link click
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            // Reset burger
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Optimized Scroll Reveal using IntersectionObserver
    const revealElements = document.querySelectorAll('.scroll-reveal, .fade-in-up');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before it enters the viewport
    });

    revealElements.forEach(element => revealObserver.observe(element));

    // Menu Booklet Navigation
    const menuSlider = document.getElementById('menuSlider');
    const menuPrev = document.getElementById('menuPrev');
    const menuNext = document.getElementById('menuNext');
    const pageCounter = document.getElementById('pageCounter');

    if (menuSlider && menuPrev && menuNext) {
        const updateCounter = () => {
            const gap = parseInt(window.getComputedStyle(menuSlider).gap) || 0;
            const itemWidth = menuSlider.clientWidth + gap;
            let pageIndex = Math.round(menuSlider.scrollLeft / itemWidth) + 1;

            // Clamp value to ensure it stays within bounds
            if (pageIndex < 1) pageIndex = 1;
            if (pageIndex > 15) pageIndex = 15;

            if (pageCounter) pageCounter.textContent = `Page ${pageIndex} / 15`;
        };

        menuNext.addEventListener('click', () => {
            const gap = parseInt(window.getComputedStyle(menuSlider).gap) || 0;
            menuSlider.scrollBy({ left: menuSlider.clientWidth + gap, behavior: 'smooth' });
        });

        menuPrev.addEventListener('click', () => {
            const gap = parseInt(window.getComputedStyle(menuSlider).gap) || 0;
            menuSlider.scrollBy({ left: -(menuSlider.clientWidth + gap), behavior: 'smooth' });
        });

        menuSlider.addEventListener('scroll', () => {
            clearTimeout(menuSlider.scrollTimeout);
            menuSlider.scrollTimeout = setTimeout(updateCounter, 100);
        });
    }
});

