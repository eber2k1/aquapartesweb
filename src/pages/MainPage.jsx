import { Banner } from "../components/Banner";
import { DescripcionAquapartes } from "../components/DescripcionAquapartes";
import { BrandsCarousel } from "../components/BrandsCarousel";
import { CategoriesGrid } from "../components/CategoriesGrid";

export const MainPage = () => {
    const bannerImages = [
        "/banner-main-products.png",
        "/banner-membranes-toray.png",
        "/banner-valves-pentair.png",
        "/banner-bomb-flint-and-walling.png"
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