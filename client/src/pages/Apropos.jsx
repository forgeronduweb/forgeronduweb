const Apropos = () => {
  const profileImage = "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=451&h=451&auto=format&fit=crop";

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-semibold text-center mx-auto px-4">À propos de moi</h1>
      <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto px-4">
        Découvrez mon parcours, mes compétences et ma passion pour le développement web.
      </p>
      
      <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-16">
            <div className="text-sm md:text-base text-gray-700 max-w-2xl h-full flex flex-col">
              <h2 className="text-lg md:text-xl font-medium text-black mb-6">
                Salut, c'est Evrard 👋
              </h2>

              <p className="mb-4 leading-relaxed">
                Développeur Full Stack JavaScript freelance. Passionné par le développement web depuis plusieurs années, j'aide les entreprises et particuliers à créer leurs projets digitaux.
              </p>
              <p className="mb-4 leading-relaxed">
                Mon expertise couvre <strong>React</strong>, <strong>Node.js</strong>, <strong>TypeScript</strong> et les bases de données modernes. J'aime créer des applications web performantes, des APIs robustes et des solutions e-commerce qui répondent aux besoins réels de mes clients.
              </p>
              <p className="mb-4 leading-relaxed">
                Titulaire d'une <strong>Licence en Informatique et Sciences du Numérique</strong> avec une spécialité en E-commerce & Marketing Digital, je combine compétences techniques et vision business pour livrer des projets qui ont du sens.
              </p>
              <p className="mb-4 leading-relaxed">
                Quand je ne code pas, j'aime partager mes connaissances et aider d'autres développeurs à progresser. Chaque projet est une nouvelle aventure où j'apprends quelque chose de nouveau.
              </p>
              <p className="font-medium leading-relaxed">
                Transformons ensemble vos idées en applications web modernes et performantes.
              </p>
            </div>

            <div className="relative shadow-2xl shadow-indigo-600/40 rounded-2xl overflow-hidden shrink-0">
              <img
                className="max-w-md w-full object-cover rounded-2xl"
                src={profileImage}
                alt="Photo de profil d'Evrard"
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Apropos;