"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import CartDrawer from "./components/CartDrawer";
import Toast from "./components/Toast";

import AdminLogin from "./components/admin/AdminLogin";
import AdminView from "./components/admin/AdminView";

import { useProducts } from "./hooks/useProducts";

export default function App() {
  const {
    products,
    persist,
    saving,
  } = useProducts();

  const [view, setView] =
    useState("store");

  const [query, setQuery] =
    useState("");

  const [activeCat, setActiveCat] =
    useState("all");

  const [openProduct, setOpenProduct] =
    useState(null);

  const [cart, setCart] = useState(() => {
    try {
      const raw =
        localStorage.getItem(
          "gamershop-cart"
        );

      return raw
        ? JSON.parse(raw)
        : [];
    } catch {
      return [];
    }
  });

  const [cartOpen, setCartOpen] =
    useState(false);

  const [toast, setToast] =
    useState("");

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [
    sessionChecked,
    setSessionChecked,
  ] = useState(false);

  /*
   * ------------------------------------------------------
   * Comprobar sesión del administrador
   * ------------------------------------------------------
   */

  useEffect(() => {
    try {
      if (
        localStorage.getItem(
          "gamershop-admin-session"
        ) === "true"
      ) {
        setIsAdmin(true);
      }
    } catch {
      // No existe sesión anterior
    } finally {
      setSessionChecked(true);
    }
  }, []);

  /*
   * ------------------------------------------------------
   * Ocultar Toast automáticamente
   * ------------------------------------------------------
   */

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(
      () => setToast(""),
      2200
    );

    return () =>
      clearTimeout(timer);
  }, [toast]);

  /*
   * ------------------------------------------------------
   * Cerrar sesión
   * ------------------------------------------------------
   */

  const handleLogout = () => {
    setIsAdmin(false);
    setView("store");

    try {
      localStorage.removeItem(
        "gamershop-admin-session"
      );
    } catch {}
  };

  /*
   * ------------------------------------------------------
   * Carrito
   * ------------------------------------------------------
   */

  const addToCart = (
    product,
    qty
  ) => {
    setCart((currentCart) => {
      const existing =
        currentCart.find(
          (item) =>
            item.id === product.id
        );

      if (existing) {
        return currentCart.map(
          (item) =>
            item.id === product.id
              ? {
                  ...item,
                  qty: Math.min(
                    product.stock,
                    item.qty + qty
                  ),
                }
              : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          qty,
        },
      ];
    });

    setToast(
      `${product.name} agregado al carrito`
    );
  };

  const updateQty = (
    id,
    qty
  ) => {
    setCart((currentCart) =>
      qty <= 0
        ? currentCart.filter(
            (item) =>
              item.id !== id
          )
        : currentCart.map(
            (item) =>
              item.id === id
                ? {
                    ...item,
                    qty,
                  }
                : item
          )
    );
  };

  const removeItem = (id) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  /*
   * Guardar carrito
   */

  useEffect(() => {
    try {
      localStorage.setItem(
        "gamershop-cart",
        JSON.stringify(cart)
      );
    } catch {}
  }, [cart]);

  /*
   * ------------------------------------------------------
   * Checkout
   * ------------------------------------------------------
   */

  const checkout = () => {
    if (!cart.length) return;

    setToast(
      "Compra preparada. Integración de pago pendiente."
    );

    setCart([]);
    setCartOpen(false);
  };

  /*
   * ------------------------------------------------------
   * Datos calculados
   * ------------------------------------------------------
   */

  const cartCount =
    cart.reduce(
      (total, item) =>
        total + item.qty,
      0
    );

  const cartTotal =
    cart.reduce(
      (total, item) =>
        total +
        item.qty *
          item.price,
      0
    );

  /*
   * ------------------------------------------------------
   * Filtrado de productos
   * ------------------------------------------------------
   */

  const filtered =
    useMemo(() => {
      if (!products) return [];

      return products.filter(
        (product) => {
          const matchCat =
            activeCat === "all" ||
            product.category ===
              activeCat;

          const matchQuery =
            product.name
              .toLowerCase()
              .includes(
                query.toLowerCase()
              );

          return (
            matchCat &&
            matchQuery
          );
        }
      );
    }, [
      products,
      activeCat,
      query,
    ]);

  /*
   * ------------------------------------------------------
   * Loading
   * ------------------------------------------------------
   */

  if (
    !products ||
    !sessionChecked
  ) {
    return (
      <div
        className="gs-root"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            "center",
          minHeight: 300,
        }}
      >
        <div
          className="gs-mono"
          style={{
            color:
              "var(--text-dim)",
          }}
        >
          Cargando catálogo…
        </div>
      </div>
    );
  }

  /*
   * ------------------------------------------------------
   * Aplicación
   * ------------------------------------------------------
   */

  return (
    <div className="gs-root">

      <Header
        view={view}
        setView={setView}
        cartCount={cartCount}
        onOpenCart={() =>
          setCartOpen(true)
        }
        query={query}
        setQuery={setQuery}
        activeCat={activeCat}
        setActiveCat={
          setActiveCat
        }
        isAdmin={isAdmin}
      />

      {view === "store" ? (
        <>
          <Hero
            products={products}
            onViewProducts={() =>
              document
                .getElementById(
                  "gs-products"
                )
                ?.scrollIntoView({
                  behavior:
                    "smooth",
                  block: "start",
                })
            }
          />

          <main
            id="gs-products"
            className="gs-container gs-section"
          >

            <div className="gs-section-head">

              <div className="gs-section-title">
                <span
                  style={{
                    fontSize: 24,
                  }}
                >
                  ☆
                </span>

                Productos destacados
              </div>

              <span
                className="gs-mono"
                style={{
                  fontSize: 10,
                  color:
                    "#68687F",
                }}
              >
                {filtered.length}{" "}
                productos
              </span>

            </div>

            {filtered.length === 0 ? (
              <div
                style={{
                  textAlign:
                    "center",
                  padding:
                    "70px 0",
                  color:
                    "var(--muted)",
                  border:
                    "1px dashed var(--line)",
                  borderRadius: 12,
                }}
              >
                No encontramos
                productos que
                coincidan con tu
                búsqueda.
              </div>
            ) : (
              <div className="gs-grid">
                {filtered.map(
                  (product) => (
                    <ProductCard
                      key={
                        product.id
                      }
                      product={
                        product
                      }
                      onOpen={
                        setOpenProduct
                      }
                    />
                  )
                )}
              </div>
            )}

            <div
              className="gs-footer"
              style={{
                marginTop: 52,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: 20,
                  flexWrap:
                    "wrap",
                }}
              >
                <div>
                  <strong
                    style={{
                      color:
                        "#D9D9E8",
                    }}
                  >
                    GamerShop
                  </strong>
                  {" "}· tecnología
                  para jugar,
                  trabajar y crear.
                </div>

                <div>
                  Medellín ·
                  Envíos nacionales ·
                  Soporte real
                </div>
              </div>
            </div>

          </main>
        </>
      ) : isAdmin ? (
        <AdminView
          products={products}
          saving={saving}
          onLogout={
            handleLogout
          }
          onCreate={(data) =>
            persist([
              ...products,
              {
                ...data,
                id:
                  "p-" +
                  Date.now(),
              },
            ])
          }
          onUpdate={(
            id,
            data
          ) =>
            persist(
              products.map(
                (product) =>
                  product.id === id
                    ? {
                        ...data,
                        id,
                      }
                    : product
              )
            )
          }
          onDelete={(id) =>
            persist(
              products.filter(
                (product) =>
                  product.id !==
                  id
              )
            )
          }
        />
      ) : (
        <AdminLogin
          onSuccess={() => {
            setIsAdmin(true);
            setView("admin");
          }}
        />
      )}

      <ProductModal
        product={openProduct}
        onClose={() =>
          setOpenProduct(null)
        }
        onAddToCart={
          addToCart
        }
      />

      <CartDrawer
        open={cartOpen}
        onClose={() =>
          setCartOpen(false)
        }
        cart={cart}
        updateQty={
          updateQty
        }
        removeItem={
          removeItem
        }
        total={cartTotal}
        onCheckout={
          checkout
        }
      />

      <Toast
        message={toast}
      />

    </div>
  );
}