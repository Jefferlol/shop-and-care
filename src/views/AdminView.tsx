import React, { useState, useEffect } from 'react';
import { 
  Lock, Download, Check, Trash2, RefreshCw, AlertCircle, 
  CheckCircle, Users, ShoppingCart, MessageSquare, Package, LogOut 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdminStats, Product, Review, FeedbackItem } from '../types';

export const AdminView: React.FC = () => {
  const { navigateTo, products, refreshProducts } = useApp();

  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('shopcare_admin_token');
  });
  const [authError, setAuthError] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // Stats and data
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [leadsList, setLeadsList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'productos' | 'leads' | 'resenas' | 'feedback'>('productos');
  const [loadingData, setLoadingData] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [priceInputs, setPriceInputs] = useState<Record<number, { normal: string; dto: string }>>({});
  const [savingPriceId, setSavingPriceId] = useState<number | null>(null);

  // Inicializar inputs de precios cuando cargan los productos
  useEffect(() => {
    const initial: Record<number, { normal: string; dto: string }> = {};
    products.forEach((p) => {
      initial[p.id] = {
        normal: p.precio_normal.toFixed(2),
        dto: p.precio_dto.toFixed(2),
      };
    });
    setPriceInputs((prev) => ({ ...initial, ...prev }));
  }, [products]);

  const handlePriceChange = (productId: number, field: 'normal' | 'dto', value: string) => {
    setPriceInputs((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleSavePrice = async (product: Product) => {
    if (!token) return;
    const current = priceInputs[product.id] || {
      normal: String(product.precio_normal),
      dto: String(product.precio_dto),
    };
    const normal = parseFloat(current.normal);
    const dto = parseFloat(current.dto);

    if (isNaN(normal) || normal < 0) {
      alert('Ingresa un precio normal válido en Soles (S/)');
      return;
    }

    setSavingPriceId(product.id);
    try {
      const res = await fetch(`/api/admin/productos/${product.id}/precio`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          precio_normal: normal,
          precio_dto: isNaN(dto) ? Math.round(normal * 0.85 * 100) / 100 : dto,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        await refreshProducts();
        setActionMessage(`Precio de "${product.nombre}" actualizado a: S/ ${normal.toFixed(2)} (DTO: S/ ${(isNaN(dto) ? normal * 0.85 : dto).toFixed(2)})`);
        setTimeout(() => setActionMessage(''), 4000);
      } else {
        alert(data.error || 'Error al guardar precio');
      }
    } catch (err) {
      alert('Error de conexión al guardar precio');
    } finally {
      setSavingPriceId(null);
    }
  };

  // Authentication
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingAuth(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToken(data.token);
        localStorage.setItem('shopcare_admin_token', data.token);
      } else {
        setAuthError(data.error || 'Contraseña incorrecta.');
      }
    } catch (err) {
      setAuthError('Error de conexión con el servidor.');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('shopcare_admin_token');
  };

  // Fetch admin dashboard data
  const loadDashboardData = async () => {
    if (!token) return;
    setLoadingData(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Stats
      const statsRes = await fetch('/api/admin/stats', { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      // Reviews
      const revRes = await fetch('/api/admin/resenas', { headers });
      if (revRes.ok) {
        const revData = await revRes.json();
        setReviews(revData.resenas || []);
      }

      // Feedback
      const fbRes = await fetch('/api/admin/feedback', { headers });
      if (fbRes.ok) {
        const fbData = await fbRes.json();
        setFeedbackList(fbData.feedback || []);
      }

      // Leads
      const leadsRes = await fetch('/api/admin/leads', { headers });
      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        setLeadsList(leadsData.leads || []);
      }
    } catch (err) {
      console.error('Error cargando datos admin:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  // Toggle Product Stock
  const handleToggleStock = async (product: Product) => {
    if (!token) return;
    const newStock = product.en_stock === 1 ? 0 : 1;
    try {
      const res = await fetch(`/api/admin/productos/${product.id}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ en_stock: newStock }),
      });
      if (res.ok) {
        await refreshProducts();
        setActionMessage(`Stock de "${product.nombre}" actualizado a: ${newStock === 1 ? 'Disponible' : 'Agotado'}`);
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      alert('Error actualizando stock');
    }
  };

  // Moderate Review (Approve / Reject)
  const handleModerateReview = async (id: number, aprobado: number) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/resenas/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ aprobado }),
      });
      if (res.ok) {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, aprobado } : r));
        await refreshProducts();
      }
    } catch (err) {
      alert('Error actualizando reseña');
    }
  };

  // Delete Review
  const handleDeleteReview = async (id: number) => {
    if (!token) return;
    if (!confirm('¿Seguro que deseas eliminar esta reseña permanentemente?')) return;
    try {
      const res = await fetch(`/api/admin/resenas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      alert('Error eliminando reseña');
    }
  };

  // Mark Feedback as attended
  const handleMarkFeedback = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: 'atendido' }),
      });
      if (res.ok) {
        setFeedbackList(prev => prev.map(f => f.id === id ? { ...f, estado: 'atendido' } : f));
      }
    } catch (err) {
      alert('Error actualizando feedback');
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    if (!token) return;
    const downloadUrl = `/api/admin/leads/csv`;
    // Fetch and download with auth header
    fetch(downloadUrl, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads_shop_care_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(err => alert('Error al exportar CSV'));
  };

  // If not logged in, show Password Gate
  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-shop-porcelain">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-shop-divider shadow-card space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-shop-navy text-white flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-6 h-6 text-shop-sky" />
            </div>
            <h1 className="font-display font-bold text-2xl text-shop-navy">
              Panel Administrativo
            </h1>
            <p className="text-xs text-shop-muted">
              Ingresa la contraseña maestra configurada en el archivo .env de tu servidor.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-shop-navy mb-1">
                Contraseña Administrativa
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña..."
                className="w-full bg-shop-porcelain border border-shop-divider rounded-xl px-4 py-2.5 text-xs text-shop-text focus:outline-none focus:ring-2 focus:ring-shop-sky"
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoadingAuth}
              className="w-full py-3 bg-shop-navy text-white font-display font-bold text-xs sm:text-sm rounded-xl hover:bg-shop-navy-light active:scale-95 transition-all shadow-md disabled:opacity-60"
            >
              {isLoadingAuth ? 'Verificando...' : 'Acceder al Panel'}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => navigateTo('inicio')}
              className="text-xs text-shop-muted hover:text-shop-navy font-semibold"
            >
              ← Volver a la Tienda
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-shop-divider gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-display font-bold text-shop-navy uppercase tracking-wider">
              Servidor Activo • Base de Datos SQLite
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-shop-navy mt-1">
            Panel de Control Shop &amp; Care
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadDashboardData}
            className="p-2.5 rounded-xl border border-shop-divider bg-white text-shop-navy hover:bg-shop-porcelain transition-colors"
            title="Recargar datos"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleExportCsv}
            className="bg-shop-sky text-shop-navy font-display font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[#8bc3ec] transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4 text-shop-navy" />
            <span>Exportar Leads (CSV)</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl border border-shop-divider bg-white text-red-600 hover:bg-red-50 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Quick Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        <div className="bg-white p-5 rounded-2xl border border-shop-divider shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs text-shop-muted font-medium">Leads Registrados</span>
            <div className="font-display font-black text-3xl text-shop-navy mt-1">
              {stats?.leadsTotal ?? leadsList.length}
            </div>
            <span className="text-[11px] text-shop-navy-light font-semibold">Asesoría y promociones</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-shop-sky/20 flex items-center justify-center text-shop-navy">
            <Users className="w-6 h-6 text-shop-navy" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-shop-divider shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs text-shop-muted font-medium">Cotizaciones de Kit</span>
            <div className="font-display font-black text-3xl text-shop-navy mt-1">
              {stats?.cotizacionesTotal ?? 0}
            </div>
            <span className="text-[11px] text-shop-navy-light font-semibold">Generadas vía web</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-shop-sky/20 flex items-center justify-center text-shop-navy">
            <ShoppingCart className="w-6 h-6 text-shop-navy" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-shop-divider shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs text-shop-muted font-medium">Reseñas Pendientes</span>
            <div className="font-display font-black text-3xl text-shop-pink mt-1">
              {stats?.resenasPendientes ?? reviews.filter(r => r.aprobado === 0).length}
            </div>
            <span className="text-[11px] text-shop-muted">Por moderar</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-shop-pink/20 flex items-center justify-center text-shop-navy">
            <MessageSquare className="w-6 h-6 text-shop-navy" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-shop-divider shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs text-shop-muted font-medium">Productos en Catálogo</span>
            <div className="font-display font-black text-3xl text-shop-navy mt-1">
              {products.length}
            </div>
            <span className="text-[11px] text-shop-muted">
              {products.filter(p => p.en_stock === 0).length} agotados
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-shop-porcelain flex items-center justify-center text-shop-navy">
            <Package className="w-6 h-6 text-shop-navy" />
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-shop-divider pb-4 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('productos')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-display font-bold transition-all ${
            activeTab === 'productos'
              ? 'bg-shop-navy text-white shadow-sm'
              : 'bg-white text-shop-muted hover:text-shop-navy border border-shop-divider'
          }`}
        >
          Gestión de Stock ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-display font-bold transition-all ${
            activeTab === 'leads'
              ? 'bg-shop-navy text-white shadow-sm'
              : 'bg-white text-shop-muted hover:text-shop-navy border border-shop-divider'
          }`}
        >
          Base de Datos de Leads ({leadsList.length})
        </button>

        <button
          onClick={() => setActiveTab('resenas')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-display font-bold transition-all ${
            activeTab === 'resenas'
              ? 'bg-shop-navy text-white shadow-sm'
              : 'bg-white text-shop-muted hover:text-shop-navy border border-shop-divider'
          }`}
        >
          Moderación de Reseñas ({reviews.length})
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-display font-bold transition-all ${
            activeTab === 'feedback'
              ? 'bg-shop-navy text-white shadow-sm'
              : 'bg-white text-shop-muted hover:text-shop-navy border border-shop-divider'
          }`}
        >
          Mensajes y Reclamos ({feedbackList.length})
        </button>
      </div>

      {/* SECTION 1: PRODUCT STOCK & PRICE EDIT TABLE */}
      {activeTab === 'productos' && (
        <div className="bg-white rounded-3xl border border-shop-divider shadow-soft overflow-hidden">
          <div className="p-5 border-b border-shop-divider bg-shop-porcelain/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display font-bold text-sm text-shop-navy">
                Edición de Precios y Control de Stock en Tiempo Real
              </h3>
              <p className="text-xs text-shop-muted">
                Modifica el precio normal o con descuento en Soles (S/) y haz clic en "Guardar". Los cambios impactan la tienda y la base de datos de inmediato.
              </p>
            </div>
            <span className="text-xs bg-shop-sky/20 text-shop-navy font-bold px-3 py-1 rounded-full self-start sm:self-auto">
              {products.length} productos registrados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-shop-porcelain font-display font-bold text-shop-navy border-b border-shop-divider">
                <tr>
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">Producto</th>
                  <th className="p-3.5">Categoría</th>
                  <th className="p-3.5">Precio Normal (S/)</th>
                  <th className="p-3.5">Precio DTO (S/)</th>
                  <th className="p-3.5 text-center">Guardar Precio</th>
                  <th className="p-3.5">Estado</th>
                  <th className="p-3.5 text-right">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-shop-divider text-shop-text">
                {products.map((p) => {
                  const isAvailable = p.en_stock === 1;
                  const isSaving = savingPriceId === p.id;
                  const inputNormal = priceInputs[p.id]?.normal ?? p.precio_normal.toFixed(2);
                  const inputDto = priceInputs[p.id]?.dto ?? p.precio_dto.toFixed(2);

                  return (
                    <tr key={p.id} className="hover:bg-shop-porcelain/40 transition-colors">
                      <td className="p-3.5 text-shop-muted font-mono">{p.id}</td>
                      <td className="p-3.5 font-bold text-shop-navy max-w-[200px]">
                        {p.nombre}
                      </td>
                      <td className="p-3.5 text-shop-muted">{p.categoria}</td>
                      
                      {/* Precio Normal Editable */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-shop-muted font-bold">S/</span>
                          <input
                            type="number"
                            step="0.10"
                            min="0"
                            value={inputNormal}
                            onChange={(e) => handlePriceChange(p.id, 'normal', e.target.value)}
                            className="w-20 px-2 py-1 text-xs border border-shop-divider rounded-lg font-bold text-shop-navy bg-white focus:outline-none focus:ring-2 focus:ring-shop-sky"
                          />
                        </div>
                      </td>

                      {/* Precio DTO Editable */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-shop-muted font-bold">S/</span>
                          <input
                            type="number"
                            step="0.10"
                            min="0"
                            value={inputDto}
                            onChange={(e) => handlePriceChange(p.id, 'dto', e.target.value)}
                            className="w-20 px-2 py-1 text-xs border border-shop-divider rounded-lg font-bold text-shop-navy bg-white focus:outline-none focus:ring-2 focus:ring-shop-sky"
                          />
                        </div>
                      </td>

                      {/* Botón Guardar Precio */}
                      <td className="p-3.5 text-center">
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => handleSavePrice(p)}
                          className="px-3 py-1.5 rounded-xl bg-shop-navy text-white text-xs font-bold hover:bg-shop-navy-light transition-all shadow-sm inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5 text-shop-sky" />
                          <span>{isSaving ? 'Guardando...' : 'Guardar precio'}</span>
                        </button>
                      </td>

                      {/* Estado */}
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isAvailable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-green-600' : 'bg-red-600'}`} />
                          {isAvailable ? 'Disponible' : 'Agotado'}
                        </span>
                      </td>

                      {/* Toggle Stock */}
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleToggleStock(p)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            isAvailable
                              ? 'bg-red-50 text-red-700 hover:bg-red-100'
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          {isAvailable ? 'Marcar Agotado' : 'Marcar Disponible'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: LEADS TABLE */}
      {activeTab === 'leads' && (
        <div className="bg-white rounded-3xl border border-shop-divider shadow-soft overflow-hidden">
          <div className="p-5 border-b border-shop-divider bg-shop-porcelain/50 flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-shop-navy">
              Leads Capturados (Asesoría y Promociones)
            </h3>
            <button
              onClick={handleExportCsv}
              className="text-xs font-bold text-shop-navy hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Descargar CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-shop-porcelain font-display font-bold text-shop-navy border-b border-shop-divider">
                <tr>
                  <th className="p-3.5">Nombre</th>
                  <th className="p-3.5">Correo</th>
                  <th className="p-3.5">WhatsApp</th>
                  <th className="p-3.5">Carrera / Etapa</th>
                  <th className="p-3.5">UTM Origen</th>
                  <th className="p-3.5">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-shop-divider text-shop-text">
                {leadsList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-shop-muted">
                      No hay leads registrados aún.
                    </td>
                  </tr>
                ) : (
                  leadsList.map((lead) => (
                    <tr key={lead.id} className="hover:bg-shop-porcelain/40 transition-colors">
                      <td className="p-3.5 font-bold text-shop-navy">{lead.nombre}</td>
                      <td className="p-3.5 text-shop-muted font-mono">{lead.correo}</td>
                      <td className="p-3.5 font-mono">{lead.whatsapp}</td>
                      <td className="p-3.5">{lead.carrera}</td>
                      <td className="p-3.5 text-xs text-shop-muted">
                        {lead.utm_source ? `${lead.utm_source} / ${lead.utm_campaign || ''}` : 'Directo'}
                      </td>
                      <td className="p-3.5 text-xs text-shop-muted">
                        {lead.created_at?.slice(0, 10)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: REVIEWS MODERATION */}
      {activeTab === 'resenas' && (
        <div className="bg-white rounded-3xl border border-shop-divider shadow-soft overflow-hidden">
          <div className="p-5 border-b border-shop-divider bg-shop-porcelain/50 flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-shop-navy">
              Moderación de Reseñas de Clientes
            </h3>
            <span className="text-xs text-shop-muted">
              Solo las reseñas aprobadas se muestran públicamente en el catálogo
            </span>
          </div>

          <div className="divide-y divide-shop-divider">
            {reviews.length === 0 ? (
              <div className="p-8 text-center text-shop-muted text-xs">
                No hay reseñas en la base de datos.
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-shop-navy">{rev.autor}</span>
                      <span className="text-xs text-shop-muted">• {rev.carrera_sede}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rev.aprobado === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {rev.aprobado === 1 ? 'Aprobada' : 'Pendiente'}
                      </span>
                    </div>
                    <div className="text-xs text-shop-navy-light font-medium">
                      Producto: {rev.producto_slug}
                    </div>
                    <p className="text-xs sm:text-sm text-shop-text italic">
                      "{rev.comentario}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {rev.aprobado === 0 ? (
                      <button
                        onClick={() => handleModerateReview(rev.id!, 1)}
                        className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-green-700 flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Aprobar
                      </button>
                    ) : (
                      <button
                        onClick={() => handleModerateReview(rev.id!, 0)}
                        className="bg-shop-porcelain text-shop-navy text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-shop-divider"
                      >
                        Ocultar
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteReview(rev.id!)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-xl"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SECTION 4: FEEDBACK & RECLAMOS */}
      {activeTab === 'feedback' && (
        <div className="bg-white rounded-3xl border border-shop-divider shadow-soft overflow-hidden">
          <div className="p-5 border-b border-shop-divider bg-shop-porcelain/50 flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-shop-navy">
              Mensajes, Consultas y Reclamos
            </h3>
          </div>

          <div className="divide-y divide-shop-divider">
            {feedbackList.length === 0 ? (
              <div className="p-8 text-center text-shop-muted text-xs">
                No hay mensajes registrados.
              </div>
            ) : (
              feedbackList.map((fb) => (
                <div key={fb.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        fb.tipo === 'reclamo' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {fb.tipo}
                      </span>
                      <strong className="text-sm text-shop-navy">{fb.nombre}</strong>
                      <span className="text-xs text-shop-muted">({fb.contacto})</span>
                    </div>
                    <p className="text-xs sm:text-sm text-shop-text">
                      {fb.mensaje}
                    </p>
                    <span className="text-[10px] text-shop-muted block">
                      Recibido: {fb.created_at}
                    </span>
                  </div>

                  <div>
                    {fb.estado === 'pendiente' ? (
                      <button
                        onClick={() => handleMarkFeedback(fb.id)}
                        className="bg-shop-navy text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-shop-navy-light"
                      >
                        Marcar como atendido
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                        Atendido ✓
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
