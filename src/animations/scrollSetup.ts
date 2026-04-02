import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let rafId: number | null = null;

/**
 * Initialize smooth scroll with Lenis + GSAP ScrollTrigger sync.
 * Lenis handles smooth inertial scrolling, and its RAF loop
 * calls ScrollTrigger.update() each frame for perfect synchronization.
 */
export function initScroll(): void {
  // Prevent double-init
  if (lenis) return;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    // @ts-ignore — Lenis typing variance
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false, // native touch on mobile for battery
    touchMultiplier: 2,
  });

  // Connect Lenis scroll position to ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Use GSAP ticker for the Lenis RAF loop (single rAF, no double-loop)
  gsap.ticker.add((time: number) => {
    lenis?.raf(time * 1000); // GSAP ticker uses seconds, Lenis expects ms
  });

  // Disable GSAP's default lagSmoothing so Lenis stays in control
  gsap.ticker.lagSmoothing(0);

  // Refresh ScrollTrigger once everything is wired
  ScrollTrigger.refresh();
}

/**
 * Destroy Lenis, cancel RAF, and kill all ScrollTrigger instances.
 * Call in useEffect cleanup / componentWillUnmount.
 */
export function destroyScroll(): void {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  if (lenis) {
    lenis.destroy();
    lenis = null;
  }

  // Kill every ScrollTrigger instance to prevent memory leaks
  ScrollTrigger.getAll().forEach((st) => st.kill());
  ScrollTrigger.clearMatchMedia();
}
