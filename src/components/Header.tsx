import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle, ArrowRight } from 'lucide-react';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Catálogo', path: '/catalogo' },
    { name: 'Como funciona', path: '/como-funciona' },
    { name: 'Suporte', path: '/suporte' },
    { name: 'FAQ', path: '/faq' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const whatsappNumber = '5581997349300'; // Substitua pelo seu número real do WhatsApp
  const whatsappMessage = encodeURIComponent('Olá, tenho interesse em um software da C2Tech e gostaria de tirar uma dúvida.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const isHeaderDark = location.pathname === '/' && !isScrolled && !isOpen;
  const showWhatsApp = location.pathname.startsWith('/catalogo') || location.pathname.startsWith('/produto');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-slate-100'
          : isHeaderDark
            ? 'bg-[#020617]/50 backdrop-blur-md py-4 border-b border-white/5'
            : 'bg-white py-5 border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src="/images/logo.png" 
              alt="Logo C2Tech" 
              className="w-9 h-9 rounded-lg object-cover shadow-sm transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>
 
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-medium text-sm transition-colors duration-200 ${
                  isActive(link.path)
                    ? isHeaderDark
                      ? 'text-sky-400 font-semibold'
                      : 'text-accent-blue font-semibold'
                    : isHeaderDark
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
 
          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            {showWhatsApp && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center font-medium text-sm transition-colors duration-200 ${
                  isHeaderDark
                    ? 'text-slate-300 hover:text-emerald-400'
                    : 'text-slate-700 hover:text-emerald-600'
                }`}
              >
                <MessageCircle className="w-5 h-5 text-emerald-500 mr-1.5" />
                <span>WhatsApp</span>
              </a>
            )}
            <Link
              to="/catalogo"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-accent-blue hover:bg-accent-blue-dark rounded-xl shadow-sm hover:shadow transition-all duration-200"
            >
              <span>Ver softwares</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
 
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {showWhatsApp && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 transition-colors ${
                  isHeaderDark ? 'text-slate-300 hover:text-emerald-400' : 'text-slate-600 hover:text-emerald-600'
                }`}
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-6 h-6 text-emerald-500" />
              </a>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors focus:outline-none ${
                isHeaderDark
                  ? 'text-slate-300 hover:text-white hover:bg-white/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-expanded={isOpen}
              aria-label="Menu principal"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (with backdrop-blur and sliding animation) */}
      <div
        className={`fixed inset-0 top-[60px] z-30 md:hidden bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 w-4/5 max-w-sm h-[calc(100vh-60px)] bg-white shadow-2xl p-6 transition-transform duration-300 ease-out transform ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`py-2 text-lg font-semibold border-b border-slate-50 transition-colors ${
                  isActive(link.path)
                    ? 'text-accent-blue'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-4 flex flex-col space-y-3">
              {showWhatsApp && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center py-3 px-4 rounded-xl border border-slate-200 text-slate-700 hover:text-emerald-600 font-semibold transition-colors duration-200"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-500 mr-2" />
                  <span>Dúvidas no WhatsApp</span>
                </a>
              )}
              <Link
                to="/catalogo"
                className="flex items-center justify-center py-3 px-4 rounded-xl bg-accent-blue text-white font-semibold shadow hover:bg-accent-blue-dark transition-all duration-200"
              >
                <span>Ver softwares</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
