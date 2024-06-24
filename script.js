document.addEventListener('DOMContentLoaded', () => {
  const langSwitcher = document.getElementById('lang-switcher');
  const elementsToTranslate = document.querySelectorAll('[data-en], [data-fr]');
  const elementsToTranslateDate = document.querySelectorAll('[data-en-date], [data-fr-date]');

  let currentLang = 'en';

  const updateLanguage = (lang) => {
      elementsToTranslate.forEach(element => {
          element.textContent = element.getAttribute(`data-${lang}`);
      });

      elementsToTranslateDate.forEach(element => {
          const dateParts = element.getAttribute(`data-${lang}-date`).split(' ');
          element.querySelector('.day').textContent = dateParts[0];
          element.querySelector('.month').textContent = dateParts[1];
          element.querySelector('.year').textContent = dateParts[2];
      });

      langSwitcher.textContent = lang === 'en' ? 'FR' : 'EN';
  };

  langSwitcher.addEventListener('click', (e) => {
      e.preventDefault();
      currentLang = currentLang === 'en' ? 'fr' : 'en';
      updateLanguage(currentLang);
  });

  // Initialize with the default language
  updateLanguage(currentLang);
});

// JavaScript for hamburger menu toggle and smooth scroll
document.addEventListener('DOMContentLoaded', function() {
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navLinks = document.querySelector('.nav-links');
  const navLinksList = document.querySelectorAll('.nav-links li a');

  let menuOpen = false; // Flag to track menu state

  // Toggle hamburger menu active class and nav links active class
  hamburgerMenu.addEventListener('click', () => {
      if (!menuOpen) {
          // Opening animation
          navLinks.classList.add('active');
          hamburgerMenu.classList.add('active');
          navLinks.style.transform = 'translateY(0)';
      } else {
          // Closing animation
          navLinks.classList.remove('active');
          hamburgerMenu.classList.remove('active');
          navLinks.style.transform = 'translateY(100%)';
      }

      // Toggle menu state
      menuOpen = !menuOpen;
  });

  // Smooth scroll to sections when nav links are clicked
  navLinksList.forEach(link => {
      link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href').substring(1); // Get target section id
          const targetSection = document.getElementById(targetId);

          // Close menu and reset hamburger icon on click
          navLinks.classList.remove('active');
          hamburgerMenu.classList.remove('active');
          navLinks.style.transform = 'translateY(100%)';
          menuOpen = false; // Update menu state

          // Scroll to the target section with smooth behavior
          if (targetSection) {
              targetSection.scrollIntoView({
                  behavior: 'smooth'
              });
          }
      });
  });
});
