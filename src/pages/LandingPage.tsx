import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Utensils, Users, TrendingDown } from 'lucide-react';
import './LandingPage.css';

// All images sourced from Unsplash (no local assets)
const IMG_HERO    = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2000&auto=format&fit=crop';
const IMG_BOWL    = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop';
const IMG_SUSHI   = 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1000&auto=format&fit=crop';
const IMG_STEAK   = 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1000&auto=format&fit=crop';
const IMG_LIFESTYLE = 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=1000&auto=format&fit=crop';
const IMG_PASTA   = 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1000&auto=format&fit=crop';

function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Trigger scroll-reveal animations
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.15 });

    const hiddenElements = document.querySelectorAll('.scroll-reveal');
    hiddenElements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return (
    <div className="layout">
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
      <section 
        id="home" 
        className="parallax-hero" 
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${IMG_HERO})` }}
      >
        <div className="hero-content fade-in">
          <h1 className="hero-script">gather, order, savour</h1>
          <h2 className="hero-title">The Fine Art of Collective Dining</h2>
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
            <img src={IMG_LIFESTYLE} alt="Collaborative Dining" className="about-image" />
          </div>
        </div>
      </section>

      {/* Reimagined Overview Section — Blended with Brand Aesthetic */}
      <section 
        id="overview" 
        className="section-overview"
        style={{ backgroundImage: `linear-gradient(rgba(253, 251, 248, 0.96), rgba(253, 251, 248, 0.96)), url(${IMG_PASTA})` }}
      >
        <div className="overview-header scroll-reveal">
          <span className="overview-tag">Network Impact</span>
          <h2 className="overview-title">Quantifying the Art of <br/>Collective Dining</h2>
        </div>
        
        <div className="overview-grid">
          <div className="insight-item scroll-reveal" style={{ transitionDelay: '0.1s' }}>
            <div className="insight-label">Collective Savings</div>
            <div className="insight-value">$2.4M+</div>
            <p className="insight-sub">Total logistical dividends returned to our global community of food connoisseurs.</p>
            <div className="viz-dots">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`dot-viz ${i < 4 ? 'dot-viz-active' : ''}`} />
              ))}
            </div>
          </div>
          
          <div className="insight-item scroll-reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="insight-label">Active Formations</div>
            <div className="insight-value">1,402</div>
            <p className="insight-sub">Batches currently synchronized across premium urban kitchens worldwide.</p>
            <div className="viz-dots">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`dot-viz ${i < 3 ? 'dot-viz-active' : ''}`} />
              ))}
            </div>
          </div>

          <div className="insight-item scroll-reveal" style={{ transitionDelay: '0.3s' }}>
            <div className="insight-label">Wait Efficiency</div>
            <div className="insight-value">24%</div>
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
              <img src={IMG_BOWL} alt="Artisan Salad" />
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
              <img src={IMG_SUSHI} alt="Matsuhisa Omakase" />
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
              <img src={IMG_STEAK} alt="Cut by Wolfgang" />
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
