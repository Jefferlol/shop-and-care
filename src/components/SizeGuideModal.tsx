import React from 'react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipo?: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-surface-container-high"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-primary-container hover:bg-surface-container-low rounded-full transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">straighten</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-primary-container">
              Tabla de Medidas Reales — Confección Perú
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Medidas anatómicas en centímetros (cm) con holgura para turnos de guardia 24h / 36h
            </p>
          </div>
        </div>

        <div className="overflow-x-auto my-4 border border-surface-container-high rounded-xl">
          <table className="w-full text-left font-body-sm text-body-sm">
            <thead className="bg-surface-container-low font-headline-sm font-bold text-primary-container border-b border-surface-container-high">
              <tr>
                <th className="p-3">Talla</th>
                <th className="p-3">Busto / Pecho (cm)</th>
                <th className="p-3">Cintura (cm)</th>
                <th className="p-3">Cadera (cm)</th>
                <th className="p-3">Estatura recomendada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high text-on-surface">
              <tr className="hover:bg-surface-container-low/50">
                <td className="p-3 font-bold text-primary-container">XS</td>
                <td className="p-3">82 - 88</td>
                <td className="p-3">64 - 70</td>
                <td className="p-3">88 - 94</td>
                <td className="p-3">1.50 m - 1.58 m</td>
              </tr>
              <tr className="hover:bg-surface-container-low/50 bg-secondary-fixed/20">
                <td className="p-3 font-bold text-primary-container">S</td>
                <td className="p-3">88 - 94</td>
                <td className="p-3">70 - 76</td>
                <td className="p-3">94 - 100</td>
                <td className="p-3">1.58 m - 1.66 m</td>
              </tr>
              <tr className="hover:bg-surface-container-low/50">
                <td className="p-3 font-bold text-primary-container">M</td>
                <td className="p-3">94 - 100</td>
                <td className="p-3">76 - 82</td>
                <td className="p-3">100 - 106</td>
                <td className="p-3">1.66 m - 1.74 m</td>
              </tr>
              <tr className="hover:bg-surface-container-low/50">
                <td className="p-3 font-bold text-primary-container">L</td>
                <td className="p-3">100 - 108</td>
                <td className="p-3">82 - 90</td>
                <td className="p-3">106 - 114</td>
                <td className="p-3">1.72 m - 1.80 m</td>
              </tr>
              <tr className="hover:bg-surface-container-low/50">
                <td className="p-3 font-bold text-primary-container">XL</td>
                <td className="p-3">108 - 118</td>
                <td className="p-3">90 - 100</td>
                <td className="p-3">114 - 124</td>
                <td className="p-3">1.76 m - 1.86 m</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-surface-container-low p-4 rounded-xl space-y-2 font-body-sm text-body-sm text-on-surface-variant">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">verified</span>
            <span>
              <strong className="text-primary-container">Cambio de Talla 100% Garantizado:</strong> Si la talla elegida no te queda perfecta, te la cambiamos sin costo adicional en Lima y con cobertura en provincias.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">verified</span>
            <span>
              <strong className="text-primary-container">Telas Ultra-Flex 4-Way Stretch:</strong> Confeccionadas con elastano para máxima libertad de movimiento al agacharte, canalizar vías y reanimar pacientes.
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-primary-container text-on-primary font-headline-sm font-bold text-body-sm rounded-xl hover:bg-primary transition-colors cursor-pointer"
          >
            Entendido, volver a mi selección
          </button>
        </div>
      </div>
    </div>
  );
};
