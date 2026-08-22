import { useState, useEffect } from "react";
import { X, Package, Minus, Plus } from "lucide-react";
import { catInfo, fmt } from "../utils/helpers";

export default function ProductModal({ product, onClose, onAddToCart }) {
  const [qty, setQty] = useState(1);

  // Cada vez que se abre un producto distinto, la cantidad vuelve a 1
  useEffect(() => {
    setQty(1);
  }, [product?.id]);

  // Bloquea el scroll de la página de fondo mientras el modal está abierto
  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  if (!product) return null;

  const cat = catInfo(product.category);

  return (
    <div className="nt-modal" onClick={onClose}>
      <div className="nt-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="nt-modal-grid">
          <div className="nt-imgwrap" style={{ aspectRatio: "auto", borderRadius: 0 }}>
            {product.image ? <img src={product.image} alt={product.name} /> : <Package size={48} color="var(--muted)" />}
          </div>

          <div className="nt-modal-body">
            <div className="nt-row-between" style={{ alignItems: "flex-start" }}>
              <span className="nt-tag" style={{ background: cat.color + "18", color: cat.color }}>{cat.label}</span>
              <button className="nt-btn-icon" onClick={onClose}><X size={18} /></button>
            </div>

            <h2 className="nt-display" style={{ fontSize: 24, fontWeight: 700, marginTop: 12 }}>{product.name}</h2>
            
            <p className="nt-muted" style={{ fontSize: 14, marginTop: 8, lineHeight: 1.5, whiteSpace: "pre-line" }}>
              {product.description}
            </p>

            <div style={{ marginTop: "auto", paddingTop: 20 }}>
              <div className="nt-display" style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>{fmt(product.price)}</div>
              <div style={{ fontSize: 12.5, color: product.stock > 0 ? "var(--muted)" : "var(--danger)", marginBottom: 14 }}>
                {product.stock > 0 ? `${product.stock} unidades disponibles` : "Sin stock disponible"}
              </div>

              <div className="nt-row" style={{ gap: 10 }}>
                <div className="nt-qty-box">
                  <button className="nt-btn-ghost" style={{ border: "none", padding: "9px 12px", background: "transparent" }} onClick={() => setQty((q) => Math.max(1, q - 1))}>
                    <Minus size={14} />
                  </button>
                  <span className="nt-mono" style={{ width: 26, textAlign: "center" }}>{qty}</span>
                  <button className="nt-btn-ghost" style={{ border: "none", padding: "9px 12px", background: "transparent" }} onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  className="nt-btn-primary"
                  style={{ flex: 1 }}
                  disabled={product.stock === 0}
                  onClick={() => { onAddToCart(product, qty); onClose(); }}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}