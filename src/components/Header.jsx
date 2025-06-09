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
        className={`fixed top-0 left-0 right-0 bg-sky-950 transition-transform duration-300 z-30 ${isVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <Link to="/" className="relative z-10 flex items-center">
              <img
                className="h-26 lg:h-28 w-auto transition-all duration-200"
                src="/logoconmarcos.png"
                alt="Aqua Partes Logo"
              />
            </Link>

            {/* Mobile Cart Icon - Only show on small screens */}
            <div className="lg:hidden">
              <CartIcon />
            </div>
          </div>

          {/* Desktop nav - Only show on large screens */}
          <nav className="hidden lg:flex items-center space-x-8 text-white font-medium text-lg">
            <Link to="/" className="hover:text-cyan-300 transition-colors duration-200">INICIO</Link>
            <div
              className="relative"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
              ref={categoriesRef}
            >
              <Link
                to="/productos"
                className={`hover:text-cyan-300 flex items-center transition-colors duration-200 uppercase ${showCategories ? 'text-cyan-300' : ''}`}
              >
                PRODUCTOS
                <svg
                  className={`ml-1 h-4 w-4 transition-transform ${showCategories ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <DropdownCategories
                isOpen={showCategories}
                onClose={() => setShowCategories(false)}
                className="absolute left-0 top-full mt-2"
              />
            </div>
            <Link to="/marcas" className="hover:text-cyan-300 transition-colors duration-200 uppercase">MARCAS</Link>
            <Link to="/nosotros" className="hover:text-cyan-300 transition-colors duration-200 uppercase">NOSOTROS</Link>
            <Link to="/contacto" className="hover:text-cyan-300 transition-colors duration-200 uppercase">CONTÁCTANOS</Link>
            <div className="relative hidden lg:block">
              <CartIcon />
            </div>
          </nav>

          {/* Mobile/Tablet toggle - Show on screens smaller than lg */}
          <button
            className="lg:hidden text-white focus:outline-none z-50"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile/Tablet menu - Show on screens smaller than lg */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          {/* Semi-transparent overlay */}
          <div className="absolute inset-0 bg-black/70 transition-opacity"></div>

          {/* Menu content */}
          <div
            ref={menuRef}
            className="absolute left-0 right-0 top-0 bg-sky-950 opacity-95 overflow-y-auto h-screen pt-24 pb-20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Fixed at top right */}
            <button
              onClick={() => setIsOpen(false)}
              className="fixed top-4 right-4 text-white hover:text-blue-300 transition-colors p-2 rounded-full bg-sky-900/50 backdrop-blur-sm"
              aria-label="Cerrar menú"
            >
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col w-full max-w-xs mx-auto pt-8 pb-12 space-y-1">
              <div className="w-full border-b border-sky-700/50">
                <Link
                  to="/"
                  className="flex items-center w-full text-white hover:text-cyan-300 transition-colors duration-200 py-4 pl-6 pr-6"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="font-medium text-lg">Inicio</span>
                </Link>
              </div>
              <div className="w-full border-b border-sky-700/50">
                <Link
                  to="/nosotros"
                  className="flex items-center w-full text-white hover:text-cyan-300 transition-colors duration-200 py-4 pl-6 pr-6"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="font-medium text-lg">Nosotros</span>
                </Link>
              </div>
              <div className="w-full border-b border-sky-700/50">
                <div className="flex items-center w-full">
                  <Link
                    to="/productos"
                    className="flex-grow text-white hover:text-cyan-300 transition-colors duration-200 py-4 pl-6 pr-2 flex items-center justify-between"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="font-medium text-lg">Productos</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowCategories(!showCategories);
                      }}
                      className="p-1.5 text-cyan-300 hover:bg-sky-900/50 rounded-lg transition-colors duration-200 ml-2"
                      aria-label={showCategories ? 'Ocultar categorías' : 'Mostrar categorías'}
                    >
                      <svg
                        className={`h-5 w-5 transition-transform duration-200 ${showCategories ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </Link>
                </div>
                {showCategories && (
                  <div className="bg-sky-900/50 rounded-lg py-2 px-4 mt-1 mb-2">
                    <DropdownCategories
                      isOpen={true}
                      onClose={() => { }}
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
              <div className="w-full border-b border-sky-700/50">
                <Link
                  to="/marcas"
                  className="flex items-center w-full text-white hover:text-cyan-300 transition-colors duration-200 py-4 pl-6 pr-6"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="font-medium text-lg">Marcas</span>
                </Link>
              </div>
              <div className="w-full border-b border-sky-700/50">
                <Link
                  to="/contacto"
                  className="flex items-center w-full text-white hover:text-cyan-300 transition-colors duration-200 py-4 pl-6 pr-6"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="font-medium text-lg">Contáctanos</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
