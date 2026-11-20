import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { activeTab, navigateTo, hasDiscount, discountCode, cartTotalCount, setIsCartOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: 'inicio' | 'catalogo' | 'kit' | 'guia'; label: string }[] = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'catalogo', label: 'Catálogo' },
    { id: 'kit', label: 'Arma tu Kit' },
    { id: 'guia', label: 'Comunidad y Contacto' },
  ];

  const handleNavClick = (tab: 'inicio' | 'catalogo' | 'kit' | 'guia') => {
    navigateTo(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-high">
      {/* Top Notice Announcement Strip with Operational Benefits */}
      <div className="w-full bg-primary-container text-on-primary py-1.5 px-margin text-center font-label-sm text-label-sm tracking-wide flex items-center justify-center gap-space-xs flex-wrap">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center text-[11px] sm:text-xs">
          <span className="inline-flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[15px] text-secondary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            Telas antifluido y antibacteriales
          </span>
          <span className="opacity-40">•</span>
          <span className="inline-flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[15px] text-secondary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>
              straighten
            </span>
            Tallas XS a XL
          </span>
          <span className="opacity-40">•</span>
          <span className="inline-flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[15px] text-secondary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_shipping
            </span>
            Envíos a todo el Perú
          </span>
          <span className="opacity-40 mx-1 hidden md:inline">|</span>
          <span className="font-bold text-tertiary-fixed hidden md:inline">CAMPAÑA 2026:</span>
          <span className="font-semibold hidden md:inline">{hasDiscount ? `15% DTO ACTIVO (${discountCode})` : '15% DTO en kits'}</span>
        </div>
      </div>

      <div className="h-20 max-w-7xl mx-auto px-margin flex items-center justify-between gap-space-md">
        {/* Brand identity from Stitch */}
        <div 
          onClick={() => handleNavClick('inicio')}
          className="flex items-center gap-space-sm cursor-pointer select-none group"
        >
          <img 
            src="/Logo.jpeg" 
            alt="Shop & Care Logo" 
            className="w-10 h-10 rounded-xl object-contain shadow-sm border border-surface-container-high bg-white p-0.5 group-hover:scale-105 transition-transform" 
          />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-primary-container tracking-tight leading-none">
              Shop &amp; Care
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-normal mt-0.5">
              Uniformes médicos, mandiles y accesorios
            </span>
          </div>
        </div>

        {/* Segmented Navbar from Stitch */}
        <nav className="hidden lg:flex items-center bg-surface-container-low p-1.5 rounded-lg border border-surface-container-high gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`font-label-lg text-label-lg px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-secondary-fixed text-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Button & Cart Trigger */}
        <div className="flex items-center gap-space-sm sm:gap-space-md">
          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full bg-surface-container-low hover:bg-secondary-fixed text-primary transition-all flex items-center justify-center cursor-pointer shadow-xs border border-surface-container-high"
            aria-label="Ver Carrito de Compras"
            title="Mi Carrito de Compras"
          >
            <span className="material-symbols-outlined text-[22px] text-primary-container">shopping_bag</span>
            {cartTotalCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-tertiary-fixed text-primary-container font-headline-sm font-bold text-[11px] flex items-center justify-center border-2 border-surface-container-lowest animate-pulse shadow-sm">
                {cartTotalCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('guia')}
            className="hidden sm:inline-flex relative items-center gap-space-xs bg-tertiary-fixed text-primary font-label-lg text-label-lg px-space-md py-2.5 rounded-full hover:bg-tertiary-fixed-dim transition-colors shadow-[0_2px_8px_-2px_rgba(13,51,101,0.05)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>Asesoría y Contacto</span>
            <span className="bg-primary text-on-primary font-label-sm text-label-sm px-1.5 py-0.5 rounded-full uppercase ml-1">
              {hasDiscount ? 'ACTIVO' : '15% DTO'}
            </span>
          </button>

          {/* User profile avatar directly from Stitch */}
          <div className="hidden sm:flex items-center gap-space-xs pl-space-xs">
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-secondary-fixed"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWoaciru_fMiZBbrSNKMC4EUdDVrgiHlBgckY_fFlLiJZtvUFpL__5MVcp9sCLB1VDvrsASc7teZ6hvEWyjrfLbShTPfA8KxI2rbGg3rvYde8bBpnuHP_hwm6fdT5xyMgSFuQ0NIM7Jcbe4V5DywOZmKIoZW9R6dYzqNz6JetoDXSRH1Z0NI1so2JTW6NlFRTVJ8nWyP51Q_orgxBbr5ZXqS04T51NJesNnLqxftzM"
            />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-primary-container"
            aria-label="Menú"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-t border-surface-container-high px-margin py-space-md flex flex-col gap-2 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left font-label-lg text-label-lg p-3 rounded-lg ${
                activeTab === item.id
                  ? 'bg-secondary-fixed text-primary font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-surface-container-high flex justify-between items-center text-xs text-on-surface-variant">
            <button
              onClick={() => {
                navigateTo('admin');
                setMobileMenuOpen(false);
              }}
              className="font-label-sm text-label-sm text-secondary hover:underline"
            >
              Panel Administrativo
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
