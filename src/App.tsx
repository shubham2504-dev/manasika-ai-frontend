import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MoodProvider } from './contexts/MoodContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Header from './components/Layout/Header';
import NavMenu from './components/Layout/NavMenu';
import Dashboard from './components/Dashboard/Dashboard';
import MoodTracker from './components/MoodTracker/MoodTracker';
import ChatWindow from './components/Chat/ChatWindow';
import Profile from './components/Profile/Profile';
import LandingPage from './components/Layout/LandingPage';
import NotificationContainer from './components/Common/NotificationContainer';

const App: React.FC = () => {
  const [isAppStarted, setIsAppStarted] = React.useState(false);

  const handleGetStarted = () => {
    setIsAppStarted(true);
  };

  if (!isAppStarted) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <MoodProvider>
      <NotificationProvider>
        <Router>
          <div className="app-container">
            <Header />
            <div className="main-layout">
              <NavMenu />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/mood-tracker" element={<MoodTracker />} />
                  <Route path="/chat" element={<ChatWindow />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>
            </div>
            <NotificationContainer />
          </div>
        </Router>
      </NotificationProvider>
    </MoodProvider>
  );
};

export default App;
