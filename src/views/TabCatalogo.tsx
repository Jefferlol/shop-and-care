import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { ProductDetailView } from './ProductDetailView';
import { StockAlertModal } from '../components/StockAlertModal';

export const TabCatalogo: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    selectedProductSlug, 
    setSelectedProductSlug,
    hasDiscount,
    discountCode,
    addToCart,
    navigateTo
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState('Todas');
  const [alertProduct, setAlertProduct] = useState<Product | null>(null);

  const categories = [
    { label: 'Todos', filter: 'Todos' },
    { label: 'Scrubs Mujer', filter: 'Scrubs Mujer' },
    { label: 'Scrubs Varón', filter: 'Scrubs Varón' },
    { label: 'Guardapolvos y Casacas', filter: 'Guardapolvos y Casacas' },
    { label: 'Instrumental & Accesorios', filter: 'Instrumental' },
  ];

  const sizeOptions = ['Todas', 'XS', 'S', 'M', 'L', 'XL'];

  // Si hay un producto seleccionado, mostrar la sub-vista detallada tipo Stitch
  const activeProduct = products.find(p => p.slug === selectedProductSlug);
  if (activeProduct) {
    return (
      <ProductDetailView
        product={activeProduct}
        onBack={() => {
          setSelectedProductSlug(null);
          navigateTo('catalogo', { categoria: selectedCategory });
        }}
      />
    );
  }

  // Filtrado de productos
  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'Todos' && p.categoria !== selectedCategory) {
      return false;
    }

    if (selectedSizeFilter !== 'Todas') {
      const hasSize = p.tallas.some(t => t.toUpperCase().includes(selectedSizeFilter.toUpperCase()));
      if (!hasSize) return false;
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchName = p.nombre.toLowerCase().includes(term);
      const matchDesc = p.descripcion?.toLowerCase().includes(term);
      const matchTela = p.tela?.toLowerCase().includes(term);
      const matchColor = p.colores?.some(c => c.nombre.toLowerCase().includes(term));
      if (!matchName && !matchDesc && !matchTela && !matchColor) return false;
    }

    return true;
  });

  return (
    <div className="w-full flex flex-col pt-28 bg-surface-container-lowest min-h-[calc(100vh-140px)] animate-fadeIn">
      {/* Notice Banner directly from Stitch Screen 2 */}
      <section className="w-full bg-surface-container-low py-space-xs px-margin border-b border-surface-container-high">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm font-label-md text-label-md text-on-secondary-container">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_shipping
            </span>
            <span className="text-xs sm:text-sm">Envíos express en Lima y a todo el Perú por Shalom y Olva Courier</span>
          </div>
          <div className="flex items-center gap-space-md">
            <span className="inline-flex items-center gap-1 bg-tertiary-fixed text-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
              Campaña Internado 2026
            </span>
            <span className="text-primary font-bold text-xs sm:text-sm">
              {hasDiscount ? `15% DTO ACTIVO (${discountCode})` : '15% DTO en kits completos'}
            </span>
          </div>
        </div>
      </section>

      {/* Main Catalog Container from Stitch */}
      <section className="max-w-7xl mx-auto w-full px-margin py-space-lg flex flex-col gap-space-xl">
        {/* Header Section with Distinct Asymmetric Layout */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
          <div className="flex flex-col gap-space-xs max-w-3xl">
            <div className="flex items-center gap-space-sm">
              <span className="bg-secondary-fixed text-primary px-space-sm py-0.5 rounded-full font-label-sm text-label-sm uppercase tracking-wider font-bold">
                Hecho en Perú con Certificación Textil
              </span>
              <span className="text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary"></span> 16 Modelos Disponibles
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight">
              Catálogo Clínico &amp; Hospitalario
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Confección peruana certificada con tecnología antifluido y antibacterial. Equipamiento ergonómico de alta durabilidad para estudiantes universitarios, internos y profesionales de la salud.
            </p>
          </div>

          {/* Quick Trust Indicators */}
          <div className="flex items-center gap-space-md bg-surface-container-low p-space-sm rounded-xl border border-surface-container-high">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">verified_user</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-primary uppercase font-bold">Norma Técnica</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">MINSA &amp; EsSalud</span>
              </div>
            </div>
            <div className="w-px h-8 bg-surface-variant"></div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">water_drop</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-primary uppercase font-bold">Repelente</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">99.4% Antifluido</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Command Center */}
        <div className="bg-surface-container-low p-space-md rounded-xl shadow-sm flex flex-col gap-space-md border border-surface-container-high">
          <div className="flex flex-col md:flex-row items-center justify-between gap-space-md">
            {/* Search bar */}
            <div className="relative w-full md:w-96 flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px]">search</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por modelo, tela o color..."
                className="w-full bg-surface-container-lowest pl-10 pr-4 py-2.5 rounded-lg text-on-surface font-body-sm text-body-sm placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary-fixed shadow-sm border border-surface-container-high"
              />
            </div>

            {/* Controls: Sizes */}
            <div className="flex flex-wrap items-center gap-space-sm w-full md:w-auto justify-start md:justify-end">
              <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-2 rounded-lg shadow-sm border border-surface-container-high">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">Talla:</span>
                <div className="flex items-center gap-1">
                  {sizeOptions.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSizeFilter(sz)}
                      className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                        selectedSizeFilter === sz
                          ? 'bg-primary text-on-primary'
                          : 'text-on-surface-variant hover:text-primary'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div className="hidden xl:flex items-center gap-1.5 bg-secondary-fixed/50 px-space-md py-2 rounded-lg text-primary font-label-md text-label-md font-semibold">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span>Stock Inmediato en Almacén Lima</span>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-space-xs overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.filter}
                onClick={() => setSelectedCategory(c.filter)}
                className={`font-label-md text-label-md px-space-md py-1.5 rounded-full shrink-0 transition-all cursor-pointer ${
                  selectedCategory === c.filter
                    ? 'bg-primary text-on-primary shadow-sm font-bold'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:text-primary hover:bg-surface-container-high border border-surface-container-high'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid: Exactly matching Stitch Screen 2 */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-low rounded-2xl border border-surface-container-high p-8">
            <p className="font-headline-sm text-headline-sm text-primary">No se encontraron productos.</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Intenta con otro término o limpia los filtros.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('Todos'); setSelectedSizeFilter('Todas'); }}
              className="mt-4 bg-primary text-on-primary font-label-md px-space-md py-2 rounded-lg"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-lg">
            {filteredProducts.map((p) => {
              const isAgotado = p.en_stock === 0;
              const price = hasDiscount ? p.precio_dto : p.precio_normal;

              return (
                <div
                  key={p.id}
                  className="group relative bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-surface-container-high"
                >
                  <div className="flex flex-col">
                    {/* Image and Badges */}
                    <div 
                      onClick={() => {
                        setSelectedProductSlug(p.slug);
                        navigateTo('catalogo', { producto: p.slug });
                      }}
                      className="relative w-full aspect-[4/5] bg-surface-container-low rounded-lg overflow-hidden flex items-center justify-center mb-space-md cursor-pointer"
                    >
                      <img
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isAgotado ? 'filter grayscale-[25%]' : ''}`}
                        alt={p.nombre}
                        src={
                          p.categoria === 'Instrumental'
                            ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEH11kUz_S9G4-EFB9Sw-1cfoGYNy2aL_HOgw7rgrk-xS_ndCOTl3Dge9Kcd7Uv-VwzU1905Nax26lMWZOMjj6avSHpCzq9Zdf18Lh_H3jZoJzZGLEN7p2bs2BGUo0qT1AhXY1_rbH3kWfdTq2Eff4rGyiwJM5oebwfMiY3-Dbw9MdlKafJSxdErQ8hzSSUfDsD5HahJK8Wp6NjgBr10ppwfTFM_lB8Fe9UKTTckDa'
                            : p.slug.includes('varon')
                            ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJQv4VbzfXVxzDHxiqaSnQCW0rqIX88QmyPABSucCqp7s9N9evUZS9RUzsqPIKEZrXR-iNoF3yrKyT16YLXkPoc-9qsQZg4FoR1fCzZIwHuc4dI3_CbXLnW5W2j-3FdVh8IErBipJLXKD1h6r2p5t_ueIlr9OeEYskID0jp1V7u7Nu6h2_D-iVEMRwOCMhH5GWX31MegPGXsXlLIoi_oLX4SsS2wLfSX_9Hmn4A0k5'
                            : p.slug.includes('alondra') || p.categoria === 'Guardapolvos y Casacas'
                            ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyUsIHhQq2hvM24SDYAE7m3u_ipgA3B0Sv48D0JL_rL3vuNJXjZoMnesMTNuhSma8pjkWGdUuyOYCYpd2SJO_DphCQQzhXzHJDAPkAdEWz-TpBiSwE7ZZKSMGfC7VRLYVj8z5P_QubXiZEbMsSVpMmJtXP0TOV-V2GxZvLbKK23N4srwULcOyAOEmXImTb-Usbeye46pQTyPtpp8XO3uHdCLkV__X-qworzqpVaJk6'
                            : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWhdyke8uhCDTs93Bmq61pT9J5VA5F1SSoJedkP08A-k4jPGIxOnLiqgEvIKEir1FQw-NwsLCwW794jr-FX-2sYPuvgUwXAcETp00od3Vr_Bo59_Y-ZKvCc02RFqHAV_fzZnWyQJp7QrSWET-HVKLTPBPZ4jLlBzARKvHLlhflEI8LBvvHbwtthNv-10bt76436kEI78ept7kXBRQh_rWCbk9t5NUv2Lqy5YP7e5UB'
                        }
                      />

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                        {isAgotado ? (
                          <span className="bg-surface-variant text-on-surface-variant font-label-sm text-label-sm px-2 py-0.5 rounded-full uppercase tracking-wider font-bold shadow-sm">
                            Próxima Reposición
                          </span>
                        ) : (
                          <>
                            <span className="bg-primary text-on-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm font-bold">
                              Top Venta
                            </span>
                            <span className="bg-tertiary-fixed text-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full uppercase tracking-wider font-bold shadow-sm">
                              -15% DTO
                            </span>
                          </>
                        )}
                      </div>

                      {/* Rating pill */}
                      <div className="absolute bottom-2 left-2 right-2 bg-surface-container-lowest/95 backdrop-blur-md px-2.5 py-1.5 rounded-md flex items-center justify-between text-primary font-label-sm text-label-sm shadow-sm">
                        <span className="flex items-center gap-1 font-bold">
                          <span className="material-symbols-outlined text-[16px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.9 (142)
                        </span>
                        <span className="text-on-surface-variant text-[11px]">{p.categoria.split(' ')[0]}</span>
                      </div>
                    </div>

                    {/* Fabric Tags */}
                    <div className="flex flex-wrap gap-1 mb-space-xs">
                      <span className="bg-surface-container-low text-primary font-label-sm text-label-sm px-2 py-0.5 rounded font-medium">
                        {p.tela?.split('+')[0] || 'Antifluido Quirúrgico'}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h2 
                      onClick={() => {
                        setSelectedProductSlug(p.slug);
                        navigateTo('catalogo', { producto: p.slug });
                      }}
                      className="font-headline-sm text-headline-sm text-primary tracking-tight mt-1 hover:text-secondary cursor-pointer"
                    >
                      {p.nombre}
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                      {p.descripcion}
                    </p>

                    {/* Colors */}
                    {p.colores && p.colores.length > 0 && (
                      <div className="flex items-center gap-2 mt-space-sm">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Colores:</span>
                        <div className="flex items-center gap-1.5">
                          {p.colores.slice(0, 4).map((col, ci) => (
                            <span
                              key={ci}
                              className="w-3.5 h-3.5 rounded-full border border-outline cursor-pointer"
                              style={{ backgroundColor: col.hex }}
                              title={col.nombre}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pricing & Action Button */}
                  <div className="mt-space-md pt-space-sm flex items-center justify-between border-t border-surface-container-high">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {isAgotado ? 'Preventa' : 'Precio Estudiante'}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-headline-md text-headline-md text-primary font-bold">
                          S/ {price.toFixed(2)}
                        </span>
                        <span className="text-xs text-on-surface-variant line-through">
                          S/ {p.precio_normal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {isAgotado ? (
                      <button
                        onClick={() => setAlertProduct(p)}
                        className="bg-surface-container-high text-on-surface-variant hover:text-primary font-label-md text-label-md px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">notifications</span>
                        <span>Avisarme</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            addToCart(p, p.tallas?.[0] || 'M', p.colores?.[0], 1, true);
                          }}
                          className="p-2 rounded-lg bg-secondary-fixed hover:bg-secondary-fixed-dim text-primary transition-colors cursor-pointer flex items-center justify-center shadow-xs"
                          title="Añadir al Carrito"
                          aria-label="Añadir al Carrito"
                        >
                          <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedProductSlug(p.slug);
                            navigateTo('catalogo', { producto: p.slug });
                          }}
                          className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-3 py-2 rounded-lg flex items-center gap-1 transition-colors shadow-sm cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          <span>Ver</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Stock alert modal */}
      <StockAlertModal
        product={alertProduct}
        isOpen={!!alertProduct}
        onClose={() => setAlertProduct(null)}
      />
    </div>
  );
};
