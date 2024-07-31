// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4 fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-around">
        <Link to="/" className="text-white hover:underline">Home</Link>
        <Link to="/blog" className="text-white hover:underline">Blog</Link>
        <Link to="/map" className="text-white hover:underline">Map</Link>
        <Link to="/auth" className="text-white hover:underline">Signin</Link>
      </div>
    </nav>
  );
};

export default Navbar;
