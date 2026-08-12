import React from "react";
import {
  ShoppingCart,
  Search,
  Lock,
  Gamepad2,
} from "lucide-react";

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
  isAdmin,
}) {
  return (
    <header className="gs-header">
      <div className="gs-container">

        <div className="gs-header-top">

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

          <div className="gs-search">
            <Search size={16} color="#77778E" />

            <input
              placeholder="Buscar productos..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setView("store");
              }}
            />
          </div>

          <div className="gs-header-actions">

            <button
              className="gs-btn-ghost"
              onClick={() =>
                setView(
                  view === "admin"
                    ? "store"
                    : "admin"
                )
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                borderColor:
                  "rgba(34,211,238,.45)",
                color: "#DDFBFF",
              }}
            >
              <Lock size={14} color="#22D3EE" />

              <span>
                {view === "admin"
                  ? "Ver tienda"
                  : "Panel admin"}
              </span>
            </button>

            <button
              className="gs-btn-ghost"
              onClick={onOpenCart}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                position: "relative",
              }}
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
                  background: "#6D20D0",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {cartCount}
              </span>
            </button>

          </div>
        </div>

        {view === "store" && (
          <nav className="gs-header-nav gs-scrollbar">

            <button
              className={
                "gs-nav-pill" +
                (activeCat === "all"
                  ? " active"
                  : "")
              }
              onClick={() =>
                setActiveCat("all")
              }
            >
              Todo
            </button>

            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                className={
                  "gs-nav-pill" +
                  (activeCat === category.id
                    ? " active"
                    : "")
                }
                onClick={() =>
                  setActiveCat(category.id)
                }
              >
                {category.label}
              </button>
            ))}

          </nav>
        )}

      </div>
    </header>
  );
}