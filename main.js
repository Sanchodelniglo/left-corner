/**
 * LEFT CORNER - DUB POSTER EXPERIENCE
 * Kingston Sound System meets Modern Web
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  animation: {
    threshold: 0.15,
    rootMargin: '-50px',
  },
  parallax: {
    intensity: 0.3,
  },
  soundcloud: {
    color: '%23d4a84b',
  },
  nav: {
    hideThreshold: 100,
  },
  counter: {
    duration: 2000,
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 768px)').matches;
const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOM CURSOR
// ═══════════════════════════════════════════════════════════════════════════

class CustomCursor {
  constructor() {
    this.cursor = document.querySelector('.cursor');
    this.cursorDot = document.querySelector('.cursor-dot');
    this.pos = { x: 0, y: 0 };
    this.mouse = { x: 0, y: 0 };
    this.speed = 0.15;
    this.isHovering = false;
  }

  init() {
    if (!this.cursor || !this.cursorDot || isCoarsePointer || prefersReducedMotion) {
      // Hide cursor elements on touch devices
      if (this.cursor) this.cursor.style.display = 'none';
      if (this.cursorDot) this.cursorDot.style.display = 'none';
      return;
    }

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // Hover states for interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .gallery__item, .track, .vinyl');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => this.onHover(true));
      el.addEventListener('mouseleave', () => this.onHover(false));
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      this.cursor.style.opacity = '0';
      this.cursorDot.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      this.cursor.style.opacity = '1';
      this.cursorDot.style.opacity = '1';
    });

    // Start animation loop
    this.animate();
  }

  onHover(isHovering) {
    this.isHovering = isHovering;
    if (isHovering) {
      this.cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
      this.cursor.style.borderColor = 'var(--clr-red)';
    } else {
      this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      this.cursor.style.borderColor = 'var(--clr-gold)';
    }
  }

  animate() {
    // Smooth follow for outer cursor
    this.pos.x = lerp(this.pos.x, this.mouse.x, this.speed);
    this.pos.y = lerp(this.pos.y, this.mouse.y, this.speed);

    this.cursor.style.left = `${this.pos.x}px`;
    this.cursor.style.top = `${this.pos.y}px`;

    // Dot follows exactly
    this.cursorDot.style.left = `${this.mouse.x}px`;
    this.cursorDot.style.top = `${this.mouse.y}px`;

    requestAnimationFrame(() => this.animate());
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL ANIMATOR
// ═══════════════════════════════════════════════════════════════════════════

class ScrollAnimator {
  constructor() {
    this.elements = document.querySelectorAll('[data-animate]');
    this.observer = null;
  }

  init() {
    if (this.elements.length === 0) return;

    if (prefersReducedMotion) {
      // Show all elements immediately
      this.elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, parseInt(delay));
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: CONFIG.animation.threshold,
        rootMargin: CONFIG.animation.rootMargin,
      }
    );

    this.elements.forEach((el) => this.observer.observe(el));
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════

class Navigation {
  constructor() {
    this.nav = document.getElementById('nav');
    this.toggle = document.getElementById('nav-toggle');
    this.menu = document.getElementById('nav-menu');
    this.links = document.querySelectorAll('.nav__link');
    this.isOpen = false;
    this.lastScroll = 0;
    this.isHidden = false;
  }

  init() {
    if (!this.nav || !this.toggle || !this.menu) return;

    // Toggle menu
    this.toggle.addEventListener('click', () => this.toggleMenu());

    // Close menu on link click
    this.links.forEach((link) => {
      link.addEventListener('click', () => this.closeMenu());
    });

    // Close menu on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.nav.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Smooth scroll for anchor links
    this.links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        link.addEventListener('click', (e) => this.handleAnchorClick(e));
      }
    });

    // Hide/show nav on scroll (desktop only)
    if (!isMobile) {
      window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    }

    // Active link highlighting
    this.setupActiveLinks();
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.toggle.setAttribute('aria-expanded', this.isOpen);
    this.menu.classList.toggle('is-open', this.isOpen);
    document.body.style.overflow = this.isOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.isOpen = false;
    this.toggle.setAttribute('aria-expanded', 'false');
    this.menu.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  handleAnchorClick(e) {
    const href = e.currentTarget.getAttribute('href');
    const target = document.querySelector(href);

    if (target) {
      e.preventDefault();
      this.closeMenu();

      const navHeight = this.nav.offsetHeight;
      const targetPosition = target.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  }

  handleScroll() {
    const currentScroll = window.pageYOffset;

    // Show/hide based on scroll direction
    if (currentScroll > this.lastScroll && currentScroll > CONFIG.nav.hideThreshold) {
      // Scrolling down - hide nav
      if (!this.isHidden) {
        this.nav.classList.add('is-hidden');
        this.isHidden = true;
      }
    } else {
      // Scrolling up - show nav
      if (this.isHidden) {
        this.nav.classList.remove('is-hidden');
        this.isHidden = false;
      }
    }

    // Add background when scrolled
    this.nav.classList.toggle('is-scrolled', currentScroll > 50);

    this.lastScroll = currentScroll;
  }

  setupActiveLinks() {
    const sections = document.querySelectorAll('section[id]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            this.links.forEach((link) => {
              link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// GALLERY
// ═══════════════════════════════════════════════════════════════════════════

class Gallery {
  constructor() {
    this.items = document.querySelectorAll('.gallery__item');
    this.modal = document.getElementById('modal');
    this.modalImage = document.getElementById('modal-image');
    this.modalCounter = document.getElementById('modal-counter');
    this.closeBtn = this.modal?.querySelector('.modal__close');
    this.prevBtn = this.modal?.querySelector('.modal__btn--prev');
    this.nextBtn = this.modal?.querySelector('.modal__btn--next');
    this.backdrop = this.modal?.querySelector('.modal__backdrop');

    this.images = [];
    this.currentIndex = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  init() {
    if (!this.modal || this.items.length === 0) return;

    // Collect all images
    this.items.forEach((item, index) => {
      const img = item.querySelector('img');
      if (img) {
        this.images.push({
          src: img.src,
          alt: img.alt,
        });

        // Click to open
        item.addEventListener('click', () => this.open(index));

        // Keyboard support
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.open(index);
          }
        });
      }
    });

    // Modal controls
    this.closeBtn?.addEventListener('click', () => this.close());
    this.prevBtn?.addEventListener('click', () => this.navigate(-1));
    this.nextBtn?.addEventListener('click', () => this.navigate(1));
    this.backdrop?.addEventListener('click', () => this.close());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Touch gestures
    this.modal.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.modal.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });
  }

  open(index) {
    this.currentIndex = index;
    this.updateImage();
    this.modal.hidden = false;
    document.body.style.overflow = 'hidden';

    // Focus trap
    this.closeBtn?.focus();
  }

  close() {
    this.modal.hidden = true;
    document.body.style.overflow = '';

    // Return focus to the item that opened the modal
    this.items[this.currentIndex]?.focus();
  }

  navigate(direction) {
    this.currentIndex += direction;

    if (this.currentIndex >= this.images.length) {
      this.currentIndex = 0;
    } else if (this.currentIndex < 0) {
      this.currentIndex = this.images.length - 1;
    }

    this.updateImage();
  }

  updateImage() {
    const image = this.images[this.currentIndex];
    if (image && this.modalImage) {
      // Add loading state
      this.modalImage.style.opacity = '0';

      const newImg = new Image();
      newImg.onload = () => {
        this.modalImage.src = image.src;
        this.modalImage.alt = image.alt;
        this.modalImage.style.opacity = '1';
      };
      newImg.src = image.src;
    }
    if (this.modalCounter) {
      this.modalCounter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    }
  }

  handleKeydown(e) {
    if (this.modal.hidden) return;

    switch (e.key) {
      case 'Escape':
        this.close();
        break;
      case 'ArrowLeft':
        this.navigate(-1);
        break;
      case 'ArrowRight':
        this.navigate(1);
        break;
    }
  }

  handleSwipe() {
    const threshold = 50;
    const diff = this.touchEndX - this.touchStartX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.navigate(-1); // Swipe right = previous
      } else {
        this.navigate(1); // Swipe left = next
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION PARALLAX - Cinematic scroll effects
// ═══════════════════════════════════════════════════════════════════════════

class SectionParallax {
  constructor() {
    this.ticking = false;
    this.windowHeight = window.innerHeight;

    // Hero
    this.hero = document.querySelector('.hero');
    this.heroImg = document.querySelector('.hero__img');
    this.heroVinyl = document.querySelector('.hero__vinyl');
    this.heroText = document.querySelector('.hero__text');
    this.heroTitle = document.querySelector('.hero__title');

    // About
    this.aboutSection = document.querySelector('.section--about');
    this.aboutTitle = document.querySelector('.about__title');
    this.aboutImage = document.querySelector('.about__image');
    this.aboutContent = document.querySelector('.about__content');
    this.aboutStats = document.querySelector('.about__stats');

    // Tracks
    this.tracksSection = document.querySelector('.section--tracks');
    this.tracksHeader = document.querySelector('.section--tracks .section__header');
    this.tracks = document.querySelectorAll('.track');

    // Events
    this.eventsSection = document.querySelector('.section--events');
    this.eventsHeader = document.querySelector('.events__header');
    this.events = document.querySelectorAll('.event');

    // Gallery
    this.gallerySection = document.querySelector('.section--gallery');
    this.galleryTitle = document.querySelector('.section--gallery .section__title');
    this.galleryItems = document.querySelectorAll('.gallery__item');

    // Contact
    this.contactSection = document.querySelector('.section--contact');
    this.contactInfo = document.querySelector('.contact__info');
    this.contactVisual = document.querySelector('.contact__visual');

    // Thanks
    this.thanksSection = document.querySelector('.section--thanks');
    this.marquee = document.querySelector('.marquee');
    this.thanksContent = document.querySelector('.thanks__content');
  }

  init() {
    if (isMobile || prefersReducedMotion) return;

    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    window.addEventListener('resize', () => {
      this.windowHeight = window.innerHeight;
    }, { passive: true });

    this.update();
  }

  onScroll() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.update();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  // Progress through viewport: 0 = bottom edge at viewport bottom, 1 = top edge at viewport top
  getProgress(element) {
    if (!element) return 0;
    const rect = element.getBoundingClientRect();
    return (this.windowHeight - rect.top) / (this.windowHeight + rect.height);
  }

  isInView(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return rect.top < this.windowHeight && rect.bottom > 0;
  }

  // Get element progress: -1 = below viewport, 0 = centered, 1 = above viewport
  getCenteredProgress(element) {
    if (!element) return 0;
    const rect = element.getBoundingClientRect();
    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = this.windowHeight / 2;
    // Returns 0 when element center is at viewport center
    return (viewportCenter - elementCenter) / (this.windowHeight / 2);
  }

  update() {
    const scrollY = window.pageYOffset;

    // ═══════════════════════════════════════════════════════════════════════
    // HERO - Title zooms out, vinyl slides right, image zooms in
    // ═══════════════════════════════════════════════════════════════════════
    if (this.hero && this.isInView(this.hero)) {
      const progress = clamp(scrollY / (this.hero.offsetHeight * 0.8), 0, 1);

      // Background zooms IN as you scroll
      if (this.heroImg) {
        const scale = 1.1 + progress * 0.3;
        this.heroImg.style.transform = `scale(${scale})`;
      }

      // Title zooms OUT
      if (this.heroText) {
        const scale = 1 - progress * 0.3;
        this.heroText.style.transform = `scale(${scale})`;
      }

      // Vinyl slides to the RIGHT and rotates
      if (this.heroVinyl) {
        const xPos = progress * 200;
        const rotation = scrollY * 0.2;
        this.heroVinyl.style.transform = `translateX(${xPos}px) rotate(${rotation}deg)`;
      }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ABOUT - Image from LEFT, content from RIGHT, centered at viewport middle
    // ═══════════════════════════════════════════════════════════════════════
    if (this.aboutSection && this.isInView(this.aboutSection)) {
      const progress = this.getCenteredProgress(this.aboutSection);

      // Title: scale 1 at center
      if (this.aboutTitle) {
        const scale = 1 - Math.abs(progress) * 0.3;
        this.aboutTitle.style.transform = `scale(${clamp(scale, 0.7, 1)})`;
      }

      // Image slides from LEFT (at position when centered)
      if (this.aboutImage) {
        const xPos = -progress * 100;
        this.aboutImage.style.transform = `translateX(${clamp(xPos, -150, 0)}px)`;
      }

      // Content slides from RIGHT (at position when centered)
      if (this.aboutContent) {
        const xPos = progress * 100;
        this.aboutContent.style.transform = `translateX(${clamp(xPos, 0, 150)}px)`;
      }

      // Stats zoom
      if (this.aboutStats) {
        const scale = 1 - Math.abs(progress) * 0.2;
        this.aboutStats.style.transform = `scale(${clamp(scale, 0.8, 1)})`;
      }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // TRACKS - Header and tracks slide right to left on scroll down
    // ═══════════════════════════════════════════════════════════════════════
    if (this.tracksSection && this.isInView(this.tracksSection)) {
      // Header
      if (this.tracksHeader) {
        const progress = this.getCenteredProgress(this.tracksHeader);
        const xPos = -progress * 150;
        this.tracksHeader.style.transform = `translateX(${xPos}px)`;
      }

      // Tracks slide from left to right
      this.tracks.forEach((track) => {
        const progress = this.getCenteredProgress(track);
        const xPos = progress * 80;

        track.style.transform = `translateX(${xPos}px)`;
      });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // EVENTS - Subtle header slide, events float
    // ═══════════════════════════════════════════════════════════════════════
    if (this.eventsSection && this.isInView(this.eventsSection)) {
      // "LIVE" text slides subtly
      if (this.eventsHeader) {
        const progress = this.getCenteredProgress(this.eventsHeader);
        const xPos = progress * 40;
        this.eventsHeader.style.transform = `translateX(${xPos}px)`;
      }

      // Events float and zoom in when centered
      this.events.forEach((event) => {
        const progress = this.getCenteredProgress(event);
        const yPos = -progress * 40;
        const scale = 1 - Math.abs(progress) * 0.15;

        event.style.transform = `translateY(${yPos}px) scale(${clamp(scale, 0.85, 1)})`;
      });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // GALLERY - Subtle scale effect based on section scroll
    // ═══════════════════════════════════════════════════════════════════════
    if (this.gallerySection && this.isInView(this.gallerySection)) {
      const sectionProgress = this.getCenteredProgress(this.gallerySection);

      // Title scales
      if (this.galleryTitle) {
        const scale = 1 - Math.abs(sectionProgress) * 0.1;
        this.galleryTitle.style.transform = `scale(${clamp(scale, 0.9, 1)})`;
      }

      // Items scale subtly - larger when section centered
      this.galleryItems.forEach((item) => {
        const scale = 1 - Math.abs(sectionProgress) * 0.05;
        item.style.transform = `scale(${clamp(scale, 0.95, 1)})`;
      });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // CONTACT - Info slides, vinyl rotates on scroll
    // ═══════════════════════════════════════════════════════════════════════
    if (this.contactSection && this.isInView(this.contactSection)) {
      const progress = this.getCenteredProgress(this.contactSection);

      // Info slides horizontally
      if (this.contactInfo) {
        const xPos = progress * 60;
        this.contactInfo.style.transform = `translateX(${xPos}px)`;
      }

      // Vinyl visual floats and rotates
      if (this.contactVisual) {
        const yPos = -progress * 50;
        const rotation = progress * 90;
        this.contactVisual.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
      }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // THANKS - Content movement, centered at viewport middle
    // ═══════════════════════════════════════════════════════════════════════
    if (this.thanksSection && this.isInView(this.thanksSection)) {
      if (this.thanksContent) {
        const progress = this.getCenteredProgress(this.thanksContent);
        const scale = 1 - Math.abs(progress) * 0.2;
        const yPos = -progress * 50;
        this.thanksContent.style.transform = `translateY(${yPos}px) scale(${clamp(scale, 0.8, 1)})`;
      }
    }
  }
}

// Legacy alias for compatibility
const Parallax = SectionParallax;

// ═══════════════════════════════════════════════════════════════════════════
// SOUNDCLOUD PLAYER
// ═══════════════════════════════════════════════════════════════════════════

class SoundCloudPlayer {
  constructor() {
    this.playButtons = document.querySelectorAll('.track__play');
    this.player = document.getElementById('player');
    this.iframe = document.getElementById('player-iframe');
    this.closeBtn = this.player?.querySelector('.player__close');
    this.currentTrackId = null;
  }

  init() {
    if (!this.player || !this.iframe) return;

    // Play buttons
    this.playButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => this.loadTrack(e));
    });

    // Close button
    this.closeBtn?.addEventListener('click', () => this.close());
  }

  loadTrack(e) {
    const button = e.currentTarget;
    const trackSlug = button.dataset.trackSlug;

    if (!trackSlug) return;

    // Toggle if same track
    if (this.currentTrackId === trackSlug && !this.player.hidden) {
      this.close();
      return;
    }

    this.currentTrackId = trackSlug;

    // Update button states
    this.playButtons.forEach((btn) => {
      btn.classList.toggle('is-playing', btn.dataset.trackSlug === trackSlug);
    });

    // Load iframe with full URL format (more reliable than API track IDs)
    const trackUrl = encodeURIComponent(`https://soundcloud.com/${trackSlug}`);
    this.iframe.src = `https://w.soundcloud.com/player/?url=${trackUrl}&color=${CONFIG.soundcloud.color}&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true`;

    // Show player
    this.player.hidden = false;

    // Animate vinyl
    const track = button.closest('.track');
    const vinyl = track?.querySelector('.vinyl');
    if (vinyl) {
      vinyl.classList.add('is-playing');
    }
  }

  close() {
    this.player.hidden = true;
    this.iframe.src = '';
    this.currentTrackId = null;

    // Reset button states
    this.playButtons.forEach((btn) => {
      btn.classList.remove('is-playing');
    });

    // Stop vinyl animation
    document.querySelectorAll('.vinyl.is-playing').forEach((v) => {
      v.classList.remove('is-playing');
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// COUNTER ANIMATION
// ═══════════════════════════════════════════════════════════════════════════

class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll('[data-count]');
    this.observer = null;
  }

  init() {
    if (this.counters.length === 0) return;

    if (prefersReducedMotion) {
      // Show final values immediately
      this.counters.forEach((counter) => {
        counter.textContent = counter.dataset.count;
      });
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    this.counters.forEach((counter) => this.observer.observe(counter));
  }

  animateCounter(counter) {
    const target = parseInt(counter.dataset.count);
    const duration = CONFIG.counter.duration;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out-expo)
      const eased = 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(target * eased);

      counter.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    };

    requestAnimationFrame(update);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// VINYL HOVER EFFECTS
// ═══════════════════════════════════════════════════════════════════════════

class VinylEffects {
  constructor() {
    this.vinyls = document.querySelectorAll('.vinyl--track');
  }

  init() {
    if (prefersReducedMotion) return;

    this.vinyls.forEach((vinyl) => {
      const track = vinyl.closest('.track');
      if (!track) return;

      track.addEventListener('mouseenter', () => {
        vinyl.classList.add('is-spinning');
      });

      track.addEventListener('mouseleave', () => {
        if (!vinyl.classList.contains('is-playing')) {
          vinyl.classList.remove('is-spinning');
        }
      });
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO SCROLL INDICATOR
// ═══════════════════════════════════════════════════════════════════════════

class HeroScroll {
  constructor() {
    this.hero = document.querySelector('.hero');
    this.scrollIndicator = document.querySelector('.hero__scroll');
  }

  init() {
    if (!this.hero || !this.scrollIndicator) return;

    this.scrollIndicator.addEventListener('click', () => {
      const nav = document.getElementById('nav');
      const nextSection = document.querySelector('main > section');

      if (nextSection) {
        const navHeight = nav?.offsetHeight || 0;
        window.scrollTo({
          top: nextSection.offsetTop - navHeight,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      }
    });

    // Hide on scroll
    if (!prefersReducedMotion) {
      window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        const opacity = 1 - scrollY / 300;
        this.scrollIndicator.style.opacity = Math.max(0, opacity);
      }, { passive: true });
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// STAGGER ANIMATION
// ═══════════════════════════════════════════════════════════════════════════

class StaggerAnimation {
  constructor() {
    this.containers = document.querySelectorAll('[data-animate="stagger"]');
    this.observer = null;
  }

  init() {
    if (this.containers.length === 0 || prefersReducedMotion) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateChildren(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    this.containers.forEach((container) => this.observer.observe(container));
  }

  animateChildren(container) {
    const children = container.children;
    Array.from(children).forEach((child, index) => {
      setTimeout(() => {
        child.classList.add('is-visible');
      }, index * 100);
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  const customCursor = new CustomCursor();
  const navigation = new Navigation();
  const gallery = new Gallery();
  const soundcloud = new SoundCloudPlayer();
  const heroScroll = new HeroScroll();
  const counterAnimation = new CounterAnimation();
  const vinylEffects = new VinylEffects();
  const staggerAnimation = new StaggerAnimation();

  customCursor.init();
  navigation.init();
  gallery.init();
  soundcloud.init();
  heroScroll.init();
  counterAnimation.init();
  vinylEffects.init();
  staggerAnimation.init();

  // Motion-sensitive features
  if (!prefersReducedMotion) {
    const scrollAnimator = new ScrollAnimator();
    const parallax = new Parallax();

    scrollAnimator.init();
    parallax.init();
  } else {
    // Make all animated elements visible immediately
    document.querySelectorAll('[data-animate]').forEach((el) => {
      el.classList.add('is-visible');
    });
  }

  // Add loaded class for entrance animations
  document.body.classList.add('is-loaded');

  console.log('🎺 Left Corner - Dub Poster Experience loaded');
});

// ═══════════════════════════════════════════════════════════════════════════
// PAGE VISIBILITY HANDLING
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('visibilitychange', () => {
  // Pause animations when page is hidden (battery saving)
  if (document.hidden) {
    document.body.classList.add('is-hidden');
  } else {
    document.body.classList.remove('is-hidden');
  }
});
