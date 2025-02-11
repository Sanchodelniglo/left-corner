// Smooth scrolling
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        section.scrollIntoView({ behavior: 'smooth' });
    });
});

// Navbar animation
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.backgroundColor = 'rgba(139, 69, 19, 0.95)';
    } else {
        nav.style.backgroundColor = 'rgba(139, 69, 19, 0.9)';
    }
});

// Ticket button click handler
document.querySelectorAll('.buy-ticket').forEach(button => {
    button.addEventListener('click', function() {
        alert('Redirection vers la billetterie...');
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    const scroll = window.pageYOffset;
    hero.style.backgroundPosition = `center ${scroll * 0.5}px`;
});
