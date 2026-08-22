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
import { supabase } from "./lib/supabase";

export default function App({ initialProducts, initialView = "store" }) {
  const { products, persistRows, remove, saving } = useProducts(initialProducts);
  
  const [supportOpen, setSupportOpen] = useState(false);
  const [view, setView] = useState(initialView);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [openProduct, setOpenProduct] = useState(null);
  const [cart, setCart] = useState(() => {
    try {
      // Cambio de clave en localStorage a navatech-cart
      const raw = localStorage.getItem("navatech-cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Escuchar la sesión en tiempo real desde Supabase Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
      setSessionChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-ocultar toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  // Guardar carrito con la nueva clave de la marca
  useEffect(() => {
    try {
      localStorage.setItem("navatech-cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Manejador de cierre de sesión seguro con Supabase
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setView("store");
  };

  const addToCart = (product, qty) => {
    setCart((cur) => {
      const found = cur.find((i) => String(i.id) === String(product.id));
      if (found) {
        return cur.map((i) =>
          String(i.id) === String(product.id) ? { ...i, qty: Math.min(product.stock, i.qty + qty) } : i
        );
      }
      return [...cur, { ...product, qty }];
    });
    setToast(`${product.name} agregado al carrito`);
  };

  const updateQty = (id, qty) =>
    setCart((cur) => (qty <= 0 ? cur.filter((i) => String(i.id) !== String(id)) : cur.map((i) => (String(i.id) === String(id) ? { ...i, qty } : i))));

  const removeItem = (id) => setCart((cur) => cur.filter((i) => String(i.id) !== String(id)));

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
      <div className="nt-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
        <div className="nt-mono nt-muted">Cargando catálogo…</div>
      </div>
    );
  }

  return (
    <div className="nt-root">
      <Header
        view={view}
        setView={setView}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        query={query}
        setQuery={setQuery}
        activeCat={activeCat}
        setActiveCat={setActiveCat}
        onLogout={handleLogout}
      />

      {view === "store" ? (
        <>
          <Hero 
            onViewProducts={() => document.getElementById("nt-products")?.scrollIntoView({ behavior: "smooth", block: "start" })} 
            onOpenSupport={() => setSupportOpen(true)}
          />

          <main id="nt-products" className="nt-container nt-section">
            <div className="nt-section-head">
              <div className="nt-section-title">
                <span style={{ fontSize: 24 }}>☆</span>
                Productos destacados
              </div>
              <span className="nt-mono" style={{ fontSize: 10, color: "#A8A6C4" }}>
                {filtered.length} productos
              </span>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "70px 0", color: "var(--muted)", border: "1px dashed var(--line)", borderRadius: 12 }}>
                No encontramos productos que coincidan con tu búsqueda.
              </div>
            ) : (
              <div className="nt-grid">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} onOpen={setOpenProduct} />
                ))}
              </div>
            )}

            <div className="nt-footer" style={{ marginTop: 52 }}>
              <div className="nt-row-between" style={{ flexWrap: "wrap" }}>
                <div><strong>NavaTech</strong> · tecnología de confianza.</div>
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
            const itemsToAdd = Array.isArray(data) ? data : [data];
            
            const newItems = itemsToAdd.map((item, index) => {
              const textoOriginal = item.description || ""; 
              const regex = /(Pantalla\s*:|Procesador\s*:|Memoria\s*:|Disco Duro\s*:|Cámara\s*:|Puertos Traseros|Puertos Laterales|Sistema Operativo\s*:|Garantía\s*:)/gi;
              const textoFormateado = textoOriginal.replace(regex, '\n$1').trim();

              return {
                ...item,
                description: textoFormateado,
                id: item.id ? String(item.id) : ("p-" + (Date.now() + index)),
              };
            });
            
            persistRows(newItems).then((result) => {
              if (result !== true) alert("Error al guardar en la base de datos:\n\n" + result);
            });
          }}
          onUpdate={(id, data) => 
            persistRows([{ ...data, id: String(id) }]).then((result) => {
              if (result !== true) alert("Error al guardar en la base de datos:\n\n" + result);
            })
          }
          onDelete={(target) => remove(target)}
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