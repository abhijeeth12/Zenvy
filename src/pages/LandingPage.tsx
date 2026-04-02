import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Utensils, Users, TrendingDown } from 'lucide-react';
import './LandingPage.css';

import { initScroll, destroyScroll } from '../animations/scrollSetup';
import { initLandingAnimations } from '../animations/heroAnimations';

// Using the newly generated premium assets
import heroBg from '../assets/hero_moody.png';
import imgBowl from '../assets/artisan_salad.png';
import imgSushi from '../assets/omakase.png';
import imgSteak from '../assets/steakhouse.png';
import imgLifestyle from '../assets/lifestyle_dining.png';
import imgPasta from '../assets/minimalist_pasta.png';

/* ── Split text into animated word spans ── */
const renderWords = (text: string, cls: string) =>
  text.split(' ').map((word, i, arr) => (
    <span key={i} className={`hero-word ${cls}`}>
      {word}{i < arr.length - 1 ? '\u00A0' : ''}
    </span>
  ));

function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);

  /* ── Smooth scroll init + nav background toggle ── */
  useEffect(() => {
    initScroll();
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      destroyScroll();
    };
  }, []);

  /* ── GSAP animations scoped to root ref ── */
  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const ctx = initLandingAnimations(rootRef.current);
    return () => ctx.revert();
  }, []);

  return (
    <div className="layout" ref={rootRef}>
      {/* Absolute/Fixed Transparent Nav */}
      <nav className={`premium-nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-brand">Zenvy.</div>
        <div className="nav-links">
          <a href="#home">HOME</a>
          <a href="#about">ABOUT US</a>
          <a href="#restaurants">RESTAURANTS</a>
          <a href="#overview">OVERVIEW</a>
        </div>
        <div className="nav-actions">
          <button className="btn-outline-light" onClick={() => navigate('/login')}>SIGN IN</button>
        </div>
      </nav>

      {/* Parallax Hero Section */}
      <section id="home" className="parallax-hero">
        <div className="hero-bg-image" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="hero-overlay" />
        <div className="hero-content fade-in">
          <h1 className="hero-script">{renderWords('gather, order, savour', 'hero-word-script')}</h1>
          <h2 className="hero-title">{renderWords('The Fine Art of Collective Dining', 'hero-word-title')}</h2>
          <p className="hero-subtitle">Experience premium culinary curation, delivered together. <br/>Save on fees, never on quality.</p>
          <button className="btn-hero border-reveal" onClick={() => navigate('/login')}>
            GET STARTED <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Parallax Break - About Us */}
      <section id="about" className="section-about light-theme">
        <div className="about-container">
          <div className="about-text scroll-reveal">
            <h3 className="section-heading">ABOUT US</h3>
            <p className="about-desc">
              Zenvy elevates the everyday food delivery experience into a collaborative, sophisticated ritual. By pooling orders from the same premium kitchens, we orchestrate a seamless logistical chain that drastically reduces delivery costs and environmental impact, while ensuring your food arrives exactly as the chef intended.
            </p>
            <div className="feature-list">
              <div className="feature-item">
                <Users size={24} className="icon-emerald" />
                <span>Synchronized Group Ordering</span>
              </div>
              <div className="feature-item">
                <TrendingDown size={24} className="icon-emerald" />
                <span>Wholesale Delivery Pricing</span>
              </div>
              <div className="feature-item">
                <Utensils size={24} className="icon-emerald" />
                <span>Curated Premium Restaurants</span>
              </div>
            </div>
          </div>
          <div className="about-image-wrapper scroll-reveal shadow-elegant">
            <img src={imgLifestyle} alt="Collaborative Dining" className="about-image" />
          </div>
        </div>
      </section>

      {/* Reimagined Overview Section — Blended with Brand Aesthetic */}
      <section 
        id="overview" 
        className="section-overview"
        style={{ backgroundImage: `linear-gradient(rgba(253, 251, 248, 0.96), rgba(253, 251, 248, 0.96)), url(${imgPasta})` }}
      >
        <div className="overview-header scroll-reveal">
          <span className="overview-tag">Network Impact</span>
          <h2 className="overview-title">Quantifying the Art of <br/>Collective Dining</h2>
        </div>
        
        <div className="overview-grid">
          <div className="insight-item scroll-reveal" style={{ transitionDelay: '0.1s' }}>
            <div className="insight-label">Collective Savings</div>
            <div className="insight-value" data-target="$2.4M+">$2.4M+</div>
            <p className="insight-sub">Total logistical dividends returned to our global community of food connoisseurs.</p>
            <div className="viz-dots">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`dot-viz ${i < 4 ? 'dot-viz-active' : ''}`} />
              ))}
            </div>
          </div>
          
          <div className="insight-item scroll-reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="insight-label">Active Formations</div>
            <div className="insight-value" data-target="1,402">1,402</div>
            <p className="insight-sub">Batches currently synchronized across premium urban kitchens worldwide.</p>
            <div className="viz-dots">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`dot-viz ${i < 3 ? 'dot-viz-active' : ''}`} />
              ))}
            </div>
          </div>

          <div className="insight-item scroll-reveal" style={{ transitionDelay: '0.3s' }}>
            <div className="insight-label">Wait Efficiency</div>
            <div className="insight-value" data-target="24%">24%</div>
            <p className="insight-sub">Average reduction in turnaround time through intelligent collective routing.</p>
            <div className="viz-dots">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`dot-viz ${i < 2 ? 'dot-viz-active' : ''}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Selection Grid */}
      <section id="restaurants" className="section-restaurants light-theme">
        <div className="text-center scroll-reveal">
          <h2 className="section-heading">CURATED SELECTION</h2>
          <p className="section-subtext">Join an active batch from our prestigious partners.</p>
        </div>

        <div className="restaurant-gallery">
          <div className="gallery-card scroll-reveal">
            <div className="gallery-img-wrapper">
              <img src={imgBowl} alt="Artisan Salad" />
              <div className="overlay-batch-status">
                <span className="status-badge">4/8 Joined</span>
              </div>
            </div>
            <div className="gallery-info">
              <h4 className="restaurant-title">Sweetgreen Artisan</h4>
              <p className="restaurant-meta">Healthy • Closing in 12m</p>
              <button className="btn-gallery">VIEW MENU</button>
            </div>
          </div>

          <div className="gallery-card scroll-reveal">
            <div className="gallery-img-wrapper">
              <img src={imgSushi} alt="Matsuhisa Omakase" />
              <div className="overlay-batch-status">
                <span className="status-badge">7/10 Joined</span>
              </div>
            </div>
            <div className="gallery-info">
              <h4 className="restaurant-title">Matsuhisa Omakase</h4>
              <p className="restaurant-meta">Japanese • Closing in 4m</p>
              <button className="btn-gallery">VIEW MENU</button>
            </div>
          </div>

          <div className="gallery-card scroll-reveal">
            <div className="gallery-img-wrapper">
              <img src={imgSteak} alt="Cut by Wolfgang" />
              <div className="overlay-batch-status">
                <span className="status-badge">2/5 Joined</span>
              </div>
            </div>
            <div className="gallery-info">
              <h4 className="restaurant-title">Cut by Wolfgang Puck</h4>
              <p className="restaurant-meta">Steakhouse • Closing in 24m</p>
              <button className="btn-gallery">VIEW MENU</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="elegant-footer">
        <div className="footer-brand">Zenvy.</div>
        <p className="footer-copy">&copy; 2026 Zenvy Premium Collaborative Dining. All rights reserved.</p>
      </footer>
    </div>
  );
}



export default LandingPage;
