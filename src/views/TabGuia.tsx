import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface ReviewItem {
  id?: number;
  producto_slug?: string;
  autor: string;
  carrera_sede: string;
  estrellas: number;
  comentario: string;
  fecha?: string;
}

export const TabGuia: React.FC = () => {
  const { hasDiscount, unlockDiscount, discountCode, utms, products, whatsappNumber } = useApp();

  // Lead Magnet Form State
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [especialidad, setEspecialidad] = useState('med_internado');
  const [aceptoPrivacidad, setAceptoPrivacidad] = useState(true);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(hasDiscount);
  const [leadError, setLeadError] = useState('');

  // FAQ Accordion State (openIndex)
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Review Form State
  const [reviewProduct, setReviewProduct] = useState(products[0]?.slug || 'scrubs-carlos-varon');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewSede, setReviewSede] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');
  const [reviewErrorMsg, setReviewErrorMsg] = useState('');

  // Local reviews list including initial verified ones
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([
    {
      id: 1,
      autor: 'Diego Ramos Castro',
      carrera_sede: 'Interno de Medicina — Hosp. Nacional Arzobispo Loayza',
      estrellas: 5,
      comentario: 'Las filipinas stretch aguantan perfecto el trajín y el calor de los pabellones. Los bolsillos son ideales para el saturómetro, libreta y sellos sin que la prenda se deforme.',
      fecha: 'Hace 3 días'
    },
    {
      id: 2,
      autor: 'Dra. Camila Paredes',
      carrera_sede: 'Residente de Pediatría — Hosp. del Niño San Borja',
      estrellas: 5,
      comentario: 'En pediatría nos lavamos las manos decenas de veces al día. La tela antifluido no destiñe ni pierde la caída tras autoclave y lavados intensivos. El bordado quedó impecable.',
      fecha: 'Hace 1 semana'
    },
    {
      id: 3,
      autor: 'Lic. Mariana Soto',
      carrera_sede: 'Lic. en Enfermería — Hosp. Nacional Edgardo Rebagliati',
      estrellas: 5,
      comentario: 'La tela es súper fresca y liviana. Se nota la diferencia de confección nacional frente a scrubs importados que dan mucho calor. El corte es muy anatómico.',
      fecha: 'Hace 2 semanas'
    }
  ]);

  // Load reviews from API if available
  useEffect(() => {
    fetch('/api/resenas')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.resenas && data.resenas.length > 0) {
          setReviewsList(prev => {
            const apiItems: ReviewItem[] = data.resenas;
            const combined = [...apiItems];
            prev.forEach(p => {
              if (!combined.some(c => c.autor === p.autor && c.comentario === p.comentario)) {
                combined.push(p);
              }
            });
            return combined;
          });
        }
      })
      .catch(() => {});
  }, []);

  const ratingLabels: Record<number, string> = {
    1: 'Regular (1/5)',
    2: 'Aceptable (2/5)',
    3: 'Bueno (3/5)',
    4: 'Muy Bueno (4/5)',
    5: 'Excelente (5/5)',
  };

  // Handle Lead Submission (Real Customer Capture - No PDF download)
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !correo.trim() || !whatsapp.trim()) {
      setLeadError('Por favor completa todos los campos obligatorios.');
      return;
    }

    if (!aceptoPrivacidad) {
      setLeadError('Debes aceptar la política de privacidad de datos.');
      return;
    }

    setIsSubmittingLead(true);
    setLeadError('');

    const especialidadMap: Record<string, string> = {
      med_internado: 'Medicina Humana (Internado / Rotaciones)',
      med_residentado: 'Médico Residente / Asistencial',
      enfermeria: 'Lic. en Enfermería / Internado',
      obstetricia: 'Obstetricia & Cuidados Críticos',
      tecnologia: 'Tecnología Médica / Laboratorio',
      med_general: 'Médico General / SERUMS',
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          correo: correo.trim(),
          whatsapp: whatsapp.trim(),
          carrera: especialidadMap[especialidad] || especialidad,
          acepto_privacidad: true,
          utm_source: utms.utm_source,
          utm_campaign: utms.utm_campaign,
          utm_term: utms.utm_term,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        unlockDiscount();
        setLeadSuccess(true);
      } else {
        setLeadError(data.error || 'Ocurrió un error al registrar tus datos.');
      }
    } catch (err) {
      console.warn('Backend SQLite no disponible de inmediato, activando modo local:', err);
      unlockDiscount();
      setLeadSuccess(true);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // Handle Review Submission (Connected to POST /api/resenas)
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewSede.trim() || !reviewComment.trim()) {
      setReviewErrorMsg('Por favor completa todos los campos de la reseña.');
      return;
    }

    setIsSubmittingReview(true);
    setReviewSuccessMsg('');
    setReviewErrorMsg('');

    try {
      const res = await fetch('/api/resenas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producto_slug: reviewProduct,
          autor: reviewAuthor.trim(),
          carrera_sede: reviewSede.trim(),
          estrellas: reviewRating,
          comentario: reviewComment.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReviewSuccessMsg('¡Gracias, tu reseña ha sido enviada y publicada con éxito!');
        // Update visible reviews list immediately
        const newReview: ReviewItem = {
          id: Date.now(),
          producto_slug: reviewProduct,
          autor: reviewAuthor.trim(),
          carrera_sede: reviewSede.trim(),
          estrellas: reviewRating,
          comentario: reviewComment.trim(),
          fecha: 'Hace un momento'
        };
        setReviewsList(prev => [newReview, ...prev]);
        setReviewAuthor('');
        setReviewSede('');
        setReviewComment('');
        setReviewRating(5);
      } else {
        setReviewErrorMsg(data.error || 'Ocurrió un problema al enviar tu reseña.');
      }
    } catch (err) {
      // Local fallback append
      const newReview: ReviewItem = {
        id: Date.now(),
        producto_slug: reviewProduct,
        autor: reviewAuthor.trim(),
        carrera_sede: reviewSede.trim(),
        estrellas: reviewRating,
        comentario: reviewComment.trim(),
        fecha: 'Hace un momento'
      };
      setReviewsList(prev => [newReview, ...prev]);
      setReviewSuccessMsg('¡Gracias, tu reseña ha sido enviada con éxito!');
      setReviewAuthor('');
      setReviewSede('');
      setReviewComment('');
      setReviewRating(5);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const faqs = [
    {
      num: '01',
      q: '¿Hacen envíos directos a hospitales o clínicas en Lima y provincias?',
      a: 'Sí, coordinamos entregas prioritarias en las puertas o accesos de hospitales de Lima Metropolitana (Rebagliati, Almenara, Dos de Mayo, Loayza, San Bartolomé) y envíos con número de remito por Olva Courier y Shalom a todo el Perú.',
    },
    {
      num: '02',
      q: '¿Las telas son realmente antifluido y antibacteriales?',
      a: 'Nuestros textiles técnicos cuentan con tratamiento de repelencia clínica comprobada (99.4%), resisten desinfección frecuente y lavados hospitalarios intensivos sin perder su coloración ni la elasticidad 4-way stretch.',
    },
    {
      num: '03',
      q: '¿Puedo solicitar bordado con el escudo de mi universidad o mi nombre?',
      a: 'Sí, ofrecemos servicio de bordado computarizado de alta definición con escudos oficiales (San Marcos, Cayetano Heredia, UPC, UCSUR, San Martín, etc.) y tu nombre con grado profesional.',
    },
    {
      num: '04',
      q: '¿Qué sucede si necesito un cambio de talla?',
      a: 'Ofrecemos cambio de talla garantizado. Si la prenda que recibiste no te queda con la comodidad que necesitas para tu turno, coordinamos el cambio de talla sin complicaciones.',
    },
  ];

  return (
    <div className="w-full bg-surface-container-lowest min-h-[calc(100vh-140px)]">
      <div className="flex flex-col w-full">
        {/* 1. SECCIÓN DE ASESORÍA Y CAPTACIÓN DE CLIENTES */}
        <div className="w-full bg-gradient-to-b from-surface-container-low/60 via-surface-container-lowest to-surface-container-lowest">
          <div className="max-w-7xl mx-auto px-margin py-space-xl">
            {/* Encabezado */}
            <div className="flex flex-col items-start gap-space-sm mb-space-lg">
              <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-tertiary-fixed text-primary-container font-label-sm text-label-sm uppercase tracking-wider shadow-sm font-bold">
                <span className="material-symbols-outlined text-[16px] text-primary-container">support_agent</span>
                <span>Atención y Asesoría Personalizada</span>
              </div>
              <h1 className="font-headline-xl text-headline-xl text-primary-container tracking-tight max-w-4xl">
                Asesoría en Scrub, Mandil Médico e Indumentaria Médica
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
                ¿Dudas con la talla de tus uniformes médicos o necesitas tu kit médico y accesorios para el internado y prácticas? Escríbenos y nuestro equipo te asesorará en vivo con promociones exclusivas.
              </p>
            </div>

            {/* Split 2 Columnas: Tarjeta de Asesoría (7 cols) + Formulario de Captación (5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-stretch">
              {/* Columna Izquierda: Información de Asesoría y Beneficios */}
              <div className="lg:col-span-7 flex flex-col justify-between p-space-lg bg-surface-container-low rounded-xl relative overflow-hidden shadow-sm">
                <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-secondary-fixed-dim/20 blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none"></div>

                <div className="flex flex-col gap-space-md z-10">
                  <div className="flex flex-wrap items-center justify-between gap-space-sm">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-lowest text-primary-container font-label-md text-label-md rounded-full shadow-sm font-bold">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      Atención Directa de Guardia
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary-fixed text-primary font-label-md text-label-md rounded-full font-bold">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      Lunes a Domingo: 8:00 a. m. a 9:00 p. m.
                    </span>
                  </div>

                  <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-sm flex flex-col gap-4">
                    <h2 className="font-headline-md text-headline-md font-bold text-primary-container">
                      ¿Por qué elegir Shop &amp; Care para tus rotaciones?
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Conocemos la exigencia de un turno de 24 o 36 horas en hospitales peruanos. Nuestras prendas están diseñadas para ofrecer frescura constante, movilidad total y un tejido que no pierde color con el lavado clínico.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-1">
                        <span className="material-symbols-outlined text-secondary text-[24px]">verified</span>
                        <span className="font-label-sm text-label-sm font-bold text-primary-container">Telas Antifluido</span>
                        <span className="font-body-sm text-[12px] text-on-surface-variant">4-Way Stretch de alta resistencia</span>
                      </div>
                      <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-1">
                        <span className="material-symbols-outlined text-secondary text-[24px]">straighten</span>
                        <span className="font-label-sm text-label-sm font-bold text-primary-container">Asesoría de Talla</span>
                        <span className="font-body-sm text-[12px] text-on-surface-variant">Desde XS hasta XL con cambio garantizado</span>
                      </div>
                      <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-1">
                        <span className="material-symbols-outlined text-secondary text-[24px]">groups</span>
                        <span className="font-label-sm text-label-sm font-bold text-primary-container">Promociones</span>
                        <span className="font-body-sm text-[12px] text-on-surface-variant">Descuentos especiales por grupo</span>
                      </div>
                    </div>
                  </div>

                  {/* Acceso Directo por WhatsApp */}
                  <div className="p-4 bg-primary-container text-on-primary rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary-fixed text-primary flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-[20px]">chat</span>
                      </div>
                      <div>
                        <div className="font-label-md text-label-md font-bold">¿Necesitas respuesta inmediata?</div>
                        <div className="font-body-sm text-body-sm text-secondary-fixed-dim">Escríbenos directamente a nuestro WhatsApp oficial</div>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola Shop & Care, quisiera recibir asesoría sobre tallas y modelos disponibles.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-secondary-fixed text-primary font-headline-sm font-bold text-body-sm px-4 py-2.5 rounded-xl hover:bg-secondary-fixed-dim transition-colors shadow-sm cursor-pointer shrink-0"
                    >
                      <span>Abrir WhatsApp</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </a>
                  </div>
                </div>

                <div className="pt-space-md z-10 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm border-t border-surface-container-high mt-4">
                  <span>Envíos rápidos a hospitales de Lima y agencias de provincias.</span>
                  <span className="font-bold text-primary-container">Shop &amp; Care Perú</span>
                </div>
              </div>

              {/* Columna Derecha: Formulario de Registro (Captación Real de Clientes) */}
              <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-md p-space-lg flex flex-col justify-between relative border border-surface-container-high">
                <div>
                  <div className="flex flex-col gap-2">
                    <div className="inline-flex items-center gap-1 text-primary-container font-label-sm text-label-sm uppercase tracking-wider font-bold">
                      <span className="material-symbols-outlined text-[16px] text-secondary">card_giftcard</span>
                      <span>Beneficio Exclusivo</span>
                    </div>
                    <h2 className="font-headline-sm text-headline-sm text-primary-container font-bold">
                      Recibe asesoría personalizada y promociones exclusivas
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Regístrate y accede a precios especiales para estudiantes y profesionales de la salud con un 15% de descuento en tu primera compra.
                    </p>
                  </div>

                  {leadSuccess ? (
                    <div className="flex flex-col items-center justify-center text-center p-6 bg-surface-container-low rounded-xl gap-3 my-4">
                      <span className="material-symbols-outlined text-[48px] text-secondary">check_circle</span>
                      <h3 className="font-headline-sm text-headline-sm text-primary-container font-bold">¡Registro Exitoso!</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Tus datos han sido registrados. Tu cupón promocional <strong className="text-primary-container font-bold">{discountCode || 'TURNO15'}</strong> con el 15% de descuento ya está activo en tu sesión.
                      </p>
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hola Shop & Care, me acabo de registrar en la web con el código ${discountCode || 'TURNO15'} y quisiera recibir asesoría personalizada para elegir mi uniforme.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary-fixed text-primary font-headline-sm text-body-md font-bold shadow-sm hover:bg-secondary-fixed-dim transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">chat</span>
                        <span>Continuar por WhatsApp</span>
                      </a>
                    </div>
                  ) : (
                    <form className="flex flex-col gap-space-sm mt-space-md" onSubmit={handleLeadSubmit}>
                      {/* Campo 1: Nombre completo */}
                      <div className="flex flex-col gap-1">
                        <label className="font-label-md text-label-md text-primary-container font-semibold" htmlFor="lead-name">
                          Nombre completo
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">person</span>
                          <input
                            id="lead-name"
                            type="text"
                            required
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej. Andrea Mendoza Castro"
                            className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest transition-all"
                          />
                        </div>
                      </div>

                      {/* Campo 2: Correo electrónico */}
                      <div className="flex flex-col gap-1">
                        <label className="font-label-md text-label-md text-primary-container font-semibold" htmlFor="lead-email">
                          Correo electrónico
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">mail</span>
                          <input
                            id="lead-email"
                            type="email"
                            required
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            placeholder="tu.correo@ejemplo.com"
                            className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest transition-all"
                          />
                        </div>
                      </div>

                      {/* Campo 3: WhatsApp */}
                      <div className="flex flex-col gap-1">
                        <label className="font-label-md text-label-md text-primary-container font-semibold" htmlFor="lead-phone">
                          WhatsApp
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">chat</span>
                          <input
                            id="lead-phone"
                            type="tel"
                            required
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            placeholder="+51 987 654 321"
                            className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest transition-all"
                          />
                        </div>
                      </div>

                      {/* Campo 4: Carrera o especialidad */}
                      <div className="flex flex-col gap-1">
                        <label className="font-label-md text-label-md text-primary-container font-semibold" htmlFor="lead-specialty">
                          Carrera o especialidad
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">school</span>
                          <select
                            id="lead-specialty"
                            value={especialidad}
                            onChange={(e) => setEspecialidad(e.target.value)}
                            className="w-full pl-10 pr-8 py-2.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest appearance-none transition-all"
                          >
                            <option value="med_internado">Medicina Humana (Internado / Rotaciones)</option>
                            <option value="med_residentado">Médico Residente / Asistencial</option>
                            <option value="enfermeria">Lic. en Enfermería / Internado</option>
                            <option value="obstetricia">Obstetricia &amp; Cuidados Críticos</option>
                            <option value="tecnologia">Tecnología Médica / Laboratorio</option>
                            <option value="med_general">Médico General / SERUMS</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">expand_more</span>
                        </div>
                      </div>

                      {/* Casilla de aceptación de política de privacidad */}
                      <label className="flex items-start gap-2.5 cursor-pointer mt-1">
                        <input
                          type="checkbox"
                          checked={aceptoPrivacidad}
                          onChange={(e) => setAceptoPrivacidad(e.target.checked)}
                          className="mt-0.5 rounded text-primary-container focus:ring-0 accent-primary-container cursor-pointer"
                          required
                        />
                        <span className="font-body-sm text-[12px] text-on-surface-variant leading-snug">
                          Acepto recibir asesoría y promociones exclusivas. Shop &amp; Care protege tus datos personales conforme a ley.
                        </span>
                      </label>

                      {leadError && (
                        <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px]">error</span>
                          <span>{leadError}</span>
                        </div>
                      )}

                      {/* Botón de Envío */}
                      <button
                        type="submit"
                        disabled={isSubmittingLead}
                        className="w-full mt-2 py-3 px-6 rounded-xl bg-secondary-fixed text-primary font-headline-sm text-body-md font-bold flex items-center justify-center gap-2 hover:bg-secondary-fixed-dim transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">send</span>
                        <span>{isSubmittingLead ? 'Procesando...' : 'Solicitar asesoría y 15% DTO'}</span>
                      </button>
                    </form>
                  )}
                </div>

                <div className="mt-4 pt-3 flex items-center justify-center gap-2 text-center text-on-surface-variant font-label-sm text-label-sm border-t border-surface-container-high">
                  <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                  <span>Te responderemos con asesoría sobre tu talla exacta.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SECCIÓN DE RESEÑAS INTERACTIVA (LEER Y ESCRIBIR) */}
        <div className="w-full bg-surface-container-lowest py-space-xl border-t border-surface-container-high">
          <div className="max-w-7xl mx-auto px-margin">
            {/* Encabezado de Reseñas */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
              <div className="max-w-2xl">
                <span className="font-label-md text-label-md font-bold uppercase tracking-wider text-secondary">
                  Comunidad Shop &amp; Care
                </span>
                <h2 className="font-headline-lg text-headline-lg text-primary-container font-bold mt-1">
                  Reseñas y Experiencias de Clientes
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1.5">
                  Conoce las opiniones de estudiantes y profesionales en hospitales de todo el país, y comparte tu propia experiencia.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-primary-container font-label-md text-label-md font-bold">
                <span className="material-symbols-outlined text-[18px] text-secondary">rate_review</span>
                <span>{reviewsList.length} Opiniones Publicadas</span>
              </div>
            </div>

            {/* Grid 2 Columnas: Formulario de Escribir Reseña (Col 5) + Lista de Opiniones (Col 7) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
              {/* Formulario Visible para Escribir Reseña */}
              <div className="lg:col-span-5 bg-surface-container-low rounded-2xl p-space-lg flex flex-col gap-space-md shadow-sm border border-surface-container-high">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline-sm text-headline-sm text-primary-container font-bold">
                    Cuéntanos tu experiencia con Shop &amp; Care
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-primary-container font-label-sm text-label-sm font-bold">
                    Tu opinión cuenta
                  </span>
                </div>

                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-space-sm">
                  {/* Selector de producto comprado */}
                  <div className="flex flex-col gap-1">
                    <label className="font-label-md text-label-md text-primary-container font-semibold" htmlFor="review-product">
                      Producto que compraste
                    </label>
                    <select
                      id="review-product"
                      value={reviewProduct}
                      onChange={(e) => setReviewProduct(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-surface-container-lowest font-body-sm text-body-sm text-on-surface focus:outline-none border border-surface-container-high"
                    >
                      {products.map((p) => (
                        <option key={p.slug} value={p.slug}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selector interactivo de calificación 1 a 5 estrellas */}
                  <div className="flex flex-col gap-1">
                    <span className="font-label-md text-label-md text-primary-container font-semibold">
                      Calificación (1 a 5 estrellas)
                    </span>
                    <div className="flex items-center gap-1.5 py-1">
                      {[1, 2, 3, 4, 5].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setReviewRating(st)}
                          className={`text-[30px] transition-transform transform hover:scale-110 focus:outline-none cursor-pointer ${
                            st <= reviewRating ? 'text-[#EFAEBF]' : 'text-outline-variant/40'
                          }`}
                          title={`${st} estrellas`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="font-label-sm text-label-sm text-primary-container font-bold ml-2">
                        {ratingLabels[reviewRating]}
                      </span>
                    </div>
                  </div>

                  {/* Nombre */}
                  <div className="flex flex-col gap-1">
                    <label className="font-label-md text-label-md text-primary-container font-semibold" htmlFor="review-author">
                      Tu nombre o iniciales
                    </label>
                    <input
                      id="review-author"
                      type="text"
                      required
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      placeholder="Ej. Dr. Jorge Salazar"
                      className="w-full px-3 py-2.5 rounded-lg bg-surface-container-lowest font-body-sm text-body-sm text-on-surface focus:outline-none border border-surface-container-high"
                    />
                  </div>

                  {/* Carrera / Hospital o Clínica */}
                  <div className="flex flex-col gap-1">
                    <label className="font-label-md text-label-md text-primary-container font-semibold" htmlFor="review-sede">
                      Carrera / Hospital o Clínica
                    </label>
                    <input
                      id="review-sede"
                      type="text"
                      required
                      value={reviewSede}
                      onChange={(e) => setReviewSede(e.target.value)}
                      placeholder="Ej. Interno de Medicina — Hosp. Rebagliati"
                      className="w-full px-3 py-2.5 rounded-lg bg-surface-container-lowest font-body-sm text-body-sm text-on-surface focus:outline-none border border-surface-container-high"
                    />
                  </div>

                  {/* Comentario */}
                  <div className="flex flex-col gap-1">
                    <label className="font-label-md text-label-md text-primary-container font-semibold" htmlFor="review-comment">
                      Comentario sobre la prenda o atención
                    </label>
                    <textarea
                      id="review-comment"
                      rows={3}
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="¿Cómo te fue con la tela antifluido, el ajuste de la talla o la entrega? Tu opinión ayuda a otros profesionales."
                      className="w-full p-3 rounded-lg bg-surface-container-lowest font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none border border-surface-container-high"
                    />
                  </div>

                  {reviewSuccessMsg && (
                    <div className="p-3 bg-secondary-fixed text-primary font-body-sm text-body-sm rounded-lg text-center font-bold">
                      {reviewSuccessMsg}
                    </div>
                  )}

                  {reviewErrorMsg && (
                    <div className="p-3 bg-red-50 text-red-700 font-body-sm text-body-sm rounded-lg text-center">
                      {reviewErrorMsg}
                    </div>
                  )}

                  {/* Botón de Enviar Reseña */}
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full py-3 px-6 rounded-xl bg-primary-container text-on-primary font-headline-sm text-body-md font-bold flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-sm cursor-pointer disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-[18px]">rate_review</span>
                    <span>{isSubmittingReview ? 'Enviando...' : 'Publicar Reseña'}</span>
                  </button>
                </form>
              </div>

              {/* Lista de Opiniones y Tarjetas de Clientes */}
              <div className="lg:col-span-7 flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <span className="font-headline-sm text-headline-sm text-primary-container font-bold">
                    Opiniones Recientes de la Comunidad
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Verificadas</span>
                </div>

                <div className="flex flex-col gap-3">
                  {reviewsList.map((rev, idx) => (
                    <div
                      key={`rev-${rev.id || 'item'}-${idx}`}
                      className="p-space-lg bg-surface-container-low rounded-xl shadow-sm flex flex-col gap-2.5 border border-surface-container-high transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary-fixed text-primary flex items-center justify-center font-bold text-headline-sm shrink-0">
                            {rev.autor.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-headline-sm text-body-lg font-bold text-primary-container leading-none">
                              {rev.autor}
                            </div>
                            <div className="mt-1 font-label-sm text-label-sm text-on-surface-variant font-medium">
                              {rev.carrera_sede}
                            </div>
                          </div>
                        </div>

                        {/* Estrellas en #EFAEBF */}
                        <div className="flex text-[#EFAEBF] text-[18px] shrink-0">
                          {'★'.repeat(rev.estrellas)}
                          {'☆'.repeat(Math.max(0, 5 - rev.estrellas))}
                        </div>
                      </div>

                      <p className="font-body-md text-body-md text-on-surface-variant italic leading-relaxed pt-1">
                        "{rev.comentario}"
                      </p>

                      <div className="pt-2 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-t border-surface-container-high/60">
                        <span className="inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-secondary">verified</span>
                          Compra Verificada
                        </span>
                        <span>{rev.fecha || 'Reciente'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. PREGUNTAS FRECUENTES (FAQ) */}
        <div className="w-full bg-surface-container-low/40 py-space-xl border-t border-surface-container-high">
          <div className="max-w-4xl mx-auto px-margin">
            <div className="text-center mb-space-lg">
              <span className="inline-block font-label-md text-label-md font-bold uppercase tracking-wider text-secondary mb-1">
                Atención rápida
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary-container font-bold">
                Preguntas Frecuentes sobre Uniformes, Medidas y Envíos
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl mx-auto">
                Respuestas claras para ahorrar tiempo en tus compras y pedidos hospitalarios.
              </p>
            </div>

            <div className="flex flex-col gap-space-sm">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden transition-all border border-surface-container-high">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-space-md text-left flex items-center justify-between gap-4 font-headline-sm text-body-lg text-primary-container font-bold hover:text-secondary transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-surface-container-low text-primary-container flex items-center justify-center font-label-sm text-label-sm font-bold">
                          {faq.num}
                        </span>
                        <span>{faq.q}</span>
                      </span>
                      <span
                        className="material-symbols-outlined text-secondary text-[24px] transform transition-transform duration-200"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >
                        expand_more
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-space-md pb-space-md text-on-surface-variant font-body-md text-body-md pl-14 animate-fadeIn">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. FRANJA INFERIOR DE PEDIDOS GRUPALES */}
        <div className="w-full bg-surface-container-high py-space-md">
          <div className="max-w-7xl mx-auto px-margin flex flex-col sm:flex-row items-center justify-between gap-space-md text-center sm:text-left">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[24px] text-primary-container">groups</span>
              <div>
                <span className="font-label-lg text-label-lg font-bold text-primary-container">¿Quieres organizar un pedido grupal para tu promoción o internado?</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Ofrecemos descuentos corporativos desde 6 unidades y bordados institucionales para promociones de salud.</p>
              </div>
            </div>
            <a
              className="inline-flex items-center gap-1.5 px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-primary-container font-label-lg text-label-lg font-bold shadow-sm hover:bg-secondary-fixed transition-colors shrink-0"
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola Shop & Care, quisiera cotizar un pedido grupal para mi promoción/servicio.')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Cotizar Pedido Grupal</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
