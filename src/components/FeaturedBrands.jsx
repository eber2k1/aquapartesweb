import { useEffect, useState } from 'react';
import { brandsApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import {  AnimatePresence } from 'framer-motion';

const FeaturedBrands = ({ onViewAllBrands }) => {
    const [featuredBrands, setFeaturedBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeaturedBrands = async () => {
            try {
                const brands = await brandsApi.getFeaturedBrands();
                setFeaturedBrands(brands);
            } catch (err) {
                console.error('Error fetching featured brands:', err);
                setError('No se pudieron cargar las marcas destacadas');
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedBrands();
    }, []);

    const handleBrandClick = (brandName) => {
        navigate(`/productos?marca=${encodeURIComponent(brandName)}`);
    };

    if (loading) {
        return (
            <div className="py-8 text-center">
                <div className="animate-pulse flex space-x-4 justify-center">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-24 w-32 bg-gray-200 rounded-lg m-2"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (featuredBrands.length === 0) {
        return null;
    }

    return (
        <div className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <section className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-light tracking-tight text-gray-900 sm:text-5xl">
                        Marcas <span className="font-medium">Destacadas</span>
                    </h2>
                    <div className="mt-6 h-0.5 w-32 bg-sky-600 mx-auto"></div>
                    <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
                        Las marcas más importadas y vendidas en el mercado peruano
                    </p>
                </div>
                
                <div className="relative w-full -mx-4 px-4">
                    <motion.div 
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto w-full"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                >
                    {featuredBrands.map((brand, index) => (
                        <motion.div 
                            key={index}
                            className="group relative"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                type: 'spring',
                                stiffness: 100,
                                damping: 10
                            }}
                            whileHover={{ 
                                scale: 1.03,
                                transition: { duration: 0.2 }
                            }}
                        >
                            <div 
                                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer h-full border border-transparent group-hover:border-sky-100 group-hover:shadow-lg transition-all duration-300"
                                onClick={() => handleBrandClick(brand.name || brand.marca || '')}
                            >
                                <div className="p-4 flex flex-col items-center h-full">
                                    <div className="flex flex-col items-center flex-grow w-full">
                                        {/* Animated Star Badge */}
                                        <motion.div 
                                            className="self-end -mt-1 -mr-1"
                                            animate={{
                                                y: [0, -5, 0],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: 'easeInOut'
                                            }}
                                        >
                                            <svg className="h-5 w-5 text-sky-400 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                            </svg>
                                        </motion.div>

                                        {brand.logo || brand.marca_imagen ? (
                                            <motion.div 
                                                className="flex-shrink-0 mt-1"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ type: 'spring', stiffness: 300 }}
                                            >
                                                <img 
                                                    src={brand.logo || brand.marca_imagen} 
                                                    alt={brand.name || brand.marca || 'Marca'} 
                                                    className="h-16 sm:h-20 md:h-24 w-auto max-w-[90%] mx-auto object-contain transition-all duration-300 group-hover:brightness-105"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/placeholder-brand.png';
                                                    }}
                                                />
                                            </motion.div>
                                        ) : (
                                            <div className="h-16 sm:h-20 md:h-24 flex items-center justify-center w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded transition-colors duration-300 group-hover:from-gray-100 group-hover:to-gray-200 px-2">
                                                <span className="text-gray-400 text-sm group-hover:text-gray-500 transition-colors">
                                                    {brand.name || brand.marca || 'Marca'}
                                                </span>
                                            </div>
                                        )}
                                        
                                        <motion.h2 
                                            className="text-sm sm:text-base md:text-lg font-medium text-gray-900 mt-2 sm:mt-3 text-center group-hover:text-sky-600 transition-colors duration-300"
                                        >
                                            {brand.name || brand.marca || 'Marca'}
                                        </motion.h2>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                        </motion.div>
                    </div>
                </section>
            
            <div className="max-w-7xl mx-auto mt-12 md:mt-16 lg:mt-20 text-center px-4">
                <p className="text-gray-600 text-lg mb-8">
                    Distribuidores oficiales de las marcas más reconocidas a nivel mundial
                </p>
                <button 
                    onClick={onViewAllBrands}
                    className="group inline-flex items-center px-10 py-5 border-2 border-sky-600 text-xl font-medium rounded-lg text-sky-600 bg-white hover:bg-sky-50 transition-all duration-200 cursor-pointer"
                >
                    Ver todas las marcas
                    <svg className="ml-3 h-5 w-5 transform transition-transform duration-200 group-hover:translate-y-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default FeaturedBrands;
