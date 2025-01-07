import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import MainLayout from './components/MainLayout';
import Dashboard from './components/Dashboard';
import Generator from './components/Generator';
import Profile from './components/Profile';

interface AppProps {
  initData?: string;
  userId?: number;
}

const App: React.FC<AppProps> = () => {
  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
  }, []);
  
  return (
    <div className="app">
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/generate" element={<Generator />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </MainLayout>
    </div>
  );
};

export default App;
