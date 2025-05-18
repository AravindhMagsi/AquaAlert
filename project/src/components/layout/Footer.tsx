import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-sky-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Droplet size={28} className="text-sky-300" />
              <span className="font-bold text-xl">AquaAlert</span>
            </div>
            <p className="text-sky-100 mb-4 max-w-xs">
              A public service initiative to help citizens report water-related 
              issues for prompt resolution by authorities.
            </p>
            <div className="flex space-x-4 mt-6">
              <SocialIcon href="#" icon="facebook" />
              <SocialIcon href="#" icon="twitter" />
              <SocialIcon href="#" icon="instagram" />
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/complaint" label="Report a Problem" />
              <FooterLink to="#" label="FAQs" />
              <FooterLink to="#" label="About Us" />
              <FooterLink to="#" label="Privacy Policy" />
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-sky-300 flex-shrink-0 mt-1" />
                <span>123 Water Street, Cityville, State 12345</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-sky-300 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-sky-300 flex-shrink-0" />
                <span>support@aquaalert.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-8 mt-8 border-t border-sky-800 text-center text-sky-200">
          <p>© {currentYear} AquaAlert. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

interface FooterLinkProps {
  to: string;
  label: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, label }) => {
  return (
    <li>
      <Link to={to} className="text-sky-100 hover:text-white transition-colors">
        {label}
      </Link>
    </li>
  );
};

interface SocialIconProps {
  href: string;
  icon: 'facebook' | 'twitter' | 'instagram';
}

const SocialIcon: React.FC<SocialIconProps> = ({ href, icon }) => {
  return (
    <a 
      href={href} 
      className="h-9 w-9 rounded-full bg-sky-800 hover:bg-sky-700 flex items-center justify-center transition-colors"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit our ${icon} page`}
    >
      <span className="sr-only">{icon}</span>
      {/* Simple placeholder for social icons */}
      <div className="h-4 w-4 bg-sky-300 rounded-sm"></div>
    </a>
  );
};

export default Footer;