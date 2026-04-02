/* ===== CURSOR ===== */
/* const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');

if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .project-card, .contact-card, .skill-tags span').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}*/

/* ===== NAV ===== */
const nav = document.getElementById('nav');
const navBurger = document.getElementById('nav-burger');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

navBurger.addEventListener('click', () => {
  navBurger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navBurger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ===== ACTIVE NAV LINK ===== */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

function setActiveLink() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinkEls.forEach(l => l.classList.remove('active-link'));
      const active = document.querySelector(`.nav-link[href="#${id}"]`);
      if (active) active.classList.add('active-link');
    }
  });
}
window.addEventListener('scroll', setActiveLink, { passive: true });

/* ===== REVEAL ON SCROLL ===== */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((sib, idx) => {
        if (sib === entry.target) delay = idx * 80;
      });
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ===== CONTACT FORM FEEDBACK ===== */
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = 'Envoi... <i class="uil uil-spinner-alt"></i>';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        btn.innerHTML = 'Envoyé ! <i class="uil uil-check"></i>';
        btn.style.background = '#00d4aa';
        form.reset();
        setTimeout(() => {
          btn.innerHTML = original;
          btn.style.background = '';
          btn.disabled = false;
        }, 3500);
      } else {
        throw new Error();
      }
    } catch {
      btn.innerHTML = 'Erreur – réessayez <i class="uil uil-times-circle"></i>';
      btn.style.background = '#e05050';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  });
}

/* ===== GOOGLE ANALYTICS EVENTS ===== */
function trackAnalyticsEvent(action, category, label) {
  if (typeof gtag === 'function') {
    gtag('event', action, {
      event_category: category,
      event_label: label,
      transport_type: 'beacon'
    });
  }
}

const trackClickSelectors = [
  '.nav-cta',
  '.hero-actions a',
  '.project-overlay-links a',
  '.hero-socials a',
  'a[href$=".pdf"]',
  'a[href^="#"]'
];
trackClickSelectors.forEach((selector) => {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener('click', () => {
      const label = el.textContent.trim() || el.href;
      trackAnalyticsEvent('click', 'interaction', `${selector} - ${label}`);
    });
  });
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', () => {
    trackAnalyticsEvent('submit', 'contact_form', 'Formulaire de contact envoyé');
  });
}
