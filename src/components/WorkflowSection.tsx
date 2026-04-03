import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './WorkflowSection.css';

import ws1 from '../assets/ws1_create.png';
import ws2 from '../assets/ws2_join.png';
import ws3 from '../assets/ws3_items.png';
import ws4 from '../assets/ws4_cart.png';
import ws5 from '../assets/ws5_order.png';

gsap.registerPlugin(ScrollTrigger);

/* ── Step data ── */
const STEPS = [
  {
    label: 'Step 01',
    tag: 'INITIATE',
    title: 'Create a Batch',
    body: 'Start one shared order for your hostel room, class group, or office team.',
    detail: 'One tap. One batch. Everyone in.',
    img: ws1,
    accent: '#c96442',
  },
  {
    label: 'Step 02',
    tag: 'INVITE',
    title: 'Friends Join Instantly',
    body: 'Share a code or link so everyone adds their choices into the same order.',
    detail: 'No separate signup needed to join.',
    img: ws2,
    accent: '#b89562',
  },
  {
    label: 'Step 03',
    tag: 'BROWSE',
    title: 'Everyone Adds Their Meal',
    body: 'Meals, add-ons, and preferences collect into one coordinated cart.',
    detail: 'Full menu access for every member.',
    img: ws3,
    accent: '#7a9e7e',
  },
  {
    label: 'Step 04',
    tag: 'REVIEW',
    title: 'One Shared Cart Builds Up',
    body: 'The shared cart keeps the whole group aligned and avoids duplicate chaos.',
    detail: 'Live updates as items are added.',
    img: ws4,
    accent: '#b89562',
  },
  {
    label: 'Step 05',
    tag: 'CONFIRM',
    title: 'One Optimized Order Placed',
    body: 'One checkout, lower friction, fewer fees, and a smoother group meal experience.',
    detail: 'Split payments handled automatically.',
    img: ws5,
    accent: '#c96442',
  },
];

const N = STEPS.length;

