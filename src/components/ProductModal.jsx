import React, { useState } from "react";
import {
  X,
  Package,
  Minus,
  Plus,
} from "lucide-react";

import { catInfo, fmt } from "../utils/helpers";

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
}) {
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const cat = catInfo(product.category);

  return (
    <div
      className="gs-modal"
      onClick={onClose}
    >
      <div
        className="gs-modal-card"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: 320,
          }}
        >

          <div
            className="gs-imgwrap"
            style={{
              aspectRatio: "auto",
              borderRadius: 0,
            }}
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
              />
            ) : (
              <Package
                size={48}
                color="#C9C4E8"
              />
            )}
          </div>

          <div
            style={{
              padding: 26,
              display: "flex",
              flexDirection: "column",
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "flex-start",
              }}
            >
              <span
                className="gs-tag"
                style={{
                  background:
                    cat.color + "18",
                  color: cat.color,
                }}
              >
                {cat.label}
              </span>

              <button
                className="gs-btn-ghost"
                style={{
                  padding: 6,
                  border: "none",
                  background: "transparent",
                }}
                onClick={onClose}
              >
                <X size={18} />
              </button>
            </div>

            <h2
              className="gs-display"
              style={{
                fontSize: 24,
                fontWeight: 700,
                marginTop: 12,
              }}
            >
              {product.name}
            </h2>

            <p
              style={{
                color: "var(--text-dim)",
                fontSize: 14,
                marginTop: 8,
                lineHeight: 1.5,
              }}
            >
              {product.description}
            </p>

            {product.specs?.length > 0 && (
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {product.specs.map(
                  (spec, index) => (
                    <div
                      key={index}
                      className="gs-mono"
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        fontSize: 12.5,
                        borderBottom:
                          "1px solid var(--line)",
                        padding: "6px 0",
                      }}
                    >
                      <span
                        style={{
                          color:
                            "var(--text-dim)",
                        }}
                      >
                        {spec.label}
                      </span>

                      <span>
                        {spec.value}
                      </span>
                    </div>
                  )
                )}
              </div>
            )}

            <div
              style={{
                marginTop: "auto",
                paddingTop: 20,
              }}
            >
              <div
                className="gs-display"
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                {fmt(product.price)}
              </div>

              <div
                style={{
                  fontSize: 12.5,
                  color:
                    product.stock > 0
                      ? "var(--text-dim)"
                      : "#DC2626",
                  marginBottom: 14,
                }}
              >
                {product.stock > 0
                  ? `${product.stock} unidades disponibles`
                  : "Sin stock disponible"}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border:
                      "1px solid var(--line)",
                    borderRadius: 10,
                  }}
                >
                  <button
                    className="gs-btn-ghost"
                    style={{
                      border: "none",
                      padding: "9px 12px",
                      background:
                        "transparent",
                    }}
                    onClick={() =>
                      setQty((q) =>
                        Math.max(
                          1,
                          q - 1
                        )
                      )
                    }
                  >
                    <Minus size={14} />
                  </button>

                  <span
                    className="gs-mono"
                    style={{
                      width: 26,
                      textAlign: "center",
                    }}
                  >
                    {qty}
                  </span>

                  <button
                    className="gs-btn-ghost"
                    style={{
                      border: "none",
                      padding: "9px 12px",
                      background:
                        "transparent",
                    }}
                    onClick={() =>
                      setQty((q) =>
                        Math.min(
                          product.stock,
                          q + 1
                        )
                      )
                    }
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  className="gs-btn-primary"
                  style={{ flex: 1 }}
                  disabled={
                    product.stock === 0
                  }
                  onClick={() => {
                    onAddToCart(
                      product,
                      qty
                    );
                    onClose();
                  }}
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