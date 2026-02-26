/* ============================================================
   519 TECH SERVICES — app.js
   Mobile nav, scroll animations, back-to-top, sticky header
============================================================ */

(function () {
  'use strict';

  // ============================================================
  // DOM refs
  // ============================================================
  const header      = document.querySelector('.site-header');
  const hamburger   = document.getElementById('hamburger');
  const navDrawer   = document.getElementById('nav-drawer');
  const navClose    = document.getElementById('nav-close');
  const navOverlay  = document.getElementById('nav-overlay');
  const navLinks    = document.querySelectorAll('.nav-links .nav-link, .nav-links .nav-cta');
  const backToTop   = document.getElementById('back-to-top');
  const revealEls   = document.querySelectorAll('.reveal');

  // ============================================================
  // Mobile navigation
  // ============================================================
  function openNav() {
    navDrawer.classList.add('open');
    navOverlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Animate hamburger lines
    const lines = hamburger.querySelectorAll('.hamburger-line');
    if (lines[0]) lines[0].style.transform = 'translateY(7px) rotate(45deg)';
    if (lines[1]) lines[1].style.opacity = '0';
    if (lines[2]) lines[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  }

  function closeNav() {
    navDrawer.classList.remove('open');
    navOverlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    // Reset hamburger lines
    const lines = hamburger.querySelectorAll('.hamburger-line');
    if (lines[0]) lines[0].style.transform = '';
    if (lines[1]) lines[1].style.opacity = '';
    if (lines[2]) lines[2].style.transform = '';
  }

  if (hamburger) hamburger.addEventListener('click', openNav);
  if (navClose)  navClose.addEventListener('click', closeNav);
  if (navOverlay) navOverlay.addEventListener('click', closeNav);

  // Close nav when any link is clicked (smooth scroll takes over)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeNav();
    });
  });

  // ESC key closes nav
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDrawer.classList.contains('open')) closeNav();
  });

  // ============================================================
  // Sticky header — add class on scroll for extra shadow
  // ============================================================
  function handleHeaderScroll() {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // ============================================================
  // Back to top button
  // ============================================================
  function handleBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================
  // Scroll listener (throttled)
  // ============================================================
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleHeaderScroll();
        handleBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Run once on load
  handleHeaderScroll();
  handleBackToTop();

  // ============================================================
  // Intersection Observer — scroll reveal
  // ============================================================
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target); // animate once
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // ============================================================
  // Smooth anchor scroll with offset for sticky header
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 68;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ============================================================
  // Contact form — prevent default & show feedback
  // ============================================================
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      // Let mailto: action work naturally on desktop; just add UX feedback
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const original = btn.textContent;
        btn.textContent = 'Opening email client…';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
        }, 3000);
      }
    });
  }

  // ============================================================
  // Active nav link highlight on scroll
  // ============================================================
  const sections = document.querySelectorAll('section[id]');
  const topNavLinks = document.querySelectorAll('.nav-container .nav-link');

  function highlightNav() {
    const scrollY = window.scrollY;
    const headerH = header ? header.offsetHeight : 68;
    sections.forEach(sec => {
      const top = sec.offsetTop - headerH - 60;
      const bottom = top + sec.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        topNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sec.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

})();