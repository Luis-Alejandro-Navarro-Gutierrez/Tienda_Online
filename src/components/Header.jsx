import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Search, Lock } from "lucide-react";
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
  onLogout,
}) {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      // Solo ocultamos después de bajar un poco, para evitar parpadeo cerca del tope de la página
      if (currentY > lastScrollY.current && currentY > 120) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAdminToggle = () => {
    if (view === "admin") {
      if (onLogout) onLogout();
      setView("store");
    } else {
      setView("admin");
    }
  };

  return (
    <header
      className="nt-header"
      style={{ transform: hidden ? "translateY(-100%)" : "translateY(0)", transition: "transform 0.3s ease" }}
    >
      <div className="nt-container">
        {/* Barra superior */}
        <div className="nt-header-top">
          {/* Brand/Logo */}
          <div
            className="nt-brand"
            onClick={() => {
              if (view === "admin" && onLogout) onLogout();
              setView("store");
              setActiveCat("all");
            }}
          >
            <div className="nt-brand-icon">
              <img 
                src="/images/favicon.png" 
                alt="NavaTech Logo" 
                style={{ width: 30, height: 30, objectFit: "contain" }} 
              />
            </div>
            <div className="nt-brand-name">
              Nava<span>Tech</span>
            </div>
          </div>

          {/* Buscador */}
          <div className="nt-search">
            <Search size={16} color="#8C8AA3" />
            <input
              placeholder="Buscar productos..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (view === "admin" && onLogout) onLogout();
                setView("store");
              }}
            />
          </div>

          {/* Acciones principales */}
          <div className="nt-header-actions">
            {view === "admin" && (
              <button
                className="nt-btn-ghost nt-row"
                onClick={handleAdminToggle}
              >
                <Lock size={14} color="#0891B2" />
                <span>Ver tienda</span>
              </button>
            )}

            <button
              className="nt-btn-ghost nt-row"
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
          <nav className="nt-header-nav nt-scrollbar">
            <button
              className={"nt-nav-pill" + (activeCat === "all" ? " active" : "")}
              onClick={() => setActiveCat("all")}
            >
              Todo
            </button>

            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={
                  "nt-nav-pill" + (activeCat === c.id ? " active" : "")
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