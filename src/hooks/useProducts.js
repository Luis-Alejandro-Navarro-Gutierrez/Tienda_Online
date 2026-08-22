import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { SEED_PRODUCTS } from "../data/products";

export function useProducts(initialProducts) {
  // Si el servidor ya nos entregó productos (vía page.jsx), arrancamos con
  // esos datos y evitamos el "Cargando catálogo..." en el primer render.
  const [products, setProducts] = useState(initialProducts?.length ? initialProducts : null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Si ya vinimos con datos del servidor, no hace falta pedirlos de nuevo
    // al montar. Si no vinieron (o vinieron vacíos), los pedimos desde el cliente.
    if (!initialProducts?.length) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;

      if (data && data.length === 0) {
        const { data: insertedData, error: insertError } = await supabase
          .from("products")
          .insert(SEED_PRODUCTS)
          .select();
        
        if (insertError) throw insertError;
        setProducts(insertedData || SEED_PRODUCTS);
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

  // Igual que persist(), pero solo envía a Supabase las filas que realmente
  // cambiaron o son nuevas (rows), en vez de reenviar todo el catálogo con
  // cada imagen de cada producto en una sola petición gigante. Esto evita
  // que ediciones individuales (como subir una foto) fallen por el tamaño
  // del request a medida que crece el inventario.
  const persistRows = async (rows) => {
    if (!rows || rows.length === 0) return;

    setProducts((prev) => {
      const prevList = prev || [];
      const byId = new Map(prevList.map((p) => [String(p.id), p]));
      rows.forEach((r) => byId.set(String(r.id), r));
      return [...byId.values()];
    });

    setSaving(true);
    try {
      const cleanData = rows.map(({ id, name, price, stock, category, description, image }) => ({
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
      return true;
    } catch (err) {
      console.error("Error al guardar en Supabase:", err?.message || err?.details || err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Función para eliminar productos individualmente o por lote en Supabase
  const remove = async (target) => {
    const idsToDelete = Array.isArray(target) ? target.map(String) : [String(target)];

    // 1. Actualización optimista de la UI
    setProducts((prev) => (prev ? prev.filter((p) => !idsToDelete.includes(String(p.id))) : []));
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

  return { products, persist, persistRows, remove, saving, refetch: fetchProducts };
}