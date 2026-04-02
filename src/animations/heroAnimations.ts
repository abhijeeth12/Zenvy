import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 60fps defaults: GPU acceleration + immediate rendering
gsap.defaults({ force3D: true, lazy: false });

/* ═══════════════════════════════════════════════════
   STAT COUNTER HELPERS
   ═══════════════════════════════════════════════════ */
function parseStat(text: string) {
  const match = text.trim().match(/^([^\d]*)([\d,.]+)(.*)$/);
  if (!match) return { prefix: '', value: 0, suffix: '', decimals: 0 };
  const numStr = match[2].replace(/,/g, '');
  const decPart = numStr.split('.')[1];
  return {
    prefix: match[1],
    value: parseFloat(numStr),
    suffix: match[3],
    decimals: decPart ? decPart.length : 0,
  };
}

function fmtNum(n: number, d: number): string {
  const [int, dec] = n.toFixed(d).split('.');
  const c = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return dec ? `${c}.${dec}` : c;
}

function animateCounters(scope: HTMLElement, startTrigger: string) {
  scope.querySelectorAll<HTMLElement>('.metric-value[data-target]').forEach((el) => {
    const { prefix, value, suffix, decimals } = parseStat(el.dataset.target!);
    const counter = { val: 0 };
    gsap.to(counter, {
      val: value,
      duration: 2.4,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: startTrigger,
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        el.textContent = `${prefix}${fmtNum(counter.val, decimals)}${suffix}`;
      },
    });
  });
}

/* ═══════════════════════════════════════════════════
   HOW-IT-WORKS STEP ACTIVATOR
   ═══════════════════════════════════════════════════ */
