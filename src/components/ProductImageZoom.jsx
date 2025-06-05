import { useState, useRef, useEffect } from 'react';

const ProductImageZoom = ({ imageUrl, alt }) => {
    const [isZoomed, setIsZoomed] = useState(false);
    const imgRef = useRef(null);

    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
        if (!isZoomed) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    };

    // Clean up the effect when component unmounts
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    if (!imageUrl) {
        return <div className="text-gray-400">Imagen no disponible</div>;
    }

    return (
        <div className="h-96 rounded-lg overflow-hidden flex items-center justify-center relative group">
            <img 
                ref={imgRef}
                src={imageUrl} 
                alt={alt} 
                className={`max-h-full max-w-full object-contain p-4 transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
            />
            <button 
                onClick={toggleZoom}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
                aria-label={isZoomed ? 'Reducir imagen' : 'Ampliar imagen'}
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6 text-gray-700" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d={isZoomed ? 'M6 18L18 6M6 6l12 12' : 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7'}
                    />
                </svg>
            </button>
            {isZoomed && (
                <div 
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 cursor-zoom-out"
                    onClick={toggleZoom}
                >
                    <img 
                        src={imageUrl} 
                        alt={alt}
                        className="max-h-[90vh] max-w-[90vw] object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductImageZoom;
