import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Droplet, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center space-x-2 text-sky-700 transition-colors hover:text-sky-900"
        >
          <Droplet size={28} className="text-sky-600" />
          <span className="font-bold text-xl">AquaAlert</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" label="Home" isScrolled={isScrolled} />
          <NavLink to="/complaint" label="Report Issue" isScrolled={isScrolled} />
          <Link
            to="/complaint"
            className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-5 rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Report Now
          </Link>
        </nav>

        {/* Mobile Navigation Toggle */}
        <button
          className="md:hidden text-sky-700 p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full py-4 px-4 border-t border-gray-200 animate-fadeIn">
          <nav className="flex flex-col space-y-4">
            <MobileNavLink to="/" label="Home" />
            <MobileNavLink to="/complaint" label="Report Issue" />
            <Link
              to="/complaint"
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-5 rounded-full transition-all text-center shadow-md"
            >
              Report Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  isScrolled: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, isScrolled }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`font-medium transition-colors ${
        isActive
          ? 'text-sky-600'
          : isScrolled
          ? 'text-gray-800 hover:text-sky-600'
          : 'text-gray-800 hover:text-sky-600'
      }`}
    >
      {label}
    </Link>
  );
};

interface MobileNavLinkProps {
  to: string;
  label: string;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`font-medium py-2 transition-colors ${
        isActive
          ? 'text-sky-600 font-semibold'
          : 'text-gray-800 hover:text-sky-600'
      }`}
    >
      {label}
    </Link>
  );
};

export default Header;