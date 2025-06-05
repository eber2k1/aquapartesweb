export const DescripcionAquapartes = () => {
    return (
        <section className="w-full py-8 px-4 md:px-16 bg-white">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
            {/* Contenedor de la descripción */}
            <div className="flex-1 h-full flex items-center justify-center">
              <div className="text-center md:text-left space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-sky-950">
                  ¿Quiénes Somos?
                </h2>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  <strong>AquaPartes</strong>, es una empresa íntegramente peruana especializada en Sistemas de Tratamiento de Agua, Efluentes Domésticos y Efluentes Industriales para los diversos sectores de la industria nacional. Cuenta con 29 años de servicio y experiencia en el diseño, importación, asesoría, automatización y mantenimiento de Sistemas y Equipos de Tratamiento de Agua, al servicio de la industria nacional, atendiendo permanentemente a más de <strong>200 empresas</strong> del mercado local, las que están muy satisfechas con nuestro servicio.
                </p>
              </div>
            </div>
    
            {/* Contenedor de la imagen */}
            <div className="flex-1 h-full flex items-center justify-center">
              <img
                src="./../../public/aquapartes-desc.jpg"
                alt="AquaPartes Descripción"
                className="w-full h-full max-h-80 object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        </section>
      );
}