function initStepScrollytelling(scope: HTMLElement) {
  const steps = scope.querySelectorAll<HTMLElement>('.step-item');
  if (steps.length === 0) return;

  steps.forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => {
        // Deactivate all, activate current
        steps.forEach((s) => s.classList.remove('step-active'));
        step.classList.add('step-active');
      },
      onEnterBack: () => {
        steps.forEach((s) => s.classList.remove('step-active'));
        step.classList.add('step-active');
      },
    });

    // Staggered reveal for steps
    gsap.fromTo(
      step,
      { opacity: 0, y: 40, clipPath: 'inset(0 0 15% 0)' },
      {
        opacity: 1,
        y: 0,
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: step,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

/* ═══════════════════════════════════════════════════
   MAIN ANIMATION INITIALIZER
   ═══════════════════════════════════════════════════ */
export function initLandingAnimations(scope: HTMLElement): gsap.Context {
  return gsap.context(() => {
    ScrollTrigger.matchMedia({
      /* ══════════════════════════════════ *
       *     DESKTOP (≥768px)              *
       * ══════════════════════════════════ */
      '(min-width: 768px)': () => {
        /* ── 1. HERO — Pinned with scrub ── */
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: '+=80vh',
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            refreshPriority: 10,
          },
        });

        // Parallax BG scale
        heroTl.fromTo(
          '.hero-bg',
          { scale: 1 },
          { scale: 1.12, ease: 'none', duration: 1 },
          0
        );

        // Staggered headline words
        heroTl.fromTo(
          '.hw-main',
          { opacity: 0, y: 50, rotationX: 15 },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            stagger: 0.06,
            ease: 'power3.out',
            duration: 0.35,
          },
          0.05
        );

        // Tag reveal
        heroTl.fromTo(
          '.hero-tag',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' },
          0.1
        );

        // Subtitle + CTA
        heroTl.fromTo(
          '.hero-sub',
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
          0.4
        );
        heroTl.fromTo(
          '.hero-cta-group',
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' },
          0.55
        );

        // Floating cards with subtle float-in
        heroTl.fromTo(
          '.floating-card',
          { opacity: 0, y: 60, scale: 0.92 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.1,
            duration: 0.4,
            ease: 'power3.out',
          },
          0.3
        );

        // Subtle floating loop for cards (non-scrubbed)
        gsap.to('.card-shared-cart', {
          y: -8,
          duration: 3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 1,
        });
        gsap.to('.card-batch-status', {
          y: 6,
          duration: 3.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 1.5,
        });
        gsap.to('.card-savings', {
          y: -5,
          duration: 2.8,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 2,
        });

        /* ── 2. HOW IT WORKS scrollytelling ── */
        gsap.fromTo(
          '.how-header',
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.how-section',
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
        initStepScrollytelling(scope);

        /* ── 3. FEATURES — Horizontal scroll ── */
        const featTrack = scope.querySelector<HTMLElement>('.features-track');
        const featSection = scope.querySelector<HTMLElement>('.features-section');
        if (featTrack && featSection) {
          // Reveal header
          gsap.fromTo(
            '.features-header .section-tag, .features-header .section-title, .features-header .section-subtitle',
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.1,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: featSection,
                start: 'top 70%',
                toggleActions: 'play none none none',
              },
            }
          );

          // Horizontal scroll
          const scrollAmount = Math.max(
            featTrack.scrollWidth - featTrack.offsetWidth,
            200
          );
          ScrollTrigger.create({
            trigger: featSection,
            start: 'top top',
            end: () => `+=${scrollAmount + 200}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            refreshPriority: 5,
            invalidateOnRefresh: true,
            animation: gsap.to(featTrack, {
              x: () => -(featTrack.scrollWidth - featTrack.offsetWidth),
              ease: 'none',
              force3D: true,
            }),
          });
        }

        /* ── 4. PRODUCT SHOWCASE — Staggered reveal ── */
        gsap.fromTo(
          '.showcase-header',
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.showcase-section',
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );

        gsap.fromTo(
          '.showcase-panel',
          { opacity: 0, y: 50, clipPath: 'inset(8% 0 8% 0)' },
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0% 0 0% 0)',
            stagger: 0.15,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.showcase-panels',
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );

        /* ── 5. METRICS — Count-up + reveal ── */
        gsap.fromTo(
          '.metrics-header',
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.metrics-section',
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );

        gsap.fromTo(
          '.metric-item',
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.metrics-grid',
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );

        animateCounters(scope, 'top 80%');

        /* ── 6. FINAL CTA ── */
        gsap.fromTo(
          '.final-cta-content',
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.final-cta-section',
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      },

      /* ══════════════════════════════════ *
       *     MOBILE (<768px)                *
       * ══════════════════════════════════ */
      '(max-width: 767px)': () => {
        // Hero entrance (no pinning)
        gsap.fromTo(
          '.hero-tag',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.4, delay: 0.1, ease: 'power2.out' }
        );
        gsap.fromTo(
          '.hw-main',
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.04,
            duration: 0.5,
            ease: 'power2.out',
            delay: 0.2,
          }
        );
        gsap.fromTo(
          '.hero-sub',
          { opacity: 0 },
          { opacity: 1, duration: 0.5, delay: 0.5, ease: 'power2.out' }
        );
        gsap.fromTo(
          '.hero-cta-group',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.4, delay: 0.7, ease: 'power2.out' }
        );

        // Gentle BG breathing
        gsap.fromTo(
          '.hero-bg',
          { scale: 1 },
          {
            scale: 1.06,
            duration: 6,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          }
        );

        // Floating cards on mobile (if visible)
        gsap.fromTo(
          '.floating-card',
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.5,
            delay: 0.8,
            ease: 'power2.out',
          }
        );

        // Batch reveal for all sections
        ScrollTrigger.batch(
          '.how-header, .step-item, .features-header .section-tag, .features-header .section-title, .features-header .section-subtitle, .feature-card, .showcase-header, .showcase-panel, .metrics-header, .metric-item, .final-cta-content',
          {
            onEnter: (els: Element[]) =>
              gsap.fromTo(
                els,
                { opacity: 0, y: 40 },
                {
                  opacity: 1,
                  y: 0,
                  stagger: 0.08,
                  duration: 0.6,
                  ease: 'power2.out',
                }
              ),
            start: 'top 88%',
          }
        );

        // Step activation on mobile too
        initStepScrollytelling(scope);

        // Counters
        animateCounters(scope, 'top 88%');
      },
    });
  }, scope);
}
