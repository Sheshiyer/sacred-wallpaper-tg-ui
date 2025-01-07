import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: '🏠 Home', path: '/', icon: '🏠' },
    { label: '✨ Generate', path: '/generate', icon: '✨' },
    { label: '👤 Profile', path: '/profile', icon: '👤' }
  ];

  return (
    <div className="main-layout fade-in">
      <main className="content">
        {children}
      </main>
      <nav className="bottom-nav">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MainLayout;
