/* ══════════════════════════════════════
   NAV — scroll shadow & mobile menu
══════════════════════════════════════ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Fermer le menu mobile au clic sur un lien
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});


/* ══════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ══════════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ══════════════════════════════════════
   FORMULAIRE RDV
══════════════════════════════════════ */
const rdvForm = document.getElementById('rdvForm');
const toast   = document.getElementById('toast');

rdvForm.addEventListener('submit', e => {
  e.preventDefault();

  // Ici, branchez votre API ou service d'envoi d'email
  // ex: fetch('/api/rdv', { method: 'POST', body: new FormData(rdvForm) })

  showToast('✓ Demande envoyée — nous vous recontactons sous 24h');
  rdvForm.reset();
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}
