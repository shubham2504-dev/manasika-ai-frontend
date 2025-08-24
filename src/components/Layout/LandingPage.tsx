import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: '📊',
      title: 'Mood Tracking',
      description: 'Monitor your daily emotional patterns with our intuitive mood scale'
    },
    {
      icon: '🤖',
      title: 'AI Coach',
      description: 'Get personalized mental wellness guidance from our compassionate AI companion'
    },
    {
      icon: '📈',
      title: 'Progress Insights',
      description: 'Visualize your wellness journey with beautiful charts and analytics'
    },
    {
      icon: '🔒',
      title: 'Privacy First',
      description: 'Your data stays private and secure - stored locally on your device'
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Access your mental wellness tools anywhere, anytime'
    },
    {
      icon: '💚',
      title: 'Evidence-Based',
      description: 'Built on proven mental health practices and cognitive behavioral techniques'
    }
  ];

  return (
    <div className="landing-page">
      <div className="landing-container">
        <header className="landing-header">
          <h1 className="landing-title">🧠 Manasika.AI</h1>
          <p className="landing-tagline">Your AI-Powered Mental Wellness Companion</p>
          <p className="landing-description">
            Take control of your mental wellness journey with personalized AI coaching, 
            mood tracking, and insights designed to support your emotional wellbeing.
          </p>
        </header>

        <section className="features-section">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Begin Your Wellness Journey?</h2>
            <p>Join thousands of users who are taking charge of their mental health</p>
            <button 
              className="get-started-btn"
              onClick={onGetStarted}
            >
              Get Started - It's Free! 🚀
            </button>
          </div>
        </section>

        <section className="benefits-section">
          <div className="benefits-content">
            <h3>Why Choose Manasika.AI?</h3>
            <div className="benefits-grid">
              <div className="benefit-item">
                <strong>✅ Completely Free</strong>
                <p>No subscriptions, no hidden fees</p>
              </div>
              <div className="benefit-item">
                <strong>✅ Private & Secure</strong>
                <p>Your data never leaves your device</p>
              </div>
              <div className="benefit-item">
                <strong>✅ Available 24/7</strong>
                <p>Support whenever you need it</p>
              </div>
              <div className="benefit-item">
                <strong>✅ No Registration</strong>
                <p>Start using immediately</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="landing-footer">
          <p>
            <strong>Disclaimer:</strong> Manasika.AI is a supportive wellness tool and not a replacement 
            for professional mental health care. If you're experiencing a mental health crisis, 
            please contact a healthcare professional or crisis helpline immediately.
          </p>
          <div className="crisis-resources">
            <strong>Crisis Resources:</strong>
            <span>US: 988 | UK: 116 123 | India: 9152987821</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
