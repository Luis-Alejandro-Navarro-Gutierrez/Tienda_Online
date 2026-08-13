import { useState } from "react";
import { X, Package, Minus, Plus } from "lucide-react";
import { catInfo, fmt } from "../utils/helpers";

export default function ProductModal({ product, onClose, onAddToCart }) {
  const [qty, setQty] = useState(1);
  if (!product) return null;

  const cat = catInfo(product.category);

  return (
    <div className="gs-modal" onClick={onClose}>
      <div className="gs-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="gs-modal-grid">
          <div className="gs-imgwrap" style={{ aspectRatio: "auto", borderRadius: 0 }}>
            {product.image ? <img src={product.image} alt={product.name} /> : <Package size={48} color="var(--muted)" />}
          </div>

          <div className="gs-modal-body">
            <div className="gs-row-between" style={{ alignItems: "flex-start" }}>
              <span className="gs-tag" style={{ background: cat.color + "18", color: cat.color }}>{cat.label}</span>
              <button className="gs-btn-icon" onClick={onClose}><X size={18} /></button>
            </div>

            <h2 className="gs-display" style={{ fontSize: 24, fontWeight: 700, marginTop: 12 }}>{product.name}</h2>
            <p className="gs-muted" style={{ fontSize: 14, marginTop: 8, lineHeight: 1.5 }}>{product.description}</p>

            {product.specs?.length > 0 && (
              <div className="gs-col gs-gap-6" style={{ marginTop: 16 }}>
                {product.specs.map((spec, i) => (
                  <div key={i} className="gs-mono gs-spec-row">
                    <span className="gs-muted">{spec.label}</span>
                    <span>{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: "auto", paddingTop: 20 }}>
              <div className="gs-display" style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>{fmt(product.price)}</div>
              <div style={{ fontSize: 12.5, color: product.stock > 0 ? "var(--muted)" : "var(--danger)", marginBottom: 14 }}>
                {product.stock > 0 ? `${product.stock} unidades disponibles` : "Sin stock disponible"}
              </div>

              <div className="gs-row" style={{ gap: 10 }}>
                <div className="gs-qty-box">
                  <button className="gs-btn-ghost" style={{ border: "none", padding: "9px 12px", background: "transparent" }} onClick={() => setQty((q) => Math.max(1, q - 1))}>
                    <Minus size={14} />
                  </button>
                  <span className="gs-mono" style={{ width: 26, textAlign: "center" }}>{qty}</span>
                  <button className="gs-btn-ghost" style={{ border: "none", padding: "9px 12px", background: "transparent" }} onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  className="gs-btn-primary"
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
