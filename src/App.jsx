"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import SupportModal from "./components/SupportModal";
import CartDrawer from "./components/CartDrawer";
import Toast from "./components/Toast";
import AdminLogin from "./components/admin/AdminLogin";
import AdminView from "./components/admin/AdminView";
import { useProducts } from "./hooks/useProducts";

export default function App() {
  const { products, persist, saving } = useProducts();
  const [supportOpen, setSupportOpen] = useState(false);
  const [view, setView] = useState("store");
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [openProduct, setOpenProduct] = useState(null);
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("gamershop-cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Sesión de administrador
  useEffect(() => {
    try {
      if (localStorage.getItem("gamershop-admin-session") === "true") setIsAdmin(true);
    } catch {}
    setSessionChecked(true);
  }, []);

  // Auto-ocultar toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  // Guardar carrito
  useEffect(() => {
    try {
      localStorage.setItem("gamershop-cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const handleLogout = () => {
    setIsAdmin(false);
    setView("store");
    try {
      localStorage.removeItem("gamershop-admin-session");
    } catch {}
  };

  const addToCart = (product, qty) => {
    setCart((cur) => {
      const found = cur.find((i) => i.id === product.id);
      if (found) {
        return cur.map((i) =>
          i.id === product.id ? { ...i, qty: Math.min(product.stock, i.qty + qty) } : i
        );
      }
      return [...cur, { ...product, qty }];
    });
    setToast(`${product.name} agregado al carrito`);
  };

  const updateQty = (id, qty) =>
    setCart((cur) => (qty <= 0 ? cur.filter((i) => i.id !== id) : cur.map((i) => (i.id === id ? { ...i, qty } : i))));

  const removeItem = (id) => setCart((cur) => cur.filter((i) => i.id !== id));

  const checkout = () => {
    if (!cart.length) return;
    setToast("Compra preparada. Integración de pago pendiente.");
    setCart([]);
    setCartOpen(false);
  };

  const cartCount = cart.reduce((t, i) => t + i.qty, 0);
  const cartTotal = cart.reduce((t, i) => t + i.qty * i.price, 0);

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter(
      (p) =>
        (activeCat === "all" || p.category === activeCat) &&
        p.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [products, activeCat, query]);

  if (!products || !sessionChecked) {
    return (
      <div className="gs-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
        <div className="gs-mono gs-muted">Cargando catálogo…</div>
      </div>
    );
  }

  return (
    <div className="gs-root">
      <Header
        view={view}
        setView={setView}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        query={query}
        setQuery={setQuery}
        activeCat={activeCat}
        setActiveCat={setActiveCat}
      />

      {view === "store" ? (
        <>
          <Hero 
            onViewProducts={() => document.getElementById("gs-products")?.scrollIntoView({ behavior: "smooth", block: "start" })} 
            onOpenSupport={() => setSupportOpen(true)}
          />

          <main id="gs-products" className="gs-container gs-section">
            <div className="gs-section-head">
              <div className="gs-section-title">
                <span style={{ fontSize: 24 }}>☆</span>
                Productos destacados
              </div>
              <span className="gs-mono" style={{ fontSize: 10, color: "#A8A6C4" }}>
                {filtered.length} productos
              </span>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "70px 0", color: "var(--muted)", border: "1px dashed var(--line)", borderRadius: 12 }}>
                No encontramos productos que coincidan con tu búsqueda.
              </div>
            ) : (
              <div className="gs-grid">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} onOpen={setOpenProduct} />
                ))}
              </div>
            )}

            <div className="gs-footer" style={{ marginTop: 52 }}>
              <div className="gs-row-between" style={{ flexWrap: "wrap" }}>
                <div><strong>GamerShop</strong> · tecnología para jugar, trabajar y crear.</div>
                <div>Medellín · Envíos nacionales · Soporte real</div>
              </div>
            </div>
          </main>
        </>
      ) : isAdmin ? (
        <AdminView
          products={products}
          saving={saving}
          onLogout={handleLogout}
          onCreate={(data) => {
            // Acepta un solo producto u un array para cargue masivo
            const itemsToAdd = Array.isArray(data) ? data : [data];
            const newItems = itemsToAdd.map((item, index) => ({
              ...item,
              id: "p-" + (Date.now() + index),
            }));
            persist([...products, ...newItems]);
          }}
          onUpdate={(id, data) => persist(products.map((p) => (p.id === id ? { ...data, id } : p)))}
          onDelete={(id) => persist(products.filter((p) => p.id !== id))}
        />
      ) : (
        <AdminLogin onSuccess={() => { setIsAdmin(true); setView("admin"); }} />
      )}

      {/* --- MODALES Y SOBREPUESTOS --- */}
      <ProductModal product={openProduct} onClose={() => setOpenProduct(null)} onAddToCart={addToCart} />
      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} updateQty={updateQty} removeItem={removeItem} total={cartTotal} onCheckout={checkout} />
      <Toast message={toast} />
    </div>
  );
}