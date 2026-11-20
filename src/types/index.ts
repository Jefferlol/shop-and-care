export interface ColorOption {
  nombre: string;
  hex: string;
}

export interface Review {
  id?: number;
  producto_slug?: string;
  autor: string;
  carrera_sede: string;
  estrellas: number;
  comentario: string;
  fecha?: string;
  aprobado?: number;
  created_at?: string;
}

export interface Product {
  id: number;
  slug: string;
  nombre: string;
  categoria: string;
  precio_normal: number;
  precio_dto: number;
  en_stock: number;
  imagen?: string;
  descripcion?: string;
  tela?: string;
  detalles: string[];
  tallas: string[];
  colores: ColorOption[];
  resenas?: Review[];
}

export interface CartItem {
  producto: Product;
  talla: string;
  color: ColorOption;
  cantidad: number;
}

export interface LeadFormData {
  nombre: string;
  correo: string;
  whatsapp: string;
  carrera: string;
  acepto_privacidad: boolean;
}

export interface AdminStats {
  leadsTotal: number;
  cotizacionesTotal: number;
  resenasPendientes: number;
  feedbackPendiente: number;
  productosAgotados: number;
}

export interface FeedbackItem {
  id: number;
  tipo: string;
  nombre: string;
  contacto: string;
  mensaje: string;
  estado: string;
  created_at: string;
}
