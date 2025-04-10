document.addEventListener("DOMContentLoaded", function () {


    // Navigation toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    menuToggle.addEventListener('click', () => {
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        navLinks.classList.toggle('active');
    });

    // Sticky navigation
    const nav = document.getElementById('main-nav');
    let lastScrollTop = 0;
    const scrollThreshold = 200; // Only hide after scrolling this many pixels

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Only hide nav when scrolled past threshold
        if (scrollTop > scrollThreshold && scrollTop > lastScrollTop) {
            // Scrolling down past threshold
            nav.style.transform = 'translateY(0)';
        } else {
            // Scrolling up or not past threshold
            nav.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Gallery carousel
    const slides = document.querySelectorAll('.gallery-slide');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const dotNav = document.getElementById('galleryNav');
    let currentSlide = 0;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('gallery-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotNav.appendChild(dot);
    });

    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlides();
    }

    // Previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlides();
    }

    // Go to specific slide
    function goToSlide(index) {
        currentSlide = index;
        updateSlides();
    }

    // Update slides display
    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            dotNav.children[index].classList.remove('active');
        });
        slides[currentSlide].classList.add('active');
        dotNav.children[currentSlide].classList.add('active');
    }

    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Auto slide
    let slideInterval = setInterval(nextSlide, 5000);

    // Pause on hover
    const galleryContainer = document.querySelector('.gallery-container');
    galleryContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    galleryContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });

    // Form submission (mock)
    const contactForm = document.querySelector('.contact-form');
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile menu if open
            navLinks.classList.remove('active');

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - nav.offsetHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
    console.log("JavaScript file loaded");
});