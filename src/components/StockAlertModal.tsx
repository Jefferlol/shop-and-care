import React, { useState } from 'react';
import { Product } from '../types';

interface StockAlertModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StockAlertModal: React.FC<StockAlertModalProps> = ({ product, isOpen, onClose }) => {
  const [contacto, setContacto] = useState('');
  const [talla, setTalla] = useState(product?.tallas[0] || 'M');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contacto.trim()) return;

    setIsSubmitting(true);
    setStatus('idle');
    try {
      const res = await fetch('/api/alertas-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producto_slug: product.slug,
          talla,
          contacto: contacto.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setMessage(data.message || '¡Te avisaremos apenas haya stock disponible!');
      } else {
        setStatus('error');
        setMessage(data.error || 'Ocurrió un error al registrar tu alerta.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('No se pudo conectar con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-surface-container-high"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-primary-container hover:bg-surface-container-low rounded-full transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">notifications_active</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-primary-container">
              Avísame cuando vuelva
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {product.nombre} (Agotado temporalmente)
            </p>
          </div>
        </div>

        {status === 'success' ? (
          <div className="bg-surface-container-low p-6 rounded-xl text-center space-y-3">
            <span className="material-symbols-outlined text-[42px] text-secondary">check_circle</span>
            <h4 className="font-headline-sm text-headline-sm font-bold text-primary-container">
              ¡Alerta Registrada con Éxito!
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              {message}
            </p>
            <button
              onClick={onClose}
              className="mt-4 w-full bg-primary-container text-on-primary font-headline-sm font-bold text-body-sm py-2.5 rounded-xl hover:bg-primary transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Este modelo se agota con frecuencia por la alta demanda de internado hospitalario. Déjanos tu WhatsApp o correo para avisarte con prioridad en la próxima reposición con tu 15% de descuento garantizado.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-primary-container font-semibold">
                Talla de interés
              </label>
              <select
                value={talla}
                onChange={(e) => setTalla(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none"
              >
                {product.tallas.map((t) => (
                  <option key={t} value={t}>Talla {t}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-primary-container font-semibold">
                WhatsApp o Correo
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">contact_mail</span>
                <input
                  type="text"
                  required
                  value={contacto}
                  onChange={(e) => setContacto(e.target.value)}
                  placeholder="+51 987 654 321 o tu@correo.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none"
                />
              </div>
            </div>

            {status === 'error' && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs">
                {message}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-body-sm text-on-surface-variant hover:text-primary-container transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-secondary-fixed-dim text-primary-container font-headline-sm font-bold text-body-sm hover:bg-secondary-container transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? 'Registrando...' : 'Notificarme'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
