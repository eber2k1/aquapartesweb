import { useState, useEffect } from 'react';
import { Banner } from "../components/Banner";
import { DescripcionAquapartes } from "../components/DescripcionAquapartes";
import { BrandsCarousel } from "../components/BrandsCarousel";
import { CategoriesGrid } from "../components/CategoriesGrid";
import PageLoader from '../components/PageLoader';

export const MainPage = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <PageLoader message="Cargando página principal..." />;
    }
    const bannerImages = [
        "/banner01.png",
        "/banner02.png",
        "/banner03.png",
        "/banner04.png"
    ];
    
    return (
        <div className="space-y-12">
            <Banner images={bannerImages} interval={5000} />
            <DescripcionAquapartes />
            <CategoriesGrid />
            <BrandsCarousel />
        </div>
    );
};