// navbar hamburger menu

document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
  });
  
  // Close menu when a link is clicked
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
      link.addEventListener('click', function() {
          hamburger.classList.remove('active');
          navLinks.classList.remove('active');
      });
  });
});