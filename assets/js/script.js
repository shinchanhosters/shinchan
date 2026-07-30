/* script.js
   Provides:
   - IntersectionObserver-based scroll reveal animations
   - Sets current year in footer
   - Lightweight lazy-loading guard for older browsers (fallback)
   - Small accessible enhancements (keyboard focus)
   - Renders pages from data/pages.json into the Pages & Links section
*/

document.addEventListener('DOMContentLoaded', function () {
  // Set year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Scroll reveal using IntersectionObserver
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(r => obs.observe(r));
  } else {
    // Fallback: just reveal immediately for old browsers
    reveals.forEach(r => r.classList.add('is-visible'));
  }

  // Slight parallax on mouse move for hero image (desktop only)
  const hero = document.querySelector('.hero');
  const heroImage = document.querySelector('.hero-image');
  if (hero && heroImage && window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroImage.style.transform = `scale(1.04) translate(${x * 8}px, ${y * 6}px)`;
    });
    hero.addEventListener('mouseleave', () => {
      heroImage.style.transform = 'scale(1.03)';
    });
  }

  // Small accessible enhancement: press Enter on focused .btn-download triggers link
  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        // allow native anchor behavior, but ensure it opens in new tab
        window.open(downloadBtn.href, '_blank', 'noopener,noreferrer');
        e.preventDefault();
      }
    });
  }

  // Lazy-load background images (if any) using data-bg attribute
  const bgEls = document.querySelectorAll('[data-bg]');
  bgEls.forEach(el => {
    const src = el.getAttribute('data-bg');
    if (!src) return;
    const img = new Image();
    img.src = src;
    img.onload = () => { el.style.backgroundImage = `url('${src}')`; el.classList.add('bg-loaded'); };
  });

  // Load pages (blogger-style links) from data/pages.json and render them
  const pagesList = document.getElementById('pages-list');
  if (pagesList) {
    fetch('data/pages.json')
      .then(res => res.ok ? res.json() : Promise.reject('Failed to load pages.json'))
      .then(pages => {
        if (!Array.isArray(pages) || pages.length === 0) {
          pagesList.innerHTML = '<p class="muted">No pages configured. Edit <code>data/pages.json</code> to add links.</p>';
          return;
        }
        pagesList.innerHTML = '';
        pages.forEach(p => {
          const card = document.createElement('a');
          card.className = 'card glass';
          card.href = p.url;
          card.target = '_blank';
          card.rel = 'noopener noreferrer';
          card.innerHTML = `<h3>${escapeHtml(p.title)}</h3><p style="color:var(--muted)">${escapeHtml(p.description || '')}</p>`;
          pagesList.appendChild(card);
        });
      })
      .catch(err => {
        pagesList.innerHTML = '<p class="muted">Unable to load pages.json</p>';
        console.error(err);
      });
  }

  // small helper to escape HTML when injecting content
  function escapeHtml(str){
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }

});
