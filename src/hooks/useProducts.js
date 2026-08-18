import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { SEED_PRODUCTS } from "../data/products";

export function useProducts() {
  const [products, setProducts] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;

      if (data && data.length === 0) {
        await supabase.from("products").insert(SEED_PRODUCTS);
        setProducts(SEED_PRODUCTS);
      } else {
        setProducts(data);
      }
    } catch (err) {
      console.error("Error cargando productos de Supabase:", err);
      setProducts(SEED_PRODUCTS);
    }
  };

  const persist = async (next) => {
    setProducts(next);
    setSaving(true);
    try {
      const cleanData = next.map(({ id, name, price, stock, category, description, image }) => ({
        id: String(id),
        name,
        price: Number(price) || 0,
        stock: Number(stock) || 0,
        category: category || "",
        description: description || "",
        image: image || "",
      }));

      const { error } = await supabase.from("products").upsert(cleanData, { onConflict: "id" });
      if (error) throw error;
    } catch (err) {
      console.error("Error al guardar en Supabase:", err?.message || err?.details || err);
    } finally {
      setSaving(false);
    }
  };

  // Función para eliminar productos individualmente o por lote en Supabase
  const remove = async (target) => {
    const idsToDelete = Array.isArray(target) ? target.map(String) : [String(target)];

    // 1. Actualización optimista de la UI
    setProducts((prev) => prev.filter((p) => !idsToDelete.includes(String(p.id))));
    setSaving(true);

    try {
      // 2. Eliminación real en Supabase
      const { error } = await supabase.from("products").delete().in("id", idsToDelete);
      if (error) throw error;
    } catch (err) {
      console.error("Error al eliminar en Supabase:", err?.message || err?.details || err);
      // Si falla, recargamos la lista real
      fetchProducts();
    } finally {
      setSaving(false);
    }
  };

  return { products, persist, remove, saving, refetch: fetchProducts };
}