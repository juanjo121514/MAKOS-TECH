import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ImagePlus, Pencil, Plus, Save, Store, Trash2 } from 'lucide-react';
import { Button, Input, Textarea, Badge } from '../../../components/ui';
import { MOCK_CATEGORIES } from '../../../constants/mockData';
import {
  createProductFromForm,
  deleteLocalProduct,
  getCatalogProducts,
  getLocalProducts,
  saveLocalProduct,
  slugify,
} from '../../../lib/localCatalog';
import type { Product } from '../../../types';

type ProductForm = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  original_price: string;
  image_url: string;
  category_slug: string;
  stock: string;
  is_featured: boolean;
};

const EMPTY_FORM: ProductForm = {
  id: '',
  name: '',
  slug: '',
  description: '',
  price: '',
  original_price: '',
  image_url: '',
  category_slug: 'laptops',
  stock: '10',
  is_featured: false,
};

function toForm(product: Product): ProductForm {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: String(product.price),
    original_price: product.original_price ? String(product.original_price) : '',
    image_url: product.image_url,
    category_slug: product.category?.slug || 'laptops',
    stock: String(product.stock),
    is_featured: product.is_featured,
  };
}

export default function ProductManagerPage() {
  const [products, setProducts] = useState(() => getCatalogProducts());
  const [localIds, setLocalIds] = useState(() => new Set(getLocalProducts().map((product) => product.id)));
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [message, setMessage] = useState('');

  const previewProduct = useMemo(() => {
    if (!form.name.trim()) return null;
    return createProductFromForm({
      id: form.id || 'preview',
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description || 'Descripcion del producto',
      price: Number(form.price) || 0,
      original_price: form.original_price ? Number(form.original_price) : null,
      image_url: form.image_url || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
      category_slug: form.category_slug,
      stock: Number(form.stock) || 0,
      is_featured: form.is_featured,
    });
  }, [form]);

  function refreshProducts() {
    setProducts(getCatalogProducts());
    setLocalIds(new Set(getLocalProducts().map((product) => product.id)));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
  }

  function handleSave() {
    if (!form.name.trim() || !form.price || !form.image_url.trim()) {
      setMessage('Completa nombre, precio e imagen para guardar.');
      return;
    }

    const product = createProductFromForm({
      id: form.id || undefined,
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      description: form.description.trim(),
      price: Number(form.price) || 0,
      original_price: form.original_price ? Number(form.original_price) : null,
      image_url: form.image_url.trim(),
      category_slug: form.category_slug,
      stock: Number(form.stock) || 0,
      is_featured: form.is_featured,
    });

    saveLocalProduct(product);
    refreshProducts();
    resetForm();
    setMessage('Producto guardado. Ya aparece en la tienda.');
  }

  function handleEdit(product: Product) {
    setForm(toForm(product));
    setMessage(localIds.has(product.id) ? 'Editando producto local.' : 'Editando una copia local de producto de ejemplo.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleDelete(product: Product) {
    if (!localIds.has(product.id)) {
      setMessage('Los productos de ejemplo no se eliminan; puedes crear y borrar tus productos locales.');
      return;
    }
    if (!confirm('Eliminar producto local?')) return;
    deleteLocalProduct(product.id);
    refreshProducts();
    setMessage('Producto eliminado.');
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="section-container">
        <Link to="/productos" className="inline-flex items-center gap-2 text-sm text-[#94a3b8] hover:text-[#00bcd4] mb-6">
          <ArrowLeft className="w-4 h-4" />
          Volver a la tienda
        </Link>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#00bcd4]/10 flex items-center justify-center">
              <Store className="w-5 h-5 text-[#00bcd4]" />
            </div>
            <h1 className="text-3xl font-bold text-[#F5F5F5]">Gestionar productos</h1>
          </div>
          <p className="text-[#94a3b8]">Crea productos para la demo. Se guardan en este navegador y aparecen inmediatamente en el catalogo.</p>
        </motion.div>

        {message && (
          <div className="mb-6 rounded-lg border border-[#00bcd4]/30 bg-[#00bcd4]/10 px-4 py-3 text-sm text-[#00bcd4]">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-8 mb-10">
          <div className="card p-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-semibold text-[#F5F5F5]">{form.id ? 'Editar producto' : 'Nuevo producto'}</h2>
              <Button size="sm" variant="ghost" onClick={resetForm}>
                <Plus className="w-4 h-4 mr-1" />
                Limpiar
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nombre" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value, slug: form.slug || slugify(event.target.value) })} placeholder="Ej: Laptop Dell XPS 13" />
              <Input label="Slug" value={form.slug} onChange={(event) => setForm({ ...form, slug: slugify(event.target.value) })} placeholder="laptop-dell-xps-13" />
              <Input label="Precio" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="2500000" />
              <Input label="Precio anterior" type="number" value={form.original_price} onChange={(event) => setForm({ ...form, original_price: event.target.value })} placeholder="Opcional" />
              <Input label="Stock" type="number" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#94a3b8]">Categoria</label>
                <select value={form.category_slug} onChange={(event) => setForm({ ...form, category_slug: event.target.value })} className="input-field">
                  {MOCK_CATEGORIES.map((category) => (
                    <option key={category.slug} value={category.slug}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <Input label="URL de imagen" value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} placeholder="https://..." />
              </div>
              <div className="md:col-span-2">
                <Textarea label="Descripcion" rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe el producto, beneficios y caracteristicas." />
              </div>
              <label className="md:col-span-2 flex items-center gap-3 rounded-lg border border-[#1e293b] bg-[#111827] px-4 py-3 text-sm text-[#94a3b8]">
                <input type="checkbox" checked={form.is_featured} onChange={(event) => setForm({ ...form, is_featured: event.target.checked })} className="accent-[#00bcd4]" />
                Marcar como producto destacado
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button onClick={handleSave} className="sm:flex-1">
                <Save className="w-4 h-4 mr-2" />
                Guardar producto
              </Button>
              <Button variant="secondary" onClick={() => window.open('/productos', '_blank')} className="sm:flex-1">
                Ver tienda
              </Button>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-4">Vista previa</h2>
            {previewProduct ? (
              <div className="rounded-lg overflow-hidden border border-[#1e293b] bg-[#111827]">
                <div className="h-52 bg-[#0f1720]">
                  <img src={previewProduct.image_url} alt={previewProduct.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-xs text-[#94a3b8]">{previewProduct.category.name}</p>
                  <h3 className="text-sm font-semibold text-[#F5F5F5] mt-1">{previewProduct.name}</h3>
                  <p className="text-lg font-bold text-[#00bcd4] mt-2">${previewProduct.price.toLocaleString()}</p>
                  <p className="text-xs text-[#94a3b8] mt-2 line-clamp-3">{previewProduct.description}</p>
                </div>
              </div>
            ) : (
              <div className="h-80 rounded-lg border border-dashed border-[#1e293b] bg-[#111827] flex flex-col items-center justify-center text-center px-6">
                <ImagePlus className="w-10 h-10 text-[#94a3b8] mb-3" />
                <p className="text-sm text-[#94a3b8]">Completa el formulario para ver el producto antes de guardarlo.</p>
              </div>
            )}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="flex items-center justify-between gap-4 p-5 border-b border-[#1e293b]">
            <div>
              <h2 className="text-lg font-semibold text-[#F5F5F5]">Catalogo actual</h2>
              <p className="text-sm text-[#94a3b8]">{products.length} productos disponibles</p>
            </div>
            <Badge variant="primary">{getLocalProducts().length} locales</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e293b]">
                  <th className="text-left text-xs font-medium text-[#94a3b8] px-5 py-3">Producto</th>
                  <th className="text-left text-xs font-medium text-[#94a3b8] px-5 py-3">Categoria</th>
                  <th className="text-left text-xs font-medium text-[#94a3b8] px-5 py-3">Precio</th>
                  <th className="text-left text-xs font-medium text-[#94a3b8] px-5 py-3">Stock</th>
                  <th className="text-right text-xs font-medium text-[#94a3b8] px-5 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-[#1e293b]/50 hover:bg-[#111827]/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.image_url} alt="" className="w-11 h-11 rounded-lg object-cover bg-[#111827]" />
                        <div>
                          <p className="text-sm font-medium text-[#F5F5F5]">{product.name}</p>
                          <p className="text-xs text-[#94a3b8]">{localIds.has(product.id) ? 'Producto local' : 'Producto de ejemplo'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-[#94a3b8]">{product.category?.name}</td>
                    <td className="px-5 py-3 text-sm font-medium text-[#00bcd4]">${product.price.toLocaleString()}</td>
                    <td className="px-5 py-3 text-sm text-[#F5F5F5]">{product.stock}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(product)} className="p-2 rounded-lg text-[#94a3b8] hover:text-[#00bcd4] hover:bg-[#111827]">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product)} className="p-2 rounded-lg text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#111827]">
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
    </main>
  );
}
