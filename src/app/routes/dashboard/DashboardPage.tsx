import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, MessageSquare, Tags, Database,
  Plus, Pencil, Trash2, X, Eye, DollarSign
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../store/auth';
import { Button, Input, Textarea, Badge } from '../../../components/ui';
import type { Product, Category, Order, ContactMessage, Competitor, Provider, PotentialClient } from '../../../types';

type Tab = 'overview' | 'products' | 'categories' | 'orders' | 'messages' | 'commercial';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalMessages: number;
  revenue: number;
}

export default function DashboardPage() {
  const { user, isAdmin, loading: authLoading } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<DashboardStats>({ totalProducts: 0, totalOrders: 0, totalUsers: 0, totalMessages: 0, revenue: 0 });
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [clients, setClients] = useState<PotentialClient[]>([]);
  const [, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '', slug: '', description: '', price: '', original_price: '',
    image_url: '', category_id: '', stock: '', warranty: '2 años', is_featured: false,
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) fetchAll();
  }, [user, isAdmin]);

  async function fetchAll() {
    setLoading(true);
    const [prodRes, catRes, ordRes, msgRes, compRes, provRes, clientRes] = await Promise.all([
      supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
      supabase.from('competitors').select('*').order('created_at', { ascending: false }),
      supabase.from('providers').select('*').order('created_at', { ascending: false }),
      supabase.from('potential_clients').select('*').order('created_at', { ascending: false }),
    ]);

    const prods = (prodRes.data as Product[]) || [];
    const cats = (catRes.data as Category[]) || [];
    const ords = (ordRes.data as Order[]) || [];
    const msgs = (msgRes.data as ContactMessage[]) || [];
    const comps = (compRes.data as Competitor[]) || [];
    const provs = (provRes.data as Provider[]) || [];
    const clientsList = (clientRes.data as PotentialClient[]) || [];

    setProducts(prods);
    setCategories(cats);
    setOrders(ords);
    setMessages(msgs);
    setCompetitors(comps);
    setProviders(provs);
    setClients(clientsList);
    setStats({
      totalProducts: prods.length,
      totalOrders: ords.length,
      totalUsers: 0,
      totalMessages: msgs.filter((m) => !m.read).length,
      revenue: ords.reduce((sum, o) => sum + Number(o.total), 0),
    });
    setLoading(false);
  }

  async function handleSaveProduct() {
    const payload = {
      name: productForm.name,
      slug: productForm.slug || productForm.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: productForm.description,
      price: parseFloat(productForm.price),
      original_price: productForm.original_price ? parseFloat(productForm.original_price) : null,
      image_url: productForm.image_url,
      category_id: productForm.category_id || null,
      stock: parseInt(productForm.stock) || 0,
      warranty: productForm.warranty,
      is_featured: productForm.is_featured,
    };

    if (editingProduct) {
      await supabase.from('products').update(payload).eq('id', editingProduct.id);
    } else {
      await supabase.from('products').insert(payload);
    }

    setShowProductModal(false);
    setEditingProduct(null);
    fetchAll();
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm('¿Eliminar este producto?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchAll();
  }

  function openEditProduct(product: Product) {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: String(product.price),
      original_price: product.original_price ? String(product.original_price) : '',
      image_url: product.image_url,
      category_id: product.category_id || '',
      stock: String(product.stock),
      warranty: product.warranty,
      is_featured: product.is_featured,
    });
    setShowProductModal(true);
  }

  function openNewProduct() {
    setEditingProduct(null);
    setProductForm({ name: '', slug: '', description: '', price: '', original_price: '', image_url: '', category_id: '', stock: '', warranty: '2 años', is_featured: false });
    setShowProductModal(true);
  }

  async function markMessageRead(id: string) {
    await supabase.from('contact_messages').update({ read: true }).eq('id', id);
    fetchAll();
  }

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Resumen', icon: LayoutDashboard },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'categories', label: 'Categorías', icon: Tags },
    { id: 'orders', label: 'Órdenes', icon: ShoppingCart },
    { id: 'messages', label: 'Mensajes', icon: MessageSquare },
    { id: 'commercial', label: 'Comercial', icon: Database },
  ];

  if (authLoading) return null;

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-[#F5F5F5]">Dashboard</h1>
          <p className="mt-1 text-[#94a3b8]">Panel de administración</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <nav className="lg:w-56 flex-shrink-0">
            <div className="card p-2 flex lg:flex-col gap-1 overflow-x-auto">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-[#00bcd4]/10 text-[#00bcd4]'
                        : 'text-[#94a3b8] hover:text-[#F5F5F5] hover:bg-[#111827]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Productos', value: stats.totalProducts, icon: Package, color: '#00bcd4' },
                    { label: 'Órdenes', value: stats.totalOrders, icon: ShoppingCart, color: '#0ea5a4' },
                    { label: 'Mensajes', value: stats.totalMessages, icon: MessageSquare, color: '#f59e0b' },
                    { label: 'Ingresos', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: '#22c55e' },
                  ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="card p-5">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-[#94a3b8]">{stat.label}</span>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                            <Icon className="w-4 h-4" style={{ color: stat.color }} />
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-[#F5F5F5]">{stat.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#F5F5F5]">Productos</h2>
                  <Button size="sm" onClick={openNewProduct}>
                    <Plus className="w-4 h-4 mr-1" /> Nuevo
                  </Button>
                </div>
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#1e293b]">
                          <th className="text-left text-xs font-medium text-[#94a3b8] px-5 py-3">Producto</th>
                          <th className="text-left text-xs font-medium text-[#94a3b8] px-5 py-3">Precio</th>
                          <th className="text-left text-xs font-medium text-[#94a3b8] px-5 py-3">Stock</th>
                          <th className="text-left text-xs font-medium text-[#94a3b8] px-5 py-3">Estado</th>
                          <th className="text-right text-xs font-medium text-[#94a3b8] px-5 py-3">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr key={p.id} className="border-b border-[#1e293b]/50 hover:bg-[#111827]/50 transition-colors">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#111827] overflow-hidden flex-shrink-0">
                                  <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-[#F5F5F5] truncate">{p.name}</p>
                                  <p className="text-xs text-[#94a3b8]">{p.category?.name || 'Sin categoría'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-sm text-[#00bcd4] font-medium">${p.price.toLocaleString()}</td>
                            <td className="px-5 py-3 text-sm text-[#F5F5F5]">{p.stock}</td>
                            <td className="px-5 py-3">
                              <Badge variant={p.is_active ? 'success' : 'danger'}>
                                {p.is_active ? 'Activo' : 'Inactivo'}
                              </Badge>
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => openEditProduct(p)} className="p-1.5 rounded text-[#94a3b8] hover:text-[#00bcd4] transition-colors">
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 rounded text-[#94a3b8] hover:text-[#ef4444] transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div>
                <h2 className="text-lg font-semibold text-[#F5F5F5] mb-6">Categorías</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <div key={cat.id} className="card p-5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#F5F5F5]">{cat.name}</p>
                        <p className="text-xs text-[#94a3b8]">{cat.description}</p>
                      </div>
                      <Badge variant="primary">{products.filter((p) => p.category_id === cat.id).length} productos</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-lg font-semibold text-[#F5F5F5] mb-6">Órdenes</h2>
                {orders.length === 0 ? (
                  <div className="card p-12 text-center">
                    <ShoppingCart className="w-10 h-10 text-[#94a3b8] mx-auto mb-4" />
                    <p className="text-[#94a3b8]">No hay órdenes aún</p>
                  </div>
                ) : (
                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#1e293b]">
                            <th className="text-left text-xs font-medium text-[#94a3b8] px-5 py-3">ID</th>
                            <th className="text-left text-xs font-medium text-[#94a3b8] px-5 py-3">Total</th>
                            <th className="text-left text-xs font-medium text-[#94a3b8] px-5 py-3">Estado</th>
                            <th className="text-left text-xs font-medium text-[#94a3b8] px-5 py-3">Fecha</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((o) => (
                            <tr key={o.id} className="border-b border-[#1e293b]/50">
                              <td className="px-5 py-3 text-sm text-[#F5F5F5] font-mono">{o.id.slice(0, 8)}</td>
                              <td className="px-5 py-3 text-sm text-[#00bcd4] font-medium">${Number(o.total).toLocaleString()}</td>
                              <td className="px-5 py-3">
                                <Badge variant={o.status === 'delivered' ? 'success' : o.status === 'cancelled' ? 'danger' : 'primary'}>
                                  {o.status}
                                </Badge>
                              </td>
                              <td className="px-5 py-3 text-sm text-[#94a3b8]">{new Date(o.created_at).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'messages' && (
              <div>
                <h2 className="text-lg font-semibold text-[#F5F5F5] mb-6">Mensajes</h2>
                {messages.length === 0 ? (
                  <div className="card p-12 text-center">
                    <MessageSquare className="w-10 h-10 text-[#94a3b8] mx-auto mb-4" />
                    <p className="text-[#94a3b8]">No hay mensajes</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`card p-5 ${!msg.read ? 'border-l-2 border-l-[#00bcd4]' : ''}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-[#F5F5F5]">{msg.name}</p>
                              {!msg.read && <Badge variant="primary">Nuevo</Badge>}
                            </div>
                            <p className="text-xs text-[#94a3b8] mb-2">{msg.email}</p>
                            <p className="text-sm text-[#94a3b8]">{msg.message}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-[#94a3b8]">{new Date(msg.created_at).toLocaleDateString()}</span>
                            {!msg.read && (
                              <button onClick={() => markMessageRead(msg.id)} className="p-1.5 rounded text-[#94a3b8] hover:text-[#00bcd4] transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'commercial' && (
              <div>
                <h2 className="text-lg font-semibold text-[#F5F5F5] mb-6">Base Comercial</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="card p-5">
                    <p className="text-sm text-[#94a3b8]">Competidores</p>
                    <p className="text-2xl font-bold text-[#F5F5F5]">{competitors.length}</p>
                  </div>
                  <div className="card p-5">
                    <p className="text-sm text-[#94a3b8]">Proveedores</p>
                    <p className="text-2xl font-bold text-[#F5F5F5]">{providers.length}</p>
                  </div>
                  <div className="card p-5">
                    <p className="text-sm text-[#94a3b8]">Clientes Potenciales</p>
                    <p className="text-2xl font-bold text-[#F5F5F5]">{clients.length}</p>
                  </div>
                </div>

                <div className="flex gap-3 mb-6">
                  <button onClick={() => navigate('/dashboard/commercial/competitors')} className="btn">Ver Competidores</button>
                  <button onClick={() => navigate('/dashboard/commercial/providers')} className="btn">Ver Proveedores</button>
                </div>

                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#1e293b]">
                          <th className="text-left text-xs font-medium text-[#94a3b8] px-5 py-3">Nombre</th>
                          <th className="text-left text-xs font-medium text-[#94a3b8] px-5 py-3">Sector / Servicio</th>
                          <th className="text-left text-xs font-medium text-[#94a3b8] px-5 py-3">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.map((c) => (
                          <tr key={c.id} className="border-b border-[#1e293b]/50">
                            <td className="px-5 py-3 text-sm text-[#F5F5F5]">{c.commercial_name}</td>
                            <td className="px-5 py-3 text-sm text-[#94a3b8]">{c.sector}</td>
                            <td className="px-5 py-3 text-sm text-[#F5F5F5]">{c.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Modal */}
        {showProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowProductModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-lg glass-strong rounded-xl p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[#F5F5F5]">
                  {editingProduct ? 'Editar producto' : 'Nuevo producto'}
                </h3>
                <button onClick={() => setShowProductModal(false)} className="p-1.5 rounded text-[#94a3b8] hover:text-[#F5F5F5] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <Input label="Nombre" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
                <Input label="Slug" value={productForm.slug} onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })} placeholder="auto-generado" />
                <Textarea label="Descripción" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows={3} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Precio" type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
                  <Input label="Precio original" type="number" value={productForm.original_price} onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })} />
                </div>
                <Input label="URL de imagen" value={productForm.image_url} onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#94a3b8]">Categoría</label>
                    <select
                      value={productForm.category_id}
                      onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Sin categoría</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <Input label="Stock" type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={productForm.is_featured}
                    onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded border-[#1e293b] bg-[#111827] text-[#00bcd4] focus:ring-[#00bcd4]"
                  />
                  <label htmlFor="featured" className="text-sm text-[#94a3b8]">Producto destacado</label>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="secondary" onClick={() => setShowProductModal(false)} className="flex-1">Cancelar</Button>
                  <Button onClick={handleSaveProduct} className="flex-1">
                    {editingProduct ? 'Guardar' : 'Crear'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}
