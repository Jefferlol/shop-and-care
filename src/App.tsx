import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { TabInicio } from './views/TabInicio';
import { TabCatalogo } from './views/TabCatalogo';
import { TabKit } from './views/TabKit';
import { TabGuia } from './views/TabGuia';
import { AdminView } from './views/AdminView';
import { CartDrawer } from './components/CartDrawer';

export const App: React.FC = () => {
  const { activeTab, whatsappNumber, cartTotalCount, setIsCartOpen } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-white text-shop-text selection:bg-shop-sky selection:text-shop-navy">
      {/* 1. Fixed Navbar with Benefits Strip */}
      <Navbar />

      {/* 3. Main Views (SPA navigation synced with URL hash & query params) */}
      <main className="flex-1">
        {activeTab === 'inicio' && <TabInicio />}
        {activeTab === 'catalogo' && <TabCatalogo />}
        {activeTab === 'kit' && <TabKit />}
        {activeTab === 'guia' && <TabGuia />}
        {activeTab === 'admin' && <AdminView />}
      </main>

      {/* 4. Deep Navy Footer */}
      <Footer />

      {/* 5. Carrito de Compras Lateral (Drawer) */}
      <CartDrawer />

      {/* Floating Cart Button (when items in cart) */}
      {cartTotalCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          aria-label="Abrir Carrito de Compras"
          className="fixed bottom-22 right-6 z-40 bg-primary-container text-on-primary p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer border-2 border-surface-container-lowest"
          title="Ver mi Carrito de Compras"
        >
          <span className="material-symbols-outlined text-[24px] text-secondary-fixed">shopping_bag</span>
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-tertiary-fixed text-primary font-headline-sm font-bold text-[11px] flex items-center justify-center border border-surface-container-lowest shadow-sm">
            {cartTotalCount}
          </span>
        </button>
      )}

      {/* Floating WhatsApp Action Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola Shop & Care, tengo una consulta sobre uniformes médicos o instrumental.')}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Atención por WhatsApp"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-display font-bold text-xs text-white group-hover:pl-2">
          Atención de Guardia
        </span>
      </a>
    </div>
  );
};
