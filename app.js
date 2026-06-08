document.addEventListener('DOMContentLoaded', function () {

  /* =========================================================
     NAVBAR SCROLL
  ========================================================= */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });


  /* =========================================================
     HAMBURGER MENU
  ========================================================= */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const overlay   = document.getElementById('menu-overlay');

  // Guarda posición del scroll antes de fijar el body (fix iOS Safari)
  var scrollY = 0;

  function openMenu() {
    scrollY = window.scrollY;
    navLinks.classList.add('open');
    hamburger.classList.add('open');
    overlay.classList.add('visible');
    document.body.classList.add('menu-open');
    document.body.style.top = '-' + scrollY + 'px';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    overlay.classList.remove('visible');
    document.body.classList.remove('menu-open');
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
  }

  function toggleMenu() {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  }

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  // Cerrar al hacer click en cualquier link del nav
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Cerrar con Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
      if (typeof closeModal === 'function') closeModal();
    }
  });

  // Cerrar modal con backdrop y botón X
  var modalBackdrop = document.getElementById('modal-backdrop');
  var modalCloseBtn = document.getElementById('modal-close');
  if (modalBackdrop) modalBackdrop.addEventListener('click', function() { if (typeof closeModal === 'function') closeModal(); });
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', function() { if (typeof closeModal === 'function') closeModal(); });

  // Exponer closeMenu globalmente por si acaso
  window.closeMenu = closeMenu;


  /* =========================================================
     ACTIVE NAV LINK AL SCROLLEAR
  ========================================================= */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', function () {
    let current = '';
    sections.forEach(function (s) {
      if (window.scrollY >= s.offsetTop - 130) current = s.id;
    });
    navAnchors.forEach(function (a) {
      a.classList.toggle('active-link', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });


  /* =========================================================
     CLICK EN TARJETA → ABRIR MODAL
  ========================================================= */
  var worksGrid = document.getElementById('works-grid');
  if (worksGrid) {
    worksGrid.addEventListener('click', function (e) {
      var card = e.target.closest('.work-card');
      if (!card) return;
      var type  = card.getAttribute('data-type');
      var src   = card.getAttribute('data-src');
      var title = card.getAttribute('data-title');
      var desc  = card.getAttribute('data-desc');
      if (type && src) openModal(type, src, title, desc);
    });
  }

  /* =========================================================
     VIDEO HOVER PLAY (solo desktop)
  ========================================================= */
  var isTouchDevice = window.matchMedia('(hover: none)').matches;
  if (!isTouchDevice) {
    document.querySelectorAll('.video-thumb').forEach(function (thumb) {
      var video = thumb.querySelector('video');
      if (!video) return;
      var card = thumb.closest('.work-card');
      card.addEventListener('mouseenter', function () { video.play().catch(function(){}); });
      card.addEventListener('mouseleave', function () { video.pause(); video.currentTime = 0; });
    });
  }


  /* =========================================================
     FILTROS DE TRABAJOS
  ========================================================= */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var workCards  = document.querySelectorAll('#works-grid .work-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {

      // Activar botón
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-filter');

      workCards.forEach(function (card) {
        var cats = card.getAttribute('data-category') || '';
        if (filter === 'all' || cats.indexOf(filter) !== -1) {
          card.style.display = '';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  /* =========================================================
     SKILL BARS ANIMACIÓN
  ========================================================= */
  var skillBars = document.querySelectorAll('.skill-bar-fill');

  if (skillBars.length > 0 && 'IntersectionObserver' in window) {
    var barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var bar = entry.target;
          var targetW = bar.getAttribute('data-width');
          if (!prefersReducedMotion) {
            bar.style.transition = 'width 1.2s cubic-bezier(0.16,1,0.3,1)';
          }
          bar.style.width = targetW;
          barObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    skillBars.forEach(function (bar) {
      var w = bar.style.getPropertyValue('--w') || '0%';
      bar.setAttribute('data-width', w);
      bar.style.removeProperty('--w');
      bar.style.width = '0%';
      barObserver.observe(bar);
    });
  }


  /* =========================================================
     FADE IN AL HACER SCROLL
  ========================================================= */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var fadeItems = document.querySelectorAll('.stat-card, .timeline-content, .edu-card, .contact-card, .info-item');

    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    fadeItems.forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s cubic-bezier(0.16,1,0.3,1) ' + (i * 0.04) + 's, transform 0.5s cubic-bezier(0.16,1,0.3,1) ' + (i * 0.04) + 's';
      fadeObserver.observe(el);
    });
  }

}); // fin DOMContentLoaded


/* =========================================================
   MODAL  — global para poder llamar desde onclick del HTML
========================================================= */
function openModal(type, src, title, desc) {
  var modal    = document.getElementById('modal');
  var mediaEl  = document.getElementById('modal-media');
  var titleEl  = document.getElementById('modal-title');
  var descEl   = document.getElementById('modal-desc');

  // Limpiar contenido anterior
  mediaEl.innerHTML = '';
  titleEl.textContent = title || '';
  descEl.textContent  = desc  || '';

  if (type === 'video' && src) {
    var v = document.createElement('video');
    v.src      = src;
    v.controls = true;
    v.autoplay = true;
    v.setAttribute('playsinline', '');
    v.style.cssText = 'width:100%;max-height:62vh;background:#000;display:block;';
    mediaEl.appendChild(v);
  } else if (type === 'image' && src) {
    var img = document.createElement('img');
    img.src = src;
    img.alt = title || '';
    img.style.cssText = 'width:100%;max-height:70vh;object-fit:contain;background:#000;display:block;';
    mediaEl.appendChild(img);
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  var modal   = document.getElementById('modal');
  var mediaEl = document.getElementById('modal-media');
  var video   = mediaEl.querySelector('video');
  if (video) { video.pause(); video.src = ''; }
  mediaEl.innerHTML = '';
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}
