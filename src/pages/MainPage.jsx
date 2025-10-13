import { useState, useEffect } from 'react';
import { Banner } from "../components/Banner";
import { DescripcionAquapartes } from "../components/DescripcionAquapartes";
import { BrandsCarousel } from "../components/BrandsCarousel";
import { CategoriesGrid } from "../components/CategoriesGrid";
import PageLoader from '../components/PageLoader';
import { SplashAdModal } from '../components/SplashAdModal.jsx';

export const MainPage = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Hooks del splash: deben ir ANTES de cualquier return temprano
    const [showSplash, setShowSplash] = useState(false);

    useEffect(() => {
        const alreadyShown = sessionStorage.getItem('splashShown');
        if (!alreadyShown) {
            setShowSplash(true);
            sessionStorage.setItem('splashShown', '1');
        }
    }, []);

    const bannerImages = [
        "/slider01.png",
        "/banner02.png",
        "/banner03.png",
        "/banner04.png"
    ];

    if (isLoading) {
        return <PageLoader message="Cargando página principal..." />;
    }

    return (
        <>
            <SplashAdModal
                isOpen={showSplash}
                onClose={() => setShowSplash(false)}
                imageSrc="/SplashModal01.jpg"
                closeOnOverlay={true}
            />
            <div>
                <BrandsCarousel />
                <Banner images={bannerImages} interval={5000} />
                <div className="space-y-18 ">
                    <DescripcionAquapartes />
                    <CategoriesGrid />
                </div>
            </div>
        </>
    );
};