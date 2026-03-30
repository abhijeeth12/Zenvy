export default function BlogPage() {
  const posts = [
    { 
      title: 'The Economics of Cohort Delivery', 
      date: 'March 20, 2026',
      category: 'Operations',
      image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=1000&auto=format&fit=crop',
      excerpt: 'How batching orders fundamentally rewires the logistics of urban food transportation, significantly reducing carbon output and lowering prices for the consumer.'
    },
    { 
      title: 'Partnership: Matsuhisa Omakase', 
      date: 'March 15, 2026',
      category: 'Announcements',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop',
      excerpt: 'We are thrilled to welcome the legendary Matsuhisa to our premium restaurant cohort. Learn about their exclusive omakase batch offerings.'
    },
    { 
      title: 'Optimizing Route Intelligence', 
      date: 'March 02, 2026',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1512485800893-b08ec1ea59b1?q=80&w=1000&auto=format&fit=crop',
      excerpt: 'A deep dive into the Zenvy routing algorithm and how we synchronize multi-restaurant kitchen prep times to guarantee perfectly timed deliveries.'
    },
    { 
      title: 'The Ritual of Shared Dining', 
      date: 'February 18, 2026',
      category: 'Culture',
      image: 'https://images.unsplash.com/photo-1414235077428-33898ed1e81b?q=80&w=1000&auto=format&fit=crop',
      excerpt: 'Exploring the psychological benefits of eating together. How our digital platform is fostering real-world community and returning food to its social roots.'
    }
  ];

  return (
    <div className="fade-in" style={{ paddingBottom: '6rem' }}>
      
      {/* Editorial Header */}
      <div style={{ textAlign: 'center', padding: '6rem 2rem 4rem', background: '#f9f8f6' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '4rem', color: '#2c2420', margin: '0 0 1rem 0' }}>
          Zenvy Journal.
        </h1>
        <p style={{ color: '#8a7d76', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Insights, culinary highlights, and platform updates.
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem' }}>
          {posts.map(post => (
            <div 
              key={post.title} 
              style={{ 
                cursor: 'pointer',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#fff',
                boxShadow: '0 4px 25px rgba(0,0,0,0.03)',
                transition: 'transform 0.3s ease, boxShadow 0.3s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 25px rgba(0,0,0,0.03)';
              }}
            >
              <div style={{ height: '300px', overflow: 'hidden' }}>
                <img 
                  src={post.image} 
                  alt={post.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
              <div style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', color: '#c96442', textTransform: 'uppercase' }}>{post.category}</span>
                  <span style={{ fontSize: '0.85rem', color: '#a39b95' }}>{post.date}</span>
                </div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.8rem', color: '#2c2420', fontWeight: 600, fontFamily: 'Playfair Display, serif', lineHeight: 1.3 }}>
                  {post.title}
                </h3>
                <p style={{ margin: 0, color: '#6a5d55', fontSize: '1.05rem', lineHeight: 1.7 }}>
                  {post.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
