/* ══════════════════════════════════════
   RENDEZ-VOUS — Logique Doctolib
══════════════════════════════════════ */

const overlay       = document.getElementById('doctolibOverlay');
const modal         = document.getElementById('doctolibModal');
const modalClose    = document.getElementById('modalClose');
const modalName     = document.getElementById('modalDoctorName');
const modalSpecialty = document.getElementById('modalSpecialty');
const modalPhoto    = document.getElementById('modalDoctorPhoto');
const iframeWrap    = document.getElementById('doctolibIframeWrap');
const loading       = document.getElementById('doctolibLoading');
const fallback      = document.getElementById('doctolibFallback');
const fallbackName  = document.getElementById('fallbackName');
const fallbackLink  = document.getElementById('fallbackLink');

let currentIframe = null;


/* ── Ouvrir le modal ── */
function openDoctolibModal(card) {
  const name       = card.dataset.name;
  const specialty  = card.dataset.specialty;
  const url        = card.dataset.doctolib;
  const photo      = card.dataset.photo;

  // Remplir le header
  modalName.textContent     = name;
  modalSpecialty.textContent = specialty;
  modalPhoto.src            = photo;
  modalPhoto.alt            = name;

  // Remplir le fallback
  fallbackName.textContent = name;
  fallbackLink.href        = url;

  // Réinitialiser l'état
  fallback.classList.remove('visible');
  loading.style.display = 'flex';

  // Supprimer l'ancien iframe s'il existe
  if (currentIframe) {
    currentIframe.remove();
    currentIframe = null;
  }

  // Créer l'iframe Doctolib
  // ⚠️  Doctolib peut bloquer l'affichage en iframe selon la config du profil.
  //     Si c'est le cas, le fallback s'affiche automatiquement (voir listener 'error').
  //     Pour un vrai projet, utilisez le widget officiel Doctolib :
  //     https://www.doctolib.fr/aide/integration-widget
  const iframe = document.createElement('iframe');
  iframe.src            = url;
  iframe.title          = `Prendre rendez-vous avec ${name}`;
  iframe.allowFullscreen = true;
  iframe.style.cssText  = 'width:100%;height:100%;border:none;display:block;';

  iframe.addEventListener('load', () => {
    // Tenter de détecter si l'iframe est bloquée
    loading.style.display = 'none';
    try {
      // Si Doctolib refuse l'intégration iframe, on ne peut pas lire le contenu —
      // on bascule sur le fallback après un court délai (heuristique).
      setTimeout(() => {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow.document;
          if (!doc || doc.body.innerHTML === '') showFallback();
        } catch {
          // Cross-origin = Doctolib s'est chargé normalement
          loading.style.display = 'none';
        }
      }, 1200);
    } catch {
      loading.style.display = 'none';
    }
  });

  iframe.addEventListener('error', () => showFallback());

  iframeWrap.appendChild(iframe);
  currentIframe = iframe;

  // Afficher le modal
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}


/* ── Fallback si iframe bloquée ── */
function showFallback() {
  loading.style.display = 'none';
  if (currentIframe) {
    currentIframe.style.display = 'none';
  }
  fallback.classList.add('visible');
}


/* ── Fermer le modal ── */
function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';

  // Nettoyer l'iframe après la transition
  setTimeout(() => {
    if (currentIframe) {
      currentIframe.remove();
      currentIframe = null;
    }
    fallback.classList.remove('visible');
    loading.style.display = 'flex';
  }, 350);
}


/* ── Événements ── */

// Clic sur les boutons de réservation uniquement
document.querySelectorAll('.doctor-rdv-card .btn-rdv-select').forEach(button => {
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    if (button.disabled) return;
    const card = button.closest('.doctor-rdv-card');
    if (card) openDoctolibModal(card);
  });
});

// Fermer via le bouton ×
modalClose.addEventListener('click', closeModal);

// Fermer via clic sur l'overlay (hors modal)
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});

// Fermer via Échap
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
});
