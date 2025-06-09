import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Breadcrumb = ({ items = [] }) => {
  const location = useLocation();
  const baseUrl = window.location.origin;
  
  // Generate breadcrumb items based on current path if no items are provided
  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbs(location.pathname);
  
  // Add JSON-LD structured data
  useEffect(() => {
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    
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
    
    return () => {
      document.head.removeChild(breadcrumbScript);
    };
  }, [breadcrumbItems, baseUrl]);
  
  return (
    <nav aria-label="breadcrumb" className="text-sm text-gray-500 py-2 px-4 bg-gray-50">
      <ol className="flex flex-wrap items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            {index === breadcrumbItems.length - 1 ? (
              <span className="text-gray-700 font-medium" aria-current="page">
                {item.name}
              </span>
            ) : (
              <a 
                href={item.path} 
                className="text-blue-600 hover:text-blue-800 hover:underline"
                itemProp="item"
              >
                <span itemProp="name">{item.name}</span>
                <meta itemProp="position" content={index + 1} />
              </a>
            )}
          </li>
        ))}
      </ol>
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
    const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    
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
