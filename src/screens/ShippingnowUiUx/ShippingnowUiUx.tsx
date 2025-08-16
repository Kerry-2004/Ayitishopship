import React from "react";
import { useState } from "react";
import { Menu, X, ChevronDown, User, Package, Phone, Home, CreditCard } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export const ShippingnowUiUx = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navigationItems = [
    { 
      label: "Accueil", 
      active: true, 
      icon: Home,
      href: "#accueil"
    },
    { 
      label: "Services", 
      active: false, 
      icon: Package,
      href: "#services",
      dropdown: [
        { label: "Achats en ligne", href: "#achats" },
        { label: "Expédition express", href: "#express" },
        { label: "Consolidation", href: "#consolidation" }
      ]
    },
    { 
      label: "Suivi de colis", 
      active: false, 
      icon: Package,
      href: "#suivi"
    },
    { 
      label: "Tarifs", 
      active: false, 
      icon: CreditCard,
      href: "#tarifs"
    },
    { 
      label: "Contact", 
      active: false, 
      icon: Phone,
      href: "#contact"
    },
  ];

  const serviceCards = [
    {
      title: "Achats en Ligne",
      description:
        "Commandez sur vos sites préférés comme Amazon, eBay, AliExpress, Shein, Temu, ou FashionNova",
      image: "/achats-en-ligne.png",
      alt: "Achats en ligne",
    },
    {
      title: "Livraison dans 3 grandes villes",
      description: "Port-au-Prince, Cap-Haïtien et Les Cayes.",
      image: "/haiti.png",
      alt: "Haiti",
    },
    {
      title: "Suivi en temps réel",
      description: "Restez informé, à chaque étape du voyage de votre colis.",
      image: "/suivi.png",
      alt: "Suivi",
    },
  ];

  const statistics = [
    { value: "3 +", label: "Villes" },
    { value: "5 ans", label: "Experience" },
    { value: "800+", label: "Expertist" },
  ];

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="relative">
          {/* Top bar with contact info - Desktop only */}
          <div className="hidden lg:flex justify-between items-center py-2 text-sm border-b border-gray-100">
            <div className="flex items-center gap-6 text-gray-600">
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +1 (555) 123-4567
              </span>
              <span>📧 info@ayitishopship.com</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Suivez-nous:</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-blue-50">
                  <span className="text-blue-600">📘</span>
                </Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-blue-50">
                  <span className="text-blue-400">🐦</span>
                </Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-pink-50">
                  <span className="text-pink-600">📷</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Main navigation */}
          <div className="flex items-center justify-between py-4 lg:py-6">
            {/* Logo */}
            <div className="flex items-center">
              <img
                className="w-32 h-20 sm:w-36 sm:h-24 lg:w-40 lg:h-28 object-contain"
                alt="Logo principale"
                src="/LOGO.png"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navigationItems.map((item, index) => (
                <div key={index} className="relative group">
                  <Button
                    variant="ghost"
                    className={`h-auto px-4 py-2 font-poppins text-sm tracking-[0] leading-[normal] transition-all duration-300 hover:bg-blue-50 rounded-lg ${
                      item.active
                        ? "font-semibold text-[#001b72] bg-blue-50"
                        : "font-medium text-[#001b72] hover:text-[#ea002a]"
                    }`}
                    onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                    {item.dropdown && <ChevronDown className="w-4 h-4 ml-1" />}
                  </Button>

                  {/* Dropdown Menu */}
                  {item.dropdown && activeDropdown === item.label && (
                    <div 
                      className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 opacity-100 transform translate-y-0 transition-all duration-200"
                      onMouseEnter={() => setActiveDropdown(item.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {item.dropdown.map((dropItem, dropIndex) => (
                        <a
                          key={dropIndex}
                          href={dropItem.href}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#001b72] transition-colors duration-200"
                        >
                          {dropItem.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Account Button */}
              <Button
                variant="outline"
                className="h-auto px-6 py-2 font-poppins font-medium text-[#001b72] text-sm border-[#001b72] hover:bg-[#001b72] hover:text-white transition-all duration-300 rounded-lg"
              >
                <User className="w-4 h-4 mr-2" />
                Compte
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-[#001b72]" />
                ) : (
                  <Menu className="w-6 h-6 text-[#001b72]" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
              <nav className="py-4">
                {navigationItems.map((item, index) => (
                  <div key={index}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start h-auto px-6 py-4 font-poppins text-sm tracking-[0] leading-[normal] transition-all duration-200 hover:bg-blue-50 ${
                        item.active
                          ? "font-semibold text-[#001b72] bg-blue-50"
                          : "font-medium text-[#001b72]"
                      }`}
                      onClick={() => {
                        if (item.dropdown) {
                          setActiveDropdown(activeDropdown === item.label ? null : item.label);
                        } else {
                          setIsMenuOpen(false);
                        }
                      }}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.label}
                      {item.dropdown && (
                        <ChevronDown className={`w-4 h-4 ml-auto transition-transform duration-200 ${
                          activeDropdown === item.label ? 'rotate-180' : ''
                        }`} />
                      )}
                    </Button>

                    {/* Mobile Dropdown */}
                    {item.dropdown && activeDropdown === item.label && (
                      <div className="bg-gray-50 border-t border-gray-100">
                        {item.dropdown.map((dropItem, dropIndex) => (
                          <a
                            key={dropIndex}
                            href={dropItem.href}
                            className="block px-12 py-3 text-sm text-gray-600 hover:text-[#001b72] hover:bg-white transition-colors duration-200"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {dropItem.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Mobile Account Button */}
                <div className="px-6 pt-4 border-t border-gray-100 mt-4">
                  <Button
                    variant="outline"
                    className="w-full justify-center h-auto px-6 py-3 font-poppins font-medium text-[#001b72] text-sm border-[#001b72] hover:bg-[#001b72] hover:text-white transition-all duration-300 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Mon Compte
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="py-2 lg:py-4" id="accueil">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="order-2 lg:order-1 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-sm font-medium text-[#001b72] mb-6">
                ✈️ Expéditions rapides et fiables
              </div>
              
              <h1 className="font-poppins font-bold text-[#001b72] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl tracking-tight leading-tight mb-3">
                Votre passerelle entre<br />
                <span className="text-[#ea002a]">les États-Unis</span> et <span className="text-[#ea002a]">Haïti</span>
              </h1>

              <p className="font-poppins font-normal text-gray-600 text-lg sm:text-xl lg:text-xl tracking-[0] leading-relaxed mb-5 max-w-lg mx-auto lg:mx-0">
                Expéditions aériennes rapides et fiables vers Port-au-Prince,
                Cap-Haïtien, et Les Cayes. Votre confiance, notre priorité.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-5">
                <Button className="group w-full sm:w-auto px-8 py-4 bg-[#ea002a] rounded-full font-poppins font-semibold text-white text-lg tracking-[0] leading-[normal] hover:bg-[#ea002a]/90 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <Package className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Commencer un envoi
                </Button>

                <Button
                  variant="outline"
                  className="group w-full sm:w-auto px-8 py-4 rounded-full border-2 border-[#001b72] font-poppins font-semibold text-[#001b72] text-lg tracking-[0] leading-[normal] bg-transparent hover:bg-[#001b72] hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  <Package className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Suivre un colis
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Service 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Suivi en temps réel</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Livraison garantie</span>
                </div>
              </div>
            </div>

            {/* Right Content - Image and Statistics */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative">
                <img
                  className="w-full max-w-md mx-auto lg:max-w-full object-contain drop-shadow-2xl"
                  alt="Box image"
                  src="/box-image.png"
                />
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-2xl">✈️</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-xl">📦</span>
                </div>
              </div>

              {/* Statistics - Desktop */}
              <div className="hidden md:flex flex-col gap-6 absolute top-8 right-4 lg:right-8">
                {statistics.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center transform hover:scale-105 transition-transform duration-300">
                    <div className="font-poppins font-bold text-[#ea002a] text-xl lg:text-2xl tracking-[0] leading-[normal]">
                      {stat.value}
                    </div>
                    <div className="font-poppins font-medium text-[#001b72] text-xs lg:text-sm tracking-[0] leading-[normal]">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Statistics - Mobile */}
              <div className="md:hidden flex justify-center gap-6 mt-8">
                {statistics.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center flex-1 max-w-[100px]">
                    <div className="font-poppins font-bold text-[#ea002a] text-lg tracking-[0] leading-[normal]">
                      {stat.value}
                    </div>
                    <div className="font-poppins font-medium text-[#001b72] text-xs tracking-[0] leading-[normal]">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-8 lg:py-12" id="services">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-red-50 rounded-full text-sm font-medium text-[#ea002a] mb-6">
              🚀 Nos Services
            </div>
            
            <h2 className="font-poppins font-bold text-[#001b72] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl tracking-tight leading-tight mb-4">
              Des services adaptés à vos besoins
            </h2>

            <p className="font-poppins font-normal text-gray-600 text-lg sm:text-xl lg:text-xl text-center tracking-[0] leading-relaxed max-w-3xl mx-auto">
              Découvrez nos solutions conçues pour rendre vos expéditions simples,
              rapides et fiables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCards.map((card, index) => (
              <Card
                key={index}
                className="group rounded-3xl border-2 border-dashed border-[#ea002a] bg-white hover:border-solid hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden"
              >
                <CardContent className="p-8 text-center h-full flex flex-col relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-red-100 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-500">
                      <img
                        className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-500"
                        alt={card.alt}
                        src={card.image}
                      />
                    </div>

                    <h3 className="font-poppins font-bold text-[#ea002a] text-xl lg:text-2xl text-center tracking-[0] leading-tight mb-4 group-hover:text-[#001b72] transition-colors duration-300">
                      {card.title}
                    </h3>

                    <p className="font-poppins font-normal text-gray-600 text-base lg:text-lg text-center tracking-[0] leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {card.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-8 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-sm font-medium text-[#001b72] mb-6">
                ⭐ Pourquoi nous choisir
              </div>
              
              <h2 className="font-poppins font-bold text-[#001b72] text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight mb-4">
                Pourquoi choisir<br />
                <span className="text-[#ea002a]">AyitiShop&Ship</span> ?
              </h2>

              <p className="font-poppins font-medium text-gray-600 text-xl lg:text-2xl tracking-[0] leading-relaxed max-w-md mx-auto lg:mx-0 mb-6">
                Une expérience de confiance et<br />
                de qualité à chaque étape
              </p>

              {/* Features list */}
              <div className="space-y-4 text-left max-w-md mx-auto lg:mx-0">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">Livraison rapide et sécurisée</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">Suivi en temps réel 24/7</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">Support client exceptionnel</span>
                </div>
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="order-first lg:order-last">
              <div className="relative">
                <img
                  className="w-full max-w-md mx-auto lg:max-w-full object-contain rounded-2xl shadow-2xl"
                  alt="Image"
                  src="/image-2-1.png"
                />
                
                {/* Decorative elements */}
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-red-200 to-red-300 rounded-full opacity-20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Spacer */}
        <div className="pb-6"></div>
      </div>
    </div>
  );
};