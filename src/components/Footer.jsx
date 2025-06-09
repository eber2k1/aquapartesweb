import { Link, useNavigate } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { categoriesApi } from '../services/api';
import { useFilters } from '../hooks/useFilters';

export default function Footer() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { updateFilters } = useFilters();

  const handleCategoryClick = (categoryName) => {
    updateFilters({ 
      categories: [categoryName],
      brands: [],
      subcategories: []
    });
    navigate('/productos');
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoriesApi.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const socialLinks = [
    { href: "https://www.facebook.com/aquapartes", icon: <FaFacebookF />, label: "Facebook" },
    { href: "https://www.instagram.com/aquapartes", icon: <FaInstagram />, label: "Instagram" },
    { href: "https://www.linkedin.com/company/aquapartes", icon: <FaLinkedinIn />, label: "LinkedIn" },
    { href: "https://www.tiktok.com/@aquapartes", icon: <FaTiktok />, label: "TikTok" },
    { href: "https://wa.me/51977607443", icon: <FaWhatsapp />, label: "WhatsApp" },
  ];

  return (
    <footer className="bg-sky-950 text-gray-300 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and Company Info */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img src="/logoconmarcos.png" alt="AQUA PARTES Logo" className="h-32" />
            </Link>
            <p className="text-sm">
              Soluciones integrales en tratamiento de agua y efluentes.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h5 className="text-white font-semibold mb-4 uppercase tracking-wider">Navegación</h5>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-cyan-300 transition-colors">Inicio</Link></li>
              <li>
                <Link to="/productos" className="hover:text-cyan-300 transition-colors">Productos</Link>
              </li>
              <li><Link to="/marcas" className="hover:text-cyan-300 transition-colors">Marcas</Link></li>
              <li><Link to="/nosotros" className="hover:text-cyan-300 transition-colors">Nosotros</Link></li>
            </ul>
          </div>

          {/* Categorías de Productos */}
          <div>
            <h5 className="text-white font-semibold mb-4 uppercase tracking-wider">Productos</h5>
            {loading ? (
              <div className="text-sm text-gray-400 mt-1">Cargando categorías...</div>
            ) : categories.length > 0 ? (
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id || category.categoria}>
                    <button
                      onClick={() => handleCategoryClick(category.categoria)}
                      className="text-sm hover:text-cyan-300 transition-colors block w-full text-left"
                    >
                      {category.categoria}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-400">No hay categorías disponibles</div>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h5 className="text-white font-semibold mb-4 uppercase tracking-wider">Contacto</h5>
            <address className="not-italic space-y-2 text-sm">
              <p> Jr. Juan Chávez Tueros 1235, 3er Piso, Urb. Chacra Ríos Sur, Lima, Perú</p>
              <p> <a href="tel:+51977607443" className="hover:text-cyan-300 transition-colors">+51 977 607 443</a></p>
              <p> <a href="mailto:ventas@aquapartes.pe" className="hover:text-cyan-300 transition-colors">ventas@aquapartes.pe</a></p>
            </address>
          </div>

          {/* Legal Links (Optional - can be expanded) */}
          <div>
            <h5 className="text-white font-semibold mb-4 uppercase tracking-wider">Legal</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-cyan-300 transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="hover:text-cyan-300 transition-colors">Términos de Servicio</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-sky-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            {new Date().getFullYear()} AQUAPARTES del grupo AQUAFIL. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4">
            {socialLinks.map(link => (
              <a 
                key={link.label}
                href={link.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={link.label}
                className="text-gray-400 hover:text-cyan-300 transition-colors text-xl"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};