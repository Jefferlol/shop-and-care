import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { navigateTo, whatsappNumber } = useApp();

  return (
    <footer className="w-full bg-primary-container text-on-primary py-space-xl border-t border-primary/40">
      <div className="max-w-7xl mx-auto px-margin">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg pb-space-lg border-b border-on-primary/10">
          {/* Col 1: Brand Info */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <img 
                src="/Logo.jpeg" 
                alt="Shop & Care Logo" 
                className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 shadow-sm" 
              />
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-primary font-bold tracking-tight">Shop &amp; Care</span>
                <span className="font-label-sm text-label-sm text-secondary-fixed-dim">Uniformes médicos, accesorios y más</span>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-primary/80 leading-relaxed">
              Equipamiento clínico de precisión, confección peruana de alta tecnología antifluido y soporte profesional para estudiantes, internos y profesionales de la salud.
            </p>
            <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-secondary-fixed-dim">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Confección nacional y telas antifluido de alta durabilidad</span>
            </div>
            <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-secondary-fixed-dim">
              <span className="material-symbols-outlined text-[16px]">local_shipping</span>
              <span>Envíos express por Shalom y Olva Courier a todo el Perú</span>
            </div>
          </div>

          {/* Col 2: Navegación Rápida */}
          <div className="flex flex-col gap-2.5">
            <span className="font-label-md text-label-md font-bold uppercase tracking-wider text-secondary-fixed-dim">
              Navegación
            </span>
            <ul className="space-y-1.5 font-body-sm text-body-sm text-on-primary/80">
              <li>
                <button
                  onClick={() => navigateTo('inicio')}
                  className="hover:text-secondary-fixed-dim transition-colors cursor-pointer"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalogo')}
                  className="hover:text-secondary-fixed-dim transition-colors cursor-pointer"
                >
                  Catálogo Médico
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('kit')}
                  className="hover:text-secondary-fixed-dim transition-colors cursor-pointer"
                >
                  Arma tu Kit Personalizado
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('guia')}
                  className="hover:text-secondary-fixed-dim transition-colors cursor-pointer"
                >
                  Comunidad y Contacto
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Atención & Contacto Directo */}
          <div className="flex flex-col gap-2.5">
            <span className="font-label-md text-label-md font-bold uppercase tracking-wider text-secondary-fixed-dim">
              Atención Inmediata
            </span>
            <p className="font-body-sm text-body-sm text-on-primary/80">
              ¿Dudas sobre tallas o pedidos? Nuestro equipo te asiste en vivo por WhatsApp:
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola Shop & Care, tengo una consulta sobre sus uniformes médicos e instrumental.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-secondary-fixed-dim text-primary-container font-headline-sm text-body-sm font-bold px-4 py-2.5 rounded-xl hover:bg-secondary-container transition-all shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Consultar por WhatsApp</span>
            </a>
            <span className="font-label-sm text-[11px] text-on-primary/60">
              Lunes a Domingo de 8:00 a. m. a 9:00 p. m.
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm font-body-sm text-body-sm text-on-primary/70">
          <p>© 2024-2026 Shop &amp; Care Perú. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Lima, Perú</span>
            <span>•</span>
            <button
              onClick={() => navigateTo('admin')}
              className="hover:text-secondary-fixed-dim text-on-primary/50 transition-colors cursor-pointer"
            >
              Panel Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
