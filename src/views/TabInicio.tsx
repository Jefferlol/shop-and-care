import React from 'react';
import { useApp } from '../context/AppContext';

export const TabInicio: React.FC = () => {
  const { navigateTo, whatsappNumber } = useApp();

  return (
    <div className="w-full flex flex-col pt-28 bg-surface-container-lowest min-h-[calc(100vh-140px)] animate-fadeIn">
      {/* 1. Top Hero Section (Split Layout from Stitch Screen 1) */}
      <section className="w-full max-w-7xl mx-auto px-margin py-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
          {/* Left Content Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start gap-space-md">
            {/* Promotional Badge */}
            <div className="inline-flex items-center gap-space-xs bg-tertiary-fixed text-primary px-space-md py-1.5 rounded-full font-label-md text-label-md tracking-wider uppercase shadow-sm">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Confección Médica Peruana • Calidad y Comodidad en Guardia</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight">
              Scrub, Mandil Médico y Uniformes Médicos para tu Internado y Prácticas
            </h1>

            {/* Subtitle */}
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              La mejor <strong>indumentaria médica</strong>, <strong>uniformes para prácticas</strong>, <strong>kit médico</strong> completo y <strong>accesorios médicos</strong> diseñados para estudiantes, internos y profesionales en hospitales y clínicas del Perú. Confección en tela antifluido 4-way stretch, ultra liviana, fresca y antibacterial.
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-wrap items-center gap-space-md pt-space-xs w-full sm:w-auto">
              <button
                onClick={() => navigateTo('catalogo')}
                className="w-full sm:w-auto text-center bg-secondary-fixed text-primary font-label-lg text-label-lg px-space-xl py-3.5 rounded-full hover:bg-secondary-fixed-dim transition-all shadow-[0_4px_16px_rgba(156,203,239,0.4)] flex items-center justify-center gap-space-xs cursor-pointer font-bold"
              >
                <span>Ver Catálogo</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>

              <button
                onClick={() => navigateTo('kit')}
                className="w-full sm:w-auto text-center bg-primary-container text-on-primary font-label-lg text-label-lg px-space-xl py-3.5 rounded-full hover:bg-primary transition-all shadow-sm flex items-center justify-center gap-space-xs cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">medical_services</span>
                <span>Arma tu Kit</span>
              </button>
            </div>

            {/* 3 Real Operational Benefits Bar */}
            <div className="w-full mt-space-lg pt-space-md bg-surface-container-low p-space-md rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-space-md border border-surface-container-high">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[20px] text-secondary">water_drop</span>
                  <span className="font-headline-sm text-body-md font-bold text-primary">Telas antifluido</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Repelentes y antibacteriales</span>
              </div>
              <div className="flex flex-col gap-1 sm:pl-space-sm sm:border-l sm:border-surface-container-high">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[20px] text-secondary">straighten</span>
                  <span className="font-headline-sm text-body-md font-bold text-primary">Tallas XS a XL</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Corte anatómico para guardia</span>
              </div>
              <div className="flex flex-col gap-1 sm:pl-space-sm sm:border-l sm:border-surface-container-high">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[20px] text-secondary">local_shipping</span>
                  <span className="font-headline-sm text-body-md font-bold text-primary">Envíos a todo el Perú</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Lima y provincias con seguimiento</span>
              </div>
            </div>
          </div>

          {/* Right Visual Column (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient decorative blur */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-secondary-fixed/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-60 h-60 bg-tertiary-fixed/30 rounded-full blur-2xl pointer-events-none" />

            {/* Main Photo Frame */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_16px_40px_-8px_rgba(13,51,101,0.16)] bg-surface-container border border-surface-container-high">
              <img
                className="w-full h-[520px] object-cover object-center transform hover:scale-[1.02] transition-transform duration-500"
                alt="Estudiantes e internos de medicina en hospital vestidos con uniformes clínicos Shop & Care"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6cSnL9RyuW1t3O0P9BQHMbp_Zzo1vIRHsBGXQe6krQZ8DP4jvhAuVxPpsCiIhFfuxVnguxDq8twn1jyi3ubZ1-SF9pTqisi8-sUfcEo__GQOLoNoE_-nWAedOtmzj7vFab6fLmDGpKZykG3wVpb44SOvyy47CHcCpqWJrNr7RT8SnvvvY_rMUcjZbhd26ZxpBCMd3HJEQ0ND6AbgmgIXX9KrNdMN3wsfzjxXQ0J5d"
              />
              {/* Floating Overlay Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/95 backdrop-blur-md p-space-md rounded-xl shadow-md flex items-center gap-space-sm border border-surface-container-high">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">verified_user</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-md text-label-md text-primary truncate font-bold">Rotaciones de Emergencia, Sala y UCI</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">Probado por estudiantes e internos en hospitales del Perú</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categorías de Acceso Rápido */}
      <section className="w-full max-w-7xl mx-auto px-margin py-space-xl">
        <div className="flex flex-col items-center text-center gap-space-xs mb-space-lg">
          <span className="font-label-md text-label-md text-secondary font-bold uppercase tracking-wider">
            Explora Nuestro Catálogo
          </span>
          <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">
            Categorías Principales
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Todo lo que necesitas para tu día a día clínico con la mejor confección y acabados de alta resistencia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {/* Tarjeta 1: Scrubs Mujer */}
          <div
            onClick={() => navigateTo('catalogo', { categoria: 'Scrubs Mujer' })}
            className="group p-space-lg bg-surface-container-low rounded-2xl border border-surface-container-high hover:border-secondary hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-primary flex items-center justify-center mb-space-sm">
                <span className="material-symbols-outlined text-[28px]">female</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors font-bold">
                Scrubs Mujer
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Modelos Oriana, Hanny, Urbana, Silvia, Candy y Estefany. Corte estilizado y ergonómico.
              </p>
            </div>
            <div className="mt-space-md flex items-center gap-1 text-secondary font-label-md font-bold text-label-md">
              <span>Ver modelos</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>

          {/* Tarjeta 2: Scrubs Varón */}
          <div
            onClick={() => navigateTo('catalogo', { categoria: 'Scrubs Varón' })}
            className="group p-space-lg bg-surface-container-low rounded-2xl border border-surface-container-high hover:border-secondary hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-primary flex items-center justify-center mb-space-sm">
                <span className="material-symbols-outlined text-[28px]">male</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors font-bold">
                Scrubs Varón
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Modelos Carlos y Boris. Cuello V reforzado, bolsillos funcionales y libertad total de movimiento.
              </p>
            </div>
            <div className="mt-space-md flex items-center gap-1 text-secondary font-label-md font-bold text-label-md">
              <span>Ver modelos</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>

          {/* Tarjeta 3: Mandil Médico y Casacas */}
          <div
            onClick={() => navigateTo('catalogo', { categoria: 'Guardapolvos y Casacas' })}
            className="group p-space-lg bg-surface-container-low rounded-2xl border border-surface-container-high hover:border-secondary hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-surface-container-highest text-primary flex items-center justify-center mb-space-sm">
                <span className="material-symbols-outlined text-[28px]">checkroom</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors font-bold">
                Mandil Médico y Casacas
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Mandil médico Alondra y Moana, uniformes para prácticas antifluido y casaca térmica micropolar.
              </p>
            </div>
            <div className="mt-space-md flex items-center gap-1 text-secondary font-label-md font-bold text-label-md">
              <span>Ver prendas</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>

          {/* Tarjeta 4: Kit Médico y Accesorios */}
          <div
            onClick={() => navigateTo('catalogo', { categoria: 'Instrumental' })}
            className="group p-space-lg bg-surface-container-low rounded-2xl border border-surface-container-high hover:border-secondary hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-primary flex items-center justify-center mb-space-sm">
                <span className="material-symbols-outlined text-[28px]">stethoscope</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors font-bold">
                Kit Médico y Accesorios
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Kit médico de instrumental quirúrgico, tensiómetros clínicos, oxímetros OLED y accesorios médicos.
              </p>
            </div>
            <div className="mt-space-md flex items-center gap-1 text-secondary font-label-md font-bold text-label-md">
              <span>Ver accesorios</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Sección "Voces" (Fondo Deep Navy de Stitch) */}
      <section className="w-full bg-primary-container text-on-primary py-space-xl">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="flex flex-col items-center text-center gap-space-xs mb-space-xl">
            <span className="font-label-md text-label-md text-secondary-fixed-dim font-bold uppercase tracking-wider">
              Experiencias Reales en Hospital
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-primary tracking-tight">
              Voces de Quienes Están en Guardia
            </h2>
            <p className="font-body-md text-body-md text-on-primary/80 max-w-xl">
              Estudiantes, internos y profesionales de la salud que confían en Shop &amp; Care para sus rotaciones diarias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {/* Testimonial 1 */}
            <div className="bg-surface-container-lowest text-on-surface p-space-lg rounded-2xl shadow-lg flex flex-col justify-between">
              <div className="flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <div className="flex text-secondary">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <span className="bg-tertiary-fixed text-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">Ayacucho</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant italic">
                  “Hice guardia en emergencia pediátrica y la tela antifluido del modelo Carlos resistió impecable. Súper cómodo para agacharse y correr entre camas.”
                </p>
              </div>
              <div className="mt-space-lg pt-space-sm flex items-center gap-space-sm border-t border-surface-container-high">
                <div className="w-11 h-11 rounded-full bg-secondary-fixed text-primary flex items-center justify-center font-headline-sm text-headline-sm font-bold">
                  AM
                </div>
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg text-primary font-bold">Andrea Mendoza</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Interna de Medicina Humana</span>
                  <span className="font-label-sm text-label-sm text-secondary font-medium">Hosp. Regional de Ayacucho</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-surface-container-lowest text-on-surface p-space-lg rounded-2xl shadow-lg flex flex-col justify-between">
              <div className="flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <div className="flex text-secondary">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <span className="bg-secondary-fixed text-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">Lima</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant italic">
                  “El set de pinzas y tijeras en estuche de lona vino calibrado exacto. Me ahorró buscar pieza por pieza en el centro de Lima.”
                </p>
              </div>
              <div className="mt-space-lg pt-space-sm flex items-center gap-space-sm border-t border-surface-container-high">
                <div className="w-11 h-11 rounded-full bg-secondary-fixed text-primary flex items-center justify-center font-headline-sm text-headline-sm font-bold">
                  CP
                </div>
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg text-primary font-bold">Dr. Carlos Paucar</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Interno de Cirugía, UPCH</span>
                  <span className="font-label-sm text-label-sm text-secondary font-medium">Hosp. Cayetano Heredia</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-surface-container-lowest text-on-surface p-space-lg rounded-2xl shadow-lg flex flex-col justify-between">
              <div className="flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <div className="flex text-secondary">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <span className="bg-tertiary-fixed text-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">Hosp. del Niño</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant italic">
                  “Los scrubs son comodísimos y súper frescos para las guardias de 24 horas. El pantalón resiste el movimiento constante y la tela antifluido no destiñe tras los lavados hospitalarios.”
                </p>
              </div>
              <div className="mt-space-lg pt-space-sm flex items-center gap-space-sm border-t border-surface-container-high">
                <div className="w-11 h-11 rounded-full bg-secondary-fixed text-primary flex items-center justify-center font-headline-sm text-headline-sm font-bold">
                  VQ
                </div>
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg text-primary font-bold">Dra. Valeria Quispe</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Interna Pediatría, UCSUR</span>
                  <span className="font-label-sm text-label-sm text-secondary font-medium">Hosp. del Niño San Borja</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Quick Call-to-Action Bar */}
      <section className="w-full max-w-7xl mx-auto px-margin py-space-xl">
        <div className="relative bg-surface-container-low rounded-3xl p-space-lg md:p-space-xl flex flex-col md:flex-row items-center justify-between gap-space-lg overflow-hidden shadow-sm border border-surface-container-high">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-secondary-fixed/40 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col gap-1 max-w-xl relative z-10 text-center md:text-left">
            <span className="font-label-md text-label-md text-secondary font-bold uppercase tracking-wider">
              ¿Dudas con tus medidas o requerimientos de rotación?
            </span>
            <h3 className="font-headline-lg text-headline-lg text-primary">
              Arma tu kit en 3 pasos o escríbenos directamente
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Te asesoramos con la talla ideal según tu carrera y sede hospitalaria. Envíos express a todo el Perú.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-space-md w-full md:w-auto relative z-10">
            <button
              onClick={() => navigateTo('kit')}
              className="w-full sm:w-auto text-center bg-primary text-on-primary font-label-lg text-label-lg px-space-lg py-3.5 rounded-full hover:bg-on-primary-fixed-variant transition-colors shadow-sm cursor-pointer font-bold"
            >
              Armar mi Kit Personalizado
            </button>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola Shop & Care, quisiera consultar sobre uniformes y requisitos de mi hospital.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center bg-secondary-fixed text-primary font-label-lg text-label-lg px-space-lg py-3.5 rounded-full hover:bg-secondary-fixed-dim transition-colors flex items-center justify-center gap-space-xs shadow-sm font-bold"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
              <span>Consultar por WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
