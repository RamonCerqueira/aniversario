import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PartyProvider } from './contexts/PartyContext';
import { SuppliersProvider } from './contexts/SuppliersContext';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import PartyDetailsScreen from './components/PartyDetailsScreen';
import GuestsScreen from './components/GuestsScreen';
import SuppliersScreen from './components/SuppliersScreen';
import ConsumptionScreen from './components/ConsumptionScreen';
import GiftListScreen from './components/GiftListScreen';
import CalendarScreen from './components/CalendarScreen';
import ProfileScreen from './components/ProfileScreen';
import './App.css';

function AppContent() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedPartyId, setSelectedPartyId] = useState(null);

  const handleLoginSuccess = () => {
    setCurrentScreen('home');
  };

  const handleCreateParty = () => {
    setSelectedPartyId(null);
    setCurrentScreen('party-details');
  };

  const handleViewParty = (partyId) => {
    setSelectedPartyId(partyId);
    setCurrentScreen('party-details');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setSelectedPartyId(null);
  };

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  const handleLogout = () => {
    logout();
    setCurrentScreen('home');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-custom mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  switch (currentScreen) {
    case 'party-details':
      return (
        <PartyDetailsScreen
          partyId={selectedPartyId}
          onBack={handleBackToHome}
        />
      );
    case 'guests':
      return <GuestsScreen onBack={handleBackToHome} />;
    case 'suppliers':
      return <SuppliersScreen onBack={handleBackToHome} />;
    case 'consumption':
      return <ConsumptionScreen onBack={handleBackToHome} />;
    case 'gift-list':
      return <GiftListScreen onBack={handleBackToHome} />;
    case 'calendar':
      return <CalendarScreen onBack={handleBackToHome} />;
    case 'profile':
      return <ProfileScreen onBack={handleBackToHome} onLogout={handleLogout} />;
    case 'home':
    default:
      return (
        <HomeScreen
          onCreateParty={handleCreateParty}
          onViewParty={handleViewParty}
          onNavigate={handleNavigate}
        />
      );
  }
}

function App() {
  return (
    <AuthProvider>
      <PartyProvider>
        <SuppliersProvider>
          <AppContent />
        </SuppliersProvider>
      </PartyProvider>
    </AuthProvider>
  );
}

export default App;
