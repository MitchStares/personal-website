import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

   const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-[#f8f5f1] text-gray-800 h-20 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${location.pathname === '/map' ? 'hover:opacity-100' : ''}`}
    >
      <nav className="max-w-6xl mx-auto px-4 h-full flex justify-between items-center lg:justify-center">
        <div className="text-2xl font-bold text-green-800 lg:absolute lg:left-4">Mitch Stares</div>
        
        {/* Hamburger menu for mobile */}
        <button 
          className="lg:hidden text-green-800 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop menu */}
        <div className="hidden lg:flex items-center space-x-6">
          <Link to="/" className={`hover:text-green-700 ${location.pathname === '/' ? 'text-green-700' : ''}`}>Home</Link>
          <Link to="/blog" className={`hover:text-green-700 ${location.pathname === '/blog' ? 'text-green-700' : ''}`}>Blog</Link>
          <Link to="/map" className={`hover:text-green-700 ${location.pathname === '/map' ? 'text-green-700' : ''}`}>Projects</Link>
        </div>

        {/* Desktop buttons */}
        <div className="hidden lg:flex items-center space-x-4 lg:absolute lg:right-4">
          <Link to="/auth" className="px-4 py-2 border border-green-800 text-green-800 rounded-full hover:bg-green-800 hover:text-white transition">Sign In</Link>
          <Link to="/map" className="px-4 py-2 bg-green-800 text-white rounded-full hover:bg-green-700 transition">Spatial Insights</Link>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`lg:hidden bg-[#f8f5f1] ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-700 hover:bg-gray-50">Home</Link>
          <Link to="/blog" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-700 hover:bg-gray-50">Blog</Link>
          <Link to="/map" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-700 hover:bg-gray-50">Projects</Link>
          <Link to="/auth" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-700 hover:bg-gray-50">Sign In</Link>
          <Link to="/map" className="block px-3 py-2 rounded-md text-base font-medium bg-green-800 text-white hover:bg-green-700">Current Project</Link>
        </div>
      </div>
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