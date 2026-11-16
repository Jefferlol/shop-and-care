import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import fallbackCatalogo from '../data/catalogo.json';

interface UtmParams {
  utm_source: string;
  utm_campaign: string;
  utm_term: string;
}

interface AppContextType {
  activeTab: 'inicio' | 'catalogo' | 'kit' | 'guia' | 'admin';
  setActiveTab: (tab: 'inicio' | 'catalogo' | 'kit' | 'guia' | 'admin') => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedProductSlug: string | null;
  setSelectedProductSlug: (slug: string | null) => void;
  hasDiscount: boolean;
  unlockDiscount: () => void;
  discountCode: string;
  products: Product[];
  isLoadingProducts: boolean;
  refreshProducts: () => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product, talla?: string, color?: any, cantidad?: number, openDrawer?: boolean) => void;
  updateCartQuantity: (index: number, delta: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotalCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;
  whatsappNumber: string;
  utms: UtmParams;
  navigateTo: (tab: 'inicio' | 'catalogo' | 'kit' | 'guia' | 'admin', params?: { categoria?: string; producto?: string }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<'inicio' | 'catalogo' | 'kit' | 'guia' | 'admin'>('inicio');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [hasDiscount, setHasDiscount] = useState<boolean>(() => {
    return localStorage.getItem('shopcare_has_discount') === 'true';
  });
  const [products, setProducts] = useState<Product[]>(fallbackCatalogo as unknown as Product[]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shopcare_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [utms, setUtms] = useState<UtmParams>({ utm_source: '', utm_campaign: '', utm_term: '' });

  // Guardar carrito en localStorage automáticamente
  useEffect(() => {
    try {
      localStorage.setItem('shopcare_cart_items', JSON.stringify(cart));
    } catch (e) {
      console.error('Error guardando carrito:', e);
    }
  }, [cart]);

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '51999999999';
  const discountCode = 'TURNO15';

  // Sincronizar URL hash y parámetros
  const syncFromUrl = () => {
    const hash = window.location.hash.toLowerCase();
    const searchParams = new URLSearchParams(window.location.search);

    // UTMs
    setUtms({
      utm_source: searchParams.get('utm_source') || '',
      utm_campaign: searchParams.get('utm_campaign') || '',
      utm_term: searchParams.get('utm_term') || '',
    });

    const catParam = searchParams.get('categoria');
    if (catParam) {
      setSelectedCategory(catParam);
    }

    const prodParam = searchParams.get('producto');
    if (prodParam) {
      setSelectedProductSlug(prodParam);
    } else {
      setSelectedProductSlug(null);
    }

    if (hash.includes('#admin')) {
      setActiveTabState('admin');
    } else if (hash.includes('#catalogo')) {
      setActiveTabState('catalogo');
    } else if (hash.includes('#kit')) {
      setActiveTabState('kit');
    } else if (hash.includes('#guia') || hash.includes('#comunidad') || hash.includes('#contacto')) {
      setActiveTabState('guia');
    } else {
      setActiveTabState('inicio');
    }
  };

  useEffect(() => {
    syncFromUrl();
    window.addEventListener('hashchange', syncFromUrl);
    window.addEventListener('popstate', syncFromUrl);
    return () => {
      window.removeEventListener('hashchange', syncFromUrl);
      window.removeEventListener('popstate', syncFromUrl);
    };
  }, []);

  const navigateTo = (tab: 'inicio' | 'catalogo' | 'kit' | 'guia' | 'admin', params?: { categoria?: string; producto?: string }) => {
    setActiveTabState(tab);
    const search = new URLSearchParams();

    // Mantener UTMs si existen
    if (utms.utm_source) search.set('utm_source', utms.utm_source);
    if (utms.utm_campaign) search.set('utm_campaign', utms.utm_campaign);
    if (utms.utm_term) search.set('utm_term', utms.utm_term);

    if (params?.categoria) {
      setSelectedCategory(params.categoria);
      search.set('categoria', params.categoria);
    }

    if (params?.producto) {
      setSelectedProductSlug(params.producto);
      search.set('producto', params.producto);
    } else if (tab !== 'catalogo' || !params?.producto) {
      setSelectedProductSlug(null);
    }

    const searchStr = search.toString() ? `?${search.toString()}` : '';
    window.location.hash = `#${tab}${searchStr}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setActiveTab = (tab: 'inicio' | 'catalogo' | 'kit' | 'guia' | 'admin') => {
    navigateTo(tab);
  };

  const unlockDiscount = () => {
    setHasDiscount(true);
    localStorage.setItem('shopcare_has_discount', 'true');
  };

  // Obtener productos desde el backend SQLite
  const refreshProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const res = await fetch('/api/productos');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.productos) {
          setProducts(data.productos);
        }
      }
    } catch (err) {
      console.warn('Backend SQLite no disponible de inmediato, usando catálogo local:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const addToCart = (
    product: Product,
    talla?: string,
    color?: any,
    cantidad: number = 1,
    openDrawer: boolean = true
  ) => {
    const selectedTalla = talla || product.tallas?.[0] || 'M';
    const selectedColor = color || product.colores?.[0] || { nombre: 'Estándar', hex: '#0D3365' };

    setCart(prev => {
      const existingIdx = prev.findIndex(
        item =>
          item.producto.id === product.id &&
          item.talla === selectedTalla &&
          item.color?.nombre === selectedColor?.nombre
      );

      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          cantidad: updated[existingIdx].cantidad + cantidad,
        };
        return updated;
      }

      return [
        ...prev,
        {
          producto: product,
          talla: selectedTalla,
          color: selectedColor,
          cantidad: Math.max(1, cantidad),
        },
      ];
    });

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const updateCartQuantity = (index: number, delta: number) => {
    setCart(prev => {
      if (!prev[index]) return prev;
      const newQty = prev[index].cantidad + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      const updated = [...prev];
      updated[index] = { ...updated[index], cantidad: newQty };
      return updated;
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  // Cálculos consolidados del Carrito
  const cartTotalCount = cart.reduce((acc, item) => acc + item.cantidad, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.producto.precio_normal * item.cantidad), 0);
  
  // Si el usuario tiene descuento activo o en todos los pedidos se calcula el ahorro del 15%
  const cartDiscount = cart.reduce((acc, item) => {
    const itemSavings = (item.producto.precio_normal - item.producto.precio_dto) * item.cantidad;
    return acc + Math.max(0, itemSavings);
  }, 0);

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        selectedProductSlug,
        setSelectedProductSlug,
        hasDiscount,
        unlockDiscount,
        discountCode,
        products,
        isLoadingProducts,
        refreshProducts,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotalCount,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        whatsappNumber,
        utms,
        navigateTo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
