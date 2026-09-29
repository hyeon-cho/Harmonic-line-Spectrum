(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const navigation = document.querySelector('.nav-shell');
  const navLinks = document.querySelector('.nav-links');
  if (!header || !navigation || !navLinks) return;

  const sectionLinks = [...navigation.querySelectorAll('a[href^="#"]')];
  const sections = ['top', 'overview', 'spectrum', 'evidence', 'method']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentLink = null;
  let readyFrame;
  let ticking = false;

  function placeLens(target) {
    if (!target) return;
    const container = navigation.getBoundingClientRect();
    const bounds = target.getBoundingClientRect();
    navigation.style.setProperty('--lens-x', `${bounds.left - container.left - navigation.clientLeft}px`);
    navigation.style.setProperty('--lens-y', `${bounds.top - container.top - navigation.clientTop}px`);
    navigation.style.setProperty('--lens-width', `${bounds.width}px`);
    navigation.style.setProperty('--lens-height', `${bounds.height}px`);
  }

  function keepCurrentLinkVisible(target) {
    if (!target || navLinks.scrollWidth <= navLinks.clientWidth) return;
    const desired = target.offsetLeft - (navLinks.clientWidth - target.offsetWidth) / 2;
    navLinks.scrollTo({ left: Math.max(0, desired), behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  }

  function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
    const scrollPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const boundary = Math.max(header.getBoundingClientRect().bottom + 36, scrollPadding + 2);
    let current = '#top';

    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= boundary) current = `#${section.id}`;
    });

    sectionLinks.forEach(link => {
      if (link.getAttribute('href') === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });

    const nextLink = sectionLinks.find(link => link.getAttribute('href') === current);
    if (nextLink && nextLink !== currentLink) {
      currentLink = nextLink;
      placeLens(currentLink);
      keepCurrentLinkVisible(currentLink);
    }
    ticking = false;
  }

  function refreshNavigation() {
    cancelAnimationFrame(readyFrame);
    navigation.classList.remove('is-ready');
    updateHeader();
    placeLens(currentLink);
    navigation.classList.add('has-lens');
    readyFrame = requestAnimationFrame(() => navigation.classList.add('is-ready'));
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', refreshNavigation);

  refreshNavigation();
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(refreshNavigation);
    [navigation, ...sectionLinks].forEach(element => observer.observe(element));
  }
  if (document.fonts) document.fonts.ready.then(refreshNavigation);

  const copyButton = document.querySelector('[data-copy-bibtex]');
  const bibtex = document.getElementById('bibtex-code');
  const copyStatus = document.getElementById('copy-status');

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    return copied;
  }

  if (copyButton && bibtex) {
    copyButton.addEventListener('click', async () => {
      const text = bibtex.textContent.trim();
      let copied = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          copied = true;
        } else {
          copied = fallbackCopy(text);
        }
      } catch {
        copied = fallbackCopy(text);
      }

      if (!copied) {
        if (copyStatus) copyStatus.textContent = 'Copy failed. Select the BibTeX text manually.';
        return;
      }

      copyButton.classList.add('copied');
      copyButton.textContent = 'Copied';
      if (copyStatus) copyStatus.textContent = 'BibTeX copied to clipboard.';
      window.setTimeout(() => {
        copyButton.classList.remove('copied');
        copyButton.textContent = 'Copy';
      }, 1600);
    });
  }
})();
