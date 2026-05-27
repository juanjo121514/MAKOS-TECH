import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Product, Category } from '../types';
import { getCatalogCategories, getCatalogProducts, LOCAL_CATALOG_EVENT } from '../lib/localCatalog';

function filterLocalProducts(filters?: { category?: string; search?: string; offersOnly?: boolean; wishlistIds?: string[] }) {
  const search = filters?.search?.trim().toLowerCase();

  return getCatalogProducts().filter((product) => {
    if (filters?.category && product.category?.slug !== filters.category) return false;
    if (filters?.offersOnly && (!product.original_price || product.original_price <= product.price)) return false;
    if (filters?.wishlistIds && !filters.wishlistIds.includes(product.id)) return false;
    if (search) {
      const searchable = `${product.name} ${product.description} ${product.category?.name}`.toLowerCase();
      if (!searchable.includes(search)) return false;
    }
    return true;
  });
}

export function useProducts(filters?: { category?: string; search?: string; offersOnly?: boolean; wishlistIds?: string[] }) {
  const [products, setProducts] = useState<Product[]>(() => filterLocalProducts(filters));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const category = filters?.category;
  const search = filters?.search;
  const offersOnly = filters?.offersOnly;
  const wishlistKey = filters?.wishlistIds?.join(',');

  const fetchProducts = useCallback(async () => {
    setError(null);
    const localFilters = {
      category,
      search,
      offersOnly,
      wishlistIds: wishlistKey ? wishlistKey.split(',') : undefined,
    };
    const fallbackProducts = filterLocalProducts(localFilters);
    setProducts(fallbackProducts);
    setLoading(fallbackProducts.length === 0);

    try {
      let query = supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category.slug', category);
      }

      if (offersOnly) {
        query = query.not('original_price', 'is', null);
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error: err } = await query;

      if (err) {
        setError(err.message);
        setProducts(fallbackProducts);
        return;
      }

      let results = (data as Product[]) || [];
      if (results.length === 0) {
        setProducts(fallbackProducts);
        return;
      }

      if (offersOnly) {
        results = results.filter((p) => p.original_price && p.original_price > p.price);
      }

      if (wishlistKey) {
        const ids = wishlistKey.split(',');
        results = results.filter((p) => ids.includes(p.id));
      }

      setProducts(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los productos.');
      setProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  }, [category, offersOnly, search, wishlistKey]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const updateLocalCatalog = () => {
      setProducts(filterLocalProducts({
        category,
        search,
        offersOnly,
        wishlistIds: wishlistKey ? wishlistKey.split(',') : undefined,
      }));
      setLoading(false);
    };
    window.addEventListener(LOCAL_CATALOG_EVENT, updateLocalCatalog);
    window.addEventListener('storage', updateLocalCatalog);
    return () => {
      window.removeEventListener(LOCAL_CATALOG_EVENT, updateLocalCatalog);
      window.removeEventListener('storage', updateLocalCatalog);
    };
  }, [category, offersOnly, search, wishlistKey]);

  return { products, loading, error, refetch: fetchProducts };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(() => getCatalogProducts().find((item) => item.id === id || item.slug === id) || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      const fallbackProduct = getCatalogProducts().find((item) => item.id === id || item.slug === id) || null;
      setProduct(fallbackProduct);
      setLoading(!fallbackProduct);
      setError(null);
      try {
        const { data, error: err } = await supabase
          .from('products')
          .select('*, category:categories(*)')
          .eq('id', id)
          .maybeSingle();

        if (err) {
          setError(err.message);
          setProduct(fallbackProduct);
        } else {
          setProduct((data as Product) || fallbackProduct);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo cargar el producto.');
        setProduct(fallbackProduct);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetch();
  }, [id]);

  return { product, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(() => getCatalogCategories());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      setLoading(false);
      setError(null);
      try {
        const { data, error: err } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order');
        if (err) {
          setError(err.message);
          setCategories(getCatalogCategories());
          return;
        }
        setCategories(((data as Category[]) || []).length > 0 ? (data as Category[]) : getCatalogCategories());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudieron cargar las categorias.');
        setCategories(getCatalogCategories());
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return { categories, loading, error };
}
