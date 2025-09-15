const Apropos = () => {
  const techLogos = ["react", "nodejs", "javascript", "typescript", "mongodb", "postgresql", "docker"];

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-semibold text-center mx-auto px-4">À propos de moi</h1>
      <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto px-4">
        Découvrez mon parcours, mes compétences et ma passion pour le développement web.
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-8 pt-8 md:pt-12">
        <div className="min-h-screen w-full bg-white">
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
            <section className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-16">
              {/* Text Content */}
              <div className="flex-1 max-w-3xl">
                <div className="space-y-4 md:space-y-6 text-gray-700 leading-relaxed md:leading-loose">
                  <p className="text-base md:text-lg mb-4 md:mb-6">
                    Je suis <span className="font-semibold text-black">Philomé Evrard Baho</span>, 
                    <span className="font-semibold text-black"> Développeur Full Stack JavaScript freelance</span> basé au 
                    <span className="font-semibold text-black"> Bénin</span>, spécialisé en 
                    <span className="font-semibold text-black"> React, Node.js, TypeScript</span> et les bases de données modernes.
                  </p>

                  <p className="mb-4 md:mb-6">
                    J'accompagne <span className="font-semibold text-black">entreprises et particuliers</span> dans la création d'
                    <span className="font-semibold text-black">applications web performantes</span>, d'
                    <span className="font-semibold text-black">APIs REST robustes</span> et de 
                    <span className="font-semibold text-black">solutions e-commerce sur mesure</span>. 🚀
                  </p>

                  <p className="mb-4 md:mb-6">
                    Titulaire d'une <span className="font-semibold text-black">Licence en Informatique et Sciences du Numérique</span> 
                    (spécialité E-commerce & Marketing Digital) et certifié en Développement Web & Mobile ainsi qu'en Community Management, 
                    je vous apporte bien plus qu'une expertise technique.
                  </p>

                  <p className="mb-4 md:mb-6">
                    Mon rôle est simple : concevoir et développer des <span className="font-semibold text-black">solutions digitales modernes</span> 
                    tout en garantissant une <span className="font-semibold text-black">expérience utilisateur exceptionnelle</span>.
                  </p>

                  <p className="mb-4 md:mb-6">
                    Grâce à ma <span className="font-semibold text-black">double compétence en développement web et en marketing digital</span>, 
                    je vous aide à bâtir des produits solides, visibles et adoptés par vos utilisateurs.
                  </p>
                </div>

                <div className="mt-6 md:mt-8">
                  <button className="flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-medium transition-all hover:scale-105 shadow-lg w-full sm:w-auto justify-center">
                    <span className="text-sm md:text-base">Découvrir mes projets</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 8h14m0 0L8 1m7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Image */}
              <div className="flex-1 flex justify-center lg:justify-end mt-8 lg:mt-0">
                <div className="relative">
                  <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden border-4 border-black shadow-2xl">
                    <img 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                      src="https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=451&h=451&auto=format&fit=crop"
                      alt="Evrard - Développeur Full Stack" 
                    />
                  </div>
                  {/* Decorative element */}
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 sm:w-24 sm:h-24 bg-black rounded-2xl -z-10"></div>
                </div>
              </div>
            </section>
          </div>

          {/* Skills Section */}
          <div className="bg-gray-50 py-8 md:py-16">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl md:text-3xl font-semibold text-center mx-auto">
                  Technologies & Compétences
                </h2>
                <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto px-4">
                  Une stack technique moderne pour créer des solutions web performantes et évolutives
                </p>
              </div>

              {/* Tech Stack Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6 mb-8 md:mb-12">
                {techLogos.map((tech, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all hover:scale-105 border border-gray-200">
                    <img 
                      src={`https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/${tech}.svg`}
                      alt={tech}
                      className="w-8 h-8 md:w-12 md:h-12 mx-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                    <p className="text-center text-xs md:text-sm font-medium text-gray-700 mt-2 capitalize">{tech}</p>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
                  <div className="text-2xl md:text-3xl font-bold text-black mb-1 md:mb-2">3+</div>
                  <div className="text-gray-600 text-sm md:text-base">Années d'expérience</div>
                </div>
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
                  <div className="text-2xl md:text-3xl font-bold text-black mb-1 md:mb-2">50+</div>
                  <div className="text-gray-600 text-sm md:text-base">Projets réalisés</div>
                </div>
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
                  <div className="text-2xl md:text-3xl font-bold text-black mb-1 md:mb-2">100%</div>
                  <div className="text-gray-600 text-sm md:text-base">Clients satisfaits</div>
                </div>
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
                  <div className="text-2xl md:text-3xl font-bold text-black mb-1 md:mb-2">24h</div>
                  <div className="text-gray-600 text-sm md:text-base">Temps de réponse</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Apropos;