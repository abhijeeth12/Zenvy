
export default function CareersPage() {
  const jobs = [
    { title: 'Senior Backend Engineer', location: 'Remote', type: 'Full Time', dept: 'Engineering' },
    { title: 'Frontend Architect', location: 'New York / Remote', type: 'Full Time', dept: 'Engineering' },
    { title: 'Culinary Operations Lead', location: 'Los Angeles', type: 'Full Time', dept: 'Operations' },
    { title: 'Restaurant Partnerships Manager', location: 'Chicago', type: 'Full Time', dept: 'Sales' }
  ];

  return (
    <div className="fade-in" style={{ paddingBottom: '6rem' }}>
      
      {/* Hero Section */}
      <div style={{ 
        position: 'relative', 
        height: '400px', 
        width: '100vw', 
        marginLeft: 'calc(-50vw + 50%)', 
        marginBottom: '5rem',
        overflow: 'hidden'
      }}>
        <img 
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop" 
          alt="Professional Hospitality Environment" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(to right, rgba(44, 36, 32, 0.9) 0%, rgba(44, 36, 32, 0.4) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 4rem'
        }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '4.5rem', color: '#f0ede6', margin: '0 0 1rem 0', maxWidth: '1200px', width: '100%', marginInline: 'auto' }}>
            Careers at Zenvy.
          </h1>
          <p style={{ color: 'rgba(240, 237, 230, 0.85)', fontSize: '1.3rem', maxWidth: '1200px', width: '100%', marginInline: 'auto', fontWeight: 300 }}>
            Help us build the most intelligent delivery cohort network in the world.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: '#2c2420', marginBottom: '1rem' }}>Open Positions</h2>
          <p style={{ color: '#8a7d76', fontSize: '1.1rem' }}>We are always looking for exceptional talent to join our table.</p>
        </div>
        
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {jobs.map(job => (
            <div 
              key={job.title} 
              style={{ 
                padding: '2.5rem', 
                background: '#ffffff', 
                border: '1px solid rgba(44,36,32,0.08)', 
                borderRadius: '16px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                transition: 'transform 0.2s, boxShadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)';
              }}
            >
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', color: '#c96442', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  {job.dept}
                </div>
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#2c2420', fontWeight: 600, fontFamily: 'Playfair Display, serif' }}>
                  {job.title}
                </h3>
                <p style={{ margin: '0.75rem 0 0 0', color: '#8a7d76', fontSize: '0.95rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span>{job.location}</span>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#d7d2cb' }} />
                  <span>{job.type}</span>
                </p>
              </div>
              <button style={{ 
                background: 'transparent', 
                color: '#2c2420', 
                border: '1px solid #2c2420', 
                padding: '0.8rem 2rem', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#2c2420'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2c2420'; }}
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
