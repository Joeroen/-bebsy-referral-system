import React, { useState } from 'react';

// Landing Page Component
function LandingPage({ onLogin }) {
  const [email, setEmail] = useState('');

  return (
    <div style={{fontFamily: 'Arial, sans-serif', lineHeight: '1.6', background: '#fff'}}>
      {/* Navigation - Exact zoals Bebsy */}
      <nav style={{
        background: 'white',
        padding: '15px 0',
        boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '1px solid #f1f1f1'
      }}>
        <div style={{maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <img 
              src="/bebsy-logo.png" 
              alt="Bebsy Logo" 
              style={{
                height: '45px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '40px'}}>
            <a href="#features" style={{textDecoration: 'none', color: '#4a5568', fontSize: '16px', fontWeight: '500'}}>Over Delen</a>
            <a href="#how-it-works" style={{textDecoration: 'none', color: '#4a5568', fontSize: '16px', fontWeight: '500'}}>Hoe het werkt</a>
            <a href="#rewards" style={{textDecoration: 'none', color: '#4a5568', fontSize: '16px', fontWeight: '500'}}>Voordelen</a>
            <button 
              style={{
                background: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={onLogin}
              onMouseOver={(e) => e.target.style.background = '#7c3aed'}
              onMouseOut={(e) => e.target.style.background = '#8b5cf6'}
            >
              Mijn Code Ophalen
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Zoals Bebsy met grote foto */}
      <section style={{
        height: '70vh',
        background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div style={{
          background: '#8b5cf6',
          borderRadius: '20px',
          padding: '50px 60px',
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 20px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.2)'
        }}>
          <h1 style={{
            fontSize: '42px', 
            marginBottom: '25px', 
            fontWeight: '700',
            color: 'white',
            lineHeight: '1.2'
          }}>
            Deel jouw mooie Bebsy ervaring
          </h1>
          <p style={{
            fontSize: '20px', 
            marginBottom: '40px', 
            color: 'rgba(255,255,255,0.95)',
            lineHeight: '1.5',
            maxWidth: '600px',
            margin: '0 auto 40px'
          }}>
            Help jouw vrienden en familie ook van zo'n prachtige reis te genieten. Jullie profiteren allebei van mooie kortingen!
          </p>
          <div style={{display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap'}}>
            <button 
              style={{
                background: 'white',
                color: '#8b5cf6',
                border: 'none',
                borderRadius: '30px',
                padding: '18px 35px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }}
              onClick={onLogin}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 35px rgba(0,0,0,0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
            >
              Krijg mijn persoonlijke code
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section - Clean zoals Bebsy */}
      <section style={{background: '#f8fafc', padding: '80px 40px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '60px'}}>
            <h2 style={{fontSize: '32px', color: '#1a202c', marginBottom: '20px', fontWeight: '700'}}>
              Samen delen, samen besparen
            </h2>
            <p style={{fontSize: '18px', color: '#718096', maxWidth: '600px', margin: '0 auto'}}>
              Onze klanten hebben al veel vrienden geholpen van mooie reizen te genieten
            </p>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '50px'}}>
            {[
              { number: '1,847', label: 'Tevreden reizigers geholpen', icon: '✈️' },
              { number: '€380', label: 'Gemiddelde korting per persoon', icon: '💰' },
              { number: '4.9★', label: 'Waardering van onze service', icon: '⭐' },
              { number: '89%', label: 'Boekt opnieuw bij Bebsy', icon: '🎯' }
            ].map((stat, index) => (
              <div key={index} style={{textAlign: 'center'}}>
                <div style={{fontSize: '40px', marginBottom: '15px'}}>{stat.icon}</div>
                <div style={{fontSize: '32px', fontWeight: '700', color: '#8b5cf6', marginBottom: '8px'}}>
                  {stat.number}
                </div>
                <div style={{fontSize: '15px', color: '#4a5568', lineHeight: '1.4'}}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Kaarten zoals Bebsy */}
      <section style={{padding: '100px 40px', background: 'white'}}>
        <div style={{maxWidth: '1400px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '80px'}}>
            <h2 style={{fontSize: '36px', color: '#1a202c', marginBottom: '25px', fontWeight: '700'}}>
              Waarom je vrienden jou dankbaar zullen zijn
            </h2>
            <p style={{fontSize: '18px', color: '#718096', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6'}}>
              Jij weet al hoe fijn het is om met Bebsy te reizen. Deel die ervaring en help anderen ook van zulke mooie momenten te genieten.
            </p>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px'}}>
            {[
              {
                image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                title: 'Deel je reisherinneringen',
                description: 'Vertel over jouw geweldige stedentrip naar Rome, Barcelona of Parijs. Jouw verhalen inspireren anderen.',
                tag: 'Stedentrips',
                color: '#8b5cf6'
              },
              {
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                title: 'Ontdek samen nieuwe plekken',
                description: 'Van romantische rondreis door Toscane tot avontuurlijke fly & drive in IJsland - er is voor ieder wat wils.',
                tag: 'Rondreis',
                color: '#059669'
              },
              {
                image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                title: 'Ervaar Bebsy kwaliteit',
                description: 'Jouw vrienden krijgen dezelfde zorgvuldige begeleiding en persoonlijke service waar jij zo tevreden over bent.',
                tag: 'Kwaliteit',
                color: '#dc2626'
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.12)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.08)';
                }}
              >
                <div style={{position: 'relative', height: '250px', overflow: 'hidden'}}>
                  <img 
                    src={feature.image}
                    alt={feature.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    background: feature.color,
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '15px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {feature.tag}
                  </div>
                </div>
                <div style={{padding: '30px'}}>
                  <h3 style={{fontSize: '22px', color: '#1a202c', marginBottom: '15px', fontWeight: '600'}}>
                    {feature.title}
                  </h3>
                  <p style={{color: '#4a5568', lineHeight: '1.6', fontSize: '16px'}}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Met icoontjes zoals Bebsy */}
      <section style={{background: '#f8fafc', padding: '100px 40px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
          <h2 style={{fontSize: '36px', color: '#1a202c', marginBottom: '25px', fontWeight: '700'}}>
            Zo eenvoudig deel je jouw ervaring
          </h2>
          <p style={{fontSize: '18px', color: '#718096', marginBottom: '80px', maxWidth: '600px', margin: '0 auto 80px'}}>
            In drie simpele stappen help je jouw vrienden van een prachtige reis te genieten
          </p>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px'}}>
            {[
              {
                step: '01',
                title: 'Log in met je gegevens',
                description: 'Gebruik je bekende Bebsy inloggegevens om jouw persoonlijke deelcode op te halen',
                icon: '🔐',
                color: '#8b5cf6'
              },
              {
                step: '02', 
                title: 'Deel met wie je wilt',
                description: 'Stuur jouw code via WhatsApp, mail of vertel het gewoon tijdens de koffie',
                icon: '💬',
                color: '#059669'
              },
              {
                step: '03',
                title: 'Jullie beiden profiteren',
                description: 'Zij krijgen korting op hun eerste reis, jij spaart punten voor je volgende avontuur',
                icon: '🎁',
                color: '#dc2626'
              }
            ].map((step, index) => (
              <div key={index}>
                <div style={{
                  background: step.color,
                  color: 'white',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: '700',
                  margin: '0 auto 30px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
                }}>
                  {step.step}
                </div>
                <div style={{fontSize: '50px', marginBottom: '25px'}}>{step.icon}</div>
                <h3 style={{color: '#1a202c', marginBottom: '20px', fontSize: '22px', fontWeight: '600'}}>
                  {step.title}
                </h3>
                <p style={{color: '#4a5568', lineHeight: '1.6', fontSize: '16px'}}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Groot zoals Bebsy */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '100px 40px',
        textAlign: 'center'
      }}>
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <h2 style={{fontSize: '40px', marginBottom: '25px', color: 'white', fontWeight: '700'}}>
            Klaar om jouw vrienden te verrassen?
          </h2>
          <p style={{fontSize: '20px', marginBottom: '50px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.5'}}>
            Log in met je Bebsy gegevens en krijg direct jouw persoonlijke deelcode
          </p>
          <button 
            style={{
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '30px',
              padding: '20px 45px',
              fontSize: '20px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 15px 40px rgba(0,0,0,0.2)'
            }}
            onClick={onLogin}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 20px 50px rgba(0,0,0,0.25)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
            }}
          >
            Haal mijn persoonlijke code op
          </button>
          <p style={{fontSize: '14px', marginTop: '25px', color: 'rgba(255,255,255,0.8)'}}>
            Inloggen met je vertrouwde Bebsy account • Veilig en betrouwbaar
          </p>
        </div>
      </section>

      {/* Footer - Clean zoals Bebsy */}
      <footer style={{background: 'white', padding: '60px 40px 40px', borderTop: '1px solid #e2e8f0'}}>
        <div style={{maxWidth: '1400px', margin: '0 auto'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '30px'}}>
            <div>
              <img 
                src="/bebsy-logo.png" 
                alt="Bebsy Logo" 
                style={{
                  height: '40px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div style={{display: 'flex', gap: '40px', flexWrap: 'wrap'}}>
              <a href="#" style={{color: '#4a5568', textDecoration: 'none', fontSize: '16px'}}>Privacy</a>
              <a href="#" style={{color: '#4a5568', textDecoration: 'none', fontSize: '16px'}}>Voorwaarden</a>
              <a href="#" style={{color: '#4a5568', textDecoration: 'none', fontSize: '16px'}}>Klantenservice</a>
              <a href="#" style={{color: '#4a5568', textDecoration: 'none', fontSize: '16px'}}>Contact</a>
            </div>
          </div>
          <div style={{textAlign: 'center', paddingTop: '30px', borderTop: '1px solid #e2e8f0'}}>
            <p style={{color: '#718096', margin: 0, fontSize: '14px'}}>
              © 2025 Bebsy. Deel jouw mooie reiservaringen met vrienden en familie.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Dashboard Components (keeping existing ones)
function Dashboard() {
  return (
    <div style={{padding: '40px', background: '#f8fafc', borderRadius: '16px', margin: '30px 0'}}>
      <h2 style={{color: '#1a202c', marginBottom: '30px', fontSize: '28px', fontWeight: '700'}}>📊 Jouw Deel Dashboard</h2>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px'}}>
        <div style={{background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
          <h3 style={{color: '#8b5cf6', margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600'}}>Vrienden Geholpen</h3>
          <p style={{fontSize: '32px', fontWeight: '700', margin: 0, color: '#1a202c'}}>12</p>
        </div>
        <div style={{background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
          <h3 style={{color: '#059669', margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600'}}>Jouw Besparingen</h3>
          <p style={{fontSize: '32px', fontWeight: '700', margin: 0, color: '#1a202c'}}>€340</p>
        </div>
        <div style={{background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
          <h3 style={{color: '#dc2626', margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600'}}>Jouw Persoonlijke Code</h3>
          <p style={{fontSize: '24px', fontWeight: '700', margin: 0, color: '#1a202c'}}>MARIA2025</p>
        </div>
      </div>
    </div>
  );
}

function Customers() {
  const friends = [
    { id: 1, name: 'Anke van der Berg', email: 'anke@email.nl', reis: 'Rome Stedentrip', status: 'Geboekt', datum: '15 maart 2025' },
    { id: 2, name: 'Els Jansen', email: 'els@email.nl', reis: 'Toscane Rondreis', status: 'Interesse', datum: '- ' },
    { id: 3, name: 'Marianne de Wit', email: 'marianne@email.nl', reis: 'Parijs Weekend', status: 'Geboekt', datum: '28 april 2025' }
  ];

  return (
    <div style={{padding: '40px'}}>
      <h2 style={{color: '#1a202c', marginBottom: '30px', fontSize: '28px', fontWeight: '700'}}>👥 Vrienden die je hebt geholpen</h2>
      <div style={{background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead style={{background: '#f8fafc'}}>
            <tr>
              <th style={{padding: '20px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '16px', fontWeight: '600', color: '#1a202c'}}>Naam</th>
              <th style={{padding: '20px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '16px', fontWeight: '600', color: '#1a202c'}}>Reis</th>
              <th style={{padding: '20px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '16px', fontWeight: '600', color: '#1a202c'}}>Status</th>
              <th style={{padding: '20px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '16px', fontWeight: '600', color: '#1a202c'}}>Vertrekdatum</th>
            </tr>
          </thead>
          <tbody>
            {friends.map(friend => (
              <tr key={friend.id}>
                <td style={{padding: '20px', borderBottom: '1px solid #f1f5f9', fontSize: '16px', color: '#1a202c'}}>{friend.name}</td>
                <td style={{padding: '20px', borderBottom: '1px solid #f1f5f9', fontSize: '16px', color: '#4a5568'}}>{friend.reis}</td>
                <td style={{padding: '20px', borderBottom: '1px solid #f1f5f9'}}>
                  <span style={{
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    background: friend.status === 'Geboekt' ? '#dcfce7' : '#fef3c7',
                    color: friend.status === 'Geboekt' ? '#166534' : '#92400e'
                  }}>
                    {friend.status}
                  </span>
                </td>
                <td style={{padding: '20px', borderBottom: '1px solid #f1f5f9', fontSize: '16px', color: '#4a5568'}}>{friend.datum}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Rewards() {
  return (
    <div style={{padding: '40px'}}>
      <h2 style={{color: '#1a202c', marginBottom: '30px', fontSize: '28px', fontWeight: '700'}}>🎁 Jouw Beloningen</h2>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px'}}>
        <div style={{background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
          <div style={{fontSize: '40px', marginBottom: '20px'}}>🏆</div>
          <h3 style={{color: '#8b5cf6', fontSize: '20px', fontWeight: '600', marginBottom: '15px'}}>€150 Reisvoucher</h3>
          <p style={{color: '#4a5568', marginBottom: '15px', lineHeight: '1.6'}}>Voor het helpen van 5 vrienden. Te gebruiken voor je volgende Bebsy reis.</p>
          <p style={{color: '#059669', fontSize: '14px', fontWeight: '600'}}>✓ Behaald! Gebruikt op Griekenland reis</p>
        </div>
        <div style={{background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
          <div style={{fontSize: '40px', marginBottom: '20px'}}>🌟</div>
          <h3 style={{color: '#dc2626', fontSize: '20px', fontWeight: '600', marginBottom: '15px'}}>VIP Service Upgrade</h3>
          <p style={{color: '#4a5568', marginBottom: '15px', lineHeight: '1.6'}}>Exclusieve VIP behandeling voor het helpen van 10 vrienden.</p>
          <p style={{color: '#8b5cf6', fontSize: '14px', fontWeight: '600'}}>Nog 3 vrienden te gaan!</p>
        </div>
        <div style={{background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
          <div style={{fontSize: '40px', marginBottom: '20px'}}>✈️</div>
          <h3 style={{color: '#059669', fontSize: '20px', fontWeight: '600', marginBottom: '15px'}}>Gratis Bonus Excursie</h3>
          <p style={{color: '#4a5568', marginBottom: '15px', lineHeight: '1.6'}}>Gratis dagexcursie tijdens je volgende reis voor 15 vrienden.</p>
          <p style={{color: '#718096', fontSize: '14px', fontWeight: '600'}}>Nog 8 vrienden te gaan</p>
        </div>
      </div>
    </div>
  );
}

// Dashboard App Component
function DashboardApp({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navStyle = {
    background: 'white',
    padding: '0',
    margin: '0',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
    borderBottom: '1px solid #e2e8f0'
  };

  const buttonStyle = {
    background: 'none',
    border: 'none',
    color: '#4a5568',
    padding: '20px 30px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  };

  const activeButtonStyle = {
    ...buttonStyle,
    color: '#8b5cf6',
    borderBottom: '3px solid #8b5cf6'
  };

  return (
    <div style={{fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f8fafc'}}>
      {/* Header */}
      <header style={{background: 'white', padding: '40px', textAlign: 'center', boxShadow: '0 2px 20px rgba(0,0,0,0.08)'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px'}}>
          <img 
            src="/bebsy-logo.png" 
            alt="Bebsy Logo" 
            style={{
              height: '50px',
              width: 'auto',
              objectFit: 'contain',
              marginRight: '20px'
            }}
          />
          <h1 style={{margin: 0, fontSize: '32px', fontWeight: '700', color: '#1a202c'}}>Deel Dashboard</h1>
        </div>
        <p style={{margin: 0, color: '#718096', fontSize: '16px'}}>Beheer jouw persoonlijke deelcode en zie wie je hebt geholpen</p>
      </header>

      {/* Navigation */}
      <nav style={navStyle}>
        <div style={{display: 'flex'}}>
          <button 
            style={activeTab === 'dashboard' ? activeButtonStyle : buttonStyle}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Overzicht
          </button>
          <button 
            style={activeTab === 'customers' ? activeButtonStyle : buttonStyle}
            onClick={() => setActiveTab('customers')}
          >
            👥 Mijn Vrienden
          </button>
          <button 
            style={activeTab === 'rewards' ? activeButtonStyle : buttonStyle}
            onClick={() => setActiveTab('rewards')}
          >
            🎁 Beloningen
          </button>
        </div>
        <button 
          style={{
            background: '#dc2626', 
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            padding: '12px 24px',
            margin: '0 20px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onClick={onLogout}
          onMouseOver={(e) => e.target.style.background = '#b91c1c'}
          onMouseOut={(e) => e.target.style.background = '#dc2626'}
        >
          Uitloggen
        </button>
      </nav>

      {/* Main Content */}
      <main style={{maxWidth: '1400px', margin: '0 auto', padding: '40px'}}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'customers' && <Customers />}
        {activeTab === 'rewards' && <Rewards />}
      </main>

      {/* Footer */}
      <footer style={{background: 'white', padding: '40px', marginTop: '60px', borderTop: '1px solid #e2e8f0'}}>
        <div style={{maxWidth: '1400px', margin: '0 auto', textAlign: 'center'}}>
          <img 
            src="/bebsy-logo.png" 
            alt="Bebsy Logo" 
            style={{
              height: '35px',
              width: 'auto',
              objectFit: 'contain',
              marginBottom: '20px'
            }}
          />
          <p style={{color: '#718096', margin: 0, fontSize: '14px'}}>
            © 2025 Bebsy - Deel jouw mooie reiservaringen met vrienden en familie
          </p>
        </div>
      </footer>
    </div>
  );
}

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const handleLogin = () => {
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentPage('landing');
  };

  if (currentPage === 'dashboard') {
    return <DashboardApp onLogout={handleLogout} />;
  }

  return <LandingPage onLogin={handleLogin} />;
}

export default App;
