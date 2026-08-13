(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const siteHeader = document.getElementById('site-header');
  const navFocusOverlay = document.getElementById('nav-focus-overlay');
  const navIndicator = document.getElementById('nav-indicator');
  const navLinks = navMenu ? navMenu.querySelectorAll('a') : [];

  /* ── Section 4 scroll reveal ── */
  (function initClosingReveal() {
    const revealEls = document.querySelectorAll('.cl-reveal');
    if (!revealEls.length) return;

    const delays = [0, 0.08, 0.18, 0.28, 0.38, 0.5, 0.64];
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${delays[Math.min(i, delays.length - 1)]}s`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -48px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
  })();

  function closeMobileNav() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    hideNavIndicator();
    setNavFocus(false);
  }

  function setNavFocus(active) {
    document.body.classList.toggle('nav-focus', active);
  }
  const scrollExperience = document.getElementById('scroll-experience');
  const pinnedBg = document.getElementById('pinned-bg');
  const pinnedBgInner = document.getElementById('pinned-bg-inner');
  const pinnedBgImage = document.getElementById('pinned-bg-image');
  const overlayHero = document.getElementById('overlay-hero');
  const overlayReveal = document.getElementById('overlay-reveal');
  const heroContent = document.getElementById('hero-content');
  const heroMarquee = document.getElementById('hero-marquee');
  const revealTitle = document.getElementById('reveal-title');

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const maxBlur = prefersReducedMotion ? 0 : isMobile ? 10 : 18;

  function getHeroMaxValues() {
    const styles = getComputedStyle(document.documentElement);
    return {
      inset: parseFloat(styles.getPropertyValue('--hero-inset-max')) || 16,
      radius: parseFloat(styles.getPropertyValue('--hero-radius-max')) || 28,
    };
  }

  /* ── Split reveal text into words ── */
  function splitWords() {
    revealTitle.querySelectorAll('.reveal-line').forEach((line) => {
      const text = line.textContent.trim();
      const words = text.split(/\s+/);
      const html = [];

      for (let i = 0; i < words.length; i++) {
        if (words[i] === '4' && words[i + 1] === 'năm' && words[i + 2] === 'qua.') {
          html.push('<span class="word word-nowrap">4 năm qua.</span>');
          i += 2;
        } else {
          html.push(`<span class="word">${words[i]}</span>`);
        }
      }

      line.innerHTML = html.join(' ');
    });
  }

  splitWords();
  const revealWords = gsap.utils.toArray('.reveal-title .word');
  const { inset: maxInset, radius: maxRadius } = getHeroMaxValues();

  /* ── Set initial states ── */
  gsap.set(pinnedBgInner, {
    top: maxInset,
    left: maxInset,
    right: maxInset,
    bottom: maxInset,
    borderRadius: maxRadius,
  });

  gsap.set(pinnedBgImage, {
    scale: 1.05,
    filter: 'blur(0px)',
    transformOrigin: 'center center',
  });

  gsap.set(heroContent, { opacity: 1, y: 0 });
  gsap.set(heroMarquee, { opacity: 1 });
  gsap.set(overlayHero, { opacity: 1 });
  gsap.set(overlayReveal, { opacity: 0 });

  /* ── Nav indicator & Scroll Spy ── */
  let activeSectionLink = navLinks[0] || null;
  let isHoveringNav = false;

  function moveNavIndicator(link, updateActive = false) {
    if (!navIndicator || !navMenu || !link) return;

    if (updateActive) {
      activeSectionLink = link;
    }

    navLinks.forEach((l) => l.classList.remove('nav-active'));
    link.classList.add('nav-active');

    const isMobile = window.innerWidth <= 900;

    if (isMobile) {
      if (!navMenu.classList.contains('open')) return;

      const menuRect = navMenu.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();

      navIndicator.style.top = `${linkRect.top - menuRect.top}px`;
      navIndicator.style.left = `${linkRect.left - menuRect.left}px`;
      navIndicator.style.right = 'auto';
      navIndicator.style.width = `${linkRect.width}px`;
      navIndicator.style.height = `${linkRect.height}px`;
      navIndicator.style.transform = 'none';
      navIndicator.style.opacity = '1';
      return;
    }

    const menuRect = navMenu.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    navIndicator.style.top = `${linkRect.top - menuRect.top}px`;
    navIndicator.style.left = `${linkRect.left - menuRect.left}px`;
    navIndicator.style.right = 'auto';
    navIndicator.style.width = `${linkRect.width}px`;
    navIndicator.style.height = `${linkRect.height}px`;
    navIndicator.style.transform = 'none';
    navIndicator.style.opacity = '1';
  }

  function resetNavIndicator() {
    if (activeSectionLink) {
      moveNavIndicator(activeSectionLink, false);
    } else {
      if (navIndicator) navIndicator.style.opacity = '0';
      navLinks.forEach((l) => l.classList.remove('nav-active'));
    }
  }

  if (navMenu && navLinks.length) {
    navLinks.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        isHoveringNav = true;
        moveNavIndicator(link, false);
      });
      link.addEventListener('focus', () => {
        isHoveringNav = true;
        moveNavIndicator(link, false);
      });
      link.addEventListener('touchstart', () => {
        isHoveringNav = true;
        moveNavIndicator(link, false);
      }, { passive: true });
    });

    navMenu.addEventListener('mouseleave', () => {
      isHoveringNav = false;
      resetNavIndicator();
    });
  }

  if (siteHeader) {
    siteHeader.addEventListener('mouseenter', () => setNavFocus(true));
    siteHeader.addEventListener('mouseleave', () => setNavFocus(false));
    siteHeader.addEventListener('focusin', () => setNavFocus(true));
    siteHeader.addEventListener('focusout', (e) => {
      if (!siteHeader.contains(e.relatedTarget)) setNavFocus(false);
    });
  }

  /* ── Scroll Spy (tracking all sections) ── */
  const spySections = [
    { id: 'hero-stage', linkSelector: 'a[href="#hero"]', start: 'top 60%', end: 'bottom 40%' },
    { id: 'reveal', linkSelector: 'a[href="#reveal"]', start: 'top 60%', end: 'bottom 40%' },
    { id: 'changes', linkSelector: 'a[href="#changes"]', start: 'top 60%', end: 'bottom 40%' },
    { id: 'closing', linkSelector: 'a[href="#closing"]', start: 'top 60%', end: 'bottom bottom' },
  ];

  spySections.forEach(({ id, linkSelector, start, end }) => {
    const el = document.getElementById(id);
    const link = navMenu ? navMenu.querySelector(linkSelector) : null;
    if (!el || !link) return;

    ScrollTrigger.create({
      trigger: el,
      start: start,
      end: end,
      onEnter: () => {
        if (!isHoveringNav) moveNavIndicator(link, true);
        else activeSectionLink = link;
      },
      onEnterBack: () => {
        if (!isHoveringNav) moveNavIndicator(link, true);
        else activeSectionLink = link;
      },
    });
  });

  /* ── Mobile nav ── */
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
      setNavFocus(open);

      if (open && activeSectionLink) {
        requestAnimationFrame(() => moveNavIndicator(activeSectionLink, false));
      } else {
        if (navIndicator) navIndicator.style.opacity = '0';
      }
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        activeSectionLink = link;
        closeMobileNav();
      });
    });
  }

  if (navFocusOverlay) {
    navFocusOverlay.addEventListener('click', closeMobileNav);
  }

  /* ── Pin background across both sections ── */
  ScrollTrigger.create({
    trigger: scrollExperience,
    start: 'top top',
    end: 'bottom bottom',
    pin: pinnedBg,
    pinSpacing: false,
    invalidateOnRefresh: true,
  });

  /* ── Master transition timeline (scrub) ── */
  const transitionTl = gsap.timeline({
    scrollTrigger: {
      trigger: scrollExperience,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

  /* Frame expand: inset → 0, radius → 0 */
  transitionTl.to(
    pinnedBgInner,
    {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: '0px',
      ease: 'none',
      duration: 0.35,
    },
    0
  );

  /* Progressive blur on background image */
  transitionTl.to(
    pinnedBgImage,
    {
      filter: `blur(${maxBlur}px)`,
      scale: 1.12,
      ease: 'none',
      duration: 0.55,
    },
    0.1
  );

  /* Crossfade overlays: hero gradient → reveal dark */
  transitionTl.to(overlayHero, { opacity: 0, ease: 'none', duration: 0.3 }, 0.15);
  transitionTl.to(overlayReveal, { opacity: 1, ease: 'none', duration: 0.35 }, 0.2);

  /* Hero content fade out + translateY */
  transitionTl.to(
    heroContent,
    {
      opacity: 0,
      y: -48,
      ease: 'none',
      duration: 0.25,
    },
    0
  );

  transitionTl.to(
    heroMarquee,
    {
      opacity: 0,
      ease: 'none',
      duration: 0.2,
    },
    0
  );

  /* Word-by-word text reveal for section 2 */
  revealWords.forEach((word, i) => {
    const start = 0.3 + (i / revealWords.length) * 0.55;
    const dur = 0.08;

    transitionTl.to(
      word,
      {
        opacity: 1,
        color: '#ffffff',
        ease: 'none',
        duration: dur,
      },
      start
    );
  });

  /* Refresh on resize */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      hideNavIndicator();
      setNavFocus(false);
      ScrollTrigger.refresh();
    }, 200);
  });

  /* ══════════════════════════════════════════════════════════
     Section 3 — Memory stack carousel (manual navigation)
     Does NOT modify Section 1 / Section 2 logic above.
     ══════════════════════════════════════════════════════════ */
  (function initSection3() {
    const changesTrack = document.getElementById('changes-track');
    const changesPin = document.getElementById('changes-pin');
    const changesHeading = document.getElementById('changes-heading');
    const headingLeft = document.getElementById('heading-left');
    const headingRight = document.getElementById('heading-right');
    const memoriesGallery = document.getElementById('memories-gallery');
    const memoriesUi = document.getElementById('memories-ui');
    const memoriesCurrent = document.getElementById('memories-current');
    const memoriesTotal = document.getElementById('memories-total');
    const progressFill = document.getElementById('memories-progress-fill');
    const btnPrev = document.getElementById('memories-prev');
    const btnNext = document.getElementById('memories-next');
    const memoryCards = gsap.utils.toArray('.memory-card');

    if (!changesTrack || !changesPin || !memoryCards.length) return;

    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const changesWords = gsap.utils.toArray('#changes-heading .word');
    const cardCount = memoryCards.length;

    if (memoriesTotal) memoriesTotal.textContent = String(cardCount);

    let slideTl = null;
    let isTransitioning = false;
    let currentIndex = 0;
    let galleryActive = false;
    let galleryObserver = null;

    function setHeadingFinalState() {
      if (!changesHeading) return;
      changesHeading.classList.add('is-split');
      gsap.set(changesWords, { opacity: 1, color: '#111111' });
      gsap.set(changesHeading, { clearProps: 'transform' });
      gsap.set([headingLeft, headingRight], { clearProps: 'transform' });
    }

    function updateDots(index) {
      if (memoriesCurrent) {
        memoriesCurrent.textContent = String(index + 1).padStart(2, '0');
      }

      if (progressFill) {
        progressFill.style.width = `${((index + 1) / cardCount) * 100}%`;
      }
    }

    function getStackState(offset) {
      const pos = (offset + cardCount) % cardCount;

      if (pos === 0) {
        return { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 30, pointerEvents: 'auto' };
      }

      if (pos === 1) {
        return { x: 14, y: 12, scale: 0.96, opacity: 0.55, zIndex: 20, pointerEvents: 'none' };
      }

      if (pos === cardCount - 1) {
        return { x: -14, y: 12, scale: 0.96, opacity: 0, zIndex: 5, pointerEvents: 'none' };
      }

      return { x: 0, y: 20, scale: 0.92, opacity: 0, zIndex: 5, pointerEvents: 'none' };
    }

    function applyStack(activeIndex, animate) {
      memoryCards.forEach((card, i) => {
        let offset = i - activeIndex;
        if (offset < 0) offset += cardCount;

        const state = getStackState(offset);

        card.classList.toggle('is-active', offset === 0);
        card.classList.toggle('is-behind-1', offset === 1);
        card.classList.toggle('is-behind-2', offset === cardCount - 1);

        const isVisible = state.opacity > 0;
        const props = {
          x: state.x,
          y: state.y,
          scale: state.scale,
          opacity: state.opacity,
          zIndex: state.zIndex,
          visibility: isVisible ? 'visible' : 'hidden',
          display: isVisible ? 'flex' : 'none',
        };

        if (animate) {
          gsap.to(card, {
            ...props,
            duration: 0.65,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        } else {
          gsap.set(card, props);
        }
      });

      updateDots(activeIndex);
    }

    function finalizeSlideTransition() {
      slideTl = null;
      isTransitioning = false;
      gsap.killTweensOf(memoryCards);
      applyStack(currentIndex, false);
    }

    function goToSlide(nextIndex, direction) {
      const prevIndex = currentIndex;
      const normalized = ((nextIndex % cardCount) + cardCount) % cardCount;

      if (isTransitioning || normalized === prevIndex) return false;

      const isForward =
        direction !== undefined
          ? direction > 0
          : normalized === (prevIndex + 1) % cardCount;

      currentIndex = normalized;

      const prevCard = memoryCards[prevIndex];
      const nextCard = memoryCards[currentIndex];
      const exitX = isForward ? -36 : 36;
      const enterX = isForward ? 24 : -24;

      if (slideTl) {
        slideTl.kill();
        slideTl = null;
        gsap.killTweensOf(memoryCards);
        isTransitioning = false;
      }

      gsap.killTweensOf(memoryCards);

      memoryCards.forEach((card, i) => {
        if (i !== prevIndex && i !== normalized) {
          gsap.set(card, {
            opacity: 0,
            visibility: 'hidden',
            display: 'none',
            zIndex: 5,
            x: 0,
            y: 20,
            scale: 0.92,
          });
        }
      });

      isTransitioning = true;

      slideTl = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: finalizeSlideTransition,
      });

      slideTl.to(
        prevCard,
        {
          x: exitX,
          y: -8,
          scale: 0.94,
          opacity: 0,
          duration: 0.45,
        },
        0
      );

      slideTl.set(
        prevCard,
        {
          visibility: 'hidden',
          display: 'none',
          zIndex: 5,
          x: 0,
          y: 20,
          scale: 0.92,
        },
        0.45
      );

      gsap.set(nextCard, {
        display: 'flex',
        zIndex: 35,
        opacity: 0,
        visibility: 'visible',
        scale: 0.94,
        x: enterX,
        y: 16,
      });

      slideTl.to(
        nextCard,
        {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.55,
        },
        0.12
      );

      return true;
    }

    function navigateManual(delta) {
      if (!galleryActive) return;
      goToSlide(currentIndex + delta, delta);
    }

    function setGalleryInteractive(active) {
      memoriesGallery.classList.toggle('is-active', active);
      if (memoriesUi) {
        memoriesUi.style.pointerEvents = active ? 'auto' : 'none';
      }
    }

    function activateGallery() {
      galleryActive = true;
      setGalleryInteractive(true);
      applyStack(currentIndex, false);
    }

    function deactivateGallery() {
      galleryActive = false;
      setGalleryInteractive(false);
    }

    function setupGalleryObserver() {
      if (galleryObserver) galleryObserver.disconnect();

      galleryObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
            showSection3();
          } else if (!entry.isIntersecting && galleryActive) {
            deactivateGallery();
          }
        },
        { threshold: [0, 0.2, 0.5] }
      );

      galleryObserver.observe(changesPin);
    }

    function showSection3() {
      setHeadingFinalState();
      gsap.set(memoriesGallery, { opacity: 1 });
      gsap.set(memoriesUi, { opacity: 1 });
      if (!galleryActive) activateGallery();
    }

    function setInitialStates() {
      setHeadingFinalState();
      gsap.set(memoriesGallery, { opacity: 1 });
      gsap.set(memoriesUi, { opacity: 1 });
      setGalleryInteractive(false);
      currentIndex = 0;
      applyStack(0, false);
    }

    function initSection3Layout() {
      deactivateGallery();
      setInitialStates();
    }

    initSection3Layout();
    setupGalleryObserver();

    if (btnPrev) {
      btnPrev.addEventListener('click', () => navigateManual(-1));
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => navigateManual(1));
    }

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (changesPin && changesPin.getBoundingClientRect().top < window.innerHeight) {
        showSection3();
      }
    });

    let s3ResizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(s3ResizeTimer);
      s3ResizeTimer = setTimeout(() => {
        setHeadingFinalState();
        ScrollTrigger.refresh();
      }, 250);
    });

    mobileQuery.addEventListener('change', () => {
      setHeadingFinalState();
      ScrollTrigger.refresh();
    });
  })();
})();
