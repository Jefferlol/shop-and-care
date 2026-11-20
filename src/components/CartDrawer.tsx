import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotalCount,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    whatsappNumber,
    navigateTo,
  } = useApp();

  const [isSendingOrder, setIsSendingOrder] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckoutWhatsApp = async () => {
    if (cart.length === 0) return;

    setIsSendingOrder(true);
    const orderCode = `SC-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      // Registrar cotización en base de datos SQLite
      await fetch('/api/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origen: 'carrito_multiproducto',
          items: cart.map(item => ({
            id: item.producto.id,
            nombre: item.producto.nombre,
            talla: item.talla,
            color: item.color.nombre,
            cantidad: item.cantidad,
            precio_unit: item.producto.precio_dto,
            subtotal: item.producto.precio_dto * item.cantidad,
          })),
          subtotal: cartSubtotal,
          descuento: cartDiscount,
          total: cartTotal,
        }),
      });
    } catch (err) {
      console.warn('No se pudo registrar cotización en backend, procediendo a WhatsApp:', err);
    } finally {
      setIsSendingOrder(false);
    }

    // Armar mensaje estructurado para WhatsApp
    let mensaje = `Hola *Shop & Care*, quisiera realizar el siguiente pedido desde la web:\n\n`;
    mensaje += `📋 *PEDIDO #${orderCode}*\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━━━━\n`;

    cart.forEach(item => {
      const lineTotal = (item.producto.precio_dto * item.cantidad).toFixed(2);
      mensaje += `• *${item.cantidad}x ${item.producto.nombre}*\n`;
      mensaje += `   Talla: ${item.talla} | Color: ${item.color.nombre}\n`;
      mensaje += `   Subtotal: S/ ${lineTotal}\n\n`;
    });

    mensaje += `━━━━━━━━━━━━━━━━━━━━━\n`;
    mensaje += `💵 *Subtotal:* S/ ${cartSubtotal.toFixed(2)}\n`;
    if (cartDiscount > 0) {
      mensaje += `🏷️ *Descuento 15% DTO:* -S/ ${cartDiscount.toFixed(2)}\n`;
    }
    mensaje += `✨ *TOTAL A PAGAR:* S/ ${cartTotal.toFixed(2)}\n\n`;
    mensaje += `¿Podrían confirmarme la disponibilidad y los datos de Yape / cuenta para coordinar la entrega en mi hospital o domicilio?`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-primary/60 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-container-lowest shadow-2xl flex flex-col border-l border-surface-container-high">
          {/* Header */}
          <div className="p-space-md border-b border-surface-container-high flex items-center justify-between bg-surface-container-low/60">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-secondary-fixed text-primary flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-body-lg font-bold text-primary-container leading-none">
                  Mi Carrito de Compras
                </h3>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {cartTotalCount} {cartTotalCount === 1 ? 'artículo seleccionado' : 'artículos seleccionados'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-on-surface-variant hover:text-primary-container hover:bg-surface-container-low rounded-full transition-colors cursor-pointer"
              aria-label="Cerrar carrito"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-space-md flex flex-col gap-space-sm">
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-3">
                <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[36px] text-secondary">shopping_cart</span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-primary-container font-bold">
                  Tu carrito está vacío
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
                  Explora nuestros scrubs médicos antifluido, guardapolvos e instrumental clínico para tus rotaciones.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('catalogo');
                  }}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-primary-container text-on-primary font-headline-sm text-body-sm font-bold hover:bg-primary transition-all cursor-pointer shadow-sm"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              cart.map((item, index) => {
                const lineTotal = (item.producto.precio_dto * item.cantidad).toFixed(2);
                return (
                  <div
                    key={`${item.producto.id}-${item.talla}-${item.color.nombre}-${index}`}
                    className="p-3.5 bg-surface-container-low rounded-xl border border-surface-container-high flex flex-col gap-2.5 transition-all hover:border-secondary/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Thumbnail image with color dot */}
                        <div className="relative w-12 h-14 rounded-lg bg-surface-container-lowest border border-surface-container-high overflow-hidden shrink-0">
                          <img
                            src={item.producto.imagen || `/productos/${item.producto.slug}.jpg`}
                            alt={item.producto.nombre}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/Logo.jpeg';
                            }}
                          />
                          <div
                            className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-white shadow-xs"
                            style={{ backgroundColor: item.color.hex }}
                            title={item.color.nombre}
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-headline-sm text-body-md font-bold text-primary-container truncate">
                            {item.producto.nombre}
                          </span>
                          <span className="font-label-sm text-[11px] text-on-surface-variant">
                            {item.producto.categoria}
                          </span>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="px-2 py-0.5 rounded bg-surface-container-lowest border border-surface-container-high font-label-sm text-[11px] font-bold text-primary-container">
                              Talla {item.talla}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-surface-container-lowest border border-surface-container-high font-label-sm text-[11px] text-on-surface-variant truncate max-w-[140px]">
                              {item.color.nombre}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Botón eliminar */}
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-on-surface-variant hover:text-red-600 p-1 transition-colors cursor-pointer"
                        title="Eliminar artículo"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>

                    {/* Precios y Selector de cantidad */}
                    <div className="flex items-center justify-between pt-1 border-t border-surface-container-high/60">
                      <div className="flex items-center gap-2 bg-surface-container-lowest rounded-lg border border-surface-container-high p-0.5">
                        <button
                          onClick={() => updateCartQuantity(index, -1)}
                          className="w-7 h-7 flex items-center justify-center text-primary-container hover:bg-surface-container-low rounded font-bold cursor-pointer transition-colors"
                          aria-label="Disminuir"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-body-sm text-primary-container">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(index, 1)}
                          className="w-7 h-7 flex items-center justify-center text-primary-container hover:bg-surface-container-low rounded font-bold cursor-pointer transition-colors"
                          aria-label="Aumentar"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="font-headline-sm text-body-md font-bold text-primary-container">
                          S/ {lineTotal}
                        </div>
                        {item.producto.precio_normal > item.producto.precio_dto && (
                          <span className="text-[11px] text-on-surface-variant line-through block">
                            S/ {(item.producto.precio_normal * item.cantidad).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary (if cart has items) */}
          {cart.length > 0 && (
            <div className="p-space-md border-t border-surface-container-high bg-surface-container-low/40 flex flex-col gap-space-sm">
              <div className="flex flex-col gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Subtotal regular:</span>
                  <span>S/ {cartSubtotal.toFixed(2)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#e57399] font-semibold">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">sell</span>
                      Descuento exclusivo (15%):
                    </span>
                    <span>-S/ {cartDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-surface-container-high">
                  <span className="font-headline-sm text-body-lg font-bold text-primary-container">Total en Soles:</span>
                  <span className="font-headline-lg text-headline-sm font-extrabold text-primary-container">
                    S/ {cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Botón WhatsApp Checkout */}
              <button
                onClick={handleCheckoutWhatsApp}
                disabled={isSendingOrder}
                className="w-full py-3.5 px-6 rounded-xl bg-secondary-fixed text-primary font-headline-sm text-body-md font-bold flex items-center justify-center gap-2 hover:bg-secondary-fixed-dim transition-all shadow-sm active:scale-[0.99] cursor-pointer disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                <span>{isSendingOrder ? 'Generando orden...' : 'Pedir Todo por WhatsApp'}</span>
              </button>

              <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1">
                <button
                  onClick={clearCart}
                  className="hover:text-red-600 transition-colors cursor-pointer"
                >
                  Vaciar carrito
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="hover:text-primary-container font-semibold transition-colors cursor-pointer"
                >
                  Seguir comprando
                </button>
              </div>

              <div className="text-center font-label-sm text-[11px] text-on-surface-variant pt-1">
                🔒 Coordinación directa con atención al cliente Shop &amp; Care
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
