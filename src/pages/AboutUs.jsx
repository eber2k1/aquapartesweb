import { useEffect } from 'react';
import { FaTrophy, FaWater, FaLeaf, FaBuilding, FaAward, FaCheckCircle } from 'react-icons/fa';

export const AboutUs = () => {
  // Set page metadata
  useEffect(() => {
    // Set page title
    const pageTitle = 'Sobre Nosotros | AquaPartes - 29 años de excelencia en tratamiento de agua';
    document.title = pageTitle;
    
    // Meta description
    const description = 'Conoce más sobre AquaPartes, empresa líder en sistemas de tratamiento de agua con 29 años de experiencia atendiendo a más de 200 empresas en Perú.';
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;
    
    // Canonical URL
    const currentUrl = window.location.href;
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = currentUrl;
    
    // Add structured data
    const scriptId = 'about-structured-data';
    let script = document.getElementById(scriptId);
    
    if (script) {
      script.remove();
    }
    
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      'name': 'Sobre Nosotros - AquaPartes',
      'description': description,
      'publisher': {
        '@type': 'Organization',
        'name': 'AquaPartes',
        'url': window.location.origin,
        'logo': {
          '@type': 'ImageObject',
          'url': `${window.location.origin}/logo.png`
        }
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': currentUrl
      }
    });
    
    document.head.appendChild(script);
    
    return () => {
      document.title = 'AquaPartes';
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);
  return (
    <>
      {/* Hero Section */}
      <div className="relative py-32 -mt-16 text-white" itemScope itemType="https://schema.org/AboutPage">
        <div 
          className="absolute inset-0 about-hero"
          style={{
            backgroundImage: 'url(/about-us/water-43.gif)'
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center pt-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" itemProp="headline">Sobre Nosotros</h1>
          <meta itemProp="description" content="29 años de excelencia en tratamiento de agua y soluciones ambientales" />
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">29 años de excelencia en tratamiento de agua y soluciones ambientales</p>
        </div>
      </div>

      {/* Introducción */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-15 overflow-hidden">
          <div className="absolute inset-0 about-gradient-bg"></div>
          <div className="absolute inset-0 about-pattern"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6" itemProp="name">AQUA PARTES</h2>
            <p className="text-lg text-gray-600 mb-8" itemProp="description">
              Somos una empresa peruana especializada en Sistemas de Tratamiento de Agua, Efluentes Domésticos e Industriales. 
              Con 29 años de experiencia, hemos atendido a más de 200 empresas, siendo reconocidos por nuestra calidad y compromiso.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <div className="flex items-center justify-center gap-4">
                <FaTrophy className="text-yellow-500 text-2xl" />
                <p className="text-yellow-700 font-medium">
                  Hemos recibido premios nacionales por nuestra excelencia en productos, precios competitivos y atención al cliente.
                </p>
              </div>
            </div>
          </div>

          {/* Misión y Visión */}
          <div className="grid md:grid-cols-2 gap-12 mt-16">
            <div className="bg-blue-50 p-8 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaWater className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Nuestra Misión</h3>
              </div>
              <p className="text-gray-600">
                En AQUA PARTES, trabajamos para ofrecer la mejor alternativa en procesos de tratamiento de agua, 
                aplicando lo último en ciencia y tecnología para el beneficio de nuestros clientes y el medio ambiente.
              </p>
            </div>

            <div className="bg-green-50 p-8 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaLeaf className="text-green-600 text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Nuestra Visión</h3>
              </div>
              <p className="text-gray-600">
                Ser un grupo empresarial que cumpla con los estándares de calidad requeridos por nuestros clientes, 
                siendo un socio estratégico confiable para colaboradores y promoviendo una visión de éxito y sustentabilidad.
              </p>
            </div>
          </div>

          {/* Experiencia y Logros */}
          <div className="mt-16 bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Nuestra Trayectoria</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBuilding className="text-blue-600 text-2xl" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">+200</h4>
                <p className="text-gray-600">Empresas atendidas</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaAward className="text-green-600 text-2xl" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">29 Años</h4>
                <p className="text-gray-600">De experiencia en el mercado</p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTrophy className="text-yellow-600 text-2xl" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Premios</h4>
                <p className="text-gray-600">Reconocimientos nacionales</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Valores */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Nuestros Valores</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Calidad',
                description: 'Comprometidos con la excelencia en cada uno de nuestros productos y servicios.',
                icon: <FaCheckCircle className="text-2xl text-blue-600" />
              },
              {
                title: 'Innovación',
                description: 'Implementamos las últimas tecnologías en tratamiento de aguas y efluentes.',
                icon: <FaWater className="text-2xl text-green-600" />
              },
              {
                title: 'Sustentabilidad',
                description: 'Promovemos prácticas responsables con el medio ambiente en todas nuestras operaciones.',
                icon: <FaLeaf className="text-2xl text-green-500" />
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-950 text-white" itemScope itemType="https://schema.org/ContactPage">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">¿Listo para trabajar juntos?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Contáctanos hoy mismo y descubre cómo podemos ayudarte a alcanzar tus objetivos.</p>
          <button className="bg-white text-slate-950 font-semibold px-8 py-3 rounded-full hover:bg-slate-50 transition-colors duration-300">
            Contáctanos
          </button>
        </div>
      </section>
    </>
  );
};
