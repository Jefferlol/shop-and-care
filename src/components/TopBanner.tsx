import React from 'react';
import { useApp } from '../context/AppContext';

export const TopBanner: React.FC = () => {
  const { hasDiscount, discountCode } = useApp();

  return (
    <aside aria-label="Información operativa y beneficios" className="w-full bg-primary-container text-on-primary text-xs py-2 px-margin border-b border-primary/40 relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-[11.5px] sm:text-xs">
          <span className="inline-flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[16px] text-secondary-fixed-dim">verified</span>
            Telas antifluido y antibacteriales
          </span>
          <span className="hidden sm:inline text-on-primary/30">•</span>
          <span className="inline-flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[16px] text-secondary-fixed-dim">straighten</span>
            Tallas desde XS hasta XL
          </span>
          <span className="hidden md:inline text-on-primary/30">•</span>
          <span className="inline-flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[16px] text-secondary-fixed-dim">local_shipping</span>
            Envíos a todo el Perú
          </span>
          <span className="hidden lg:inline text-on-primary/30">•</span>
          <span className="hidden lg:inline-flex items-center gap-1 font-medium text-secondary-fixed-dim">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            Atención por WhatsApp de 8:00 a. m. a 9:00 p. m.
          </span>
        </div>

        {hasDiscount && (
          <div className="inline-flex items-center gap-1.5 bg-tertiary-fixed text-primary-container font-bold px-2.5 py-0.5 rounded-full text-[11px] shadow-sm animate-pulse">
            <span className="material-symbols-outlined text-[14px]">sell</span>
            <span>15% DTO Activo: {discountCode}</span>
          </div>
        )}
      </div>
    </aside>
  );
};
