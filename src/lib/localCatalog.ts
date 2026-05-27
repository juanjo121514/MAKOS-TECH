import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../constants/mockData';
import type { Product } from '../types';

const STORAGE_KEY = 'makostech-local-products';
export const LOCAL_CATALOG_EVENT = 'makostech-local-catalog-updated';

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getLocalProducts(): Product[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
}

export function getCatalogProducts() {
  const localProducts = getLocalProducts();
  const localIds = new Set(localProducts.map((product) => product.id));
  return [...localProducts, ...MOCK_PRODUCTS.filter((product) => !localIds.has(product.id))];
}

export function getCatalogCategories() {
  return MOCK_CATEGORIES;
}

export function saveLocalProduct(product: Product) {
  if (!canUseStorage()) return;
  const products = getLocalProducts();
  const index = products.findIndex((item) => item.id === product.id);
  const nextProducts = index >= 0
    ? products.map((item) => (item.id === product.id ? product : item))
    : [product, ...products];

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProducts));
  window.dispatchEvent(new Event(LOCAL_CATALOG_EVENT));
}

export function deleteLocalProduct(id: string) {
  if (!canUseStorage()) return;
  const nextProducts = getLocalProducts().filter((product) => product.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProducts));
  window.dispatchEvent(new Event(LOCAL_CATALOG_EVENT));
}

export function createProductFromForm(input: {
  id?: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  original_price: number | null;
  image_url: string;
  category_slug: string;
  stock: number;
  is_featured: boolean;
}) {
  const category = MOCK_CATEGORIES.find((item) => item.slug === input.category_slug) || MOCK_CATEGORIES[0];
  const id = input.id || `local-${Date.now()}`;
  const slug = input.slug?.trim() || slugify(input.name) || id;
  const now = new Date().toISOString();

  return {
    id,
    name: input.name,
    slug,
    description: input.description,
    price: input.price,
    original_price: input.original_price,
    image_url: input.image_url,
    gallery: [input.image_url].filter(Boolean),
    category_id: category.id,
    category,
    stock: input.stock,
    is_featured: input.is_featured,
    is_active: true,
    warranty: '2 anos',
    free_shipping: true,
    created_at: now,
    updated_at: now,
  } satisfies Product;
}