/* ─────────────────────────────────────────────────────────────
   activateStep — drives all card & UI transitions
───────────────────────────────────────────────────────────── */
function activateStep(
  nextIdx: number,
  prevIdx: number | null,
  section: HTMLElement,
  instant: boolean
) {
  const imgCards = section.querySelectorAll<HTMLElement>('[data-img-card]');
  const textCards = section.querySelectorAll<HTMLElement>('[data-text-card]');
  const dots = section.querySelectorAll<HTMLElement>('[data-dot]');
  const fill = section.querySelector<HTMLElement>('[data-progress-fill]');
  const ambient = section.querySelector<HTMLElement>('.wf-ambient');

  /* kill any active tweens to prevent conflicts */
  gsap.killTweensOf([...imgCards, ...textCards]);

  /* --- Progress fill --- */
  if (fill) {
    gsap.to(fill, {
      width: `${(nextIdx / (N - 1)) * 100}%`,
      duration: instant ? 0 : 0.65,
      ease: 'power2.out',
    });
  }

  /* --- Ambient orb color --- */
  if (ambient) {
    const hex = STEPS[nextIdx].accent;
    const before = ambient as HTMLElement;
    before.style.setProperty('--orb-accent', hex);
    if (!instant) {
      gsap.to({ dummy: 0 }, {
        duration: 1,
        onUpdate() {
          ambient.style.setProperty('--orb-accent', hex);
        },
      });
    }
  }

  /* --- Dots --- */
  dots.forEach((dot, i) => dot.classList.toggle('wf-dot-active', i === nextIdx));

  /* --- Image cards --- */
  imgCards.forEach((card, i) => {
    const isActive = i === nextIdx;
    const isNext = i === nextIdx + 1;
    const isPrev = prevIdx !== null && i === prevIdx;
    const goingFwd = prevIdx !== null ? nextIdx > prevIdx : true;

    card.setAttribute('data-active', isActive ? 'true' : 'false');
    card.setAttribute('data-next', isNext ? 'true' : 'false');

    if (instant) {
      gsap.set(card, {
        opacity: isActive ? 1 : isNext ? 0.28 : 0,
        scale: isActive ? 1 : isNext ? 0.88 : 0.82,
        rotate: isActive ? (i % 2 === 0 ? -1.5 : 1.5) : (i % 2 === 0 ? 2 : -2),
        clipPath: 'inset(0% 0% 0% 0% round 28px)',
        y: 0,
        zIndex: isActive ? 10 : isNext ? 5 : 1,
      });
      return;
    }

    if (isActive && isPrev === false) {
      /* Incoming active card: sweeps up with clip-path reveal */
      gsap.fromTo(
        card,
        {
          clipPath: goingFwd
            ? 'inset(0% 0% 100% 0% round 28px)'
            : 'inset(100% 0% 0% 0% round 28px)',
          scale: 0.9,
          y: goingFwd ? 50 : -50,
          opacity: 0,
          rotate: i % 2 === 0 ? -3 : 3,
          zIndex: 10,
        },
        {
          clipPath: 'inset(0% 0% 0% 0% round 28px)',
          scale: 1,
          y: 0,
          opacity: 1,
          rotate: i % 2 === 0 ? -1.5 : 1.5,
          duration: 0.85,
          ease: 'expo.out',
          zIndex: 10,
        }
      );
    } else if (isPrev && i !== nextIdx) {
      /* Outgoing previous card: flies away */
      gsap.to(card, {
        clipPath: goingFwd
          ? 'inset(100% 0% 0% 0% round 28px)'
          : 'inset(0% 0% 100% 0% round 28px)',
        scale: 0.82,
        y: goingFwd ? -60 : 60,
        opacity: 0,
        zIndex: 1,
        duration: 0.6,
        ease: 'expo.in',
      });
    } else if (isNext) {
      /* Peek card: slightly showing behind */
      gsap.to(card, {
        clipPath: 'inset(0% 0% 0% 0% round 28px)',
        scale: 0.88,
        rotate: i % 2 === 0 ? 2 : -2,
        opacity: 0.28,
        y: goingFwd ? 20 : -20,
        zIndex: 5,
        duration: 0.55,
        ease: 'power3.out',
      });
    } else {
      /* Hide all others */
      gsap.to(card, {
        opacity: 0,
        scale: 0.82,
        zIndex: 1,
        duration: 0.35,
        ease: 'power2.in',
      });
    }
  });

  /* --- Text cards --- */
  textCards.forEach((card, i) => {
    const isActive = i === nextIdx;
    const goingFwd = prevIdx !== null ? nextIdx > prevIdx : true;

    if (instant) {
      gsap.set(card, { opacity: isActive ? 1 : 0, y: 0, zIndex: isActive ? 10 : 1 });
      return;
    }

    if (isActive) {
      const tag = card.querySelector('.wf-tc-tag');
      const label = card.querySelector('.wf-tc-label');
      const title = card.querySelector('.wf-tc-title');
      const body = card.querySelector('.wf-tc-body');
      const detail = card.querySelector('.wf-tc-detail');
      const bar = card.querySelector('.wf-tc-accent-bar');

      gsap.set(card, { zIndex: 10, opacity: 1 });

      const tl = gsap.timeline();
      tl.fromTo(bar,
        { scaleY: 0, transformOrigin: 'top center' },
        { scaleY: 1, duration: 0.6, ease: 'expo.out' },
        0
      );
      tl.fromTo([tag, label],
        { y: goingFwd ? 18 : -18, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.45, ease: 'power3.out' },
        0.08
      );
      tl.fromTo(title,
        { y: goingFwd ? 32 : -32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' },
        0.18
      );
      tl.fromTo([body, detail],
        { y: goingFwd ? 20 : -20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out' },
        0.35
      );
    } else {
      gsap.to(card, {
        opacity: 0,
        y: goingFwd ? -25 : 25,
        zIndex: 1,
        duration: 0.38,
        ease: 'power2.in',
      });
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────── */
export default function WorkflowSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const activeIdx = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!section || !sticky) return;

    const ctx = gsap.context(() => {
      /* Set initial state with no animation */
      activateStep(0, null, section, true);

      /* Single ScrollTrigger: pins the panel AND drives step transitions */
      ScrollTrigger.create({
        trigger: sticky,
        start: 'top top',
        end: `+=${(N - 1) * 200}vh`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate(self) {
          const raw = self.progress * N;
          const next = Math.min(Math.floor(raw), N - 1);
          if (next !== activeIdx.current) {
            activateStep(next, activeIdx.current, section, false);
            activeIdx.current = next;
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="wf-section" id="how">
      <div ref={stickyRef} className="wf-sticky">

        {/* Ambient background */}
        <div className="wf-ambient" />
        <div className="wf-deco-ring wf-deco-ring-1" />
        <div className="wf-deco-ring wf-deco-ring-2" />

        {/* Top nav row */}
        <div className="wf-nav-row">
          <span className="wf-section-tag">How It Works</span>
          <div className="wf-dots">
            {STEPS.map((_, i) => (
              <div key={i} className="wf-dot" data-dot={i} />
            ))}
          </div>
        </div>

        {/* Stage: image col + text col */}
        <div className="wf-stage">

          {/* LEFT — image card stack */}
          <div className="wf-image-col">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="wf-img-card"
                data-img-card={i}
                style={{ '--step-accent': step.accent } as React.CSSProperties}
              >
                <div className="wf-img-inner">
                  <img src={step.img} alt={step.title} className="wf-img" loading="lazy" />
                  <div className="wf-img-shade" />
                </div>
                <div className="wf-img-meta">
                  <span className="wf-img-tag">{step.tag}</span>
                  <span className="wf-img-num">{String(i + 1).padStart(2, '0')}</span>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT — text card stack */}
          <div className="wf-text-col">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="wf-text-card"
                data-text-card={i}
                style={{ '--step-accent': step.accent } as React.CSSProperties}
              >
                {/* Left accent bar */}
                <div className="wf-tc-accent-bar" />

                {/* Watermark step number */}
                <div className="wf-tc-watermark">{i + 1}</div>

                {/* Content */}
                <div className="wf-tc-eyebrow">
                  <span className="wf-tc-tag">{step.tag}</span>
                  <span className="wf-tc-label">{step.label}</span>
                </div>
                <h2 className="wf-tc-title">{step.title}</h2>
                <p className="wf-tc-body">{step.body}</p>
                <p className="wf-tc-detail">{step.detail}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom progress bar */}
        <div className="wf-progress-track">
          <div className="wf-progress-fill" data-progress-fill />
        </div>

      </div>
    </section>
  );
}
