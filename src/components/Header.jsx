import { ShoppingCart, Search, Lock, Gamepad2 } from "lucide-react";
import { CATEGORIES } from "../data/products";

export default function Header({
  view,
  setView,
  cartCount,
  onOpenCart,
  query,
  setQuery,
  activeCat,
  setActiveCat,
}) {
  return (
    <header className="gs-header">
      <div className="gs-container">
        {/* Barra superior */}
        <div className="gs-header-top">
          {/* Brand/Logo */}
          <div
            className="gs-brand"
            onClick={() => {
              setView("store");
              setActiveCat("all");
            }}
          >
            <div className="gs-brand-icon">
              <Gamepad2 size={19} color="#fff" />
            </div>
            <div className="gs-brand-name">
              Gamer<span>Shop</span>
            </div>
          </div>

          {/* Buscador */}
          <div className="gs-search">
            <Search size={16} color="#8C8AA3" />
            <input
              placeholder="Buscar productos..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setView("store");
              }}
            />
          </div>

          {/* Acciones principales */}
          <div className="gs-header-actions">
            <button
              className="gs-btn-ghost gs-row"
              onClick={() => setView(view === "admin" ? "store" : "admin")}
            >
              <Lock size={14} color="#0891B2" />
              <span>{view === "admin" ? "Ver tienda" : "Panel admin"}</span>
            </button>

            <button
              className="gs-btn-ghost gs-row"
              onClick={onOpenCart}
              style={{ position: "relative" }}
            >
              <ShoppingCart size={17} />
              <span>Carrito</span>
              <span
                style={{
                  minWidth: 20,
                  height: 20,
                  padding: "0 5px",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 999,
                  background: "var(--purple)",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Navegación por categorías */}
        {view === "store" && (
          <nav className="gs-header-nav gs-scrollbar">
            <button
              className={"gs-nav-pill" + (activeCat === "all" ? " active" : "")}
              onClick={() => setActiveCat("all")}
            >
              Todo
            </button>

            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={
                  "gs-nav-pill" + (activeCat === c.id ? " active" : "")
                }
                onClick={() => setActiveCat(c.id)}
              >
                {c.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}