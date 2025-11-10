import React from 'react';

export const PresencialPayments = () => {
    return (
        <section className="w-full bg-white border border-gray-200 rounded-lg shadow-sm my-6">
            <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                    <p className="text-sm sm:text-base text-gray-600">
                        Pagos presenciales disponibles con
                        <span className="font-semibold text-gray-900"> Visa</span> y
                        <span className="font-semibold text-gray-900"> Mastercard</span>.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Atendemos pagos presenciales en nuestras oficinas y almacén en Jr. Juan Chávez Tueros 1235, 3er piso, Urb. Chacra Ríos Sur, Lima, Perú
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <img
                        src="/Visa_Inc._logo.svg"
                        alt="Visa"
                        className="h-8 sm:h-10 w-auto"
                        loading="lazy"
                    />
                    <img
                        src="/Mastercard-logo.svg"
                        alt="Mastercard"
                        className="h-8 sm:h-10 w-auto"
                        loading="lazy"
                    />
                </div>
            </div>
        </section>
    );
};