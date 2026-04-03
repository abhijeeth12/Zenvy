import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ force3D: true, lazy: false });

/* ═══════════════════════════════════════════════════
   STAT COUNTER HELPERS
   ═══════════════════════════════════════════════════ */
function parseStat(text: string) {
  const match = text.trim().match(/^([^\d]*)([.\d,]+)(.*)$/);
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

function animateCounters(scope: HTMLElement, start: string) {
  scope.querySelectorAll<HTMLElement>('.metric-value[data-target]').forEach((el) => {
    const { prefix, value, suffix, decimals } = parseStat(el.dataset.target!);
    const counter = { val: 0 };
    gsap.to(counter, {
      val: value,
      duration: 2.4,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start, toggleActions: 'play none none none' },
      onUpdate: () => { el.textContent = `${prefix}${fmtNum(counter.val, decimals)}${suffix}`; },
    });
  });
}

/* initStepImageSwitcher removed — WorkflowSection owns step logic */

/* ═══════════════════════════════════════════════════
   MAIN ANIMATION INITIALIZER
   ═══════════════════════════════════════════════════ */
export function initLandingAnimations(scope: HTMLElement): gsap.Context {
  return gsap.context(() => {
    ScrollTrigger.matchMedia({

      /* ══════════════════════════════════════════════
       *  DESKTOP (≥768px)
       * ══════════════════════════════════════════════ */
      '(min-width: 768px)': () => {

        /* ─── 1. HERO — Immediate entrance + scroll parallax ─── */

        // Show hero content IMMEDIATELY on load (timed, NOT scroll-gated)
        const heroEntrance = gsap.timeline({ delay: 0.2 });

        // Background subtle scale
        heroEntrance.fromTo('.hero-bg',
          { scale: 1.15 },
          { scale: 1.05, duration: 1.8, ease: 'power2.out' },
          0
        );

        // Tag
        heroEntrance.fromTo('.hero-tag',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          0.15
        );

        // Staggered headline words — appear one by one
        heroEntrance.fromTo('.hw-main',
          { opacity: 0, y: 40, rotationX: 12 },
          { opacity: 1, y: 0, rotationX: 0, stagger: 0.07, duration: 0.7, ease: 'power3.out' },
          0.3
        );

        // Subtitle
        heroEntrance.fromTo('.hero-sub',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          0.7
        );

        // CTA buttons
        heroEntrance.fromTo('.hero-cta-group',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          0.9
        );

        // Floating cards — staggered entrance
        heroEntrance.fromTo('.floating-card',
          { opacity: 0, y: 50, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.7, ease: 'power3.out' },
          0.6
        );

        // Layered food images — subtle entrance
        heroEntrance.fromTo('.hero-layer-1',
          { opacity: 0, y: 30, scale: 0.85, rotate: -10 },
          { opacity: 0.35, y: 0, scale: 1, rotate: -6, duration: 1, ease: 'power2.out' },
          0.5
        );
        heroEntrance.fromTo('.hero-layer-2',
          { opacity: 0, y: -20, scale: 0.85, rotate: 8 },
          { opacity: 0.35, y: 0, scale: 1, rotate: 4, duration: 1, ease: 'power2.out' },
          0.65
        );

        // Card bobbing (after entrance completes)
        heroEntrance.add(() => {
          gsap.to('.card-shared-cart', { y: -8, duration: 3, ease: 'sine.inOut', repeat: -1, yoyo: true });
          gsap.to('.card-batch-status', { y: 6, duration: 3.5, ease: 'sine.inOut', repeat: -1, yoyo: true });
          gsap.to('.card-savings', { y: -5, duration: 2.8, ease: 'sine.inOut', repeat: -1, yoyo: true });
        });

        // Scroll parallax: different layers move at different speeds
        gsap.to('.hero-bg', {
          yPercent: 15, scale: 1.12,
          ease: 'none',
          scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to('.hero-layer-1', {
          yPercent: -30,
          ease: 'none',
          scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to('.hero-layer-2', {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to('.hero-text-block', {
          yPercent: 25, opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: '.hero-section', start: '60% top', end: 'bottom top', scrub: true },
        });
        gsap.to('.hero-cards-composition', {
          yPercent: 15, opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: '.hero-section', start: '60% top', end: 'bottom top', scrub: true },
        });

        /* ─── 2. HOW It Works handled by WorkflowSection (self-contained) ─── */

        /* ─── 3. FEATURES — NO pinning, NO horizontal scroll ─── */

        // Food image strip parallax for continuity
        gsap.fromTo('.features-strip-img',
          { yPercent: -15, scale: 1.1 },
          { yPercent: 10, scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: '.features-img-strip', start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );

        // Header reveal
        gsap.fromTo(
          '.features-header .section-tag, .features-header .section-title, .features-header .section-subtitle',
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: '.features-content-area', start: 'top 75%', toggleActions: 'play none none none' },
          }
        );

        // Feature cards — staggered grid reveal
        gsap.fromTo('.feature-card',
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: '.features-grid', start: 'top 80%', toggleActions: 'play none none none' },
          }
        );

        /* ─── 4. PRODUCT SHOWCASE ─── */
        gsap.fromTo('.showcase-header',
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: '.showcase-section', start: 'top 75%', toggleActions: 'play none none none' },
          }
        );

        // Panels rise with slight fan effect
        gsap.utils.toArray<HTMLElement>('.showcase-panel').forEach((panel, i) => {
          gsap.fromTo(panel,
            { opacity: 0, y: 50, rotateY: i === 1 ? 0 : (i === 0 ? 5 : -5) },
            { opacity: 1, y: 0, rotateY: 0, duration: 0.8, ease: 'power3.out',
              scrollTrigger: { trigger: '.showcase-panels', start: 'top 80%', toggleActions: 'play none none none' },
              delay: i * 0.12,
            }
          );
        });

        /* ─── 5. METRICS ─── */
        gsap.fromTo('.metrics-header',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: '.metrics-section', start: 'top 75%', toggleActions: 'play none none none' },
          }
        );
        gsap.fromTo('.metric-item',
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: '.metrics-grid', start: 'top 80%', toggleActions: 'play none none none' },
          }
        );
        animateCounters(scope, 'top 80%');

        /* ─── 6. FINAL CTA ─── */
        gsap.fromTo('.final-cta-content',
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.final-cta-section', start: 'top 80%', toggleActions: 'play none none none' },
          }
        );
      },

      /* ══════════════════════════════════════════════
       *  MOBILE (<768px)
       * ══════════════════════════════════════════════ */
      '(max-width: 767px)': () => {

        // Hero entrance — timed, not scroll
        const mobileHero = gsap.timeline({ delay: 0.15 });

        mobileHero.fromTo('.hero-bg',
          { scale: 1.1 },
          { scale: 1.02, duration: 1.5, ease: 'power2.out' },
          0
        );
        mobileHero.fromTo('.hero-tag',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          0.1
        );
        mobileHero.fromTo('.hw-main',
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, stagger: 0.04, duration: 0.5, ease: 'power2.out' },
          0.2
        );
        mobileHero.fromTo('.hero-sub',
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: 'power2.out' },
          0.5
        );
        mobileHero.fromTo('.hero-cta-group',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          0.65
        );
        mobileHero.fromTo('.floating-card',
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' },
          0.7
        );

        // Gentle BG breathing
        gsap.fromTo('.hero-bg',
          { scale: 1 },
          { scale: 1.04, duration: 6, ease: 'sine.inOut', repeat: -1, yoyo: true }
        );

        // Batch reveal for remaining sections
        ScrollTrigger.batch(
          '.how-header, .how-visual-frame, .step-item, .features-header .section-tag, .features-header .section-title, .features-header .section-subtitle, .feature-card, .showcase-header, .showcase-panel, .metrics-header, .metric-item, .final-cta-content',
          {
            onEnter: (els: Element[]) =>
              gsap.fromTo(els,
                { opacity: 0, y: 35 },
                { opacity: 1, y: 0, stagger: 0.06, duration: 0.5, ease: 'power2.out' }
              ),
            start: 'top 88%',
          }
        );

        // Counters
        animateCounters(scope, 'top 88%');
      },
    });
  }, scope);
}
