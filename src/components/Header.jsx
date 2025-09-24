import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { DropdownCategories } from "./DropdownCategories";
import CartIcon from "./CartIcon";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showCategories, setShowCategories] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const categoriesRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Cerrar menú al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
        !event.target.closest('button[aria-label*="men"]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle scroll behavior
  useEffect(() => {
    if (isOpen) return; // No ocultar el header cuando el menú está abierto

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isScrollingDown = currentScrollPos > prevScrollPos && currentScrollPos > 10;

      if (currentScrollPos < 10) {
        setIsVisible(true);
      } else if (isScrollingDown && isVisible) {
        setIsVisible(false);
      } else if (!isScrollingDown && !isVisible) {
        setIsVisible(true);
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible, prevScrollPos, isOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 transition-all duration-300 z-30 shadow-lg ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
        style={{ backgroundColor: '#095EA1' }}
      >
        <div className="w-full px-0 sm:px-6 lg:px-12 h-20 sm:h-24 lg:h-28 flex justify-between items-center">
          {/* Logo Section - Mejorado */}
          <div className="flex items-center pl-4 sm:pl-0">
            <Link to="/" className="group flex items-center transition-all duration-300 hover:scale-105">
              <div className="relative bg-white h-20 sm:h-24 lg:h-28 flex items-center px-2 sm:px-3 lg:px-4 shadow-md ">
                <img
                  className="h-20 sm:h-20 lg:h-36 w-auto object-contain"
                  src="/logov8.png"
                  alt="AquaPartes Logo"
                />
                {/* Efecto de brillo mejorado */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-cyan-400/10 to-blue-400/0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Mejorado */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            <Link 
              to="/" 
              className="px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 font-medium text-sm tracking-wide transition-all duration-200 rounded-lg relative group backdrop-blur-sm"
            >
              INICIO
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-cyan-300 transition-all duration-300 group-hover:w-full group-hover:left-0"></div>
            </Link>
            
            <div className="relative" ref={categoriesRef}>
              <div 
                className="h-full flex items-center"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                <Link
                  to="/productos"
                  className={`px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 font-medium text-sm tracking-wide transition-all duration-200 rounded-lg flex items-center group backdrop-blur-sm ${
                    showCategories ? 'text-white bg-white/10' : ''
                  }`}
                >
                  PRODUCTOS
                  <svg
                    className={`ml-1 h-3 w-3 transition-transform duration-200 ${
                      showCategories ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-cyan-300 transition-all duration-300 group-hover:w-full group-hover:left-0"></div>
                </Link>
              </div>
              
              {/* Dropdown Categories - Mejorado */}
              {showCategories && (
                <div 
                  className="absolute left-1/2 transform -translate-x-1/2 top-full w-screen max-w-5xl"
                  onMouseEnter={() => setShowCategories(true)}
                  onMouseLeave={() => setShowCategories(false)}
                >
                  <div className="bg-white/98 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden max-h-[600px] overflow-y-auto">
                    <DropdownCategories
                      isOpen={showCategories}
                      onClose={() => setShowCategories(false)}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <Link 
              to="/marcas" 
              className="px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 font-medium text-sm tracking-wide transition-all duration-200 rounded-lg relative group backdrop-blur-sm"
            >
              MARCAS
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-cyan-300 transition-all duration-300 group-hover:w-full group-hover:left-0"></div>
            </Link>
            
            <Link 
              to="/nosotros" 
              className="px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 font-medium text-sm tracking-wide transition-all duration-200 rounded-lg relative group backdrop-blur-sm"
            >
              NOSOTROS
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-cyan-300 transition-all duration-300 group-hover:w-full group-hover:left-0"></div>
            </Link>
            
            <Link 
              to="/contacto" 
              className="px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 font-medium text-sm tracking-wide transition-all duration-200 rounded-lg relative group backdrop-blur-sm"
            >
              CONTÁCTANOS
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-cyan-300 transition-all duration-300 group-hover:w-full group-hover:left-0"></div>
            </Link>
            
            {/* Desktop Cart - Mejorado */}
            <div className="ml-6 pl-6 border-l border-white/20">
              <div className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200">
                <CartIcon />
              </div>
            </div>
          </nav>

          {/* Mobile Menu Button & Cart - Mejorado */}
          <div className="lg:hidden flex items-center space-x-3 pr-4 sm:pr-0">
            <div className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200">
              <CartIcon />
            </div>
            <button
              className="p-2 text-white/90 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 rounded-lg backdrop-blur-sm"
              onClick={toggleMenu}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Mejorado */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop mejorado */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-300"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Menu Panel mejorado */}
          <div
            ref={menuRef}
            className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-sky-950/98 to-sky-900/98 backdrop-blur-lg shadow-2xl transform transition-all duration-300 overflow-y-auto border-r border-sky-800/30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header mejorado */}
            <div className="flex items-center justify-between p-6 border-b border-sky-800/30 bg-sky-900/50">
              <div className="bg-white rounded-lg p-2 shadow-md">
                <img className="h-10 w-auto" src="/logov8.png" alt="AquaPartes" />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg"
                aria-label="Cerrar menú"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Links mejorados */}
            <div className="py-4 flex-1">
              <div className="space-y-1 px-4">
                <Link
                  to="/"
                  className="block px-4 py-3 text-gray-200 hover:text-white hover:bg-sky-800/50 font-medium transition-all duration-200 rounded-lg border-l-4 border-transparent hover:border-cyan-400"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Inicio
                  </span>
                </Link>
                
                <div>
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-gray-200 hover:text-white hover:bg-sky-800/50 font-medium transition-all duration-200 rounded-lg border-l-4 border-transparent hover:border-cyan-400"
                    onClick={() => setShowCategories(!showCategories)}
                  >
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H3a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" />
                      </svg>
                      Productos
                    </span>
                    <svg
                      className={`h-4 w-4 transition-transform duration-200 ${
                        showCategories ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showCategories && (
                    <div className="bg-sky-800/30 rounded-lg mt-2 mx-2 overflow-hidden border border-sky-700/30">
                      <DropdownCategories
                        isOpen={true}
                        onClose={() => {}}
                        className="relative"
                        mobileView={true}
                        onItemClick={() => {
                          setIsOpen(false);
                          setShowCategories(false);
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <Link
                  to="/marcas"
                  className="block px-4 py-3 text-gray-200 hover:text-white hover:bg-sky-800/50 font-medium transition-all duration-200 rounded-lg border-l-4 border-transparent hover:border-cyan-400"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Marcas
                  </span>
                </Link>
                
                <Link
                  to="/nosotros"
                  className="block px-4 py-3 text-gray-200 hover:text-white hover:bg-sky-800/50 font-medium transition-all duration-200 rounded-lg border-l-4 border-transparent hover:border-cyan-400"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Nosotros
                  </span>
                </Link>
                
                <Link
                  to="/contacto"
                  className="block px-4 py-3 text-gray-200 hover:text-white hover:bg-sky-800/50 font-medium transition-all duration-200 rounded-lg border-l-4 border-transparent hover:border-cyan-400"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contáctanos
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};