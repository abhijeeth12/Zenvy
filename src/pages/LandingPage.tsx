import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Users,
  Link2,
  Search,
  Eye,
  ShoppingCart,
  Radio,
  DollarSign,
  MessageSquare,
  Scale,
  Sparkles,
} from 'lucide-react';
import './LandingPage.css';

import { initScroll, destroyScroll } from '../animations/scrollSetup';
import { initLandingAnimations } from '../animations/heroAnimations';

import heroBg from '../assets/hero_moody.png';

/* ── Word splitter for staggered text ── */
const splitWords = (text: string, cls: string) =>
  text.split(' ').map((word, i, arr) => (
    <span key={i} className={`hero-word ${cls}`}>
      {word}{i < arr.length - 1 ? '\u00A0' : ''}
    </span>
  ));

/* ── HOW IT WORKS STEPS DATA ── */
const STEPS = [
  {
    icon: <Users size={22} />,
    title: 'Create a Batch',
    desc: 'Start a group order for your team, class, or office wing with a single tap.',
  },
  {
    icon: <Link2 size={22} />,
    title: 'Share the Link',
    desc: 'Invite friends and colleagues — anyone with the link can join your session.',
  },
  {
    icon: <Search size={22} />,
    title: 'Browse & Add',
    desc: 'Everyone picks from the same premium menu. No screenshots, no confusion.',
  },
  {
    icon: <Eye size={22} />,
    title: 'Review Together',
    desc: 'See the shared cart update in real-time as items are added by the group.',
  },
  {
    icon: <ShoppingCart size={22} />,
    title: 'One Smart Order',
    desc: 'Place a single optimized delivery for everyone. One fee, one delivery, all together.',
  },
];

/* ── FEATURES DATA ── */
const FEATURES = [
  {
    icon: <Eye size={24} />,
    title: 'Shared Cart Visibility',
    desc: 'Never guess who ordered what. See additions in real-time as colleagues browse and build the perfect collective menu.',
  },
  {
    icon: <Radio size={24} />,
    title: 'Real-Time Coordination',
    desc: 'Kill the group chat chaos. Automatic status updates inform everyone when the batch is filling, ordering, and arriving.',
  },
  {
    icon: <DollarSign size={24} />,
    title: 'Lower Delivery Costs',
    desc: "Why pay five delivery fees? Split one optimized fee and share service costs fairly across the entire group.",
  },
  {
    icon: <MessageSquare size={24} />,
    title: 'Zero Ordering Chaos',
    desc: 'No more "what do you want?" text chains. Everyone browses, picks, and confirms within one clean interface.',
  },
  {
    icon: <Scale size={24} />,
    title: 'Fair & Streamlined',
    desc: 'Everyone pays their share, automatically. No awkward split calculations, no chasing payments.',
  },
];

/* ── METRICS DATA ── */
const METRICS = [
  { value: '$2.4M+', label: 'Saved Collectively', desc: 'Total logistical savings returned to our food-loving community.' },
  { value: '45,000+', label: 'Batches Completed', desc: 'Successful group orders placed and delivered with care.' },
  { value: '24%', label: 'Faster Deliveries', desc: 'Average reduction in turnaround through intelligent routing.' },
  { value: '4.9', label: 'Average Rating', desc: 'Rated by groups who never went back to solo ordering.' },
];

