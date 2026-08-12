import { useEffect, useState } from "react";
import { SEED_PRODUCTS } from "../data/products";

export function useProducts() {
  const [products, setProducts] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("gamershop-products");
      const stored = raw ? JSON.parse(raw) : null;

      setProducts(
        Array.isArray(stored)
          ? stored
          : SEED_PRODUCTS
      );

      if (!stored) {
        localStorage.setItem(
          "gamershop-products",
          JSON.stringify(SEED_PRODUCTS)
        );
      }
    } catch {
      setProducts(SEED_PRODUCTS);
    }
  }, []);

  const persist = (next) => {
    setProducts(next);
    setSaving(true);

    try {
      localStorage.setItem(
        "gamershop-products",
        JSON.stringify(next)
      );
    } catch {
      // Guardado best-effort
    } finally {
      setSaving(false);
    }
  };

  return {
    products,
    persist,
    saving,
  };
}