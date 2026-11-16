import React, { useState } from 'react';
import { Product, ColorOption } from '../types';
import { useApp } from '../context/AppContext';
import { SizeGuideModal } from '../components/SizeGuideModal';
import { StockAlertModal } from '../components/StockAlertModal';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, onBack }) => {
  const { hasDiscount, discountCode, whatsappNumber, navigateTo, addToCart } = useApp();

  const [selectedColor, setSelectedColor] = useState<ColorOption>(
    product.colores[0] || { nombre: 'Navy Blue (UNMSM)', hex: '#001e44' }
  );
  const [selectedTalla, setSelectedTalla] = useState<string>(
    product.tallas[0] || 'S'
  );
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [stockAlertOpen, setStockAlertOpen] = useState(false);
  const [addedMessage, setAddedMessage] = useState(false);

  const isAgotado = product.en_stock === 0;
  const priceToDisplay = hasDiscount ? product.precio_dto : product.precio_normal;
  const savings = (product.precio_normal - product.precio_dto).toFixed(2);

  const handleWhatsAppOrder = () => {
    let msg = `Hola Shop & Care, deseo ordenar el modelo *${product.nombre}*:\n`;
    msg += `• Talla: *${selectedTalla}*\n`;
    msg += `• Color: *${selectedColor.nombre}*\n`;
    if (hasDiscount) {
      msg += `• Precio con 15% DTO: S/ ${product.precio_dto.toFixed(2)} (Cupón: ${discountCode})\n`;
    } else {
      msg += `• Precio regular: S/ ${product.precio_normal.toFixed(2)}\n`;
    }
    msg += `\n¿Tienen entrega prioritaria para mi hospital docente?`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleAddToCart = () => {
    addToCart(product, selectedTalla, selectedColor, 1, true);
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-margin py-space-lg animate-fadeIn">
      {/* Back to catalog button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-space-xs font-label-md text-label-md text-primary hover:text-secondary mb-space-md cursor-pointer transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        <span>Volver al Catálogo</span>
      </button>

      {/* Inline Showcase from Stitch Screen 2 lines 451-600 */}
      <div className="relative bg-surface-container-lowest rounded-2xl p-space-lg lg:p-space-xl shadow-xl overflow-hidden border border-surface-container-high">
        {/* Top Decorative Sky Glow Circle */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-secondary-fixed/30 rounded-full blur-3xl pointer-events-none" />

        {/* Header of the Highlight Showcase */}
        <div className="flex items-center justify-between pb-space-md mb-space-lg border-b border-surface-container-high flex-wrap gap-2">
          <div className="flex items-center gap-space-sm">
            <span className="w-3 h-3 rounded-full bg-secondary animate-ping" />
            <span className="font-label-lg text-label-lg text-primary uppercase tracking-wide font-bold">
              Detalle de Selección Rápida — Modelo Destacado
            </span>
          </div>
          <span className="bg-secondary-fixed text-primary px-space-md py-1 rounded-full font-label-sm text-label-sm font-semibold">
            Modelo Oficial Recomendado por Internas
          </span>
        </div>

        {/* Split Layout 50/50 from Stitch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Left Column: Visual Showcase (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            <div className="relative w-full aspect-[3/4] bg-surface-container-low rounded-xl overflow-hidden shadow-md border border-surface-container-high">
              <img
                className="w-full h-full object-cover"
                alt={product.nombre}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJ83lOkmlgc5yPPZHA-KKKmBKrRv8J3cDORSBNKocp-7bXRblftkBznLcErCM1hNNgBHdnb8UAK52DXprEhNQujxSZMHGylYwQ0iUgty11EhY3J9HPpHY0jQClpYw6y4lTuYG_6lWE9KJOnKhxFpaOu2jzIzhf93lx5HAhtG0D8XyhwMfLQQE5n9Wzbe1SQgM2iJ6yr8-hrWpHRFiD5ypYhJORe_1XXlloooz5QZ6J"
              />
              {/* Badges Layered */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-primary text-on-primary font-label-md text-label-md px-space-md py-1 rounded-full shadow-md font-bold">
                  Bestseller Internado 2026
                </span>
                <span className="bg-tertiary-fixed text-primary font-label-md text-label-md px-space-md py-1 rounded-full font-bold shadow-md">
                  -15% DTO Primera Compra
                </span>
              </div>
              {/* Certified Peruvian Quality Micro-badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/95 backdrop-blur-md p-space-sm rounded-lg shadow flex items-center gap-space-sm border border-surface-container-high">
                <span className="material-symbols-outlined text-secondary text-[24px]">verified</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-primary uppercase font-bold">Confección Gamarra Premium</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">Costura doble remalle de grado quirúrgico</span>
                </div>
              </div>
            </div>

            {/* Secondary Micro Thumbnails from Stitch */}
            <div className="grid grid-cols-3 gap-space-sm">
              <div className="aspect-square bg-surface-container-low rounded-lg overflow-hidden ring-2 ring-primary p-0.5 cursor-pointer">
                <img
                  className="w-full h-full object-cover rounded-md"
                  alt="Detalle de pretina elástica"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJcL7NGN09S5H-rMHPgZh-0AkE7w02UqTaTrUE0UQwBjcV6naUn6OdoCeb2vkNuCn7Tq41JVYInvDy3_iaG9rcBF1bifj5hmsUZhcwDF3gD1WryyuZWmc_U1mKpJzaWAn9dBQIPMEH4vrNiHbA3QK0qbDea65uVMxWt4EHkzlR9NMQ_pVnwhWO1fWEXd8u9AmfPUjfOFDUhvUm5g4Cd6so2v7pBF0aq2LpbTMUp6wv"
                />
              </div>
              <div className="aspect-square bg-surface-container-low rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                <img
                  className="w-full h-full object-cover rounded-md"
                  alt="Bolsillos laterales cargo"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDPHDfW8avbvJn8rbCe29YtFwJuhmcPBJmzSfCd9p80YFt-m9-0VsyMxr5H8iJBK9jsEmgaQOxbdSLRPtFN-kGq_uig_tAbb7uJt2c8iWK1eV6AQfkxy-RtqSLk6BbeTlvVnGgycOH9c1pIyOFoRfeWVBHUA5R5no6XOKBRLC8pNN3lSTFQ-s0DRLCUWyb7LABYYPJEnCElFMqM3ER2cjS5FtiLVn1zVXdQN3GN5vA"
                />
              </div>
              <div className="aspect-square bg-surface-container-low rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                <img
                  className="w-full h-full object-cover rounded-md"
                  alt="Espalda ergonómica stretch"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDr0Ip1NC92H-Pvz43nXvpTNMJ-HJi6ims5hYyOPefvbtEHUDgHyABOOx3sLC1FfL_EsDm22-J9uS_m1OegwMHgoBRQs3r7Sb9EsZqQWwpZl6AgqRwlbXh7CrfGJ8Byc-xYIHVCdohW5YqoYI4RPLKj9AgVLHyv6qKRHg7zpWt_TkdvKGbnA7640XDnvjjzkiKUe0wylOK2qv5jzq6oL76YRg5JDj-ApF5YV6BEU6P_"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Specs, Customization & Actions (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            {/* Title & Social Proof */}
            <div className="flex flex-col gap-space-xs">
              <h3 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                {product.nombre} — Filipina + Pantalón Jogger
              </h3>
              {/* Rating in Heart Pink directly from Stitch */}
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <div className="flex items-center text-tertiary-fixed-dim">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[20px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <span className="font-label-md text-label-md text-primary font-bold">5.0</span>
                <span className="text-on-surface-variant font-body-sm text-body-sm">
                  (142 reseñas verificadas de internas en Lima y provincias)
                </span>
              </div>
            </div>

            {/* Price Calculation Pill */}
            <div className="bg-surface-container-low p-space-md rounded-xl flex items-center justify-between flex-wrap gap-space-sm border border-surface-container-high">
              <div className="flex items-baseline gap-space-sm">
                <span className="font-headline-xl text-headline-xl text-primary font-bold">
                  S/ {priceToDisplay.toFixed(2)}
                </span>
                <span className="font-body-lg text-body-lg text-on-surface-variant line-through">
                  S/ {product.precio_normal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-tertiary-fixed text-primary font-label-md text-label-md px-3 py-1 rounded-full font-bold">
                  Ahorras S/ {savings}
                </span>
                <span className="text-secondary font-label-sm text-label-sm font-semibold">Incluye IGV &amp; Factura</span>
              </div>
            </div>

            {/* Color Swatch Selector with Hospital Names from Stitch */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
                  1. Selecciona Color Clínico:
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-bold">
                  {selectedColor.nombre} Seleccionado
                </span>
              </div>
              <div className="flex flex-wrap gap-space-sm">
                {[
                  { nombre: 'Navy Blue (UNMSM)', hex: '#001e44' },
                  { nombre: 'Celeste San Fernando', hex: '#9dccf0' },
                  { nombre: 'Vino Cayetano', hex: '#522634' },
                  { nombre: 'Verde Rebagliati', hex: '#205040' },
                ].map((col) => (
                  <button
                    key={col.nombre}
                    onClick={() => setSelectedColor(col)}
                    className={`flex items-center gap-2 px-space-md py-2 rounded-lg text-left transition-all cursor-pointer ${
                      selectedColor.nombre === col.nombre
                        ? 'bg-surface-container-lowest ring-2 ring-primary shadow-sm'
                        : 'bg-surface-container-low hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full border border-outline shrink-0" style={{ backgroundColor: col.hex }} />
                    <span className="font-label-md text-label-md text-primary font-semibold">{col.nombre}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector from Stitch */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
                  2. Selecciona Talla:
                </span>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="font-label-sm text-label-sm text-secondary hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">straighten</span>
                  <span>Guía de medidas UNMSM / Cayetano</span>
                </button>
              </div>
              <div className="flex items-center gap-space-xs">
                {product.tallas.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTalla(t)}
                    className={`w-12 h-12 rounded-lg font-label-md text-label-md font-bold flex items-center justify-center transition-all cursor-pointer ${
                      selectedTalla === t
                        ? 'bg-primary text-on-primary shadow-md scale-105'
                        : 'bg-surface-container-low hover:bg-surface-container-high text-primary'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Key Specs Highlights Bullets from Stitch */}
            <div className="bg-surface-container-low/60 p-space-md rounded-xl flex flex-col gap-space-xs border border-surface-container-high">
              <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
                Utilidad Clínica en Guardia:
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {product.descripcion}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-surface-container-high text-xs text-on-surface">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[16px]">water_drop</span>
                  <span>99.4% Antifluido Clororresistente</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[16px]">autorenew</span>
                  <span>Elasticidad Bidireccional 4-Way Stretch</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[16px]">shield</span>
                  <span>Tratamiento Antibacterial Duradero</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[16px]">local_laundry_service</span>
                  <span>Secado Rápido en 45 Minutos</span>
                </div>
              </div>
            </div>

            {/* Actions: Pedir por WhatsApp & Añadir al Kit */}
            <div className="flex flex-col sm:flex-row items-center gap-space-md pt-space-xs">
              {isAgotado ? (
                <button
                  onClick={() => setStockAlertOpen(true)}
                  className="w-full bg-surface-container-high text-primary font-label-lg text-label-lg py-3.5 px-space-md rounded-xl hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2 cursor-pointer font-bold"
                >
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                  <span>Avisarme cuando vuelva a estar en Stock</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleAddToCart}
                    className="w-full sm:flex-1 bg-secondary-fixed text-primary font-label-lg text-label-lg py-3.5 px-space-md rounded-xl hover:bg-secondary-fixed-dim transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer font-bold"
                  >
                    <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                    <span>{addedMessage ? '¡Agregado al Carrito!' : 'Añadir al Carrito'}</span>
                  </button>

                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full sm:flex-1 bg-primary text-on-primary font-label-lg text-label-lg py-3.5 px-space-md rounded-xl hover:bg-on-primary-fixed-variant transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer font-bold"
                  >
                    <span className="material-symbols-outlined text-[20px] text-secondary-fixed">chat</span>
                    <span>Pedir por WhatsApp</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      <StockAlertModal product={product} isOpen={stockAlertOpen} onClose={() => setStockAlertOpen(false)} />
    </div>
  );
};
