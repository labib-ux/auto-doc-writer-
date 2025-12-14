import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { Features } from './components/Features';
import { Workflow } from './components/Workflow';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { RepositoryDetail } from './components/RepositoryDetail';

type Page = 'home' | 'login' | 'dashboard' | 'repo-detail';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentRepoId, setCurrentRepoId] = useState<number | null>(null);

  const handleRepoSelect = (id: number) => {
    setCurrentRepoId(id);
    setCurrentPage('repo-detail');
  };

  const navigateToLogin = () => setCurrentPage('login');

  if (currentPage === 'repo-detail' && currentRepoId) {
    return (
      <RepositoryDetail 
        repoId={currentRepoId} 
        onBack={() => setCurrentPage('dashboard')} 
      />
    );
  }

  if (currentPage === 'dashboard') {
    return (
      <Dashboard 
        onLogout={() => setCurrentPage('home')} 
        onRepoSelect={handleRepoSelect}
      />
    );
  }

  if (currentPage === 'login') {
    return (
        <Login 
            onBack={() => setCurrentPage('home')} 
            onLogin={() => setCurrentPage('dashboard')} 
        />
    );
  }

  return (
    <div className="bg-dark text-white min-h-screen">
      <Navbar onLoginClick={navigateToLogin} />
      <main>
        <Hero onGetStarted={navigateToLogin} />
        <Problem />
        <Solution />
        <Features />
        <Workflow />
        <CTA onGetStarted={navigateToLogin} />
      </main>
      <Footer />
    </div>
  );
}

export default App;