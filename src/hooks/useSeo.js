import { useEffect } from 'react';
import { generateStructuredData } from '../utils/productUtils';

export const useSeo = ({ title, description, url, products }) => {
  useEffect(() => {
    // Set page title
    const pageTitle = title ? `${title} | AquaPartes` : 'AquaPartes';
    document.title = pageTitle;
    
    // Set meta description
    let metaDescriptionEl = document.querySelector('meta[name="description"]');
    if (!metaDescriptionEl) {
      metaDescriptionEl = document.createElement('meta');
      metaDescriptionEl.name = 'description';
      document.head.appendChild(metaDescriptionEl);
    }
    metaDescriptionEl.content = description || 'Explora nuestra amplia selección de productos de calidad';
    
    // Set canonical URL
    if (url) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.rel = 'canonical';
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.href = url;
    }
    
    // Set Open Graph tags
    const ogTags = {
      'og:title': pageTitle,
      'og:description': description || 'Explora nuestra amplia selección de productos de calidad',
      'og:url': url || window.location.href,
      'og:type': 'website',
      'og:site_name': 'AquaPartes'
    };
    
    // Update or create meta tags
    const updateMetaTag = (name, content, property = null) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let tag = document.querySelector(selector);
      
      if (!tag) {
        tag = document.createElement('meta');
        if (property) {
          tag.setAttribute('property', name);
        } else {
          tag.name = name;
        }
        document.head.appendChild(tag);
      }
      tag.content = content;
    };
    
    // Set all meta tags
    Object.entries(ogTags).forEach(([key, value]) => updateMetaTag(key, value, true));
    
    // Add structured data if products are provided
    if (products && products.length > 0) {
      const structuredData = generateStructuredData(products, url || window.location.origin);
      
      // Remove existing structured data
      document.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());
      
      if (structuredData) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(structuredData);
        document.head.appendChild(script);
      }
    }
    
    // Cleanup function
    return () => {
      document.title = 'AquaPartes';
      document.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());
    };
  }, [title, description, url, products]);
};
