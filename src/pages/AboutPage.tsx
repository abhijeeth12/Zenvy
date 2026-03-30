import lifestyleImg from '../assets/lifestyle_dining.png';

export default function AboutPage() {
  return (
    <div className="fade-in" style={{ paddingBottom: '6rem' }}>
      {/* Hero Section for About */}
      <div style={{ 
        position: 'relative', 
        height: '400px', 
        width: '100vw', 
        marginLeft: 'calc(-50vw + 50%)', 
        marginBottom: '4rem',
        overflow: 'hidden'
      }}>
        <img 
          src={lifestyleImg} 
          alt="Collective Dining Lifestyle" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(to top, rgba(44, 36, 32, 0.8), transparent)',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '4rem'
        }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '4rem', color: '#fff', margin: 0 }}>
            Our Story
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
        <p style={{ color: '#2c2420', fontSize: '1.4rem', lineHeight: 1.6, marginBottom: '3rem', fontWeight: 500, fontFamily: 'Playfair Display, serif' }}>
          Zenvy elevates the everyday food delivery experience into a collaborative, sophisticated ritual. 
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#c96442', marginBottom: '1rem', letterSpacing: '0.1em', fontWeight: 700 }}>THE MISSION</h3>
            <p style={{ color: '#6a5d55', fontSize: '1.05rem', lineHeight: 1.7 }}>
              We empower individuals to coordinate collective food deliveries from premium restaurants, maximizing delivery efficiency, unlocking wholesale pricing, and creating community through shared experiences.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#c96442', marginBottom: '1rem', letterSpacing: '0.1em', fontWeight: 700 }}>THE VISION</h3>
            <p style={{ color: '#6a5d55', fontSize: '1.05rem', lineHeight: 1.7 }}>
              By merging intelligent routing with human coordination, we're building the future of sustainable, premium food delivery. Join us in reshaping the city grid.
            </p>
          </div>
        </div>

        <div style={{ background: '#f9f8f6', borderRadius: '12px', padding: '4rem', border: '1px solid rgba(44,36,32,0.05)', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: '#2c2420', marginBottom: '1.5rem' }}>
            Sustainability through Coordination
          </h2>
          <p style={{ color: '#6a5d55', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto' }}>
            Every batch order placed through Zenvy reduces carbon emissions by up to 60% compared to individual deliveries. We believe that fine dining shouldn't cost the earth.
          </p>
        </div>
      </div>
    </div>
  );
}
