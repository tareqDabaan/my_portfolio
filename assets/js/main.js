/**
 * Site behaviour shared by the home page and the project pages:
 * header on scroll, full-screen mobile menu, active menu link, back-to-top button,
 * scroll animations (AOS), project filter, Kuwait local time and the footer year.
 */
(function() {
  "use strict";

  const body = document.body;
  const header = document.querySelector('#header');

  /* Header: dark glass background once the page is scrolled */
  function toggleScrolled() {
    if (!header) return;
    body.classList.toggle('scrolled', window.scrollY > 40);
  }
  document.addEventListener('scroll', toggleScrolled, { passive: true });
  window.addEventListener('load', toggleScrolled);
  toggleScrolled();

  /* Mobile menu (full screen) */
  const toggle = document.querySelector('.mobile-nav-toggle');
  function setMenu(open) {
    body.classList.toggle('mobile-nav-active', open);
    if (toggle) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
  }
  if (toggle) {
    toggle.addEventListener('click', () => setMenu(!body.classList.contains('mobile-nav-active')));
  }
  document.querySelectorAll('#navmenu a').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && body.classList.contains('mobile-nav-active')) {
      setMenu(false);
      if (toggle) toggle.focus();
    }
  });

  /* Back-to-top button */
  const scrollTop = document.querySelector('.scroll-top');
  function toggleScrollTop() {
    if (scrollTop) scrollTop.classList.toggle('active', window.scrollY > 400);
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  document.addEventListener('scroll', toggleScrollTop, { passive: true });
  window.addEventListener('load', toggleScrollTop);

  /* Scroll animations */
  window.addEventListener('load', () => {
    if (window.AOS) {
      AOS.init({ duration: 650, easing: 'ease-out-cubic', once: true, mirror: false, offset: 60 });
    }
  });

  /* Correct the scroll position when the page opens on a #section link */
  window.addEventListener('load', () => {
    if (!window.location.hash) return;
    const section = document.querySelector(window.location.hash);
    if (!section) return;
    setTimeout(() => {
      const offset = parseInt(getComputedStyle(section).scrollMarginTop) || 0;
      window.scrollTo({ top: section.offsetTop - offset, behavior: 'smooth' });
    }, 100);
  });

  /* Highlight the menu link of the section on screen */
  const navLinks = [...document.querySelectorAll('#navmenu ul a')].filter(a => a.hash && a.pathname === window.location.pathname);
  function scrollspy() {
    const position = window.scrollY + 200;
    navLinks.forEach(link => {
      const section = document.querySelector(link.hash);
      if (!section) return;
      const inside = position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight;
      link.classList.toggle('active', inside);
    });
  }
  window.addEventListener('load', scrollspy);
  document.addEventListener('scroll', scrollspy, { passive: true });

  /* Project filter (All / Professional / Personal & freelance) */
  const filter = document.querySelector('.project-filter');
  if (filter) {
    const cards = [...document.querySelectorAll('.project-grid .project-card')];
    filter.addEventListener('click', e => {
      const button = e.target.closest('button[data-filter]');
      if (!button) return;
      const value = button.dataset.filter;
      filter.querySelectorAll('button').forEach(b => {
        const on = b === button;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      cards.forEach(card => {
        card.hidden = value !== 'all' && card.dataset.category !== value;
      });
      if (window.AOS) AOS.refresh();
    });
  }

  /* Local time in Kuwait (About section) */
  const timeEls = document.querySelectorAll('[data-kuwait-time]');
  function updateTime() {
    try {
      const t = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kuwait', hour: 'numeric', minute: '2-digit' }).format(new Date());
      timeEls.forEach(el => { el.textContent = t + ' local time'; });
    } catch (err) { /* keep the fallback text */ }
  }
  if (timeEls.length) {
    updateTime();
    setInterval(updateTime, 30000);
  }

  /* Footer year */
  const year = document.querySelector('#copyright-year');
  if (year) year.textContent = new Date().getFullYear();
})();
