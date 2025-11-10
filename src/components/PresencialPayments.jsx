import React from 'react';

export const PresencialPayments = () => {
    return (
        <section
            className="relative isolate my-6 overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-r from-white to-sky-50 shadow-sm hover:shadow-md transition-shadow"
            role="region"
            aria-label="Pagos presenciales Visa y Mastercard"
        >
            <div className="px-4 sm:px-6 py-5 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                <div className="w-full md:w-auto text-center md:text-left">
                    <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 text-sky-800 px-3 py-1 text-xs font-semibold">
                        <span>Pagos presenciales</span>
                    </div>
                    <h3 className="mt-3 text-base sm:text-lg font-semibold text-gray-900">
                        Aceptamos Visa y Mastercard
                    </h3>
                    
                    <p className="mt-1 text-xs sm:text-sm text-gray-500">
                        Atendemos pagos presenciales en nuestras oficinas en Jr. Juan Chávez Tueros 1235, Urb. Chacra Ríos Sur, Lima, Perú
                    </p>
                </div>

                <div className="w-full md:w-auto">
                    <div className="flex items-center gap-4 md:gap-6 rounded-lg bg-white/80 ring-1 ring-gray-200 px-4 py-3 backdrop-blur-sm">
                        <img
                            src="/Visa_Inc._logo.svg"
                            alt="Logo de Visa"
                            className="h-8 sm:h-10 w-auto object-contain"
                            loading="lazy"
                        />
                        <span className="h-6 w-px bg-gray-200 hidden sm:block" />
                        <img
                            src="/Mastercard-logo.svg"
                            alt="Logo de Mastercard"
                            className="h-8 sm:h-10 w-auto object-contain"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};