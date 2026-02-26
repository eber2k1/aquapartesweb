import { useState, useEffect } from 'react';
import { Banner } from "../components/Banner";
import { DescripcionAquapartes } from "../components/DescripcionAquapartes";
import { BrandsCarousel } from "../components/BrandsCarousel";
import { CategoriesGrid } from "../components/CategoriesGrid";
import PageLoader from '../components/PageLoader';
// MainPage component
import { PresencialPayments } from '../components/PresencialPayments';
import { SplashAdModal } from '../components/SplashAdModal';
import { InstallModal } from '../components/InstallModal';

export const MainPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSplashOpen, setIsSplashOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Abrir el modal cuando termina la carga inicial
    useEffect(() => {
        if (!isLoading) {
            setIsSplashOpen(true);
        }
    }, [isLoading]);

    if (isLoading) {
        return <PageLoader message="Cargando página principal..." />;
    }

    const bannerImages = [
        "/slider01.png",
        "/banner02.png",
        "/banner03.png",
        "/banner04.png"
    ];

    return (
        <>
            <InstallModal />
            {/* <SplashAdModal
                isOpen={isSplashOpen}
                onClose={() => setIsSplashOpen(false)}
                images={[
                    '/adds/Add-NewYear.jpeg'
                ]}
                intervalMs={10000}
                autoRotate={true}
            /> */}
            <div>
                <BrandsCarousel />
                <Banner images={bannerImages} interval={10000} />
                <div className="space-y-18 ">
                    <DescripcionAquapartes />
                    <CategoriesGrid />
                    <PresencialPayments />
                </div>
            </div>
        </>
    );
};