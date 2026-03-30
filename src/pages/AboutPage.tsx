
export default function AboutPage() {
  return (
    <div className="fade-in" style={{ paddingBottom: '6rem' }}>
      {/* Hero Section for About */}
      <div style={{ 
        position: 'relative', 
        height: '500px', 
        width: '100vw', 
        marginLeft: 'calc(-50vw + 50%)', 
        marginBottom: '6rem',
        overflow: 'hidden'
      }}>
        <img 
          src="https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop" 
          alt="Premium Fine Dining Interior" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(to top, rgba(44, 36, 32, 0.95), rgba(44, 36, 32, 0.4))',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '6rem 4rem'
        }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '5rem', color: '#f0ede6', margin: '0 0 1rem 0', maxWidth: '1200px', marginInline: 'auto', width: '100%' }}>
            Our Story.
          </h1>
          <p style={{ color: 'rgba(240, 237, 230, 0.8)', fontSize: '1.4rem', maxWidth: '1200px', marginInline: 'auto', width: '100%', fontWeight: 300 }}>
            Redefining the boundaries of culinary delivery through collective coordination.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}>
        <p style={{ color: '#2c2420', fontSize: '1.6rem', lineHeight: 1.8, marginBottom: '5rem', fontWeight: 500, fontFamily: 'Playfair Display, serif', textAlign: 'center' }}>
          Zenvy elevates the everyday food delivery experience into a collaborative, sophisticated ritual. We bridge the gap between world-class kitchens and your community.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '6rem', marginBottom: '6rem' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', color: '#c96442', marginBottom: '1.5rem', letterSpacing: '0.15em', fontWeight: 700, textTransform: 'uppercase' }}>The Mission</h3>
            <p style={{ color: '#6a5d55', fontSize: '1.1rem', lineHeight: 1.8 }}>
              We empower individuals to coordinate collective food deliveries from premium restaurants, maximizing delivery efficiency, unlocking wholesale pricing, and creating community through shared experiences. It's about taking the solitude out of takeout.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', color: '#c96442', marginBottom: '1.5rem', letterSpacing: '0.15em', fontWeight: 700, textTransform: 'uppercase' }}>The Vision</h3>
            <p style={{ color: '#6a5d55', fontSize: '1.1rem', lineHeight: 1.8 }}>
              By merging intelligent routing with human coordination, we're building the future of sustainable, premium food delivery. Join us in reshaping the city grid, bringing high-end gastronomy into collaborative spaces everywhere.
            </p>
          </div>
        </div>

        <div style={{ 
          background: '#ffffff', 
          borderRadius: '16px', 
          padding: '5rem 4rem', 
          border: '1px solid rgba(44,36,32,0.06)', 
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.03)'
        }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: '#2c2420', marginBottom: '2rem' }}>
            Sustainability through Coordination
          </h2>
          <p style={{ color: '#8a7d76', fontSize: '1.2rem', lineHeight: 1.8, maxWidth: '700px', margin: '0 auto' }}>
            Every batch order placed through Zenvy reduces carbon emissions by up to 60% compared to individual deliveries. We believe that fine dining shouldn't cost the earth.
          </p>
        </div>
      </div>
    </div>
  );
}
