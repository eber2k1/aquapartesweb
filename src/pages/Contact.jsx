import { useState, useEffect } from 'react';
import PageLoader from '../components/PageLoader';

export const Contact = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <PageLoader message="Cargando contacto..." />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Contacto</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-700 mb-4">
                    ¿Tienes alguna pregunta o necesitas más información? No dudes en contactarnos.
                </p>
                {/* Add your contact form or information here */}
            </div>
        </div>
    );
};