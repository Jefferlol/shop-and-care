import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface KitItemConfig {
  id: string;
  nombre: string;
  categoria: 'indumentaria' | 'instrumental';
  descripcion: string;
  precioRegular: number;
  talla: string;
  tallasDisponibles: string[];
  incluido: boolean;
  imagen: string;
  badge: string;
}

export const TabKit: React.FC = () => {
  const { whatsappNumber, addToCart, setIsCartOpen, products } = useApp();

  const [carrera, setCarrera] = useState<string>('Medicina Humana');
  const [sede, setSede] = useState<string>('Sede MINSA');
  const [sedeDetalle, setSedeDetalle] = useState<string>('Loayza, Dos de Mayo, Cayetano');

  const [items, setItems] = useState<KitItemConfig[]>([
    {
      id: 'scrub-oriana',
      nombre: 'Scrub Clínico Antifluido Oriana / Carlos',
      categoria: 'indumentaria',
      descripcion: '6 bolsillos de guardia, tejido stretch 4-way, antifluidos. Talla y color institucional.',
      precioRegular: 135.00,
      talla: 'M',
      tallasDisponibles: ['XS', 'S', 'M', 'L', 'XL'],
      incluido: true,
      imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFzPpbJyhD9jEvDinPQ7vAbEy4MxP8FrbD1B1M71vvcr-n1U-KgcMcymGMhAb57IvVf0jlxsT2bhlS4-uV4CKscmj4PF4QnAgVr7AG3zYuvm1NqrHiz_VV62eaAIr9JGTG0HxdmKU_FGGc_7qZxE4IAxfzytCkj76hTOsE8kLA4Hmi2oGPdfi-o_WEq8CuUgos0tUtypENHKhfTpetr2HCbkxh3H-_sD_kQJuS5c7_',
      badge: 'Filipina + Jogger',
    },
    {
      id: 'casaca-termica',
      nombre: 'Casaca Micropolar Térmica para Guardia',
      categoria: 'indumentaria',
      descripcion: 'Capa ultraligera térmica con espacio para bordado institucional. Talla y corte entallado.',
      precioRegular: 119.00,
      talla: 'M',
      tallasDisponibles: ['XS', 'S', 'M', 'L', 'XL'],
      incluido: true,
      imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWLM7QmSj54PC_9xdp9LBSIV95dXwqnx6C1nq3ulVq-20wEJAWiodwjV0uXXrrMz76qA8bQ_QOTjwa9QwR2q8zUT2GfwXC7f_Xk01XHWmxUx-ChNLDFAexGxkrMjjbeyWltU1Hc2r6dXAH1niGtsVyAXG586yukEhMrgxGou5YbuMDn9t2ymZmSqBa5yj6He3df5EMe2Mf_LUjMDeTk7C-TwWJukS-Y6hO6WLZxyT4',
      badge: 'Nocturna',
    },
    {
      id: 'guardapolvo-alondra',
      nombre: 'Guardapolvo Clínico Alondra (Cuello Mao)',
      categoria: 'indumentaria',
      descripcion: 'Tela clororresistente antiarrugas para pase de visita y auditorio hospitalario.',
      precioRegular: 129.00,
      talla: 'M',
      tallasDisponibles: ['XS', 'S', 'M', 'L', 'XL'],
      incluido: false,
      imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDohd-LAc3rX7HoGjjBmFDAFcDhUxheogVb6tQA3qiZGygG3IcgGijSyeufUIpp2JJTBHmaddpkCbsPLKve6Cp8rlK6wnYaDxmVzwSzGnl8uavQW1fYdNmOooF7ANv1ZcP88IM1z1rs4EUw9wcPhSbTUV5hNon1haaBiZtLpM5CH68cOUjMR9NEpq8hWmSZFjEn4qG2kJfHlcNYj3wTDYBVdewpVu3bJKvrKEHkRaOo',
      badge: 'Visita Médica',
    },
    {
      id: 'set-instrumental',
      nombre: 'Set Instrumental Quirúrgico Básico en Estuche',
      categoria: 'instrumental',
      descripcion: 'Tijera Mayo recta, pinza Kelly curva, pinza disección y portagujas (Acero alemán).',
      precioRegular: 249.90,
      talla: 'Estándar',
      tallasDisponibles: ['Estándar'],
      incluido: true,
      imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBP6ueN4RXrlVxGpWe52cwOitcpD0b-yxLYNEFDqv0bdzwUKXgVPX1XzH1WgZ0Wqyeq-TQPqZbLb5DMS8Oigtp7f-506uQHdCC5RgYSbNGr8RWGuoaO5_UKC3Al8-bD0VdKzebzr1xvOhzeGgYNEhw2saIkSJpRr41LN00wfRJLb0Ops72g8OhoLGRAdiCyXGc9hnRqujbfumY-RcQTqPcEHDR42TUJtf6JCa8UC2fk',
      badge: 'Garantía 12m',
    },
    {
      id: 'linterna-martillo',
      nombre: 'Linterna de Diagnóstico + Martillo Taylor',
      categoria: 'instrumental',
      descripcion: 'Luz blanca enfocada con pupilería graduada + martillo neurológico con punta de goma.',
      precioRegular: 69.00,
      talla: 'Estándar',
      tallasDisponibles: ['Estándar'],
      incluido: true,
      imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlCS2Xzy8N80-nQFR3uxI3ybjl72gOUe5Npt67kMM9xMBvu5V7tQJOS6oKz0XDLIfuDA5s_FLYCEv1TfCTYCMitdDdGzsKEY6mWL1vhl10rU9nf2-Y4j5TmGMUC2vWK3n7KfX-P1yCiACe-s8o2hAa-Oxx75KpfvqSwcWVd6Ua-sS38Hk8rND8_fav_1F4MIo5Qh1G0xxjMc6tMoRYWrKa0_Xp4MxwZtBOryqUszNA',
      badge: 'Diagnóstico',
    },
    {
      id: 'oximetro',
      nombre: 'Oxímetro de Pulso Digital OLED',
      categoria: 'instrumental',
      descripcion: 'Lectura en 4 segundos de SpO2 y frecuencia con curva pletismográfica y alarma sonora.',
      precioRegular: 79.90,
      talla: 'Estándar',
      tallasDisponibles: ['Estándar'],
      incluido: false,
      imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEH11kUz_S9G4-EFB9Sw-1cfoGYNy2aL_HOgw7rgrk-xS_ndCOTl3Dge9Kcd7Uv-VwzU1905Nax26lMWZOMjj6avSHpCzq9Zdf18Lh_H3jZoJzZGLEN7p2bs2BGUo0qT1AhXY1_rbH3kWfdTq2Eff4rGyiwJM5oebwfMiY3-Dbw9MdlKafJSxdErQ8hzSSUfDsD5HahJK8Wp6NjgBr10ppwfTFM_lB8Fe9UKTTckDa',
      badge: 'Triaje Rápido',
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, incluido: !item.incluido } : item));
  };

  const changeSize = (id: string, newSize: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, talla: newSize } : item));
  };

  const selectedItems = items.filter(it => it.incluido);
  const subtotalRegular = selectedItems.reduce((acc, curr) => acc + curr.precioRegular, 0);
  const discountAmount = subtotalRegular * 0.15;
  const grandTotal = subtotalRegular - discountAmount;

  const handleSendKitWhatsApp = async () => {
    if (selectedItems.length === 0) {
      alert('Por favor selecciona al menos un artículo para tu kit.');
      return;
    }

    setIsSubmitting(true);
    let quoteCode = `SC-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const res = await fetch('/api/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origen: 'configurador_kit',
          items: selectedItems.map(it => ({
            id: it.id,
            nombre: it.nombre,
            talla: it.talla,
            precioRegular: it.precioRegular,
          })),
          subtotal: subtotalRegular,
          descuento: discountAmount,
          total: grandTotal,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.codigo) {
          quoteCode = data.codigo;
        }
      }
    } catch (err) {
      console.warn('Error registrando cotización:', err);
    } finally {
      setIsSubmitting(false);
    }

    let msg = `🩺 *COTIZACIÓN DE KIT OFICIAL — SHOP & CARE*\n`;
    msg += `Código de Cotización: *${quoteCode}*\n`;
    msg += `Perfil: *${carrera}*\n`;
    msg += `Sede de Rotación: *${sede}* (${sedeDetalle})\n\n`;
    msg += `*Artículos seleccionados:*\n`;

    selectedItems.forEach((it, idx) => {
      msg += `${idx + 1}. ${it.nombre} — Talla: *${it.talla}* (S/ ${it.precioRegular.toFixed(2)})\n`;
    });

    msg += `\nSubtotal regular: S/ ${subtotalRegular.toFixed(2)}\n`;
    msg += `Descuento Campaña Internado (-15%): -S/ ${discountAmount.toFixed(2)}\n`;
    msg += `*TOTAL A PAGAR: S/ ${grandTotal.toFixed(2)}*\n\n`;
    msg += `_Solicito confirmación de stock y fecha de entrega prioritaria en mi hospital._`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSaveConfig = () => {
    localStorage.setItem('shopcare_saved_kit', JSON.stringify({
      carrera,
      sede,
      items: selectedItems,
    }));
    setSaveMessage('¡Configuración guardada en tu navegador!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleAddKitToCart = () => {
    if (selectedItems.length === 0) return;

    selectedItems.forEach((it) => {
      const matched = products.find(p => p.nombre.toLowerCase().includes(it.nombre.toLowerCase().slice(0, 10))) || {
        id: Math.abs(it.id.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)),
        nombre: it.nombre,
        slug: it.id,
        categoria: it.categoria === 'indumentaria' ? 'Scrubs' : 'Instrumental',
        precio_normal: it.precioRegular,
        precio_dto: Math.round(it.precioRegular * 0.85 * 100) / 100,
        en_stock: 1,
        detalles: [it.descripcion],
        tallas: it.tallasDisponibles,
        colores: [{ nombre: 'Azul Institucional', hex: '#0D3365' }],
      };

      addToCart(
        matched as any,
        it.talla,
        { nombre: 'Color Institucional', hex: '#0D3365' },
        1,
        false
      );
    });

    setIsCartOpen(true);
  };

  return (
    <div className="w-full flex flex-col pt-28 bg-surface-container-lowest min-h-[calc(100vh-140px)] animate-fadeIn">
      <div className="w-full max-w-7xl mx-auto px-margin py-space-lg flex flex-col gap-space-lg">
        {/* Top Announcement & Header Section directly from Stitch Screen 3 */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-surface-container-low via-surface-bright to-secondary-fixed/30 p-space-lg shadow-sm border border-surface-container-high">
          <div className="relative z-10 flex flex-col gap-space-sm max-w-3xl">
            <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-secondary-fixed text-primary-container font-label-sm text-label-sm w-fit shadow-sm font-bold">
              <span className="material-symbols-outlined text-[15px] animate-pulse">ecg_heart</span>
              <span className="tracking-wider uppercase">Configurador Clínico Personalizado 2026</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-primary-container tracking-tight">
              Arma tu Kit para Internado o Externado
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Selecciona tu perfil médico y personaliza tu equipamiento con descuento automático para estudiantes y residentes peruanos.
            </p>
          </div>
          <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none text-primary">
            <span className="material-symbols-outlined text-[240px]">medical_services</span>
          </div>
        </div>

        {/* Main Two-Column Interactive Builder */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Left Column: Interactive Configuration Steps (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-space-xl">
            {/* Step 1: Especialidad / Carrera */}
            <section className="flex flex-col gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container-high">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <span className="w-7 h-7 rounded-full bg-primary-container text-on-primary font-label-md text-label-md flex items-center justify-center font-bold">1</span>
                  <h2 className="font-headline-sm text-headline-sm text-primary-container">Carrera &amp; Especialidad</h2>
                </div>
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">Paso Obligatorio</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
                {[
                  'Medicina Humana',
                  'Enfermería',
                  'Tecnología Médica',
                  'Obstetricia',
                ].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCarrera(c)}
                    className={`px-space-md py-2.5 rounded-lg text-center font-label-lg text-label-lg transition-all cursor-pointer ${
                      carrera === c
                        ? 'bg-secondary-fixed text-primary-container font-bold shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-secondary-fixed/50 hover:text-primary-container'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </section>

            {/* Step 2: Sede / Tipo de Hospital */}
            <section className="flex flex-col gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container-high">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <span className="w-7 h-7 rounded-full bg-primary-container text-on-primary font-label-md text-label-md flex items-center justify-center font-bold">2</span>
                  <h2 className="font-headline-sm text-headline-sm text-primary-container">Sede Hospitalaria de Rotación</h2>
                </div>
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">Protocolo de Uniforme</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-space-sm">
                {[
                  { id: 'Sede MINSA', label: 'MINSA', sub: 'Loayza, Dos de Mayo, Cayetano' },
                  { id: 'Sede EsSalud', label: 'EsSalud', sub: 'Rebagliati, Almenara, Sabogal' },
                  { id: 'Sede Privada', label: 'Clínica Privada', sub: 'Anglo Americana, San Pablo, etc.' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSede(s.id);
                      setSedeDetalle(s.sub);
                    }}
                    className={`flex-1 p-space-md rounded-lg text-left transition-all border cursor-pointer ${
                      sede === s.id
                        ? 'bg-secondary-fixed text-primary-container font-bold shadow-sm border-secondary'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-secondary-fixed/50 border-surface-container-high'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-label-lg text-label-lg">{s.label}</span>
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant font-normal mt-1 text-xs">{s.sub}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 3: Indumentaria Clínica Certificada */}
            <section className="flex flex-col gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-surface-container-high">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <span className="w-7 h-7 rounded-full bg-primary-container text-on-primary font-label-md text-label-md flex items-center justify-center font-bold">3</span>
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-primary-container">Indumentaria Clínica Certificada</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Confección nacional con tecnología antifluido y antimicrobial</p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                  {selectedItems.length} seleccionados
                </span>
              </div>

              <div className="flex flex-col gap-space-md">
                {items.map((item) => (
                  <label
                    key={item.id}
                    className={`group relative flex flex-col md:flex-row items-start md:items-center justify-between p-space-md rounded-xl transition-all shadow-sm cursor-pointer border ${
                      item.incluido
                        ? 'bg-surface-bright border-secondary-fixed ring-1 ring-secondary-fixed'
                        : 'bg-surface-container-low/60 border-surface-container-high opacity-80'
                    }`}
                  >
                    <div className="flex items-start gap-space-md w-full md:w-auto">
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          checked={item.incluido}
                          onChange={() => toggleItem(item.id)}
                          className="w-5 h-5 rounded text-primary-container focus:ring-secondary-fixed accent-primary-container cursor-pointer"
                        />
                      </div>
                      <div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden shrink-0 flex items-center justify-center border border-surface-container-high">
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-space-xs flex-wrap">
                          <span className="font-label-lg text-label-lg text-primary-container font-bold">{item.nombre}</span>
                          <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-primary-container font-label-sm text-label-sm font-semibold">{item.badge}</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-0.5 text-xs">
                          {item.descripcion}
                        </p>
                        <div className="flex items-center gap-space-sm mt-1.5 font-label-sm text-label-sm text-secondary">
                          <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[14px]">water_drop</span> Antifluido</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[14px]">autorenew</span> 4-Way Stretch</span>
                        </div>

                        {/* Size picker */}
                        {item.tallasDisponibles.length > 1 && item.incluido && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="font-label-sm text-label-sm text-primary font-bold">Talla:</span>
                            <div className="flex items-center gap-1">
                              {item.tallasDisponibles.map((sz) => (
                                <button
                                  key={sz}
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    changeSize(item.id, sz);
                                  }}
                                  className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                                    item.talla === sz
                                      ? 'bg-primary-container text-on-primary'
                                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                                  }`}
                                >
                                  {sz}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 md:mt-0 flex md:flex-col items-baseline md:items-end justify-between w-full md:w-auto pl-10 md:pl-0 shrink-0">
                      <span className="font-headline-sm text-headline-sm text-primary-container font-bold">
                        S/ {item.precioRegular.toFixed(2)}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {item.incluido ? 'Incluido' : 'Opcional'}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Summary Card (5 cols directly from Stitch Screen 3) */}
          <aside className="lg:col-span-5 sticky top-28">
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-lg border border-surface-container-high flex flex-col gap-space-md">
              <div className="flex flex-col gap-1 pb-space-xs border-b border-surface-container-high">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Configuración de Guardia</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-tertiary bg-tertiary-fixed px-2 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-[14px]">local_offer</span> 15% DTO
                  </span>
                </div>
                <h2 className="font-headline-md text-headline-md text-primary-container">
                  Resumen de tu Kit
                </h2>
                <div className="flex items-center gap-space-xs mt-1">
                  <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-secondary-fixed text-primary-container font-bold">
                    {carrera}
                  </span>
                  <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-high text-primary-container font-semibold">
                    {sede}
                  </span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="flex flex-col gap-space-xs py-space-xs">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">
                  Artículos Incluidos ({selectedItems.length}):
                </span>
                <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
                  {selectedItems.map((it) => (
                    <div key={it.id} className="flex items-center justify-between text-xs py-1 border-b border-surface-container-low">
                      <span className="text-primary font-medium truncate max-w-[200px]">
                        {it.nombre} ({it.talla})
                      </span>
                      <span className="text-on-surface-variant font-bold shrink-0">
                        S/ {it.precioRegular.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subtotal & Discount Calculation */}
              <div className="flex flex-col gap-space-xs pt-space-sm border-t border-surface-container-high font-body-sm text-body-sm">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Subtotal regular:</span>
                  <span className="font-label-lg text-label-lg font-bold text-on-surface">
                    S/ {subtotalRegular.toFixed(2)}
                  </span>
                </div>
                {/* Automated Coupon Badge */}
                <div className="flex items-center justify-between bg-tertiary-fixed text-on-tertiary-fixed p-2 rounded-lg font-label-sm text-label-sm">
                  <div className="flex items-center gap-1.5 font-bold text-primary">
                    <span className="material-symbols-outlined text-[16px]">local_offer</span>
                    <span>Campaña Internado 2026 (-15%)</span>
                  </div>
                  <span className="font-bold font-label-lg text-label-lg text-primary">
                    - S/ {discountAmount.toFixed(2)}
                  </span>
                </div>
                {/* Hospital Shipping Benefit */}
                <div className="flex items-start gap-2 bg-secondary-fixed/30 p-2 rounded-lg text-primary-container mt-1 font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">location_on</span>
                  <span className="font-normal text-[12px] leading-tight">
                    <strong>Envío Gratis:</strong> Entrega prioritaria en 24h a sedes hospitalarias de Lima (Rebagliati, Loayza, Almenara, Dos de Mayo).
                  </span>
                </div>
              </div>

              {/* Final Grand Total Block */}
              <div className="p-space-md rounded-xl bg-gradient-to-br from-surface-container-low to-secondary-fixed/20 flex flex-col gap-1 border border-surface-container-high">
                <div className="flex items-baseline justify-between">
                  <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold">Total a Pagar:</span>
                  <span className="line-through font-label-md text-label-md text-on-surface-variant opacity-60">S/ {subtotalRegular.toFixed(2)}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
                    S/ {grandTotal.toFixed(2)}
                  </span>
                  <span className="font-label-sm text-label-sm font-bold text-primary bg-tertiary-fixed px-2 py-0.5 rounded">
                    ¡Ahorras S/ {discountAmount.toFixed(2)}!
                  </span>
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant italic mt-1 text-xs">Precios incluyen IGV. Comprobante de pago emitido automáticamente.</p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-space-sm pt-space-xs">
                <button
                  type="button"
                  onClick={handleSendKitWhatsApp}
                  disabled={isSubmitting || selectedItems.length === 0}
                  className="w-full py-3.5 px-space-md rounded-xl bg-primary-container text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 hover:bg-primary shadow-md hover:shadow-lg transition-all group cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[20px] text-secondary-fixed group-hover:scale-110 transition-transform">chat</span>
                  <span>{isSubmitting ? 'Generando Cotización...' : 'Cotizar Kit por WhatsApp'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddKitToCart}
                  disabled={selectedItems.length === 0}
                  className="w-full py-3 px-space-md rounded-xl bg-secondary-fixed text-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 hover:bg-secondary-fixed-dim transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                  <span>Añadir Kit a mi Carrito ({selectedItems.length} prendas)</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="w-full py-2.5 px-space-md rounded-xl bg-transparent border-2 border-secondary-fixed-dim text-primary-container font-label-lg text-label-lg font-bold hover:bg-secondary-fixed/30 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">bookmark_add</span>
                  <span>Guardar configuración de Kit</span>
                </button>
                {saveMessage && (
                  <div className="text-center text-xs text-green-800 bg-green-100 p-2 rounded-lg font-bold">
                    {saveMessage}
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-space-sm border-t border-surface-container-high text-center">
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-[18px] text-primary-container">verified_user</span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant leading-tight">Telas certificadas</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-[18px] text-primary-container">published_with_changes</span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant leading-tight">Cambio de talla gratis</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-[18px] text-primary-container">format_quote</span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant leading-tight">Bordado institucional</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