/* ═════════════════════════════════════════════ */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);

  /* ── Smooth scroll + nav bg ── */
  useEffect(() => {
    initScroll();
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      destroyScroll();
    };
  }, []);

  /* ── GSAP animations ── */
  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const ctx = initLandingAnimations(rootRef.current);
    return () => ctx.revert();
  }, []);

  return (
    <div className="landing-layout" ref={rootRef}>

      {/* ═══ NAVIGATION ═══ */}
      <nav className={`zen-nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="zen-nav-brand">Zenvy.</div>
        <div className="zen-nav-links">
          <a href="#home">Home</a>
          <a href="#how">How It Works</a>
          <a href="#features">Features</a>
          <a href="#metrics">Results</a>
        </div>
        <button className="btn-nav-cta" onClick={() => navigate('/login')}>Sign In</button>
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="home" className="hero-section">
        <div className="hero-bg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="hero-gradient-overlay" />

        <div className="hero-inner">
          <div className="hero-text-block">
            <span className="hero-tag anim-reveal">Collaborative Food Ordering</span>

            <h1 className="hero-headline">
              {splitWords('Order', 'hw-main')}
              {' '}
              <span className="hero-word hw-main accent-word">Together.</span>
              <br />
              {splitWords('Save', 'hw-main')}
              {' '}
              <span className="hero-word hw-main accent-word">Together.</span>
            </h1>

            <p className="hero-sub anim-reveal">
              The collaborative food ordering platform that brings groups together
              — one batch, one cart, one delivery.
            </p>

            <div className="hero-cta-group anim-reveal">
              <button className="btn-primary-hero" onClick={() => navigate('/login')}>
                Start a Batch <ArrowRight size={18} />
              </button>
              <button className="btn-secondary-hero" onClick={() => navigate('/login')}>
                Join Existing Batch
              </button>
            </div>
          </div>

          {/* Floating glassmorphism UI cards */}
          <div className="hero-cards-composition">
            <div className="floating-card card-shared-cart">
              <div className="fc-label">Shared Cart</div>
              <div className="fc-items">
                <div className="fc-item-row">
                  <span>🍔 Classic Burger</span>
                  <span>$12.99</span>
                </div>
                <div className="fc-item-row">
                  <span>🥗 Caesar Salad</span>
                  <span>$9.50</span>
                </div>
                <div className="fc-item-row">
                  <span>🍜 Pad Thai</span>
                  <span>$14.25</span>
                </div>
              </div>
              <div className="fc-avatars">
                <div className="fc-avatar">AJ</div>
                <div className="fc-avatar">RK</div>
                <div className="fc-avatar">SM</div>
                <div className="fc-avatar">+2</div>
              </div>
            </div>

            <div className="floating-card card-batch-status">
              <div className="fc-label">Batch Status</div>
              <div className="fc-main-value">4/8</div>
              <div className="fc-detail">Members joined</div>
              <div className="fc-progress-bar">
                <div className="fc-progress-fill" />
              </div>
            </div>

            <div className="floating-card card-savings">
              <div className="fc-label">You're Saving</div>
              <div className="fc-main-value">$12.40</div>
              <div className="fc-detail">vs. individual orders</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how" className="how-section">
        <div className="how-header anim-reveal">
          <span className="section-tag">How It Works</span>
          <h2 className="section-title">From Solo Orders to Smart Batches</h2>
          <p className="section-subtitle">
            Five simple steps to transform chaotic group ordering into a seamless, cost-saving experience.
          </p>
        </div>

        <div className="how-steps">
          {STEPS.map((step, i) => (
            <div key={i} className={`step-item anim-reveal ${i === 0 ? 'step-active' : ''}`} data-step={i}>
              <div className="step-number-wrap">
                <div className="step-number">{i + 1}</div>
              </div>
              <div className="step-content">
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES STRIP (dark) ═══ */}
      <section id="features" className="features-section">
        <div className="features-header">
          <span className="section-tag">Features</span>
          <h2 className="section-title">Why Groups Choose Zenvy</h2>
          <p className="section-subtitle">
            Every feature is designed to replace the chaos of group ordering with effortless coordination.
          </p>
        </div>

        <div className="features-track-wrap">
          <div className="features-track">
            {FEATURES.map((feat, i) => (
              <div key={i} className="feature-card anim-reveal">
                <div className="feature-icon-wrap">{feat.icon}</div>
                <h3 className="feature-card-title">{feat.title}</h3>
                <p className="feature-card-desc">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRODUCT SHOWCASE ═══ */}
      <section className="showcase-section">
        <div className="showcase-header anim-reveal">
          <span className="section-tag">Product</span>
          <h2 className="section-title">Built for the Way Groups Actually Order</h2>
          <p className="section-subtitle">
            A purpose-built interface that handles the complexity so your group doesn't have to.
          </p>
        </div>

        <div className="showcase-panels">
          {/* Panel 1 — Dashboard */}
          <div className="showcase-panel anim-reveal">
            <div className="panel-header">
              <span className="panel-dot red" />
              <span className="panel-dot yellow" />
              <span className="panel-dot green" />
              <span className="panel-title-bar">Active Batches</span>
            </div>
            <div className="panel-body">
              <div className="mock-batch-card">
                <div className="mock-batch-name">Lunch — Team Alpha</div>
                <div className="mock-batch-meta">
                  <span>6/8 joined</span>
                  <span>Closes in 12m</span>
                </div>
                <span className="mock-batch-badge">OPEN</span>
              </div>
              <div className="mock-batch-card">
                <div className="mock-batch-name">Friday Pizza Night</div>
                <div className="mock-batch-meta">
                  <span>4/5 joined</span>
                  <span>Closes in 3m</span>
                </div>
                <span className="mock-batch-badge">FILLING</span>
              </div>
              <div className="mock-batch-card">
                <div className="mock-batch-name">Study Group Snacks</div>
                <div className="mock-batch-meta">
                  <span>10/10 joined</span>
                  <span>Ordered</span>
                </div>
                <span className="mock-batch-badge" style={{ background: 'rgba(39,201,63,0.1)', color: '#27c93f' }}>PLACED</span>
              </div>
            </div>
          </div>

          {/* Panel 2 — Menu */}
          <div className="showcase-panel anim-reveal">
            <div className="panel-header">
              <span className="panel-dot red" />
              <span className="panel-dot yellow" />
              <span className="panel-dot green" />
              <span className="panel-title-bar">Menu — Sweetgreen</span>
            </div>
            <div className="panel-body">
              <div className="mock-menu-item">
                <div className="mock-menu-thumb" />
                <div className="mock-menu-info">
                  <div className="mock-menu-title">Harvest Bowl</div>
                  <div className="mock-menu-sub">Quinoa, chicken, sweet potato</div>
                  <div className="mock-menu-price">$13.95</div>
                </div>
              </div>
              <div className="mock-menu-item">
                <div className="mock-menu-thumb" style={{ background: 'linear-gradient(135deg, #d2c4bd, #dcc1b8)' }} />
                <div className="mock-menu-info">
                  <div className="mock-menu-title">Kale Caesar</div>
                  <div className="mock-menu-sub">Romaine, parmesan, croutons</div>
                  <div className="mock-menu-price">$11.50</div>
                </div>
              </div>
              <div className="mock-menu-item">
                <div className="mock-menu-thumb" style={{ background: 'linear-gradient(135deg, #efdfd9, #e3e2e0)' }} />
                <div className="mock-menu-info">
                  <div className="mock-menu-title">Guacamole Greens</div>
                  <div className="mock-menu-sub">Avocado, lime, cilantro</div>
                  <div className="mock-menu-price">$12.75</div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 3 — Shared Cart */}
          <div className="showcase-panel anim-reveal">
            <div className="panel-header">
              <span className="panel-dot red" />
              <span className="panel-dot yellow" />
              <span className="panel-dot green" />
              <span className="panel-title-bar">Shared Cart</span>
            </div>
            <div className="panel-body">
              <div className="panel-mock-row">
                <span><span className="mock-item-avatar">AJ</span> <span className="mock-item-name">Harvest Bowl</span></span>
                <span className="mock-item-price">$13.95</span>
              </div>
              <div className="panel-mock-row">
                <span><span className="mock-item-avatar">RK</span> <span className="mock-item-name">Kale Caesar</span></span>
                <span className="mock-item-price">$11.50</span>
              </div>
              <div className="panel-mock-row">
                <span><span className="mock-item-avatar">SM</span> <span className="mock-item-name">Pad Thai</span></span>
                <span className="mock-item-price">$14.25</span>
              </div>
              <div className="panel-mock-row" style={{ borderBottom: 'none', paddingTop: '1rem', fontWeight: 600 }}>
                <span className="mock-item-name">Total (3 items)</span>
                <span className="mock-item-price">$39.70</span>
              </div>
              <div className="panel-mock-row" style={{ borderBottom: 'none', color: '#27c93f', fontSize: '0.82rem' }}>
                <span>Delivery fee (split 3 ways)</span>
                <span style={{ fontWeight: 600 }}>$1.30 each</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ METRICS ═══ */}
      <section id="metrics" className="metrics-section">
        <div className="metrics-header anim-reveal">
          <span className="section-tag">Impact</span>
          <h2 className="section-title">Numbers That Speak for Themselves</h2>
        </div>

        <div className="metrics-grid">
          {METRICS.map((m, i) => (
            <div key={i} className="metric-item anim-reveal">
              <div className="metric-value" data-target={m.value}>{m.value}</div>
              <div className="metric-label">{m.label}</div>
              <p className="metric-desc">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="final-cta-section">
        <div className="final-cta-content anim-reveal">
          <Sparkles size={32} style={{ color: '#b89562', marginBottom: '1.5rem' }} />
          <h2 className="final-cta-headline">Ready to Order Smarter?</h2>
          <p className="final-cta-sub">
            Join thousands of groups already saving time and money with Zenvy.
            Experience the future of collaborative dining.
          </p>
          <button className="btn-cta-final" onClick={() => navigate('/login')}>
            Get Started Free <ArrowRight size={20} />
          </button>
          <p className="final-cta-note">No credit card required · Secure group ordering</p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="zen-footer">
        <div className="footer-top">
          <div className="footer-brand-block">
            <div className="footer-brand-name">Zenvy.</div>
            <p className="footer-brand-desc">
              Premium collaborative dining — crafted for the modern epicurean. Order together, save together.
            </p>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Company</div>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Product</div>
            <a href="#">Features</a>
            <a href="#">Enterprise</a>
            <a href="#">Security</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Support</div>
            <a href="#">Help Center</a>
            <a href="#">Safety</a>
            <a href="#">Status</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Social</div>
            <a href="#">Instagram</a>
            <a href="#">Twitter</a>
            <a href="#">LinkedIn</a>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 Zenvy. Crafted for the Modern Epicurean. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
