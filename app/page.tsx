import Link from "next/link";

export default function Home() {
  return (
    <>
      <header className="py-4 fixed w-full top-0 z-50 bg-gradient-to-b from-white to-transparent">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="border border-gray-200/50 rounded-full bg-white/80 backdrop-blur-md shadow-sm">
            <div className="flex justify-between items-center px-6 py-2.5">
              {/* Logo */}
              <a href="/" className="flex items-center">
                <span className="text-xl font-bold text-[#D2232A]">
                  Geoshare
                </span>
              </a>

              {/* Navigation desktop */}
              <nav className="hidden lg:flex gap-8">
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-[#D2232A] transition-colors">Accueil</a>
                <a href="#fonctionnalites" className="text-sm font-medium text-gray-700 hover:text-[#D2232A] transition-colors">Fonctionnalités</a>
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-[#D2232A] transition-colors">Carte</a>
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-[#D2232A] transition-colors">Contact</a>
              </nav>

              {/* Boutons */}
              <div className="flex items-center gap-3">
                {/* Menu mobile */}
                <button className="lg:hidden p-2 text-gray-700 hover:text-[#D2232A] hover:bg-gray-100 rounded-lg transition-all">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Boutons desktop */}
                <div className="hidden lg:flex gap-3">
                  <Link href="/login">
                    <button className="rounded-full px-5 py-2 text-sm font-medium text-gray-700 hover:text-[#D2232A] hover:bg-gray-100 transition-all">
                      se connecter
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="rounded-full px-5 py-2 text-sm font-semibold bg-[#D2232A] hover:bg-[#B01E24] text-white shadow-md hover:shadow-lg transition-all">
                      s'inscrire
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-28 min-h-screen bg-gradient-to-b from-red-50 via-white to-gray-50">
        {/* Hero Section */}
        <div className="container max-w-6xl mx-auto px-4 text-center py-20">
          <h1 className="text-5xl md:text-6xl font-bold text-[#D2232A] mb-6">
            Recensez et gérez les infrastructures sportives de Normandie
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Plateforme collaborative pour les associations et entreprises permettant de recenser, gérer et partager les infrastructures sportives de la région.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <button className="rounded-full px-8 py-3 text-base font-semibold bg-[#D2232A] hover:bg-[#B01E24] text-white shadow-lg hover:shadow-xl transition-all">
                Commencer maintenant
              </button>
            </Link>
            <Link href="/map">
            <button className="rounded-full px-8 py-3 text-base font-medium text-gray-700 border-2 border-gray-300 hover:border-[#D2232A] hover:text-[#D2232A] transition-all">
              Voir la carte
            </button>
            </Link>
          </div>
        </div>

        {/* Section Comment ça marche */}
        <section id="fonctionnalites" className="py-20 bg-white">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Comment ça fonctionne ?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Une solution simple et collaborative pour recenser et gérer les infrastructures sportives de votre région.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Étape 1 */}
              <div className="text-center p-6 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-[#D2232A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Inscrivez votre organisation
                </h3>
                <p className="text-gray-600">
                  Créez un compte pour votre association ou entreprise et accédez à la plateforme de recensement.
                </p>
              </div>

              {/* Étape 2 */}
              <div className="text-center p-6 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-[#D2232A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Recensez vos infrastructures
                </h3>
                <p className="text-gray-600">
                  Ajoutez vos équipements sportifs sur la carte : gymnases, terrains, piscines, stades et plus encore.
                </p>
              </div>

              {/* Étape 3 */}
              <div className="text-center p-6 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-[#D2232A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Gérez vos infrastructures
                </h3>
                <p className="text-gray-600">
                  Mettez à jour les informations, modifiez les caractéristiques et maintenez vos données à jour en temps réel.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Avantages */}
        <section className="py-20 bg-gray-50">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Pourquoi utiliser Geoshare ?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Pour les particuliers</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#D2232A] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Découvrez toutes les infrastructures sportives près de chez vous</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#D2232A] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Consultez les horaires et disponibilités en temps réel</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#D2232A] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Trouvez le terrain idéal pour votre activité sportive</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Pour les associations</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#D2232A] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Trouvez facilement des infrastructures disponibles près de chez vous</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#D2232A] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Partagez vos équipements avec d'autres associations</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#D2232A] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Gérez les réservations et disponibilités en temps réel</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Pour les collectivités</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#D2232A] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Centralisez toutes les infrastructures de votre territoire</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#D2232A] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Suivez l'utilisation et optimisez vos équipements</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#D2232A] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Facilitez l'accès aux données pour tous les acteurs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
