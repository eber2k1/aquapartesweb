import { useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

const Breadcrumb = ({ items = [] }) => {
  const location = useLocation();
  const baseUrl = window.location.origin;
  const scriptRef = useRef(null);
  
  // Generate breadcrumb items based on current path if no items are provided
  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbs(location.pathname);
  
  // Add JSON-LD structured data
  useEffect(() => {
    // Remove existing script if it exists
    if (scriptRef.current && document.head.contains(scriptRef.current)) {
      document.head.removeChild(scriptRef.current);
    }
    
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.id = 'breadcrumb-structured-data';
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": `${baseUrl}${item.path}`
      }))
    };
    
    breadcrumbScript.text = JSON.stringify(structuredData);
    document.head.appendChild(breadcrumbScript);
    scriptRef.current = breadcrumbScript;
    
    return () => {
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
      }
    };
  }, [breadcrumbItems, baseUrl]);
  
  return (
    <nav aria-label="breadcrumb" className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center h-12 space-x-2 overflow-x-auto whitespace-nowrap">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const isHome = item.name === 'Inicio';
            
            return (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <FiChevronRight className="h-4 w-4 text-gray-400 mx-2 flex-shrink-0" />
                )}
                
                {isLast ? (
                  <span 
                    className="text-sm font-medium text-gray-900 truncate max-w-xs"
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center text-sm font-medium transition-colors duration-200 ${
                      isHome 
                        ? 'text-blue-600 hover:text-blue-700' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {isHome && <FiHome className="h-4 w-4 mr-1.5 flex-shrink-0" />}
                    <span className="truncate max-w-[200px]">{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

// Helper function to generate breadcrumbs from path
const generateBreadcrumbs = (pathname) => {
  const pathSegments = pathname.split('/').filter(segment => segment);
  
  const items = [
    { name: 'Inicio', path: '/' }
  ];
  
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Skip adding the current page as a link if it's the last segment
    if (index < pathSegments.length - 1) {
      items.push({
        name,
        path: currentPath
      });
    } else {
      items.push({
        name,
        path: ''
      });
    }
  });
  
  return items;
};

export default Breadcrumb;
