/* ============================================================
   Rapport RGAA 4.1.2
   app.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Header : réduction définitive au premier scroll ──
  const header  = document.querySelector('.site-header');
  const layout  = document.querySelector('.layout');
  const hint    = document.getElementById('scrollHint');
  let shrunk    = false;

  if (hint) setTimeout(() => hint.classList.add('no-bounce'), 5000);

  function onScroll() {
    if (!shrunk && window.scrollY > window.innerHeight * 0.05) {
      header.classList.add('scrolled');
      document.querySelector('.tabs-nav').classList.add('scrolled');
      if (layout) layout.classList.add('compact');
      if (hint) hint.classList.add('hidden');
      shrunk = true;
      window.removeEventListener('scroll', onScroll);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Tabs ──
  const tabBtns     = document.querySelectorAll('.tab-btn');
  const tabSections = document.querySelectorAll('.tab-section');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabSections.forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      panel.classList.add('active');

      // Boîte à outils : réduire le layout pour éviter l'espace vide
      if (layout) {
        if (btn.id === 'btn-outils') {
          layout.classList.add('outils-active');
        } else {
          layout.classList.remove('outils-active');
        }
      }

      panel.focus();
    });

    // Navigation clavier entre onglets (flèches gauche/droite)
    btn.addEventListener('keydown', e => {
      const btns = [...tabBtns];
      const idx  = btns.indexOf(btn);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        btns[(idx + 1) % btns.length].click();
        btns[(idx + 1) % btns.length].focus();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        btns[(idx - 1 + btns.length) % btns.length].click();
        btns[(idx - 1 + btns.length) % btns.length].focus();
      }
    });
  });

  // ── Scroll spy ──
  function setupScrollSpy(sectionSelector, navSelector) {
    const sections = document.querySelectorAll(sectionSelector);
    const links    = document.querySelectorAll(navSelector);
    if (!sections.length || !links.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const a = document.querySelector(
            navSelector + '[href="#' + entry.target.id + '"]'
          );
          if (a) a.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    sections.forEach(s => obs.observe(s));
  }

  setupScrollSpy('#tab-pages .page-section',       '#nav-pages .nav-page');
  setupScrollSpy('#tab-thematiques .theme-section', '#nav-thematiques .nav-page');
  setupScrollSpy('#tab-outils .toolkit-section',    '#nav-outils .nav-page');

});
