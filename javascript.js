document.addEventListener("DOMContentLoaded", function () {


  // Navigation toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    navLinks.classList.toggle('active');
  });

  // Parallax effect
  const header = document.querySelector('header');

  // Set initial background position
  let scrollPosition = window.pageYOffset;
  header.style.backgroundPosition = `center ${+scrollPosition * 0.5}px`;

  // Update background position on scroll
  window.addEventListener('scroll', function () {
    scrollPosition = window.pageYOffset;

    // The multiplier 0.5 controls how much slower the background moves (smaller = slower)
    const yPosition = +scrollPosition * 0.5;

    // Update the background position
    header.style.backgroundPosition = `center ${yPosition}px`;
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

  // Gallery modal functionality
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('galleryModal');
  const modalSlides = document.querySelectorAll('.modal-slide');
  const closeBtn = document.querySelector('.close');
  const prevBtn = document.querySelector('.modal-prev');
  const nextBtn = document.querySelector('.modal-next');
  const counter = document.querySelector('.modal-counter');
  let currentSlide = 0;

  // Open modal and show clicked image
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      modal.style.display = 'block';
      showSlide(index);
    });
  });

  // Close modal
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close on click outside of image
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Next slide
  nextBtn.addEventListener('click', () => {
    showSlide(currentSlide + 1);
  });

  // Previous slide
  prevBtn.addEventListener('click', () => {
    showSlide(currentSlide - 1);
  });

  // Key navigation
  document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'block') {
      if (e.key === 'ArrowRight') {
        showSlide(currentSlide + 1);
      } else if (e.key === 'ArrowLeft') {
        showSlide(currentSlide - 1);
      } else if (e.key === 'Escape') {
        modal.style.display = 'none';
      }
    }
  });

  // Show slide function
  function showSlide(n) {
    // Loop back to first/last slide
    if (n >= modalSlides.length) {
      currentSlide = 0;
    } else if (n < 0) {
      currentSlide = modalSlides.length - 1;
    } else {
      currentSlide = n;
    }

    // Hide all slides
    modalSlides.forEach(slide => {
      slide.classList.remove('active');
    });

    // Show current slide
    modalSlides[currentSlide].classList.add('active');

    // Update counter
    counter.textContent = `${currentSlide + 1} / ${modalSlides.length}`;
  }

  // // Form submission (mock)
  // const contactForm = document.querySelector('.contact-form');
  // contactForm.addEventListener('submit', function (e) {
  //     e.preventDefault();
  //     alert('Thank you for your message! We will get back to you soon.');
  //     this.reset();
  // });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      // Close mobile menu if open
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');

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