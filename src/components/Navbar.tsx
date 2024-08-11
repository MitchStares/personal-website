import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (location.pathname === '/map') {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-[#f8f5f1] text-gray-800 h-20 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${location.pathname === '/map' ? 'hover:opacity-100' : ''}`}
    >
      <nav className="max-w-6xl mx-auto px-4 h-full flex justify-between items-center">
        <div className="text-2xl font-bold text-green-800">Mitch Stares</div>
        <div className="space-x-6">
          <Link to="/" className={`hover:text-green-700 ${location.pathname === '/' ? 'text-green-700' : ''}`}>Home</Link>
          <Link to="/blog" className={`hover:text-green-700 ${location.pathname === '/blog' ? 'text-green-700' : ''}`}>Blog</Link>
          <Link to="/map" className={`hover:text-green-700 ${location.pathname === '/map' ? 'text-green-700' : ''}`}>Map</Link>
        </div>
        <div className="space-x-4">
          <Link to="/auth" className="px-4 py-2 border border-green-800 text-green-800 rounded-full hover:bg-green-800 hover:text-white transition">Sign In</Link>
          <Link to="/map" className="px-4 py-2 bg-green-800 text-white rounded-full hover:bg-green-700 transition">Current Project</Link>
        </div>
      </nav>
    </header>
  );
};

// Layout wrapper component

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMapPage = location.pathname === '/map';

  return (
    <div className={`min-h-screen flex flex-col ${!isMapPage ? 'pt-20' : ''}`}>
      {!isMapPage && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};


export { Navbar, Layout };