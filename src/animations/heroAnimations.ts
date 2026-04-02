import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 60fps defaults: GPU acceleration + immediate rendering
gsap.defaults({ force3D: true, lazy: false });

/* ─── Stat counter helpers ─── */
function parseStat(text: string) {
  const match = text.trim().match(/^([^\d]*)([\d,.]+)(.*)$/);
  if (!match) return { prefix: '', value: 0, suffix: '', decimals: 0 };
  const numStr = match[2].replace(/,/g, '');
  const decPart = numStr.split('.')[1];
  return { prefix: match[1], value: parseFloat(numStr), suffix: match[3], decimals: decPart ? decPart.length : 0 };
}

function fmtNum(n: number, d: number): string {
  const [int, dec] = n.toFixed(d).split('.');
  const c = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return dec ? `${c}.${dec}` : c;
}

function animateCounters(scope: HTMLElement, startTrigger: string) {
  scope.querySelectorAll<HTMLElement>('.insight-value[data-target]').forEach((el) => {
    const { prefix, value, suffix, decimals } = parseStat(el.dataset.target!);
    const counter = { val: 0 };
    gsap.to(counter, {
      val: value, duration: 2, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: startTrigger, toggleActions: 'play none none none' },
      onUpdate: () => { el.textContent = `${prefix}${fmtNum(counter.val, decimals)}${suffix}`; },
    });
  });
}

/**
 * Initialize all cinematic landing page animations.
 * Returns a gsap.Context — call ctx.revert() on unmount.
 */
export function initLandingAnimations(scope: HTMLElement): gsap.Context {
  return gsap.context(() => {
    ScrollTrigger.matchMedia({

      /* ══════ DESKTOP ≥768px ══════ */
      '(min-width: 768px)': () => {

        /* 1 — Pinned Hero with Scrub */
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: '.parallax-hero', start: 'top top', end: '+=100vh',
            pin: true, scrub: 0.6, anticipatePin: 1, refreshPriority: 10,
          },
        });
        heroTl
          .fromTo('.hero-bg-image', { scale: 1 }, { scale: 1.15, ease: 'none', duration: 1 }, 0)
          .fromTo('.hero-word-script', { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.08, ease: 'power3.out', duration: 0.35 }, 0.05)
          .fromTo('.hero-word-title', { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.08, ease: 'power3.out', duration: 0.35 }, 0.2)
          .fromTo('.hero-subtitle', { opacity: 0, y: 20 }, { opacity: 0.9, y: 0, duration: 0.25, ease: 'power2.out' }, 0.45)
          .fromTo('.btn-hero', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 0.6);

        /* 2 — Horizontal scroll restaurant cards */
        const gallery = scope.querySelector<HTMLElement>('.restaurant-gallery');
        if (gallery) {
          ScrollTrigger.create({
            trigger: '.section-restaurants', start: 'top top',
            end: () => `+=${Math.max(gallery.scrollWidth - gallery.offsetWidth, 400)}`,
            pin: true, scrub: 0.8, anticipatePin: 1, refreshPriority: 5, invalidateOnRefresh: true,
            animation: gsap.to(gallery, { x: () => -(gallery.scrollWidth - gallery.offsetWidth), ease: 'none', force3D: true }),
          });
        }

        /* 3 — Staggered clipPath reveals */
        gsap.fromTo(
          '.section-about .section-heading, .section-about .about-desc, .section-about .feature-item, .section-about .about-image-wrapper',
          { opacity: 0, clipPath: 'inset(0 0 100% 0)', y: 30 },
          { opacity: 1, clipPath: 'inset(0 0 0% 0)', y: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: '.section-about', start: 'top 75%', toggleActions: 'play none none none' } }
        );
        gsap.fromTo(
          '.section-overview .overview-tag, .section-overview .overview-title, .section-overview .insight-item',
          { opacity: 0, clipPath: 'inset(0 0 100% 0)', y: 30 },
          { opacity: 1, clipPath: 'inset(0 0 0% 0)', y: 0, stagger: 0.15, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: '.section-overview', start: 'top 70%', toggleActions: 'play none none none' } }
        );

        /* 4 — Number counters */
        animateCounters(scope, 'top 80%');
      },

      /* ══════ MOBILE <768px — no pinning ══════ */
      '(max-width: 767px)': () => {
        gsap.fromTo('.hero-word-script, .hero-word-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.04, duration: 0.5, ease: 'power2.out', delay: 0.2 });
        gsap.fromTo('.hero-subtitle', { opacity: 0 }, { opacity: 0.9, duration: 0.5, delay: 0.5 });
        gsap.fromTo('.btn-hero', { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.7 });
        gsap.fromTo('.hero-bg-image', { scale: 1 }, { scale: 1.06, duration: 6, ease: 'sine.inOut', repeat: -1, yoyo: true });

        ScrollTrigger.batch(
          '.section-about .section-heading, .section-about .about-desc, .section-about .feature-item, .section-about .about-image-wrapper, .section-overview .overview-tag, .section-overview .overview-title, .section-overview .insight-item, .gallery-card',
          { onEnter: (els: Element[]) => gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out' }), start: 'top 88%' }
        );
        animateCounters(scope, 'top 88%');
      },
    });
  }, scope);
}
