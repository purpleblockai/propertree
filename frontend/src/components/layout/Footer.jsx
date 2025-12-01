/**
 * Footer component
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-propertree-dark text-propertree-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src="/logo.jpg" alt="Propertree" className="h-10 w-auto object-contain" />
              <span className="text-xl font-bold text-white">Propertree</span>
            </div>
            <p className="text-sm leading-relaxed">
              Professional property and booking management platform.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="hover:text-propertree-green transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-propertree-green transition-colors text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-propertree-green transition-colors text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="hover:text-propertree-green transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-propertree-green transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-propertree-green transition-colors text-sm">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-propertree-green transition-colors text-sm">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Social Media</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-propertree-green transition-colors" aria-label="Facebook">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-propertree-green transition-colors" aria-label="Twitter">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-propertree-green transition-colors" aria-label="Instagram">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-propertree-green transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-propertree-dark-400 mt-8 pt-8 text-sm text-center">
          <p>&copy; {currentYear} Propertree. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

