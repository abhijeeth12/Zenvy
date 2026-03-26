import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Utensils, Users, TrendingDown, Clock } from 'lucide-react';
import './LandingPage.css';

// Using the copied assets locally
import heroBg from '../assets/hero_bg.png';
import imgBowl from '../assets/bowl.png';
import imgSushi from '../assets/sushi.png';
import imgSteak from '../assets/steak.png';

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
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${heroBg})` }}
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
            <img src={imgSteak} alt="Premium Steak" className="about-image" />
          </div>
        </div>
      </section>

      {/* Dashboard & Overview Section with Dark Parallax Break */}
      <section 
        id="overview" 
        className="parallax-divider"
        style={{ backgroundImage: `linear-gradient(rgba(17,24,39,0.9), rgba(17,24,39,0.9)), url(${imgBowl})` }}
      >
        <div className="dashboard-container scroll-reveal">
          <div className="dashboard-header">
            <h2 className="section-heading light-heading">PLATFORM OVERVIEW</h2>
            <p className="light-subheading">Real-time collaborative analytics at your fingertips.</p>
          </div>
          
          <div className="dashboard-grid">
            <div className="dash-card">
              <h4 className="dash-title">Total Platform Savings</h4>
              <div className="dash-metric text-emerald">$2.4M</div>
              <div className="dash-chart">
                {/* CSS Mock Chart */}
                <div className="bar" style={{height: '40%'}}></div>
                <div className="bar" style={{height: '60%'}}></div>
                <div className="bar" style={{height: '50%'}}></div>
                <div className="bar" style={{height: '80%'}}></div>
                <div className="bar active-bar" style={{height: '100%'}}></div>
              </div>
            </div>
            
            <div className="dash-card">
              <h4 className="dash-title">Active Live Batches</h4>
              <div className="dash-metric">1,402</div>
              <div className="batch-pulse-container">
                <div className="pulse-ring"></div>
                <div className="pulse-ring delay"></div>
                <MapPinIcon />
              </div>
            </div>

            <div className="dash-card">
              <h4 className="dash-title">Avg. Wait Time Reduction</h4>
              <div className="dash-metric">24%</div>
              <div className="progress-track">
                <div className="progress-fill" style={{width: '76%'}}></div>
              </div>
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
              <img src={imgBowl} alt="Sweetgreen" />
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
              <img src={imgSushi} alt="Sushi Roku" />
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

const MapPinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-pin">
    <line x1="12" y1="17" x2="12" y2="22"></line>
    <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.68V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3v4.68a2 2 0 0 1-1.11 1.87l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
  </svg>
)

export default LandingPage;
