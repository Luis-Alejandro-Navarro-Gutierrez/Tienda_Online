import React from "react";
import {
  X,
  Package,
  Trash2,
} from "lucide-react";

import { fmt } from "../utils/helpers";

export default function CartDrawer({
  open,
  onClose,
  cart,
  updateQty,
  removeItem,
  total,
  onCheckout,
}) {
  return (
    <>
      <div
        className={
          "gs-overlay" +
          (open ? " open" : "")
        }
        onClick={onClose}
      />

      <div
        className={
          "gs-drawer" +
          (open ? " open" : "")
        }
      >

        <div
          style={{
            padding: 18,
            borderBottom:
              "1px solid var(--line)",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >
          <span
            className="gs-display"
            style={{
              fontWeight: 700,
              fontSize: 17,
            }}
          >
            Tu carrito
          </span>

          <button
            className="gs-btn-ghost"
            style={{
              border: "none",
              padding: 6,
              background: "transparent",
            }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div
          className="gs-scrollbar"
          style={{
            flex: 1,
            overflow: "auto",
            padding: 14,
          }}
        >
          {cart.length === 0 ? (
            <div
              style={{
                color:
                  "var(--text-dim)",
                fontSize: 14,
                textAlign: "center",
                marginTop: 40,
              }}
            >
              Aún no has agregado
              productos.
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "12px 0",
                  borderBottom:
                    "1px solid var(--line)",
                }}
              >

                <div
                  className="gs-imgwrap"
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                    flexShrink: 0,
                  }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  ) : (
                    <Package
                      size={20}
                      color="#C9C4E8"
                    />
                  )}
                </div>

                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                    }}
                  >
                    {item.name}
                  </div>

                  <div
                    className="gs-mono"
                    style={{
                      fontSize: 12,
                      color:
                        "var(--text-dim)",
                    }}
                  >
                    {fmt(item.price)}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: 8,
                      marginTop: 6,
                    }}
                  >
                    <button
                      className="gs-btn-ghost"
                      style={{
                        padding:
                          "2px 8px",
                        fontSize: 12,
                      }}
                      onClick={() =>
                        updateQty(
                          item.id,
                          item.qty - 1
                        )
                      }
                    >
                      -
                    </button>

                    <span
                      className="gs-mono"
                      style={{
                        fontSize: 12.5,
                      }}
                    >
                      {item.qty}
                    </span>

                    <button
                      className="gs-btn-ghost"
                      style={{
                        padding:
                          "2px 8px",
                        fontSize: 12,
                      }}
                      onClick={() =>
                        updateQty(
                          item.id,
                          item.qty + 1
                        )
                      }
                    >
                      +
                    </button>

                    <button
                      onClick={() =>
                        removeItem(
                          item.id
                        )
                      }
                      style={{
                        marginLeft: "auto",
                        background:
                          "none",
                        border: "none",
                        color:
                          "var(--text-dim)",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div
          style={{
            padding: 18,
            borderTop:
              "1px solid var(--line)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                color:
                  "var(--text-dim)",
                fontSize: 14,
              }}
            >
              Subtotal
            </span>

            <span
              className="gs-display"
              style={{
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              {fmt(total)}
            </span>
          </div>

          <button
            className="gs-btn-primary"
            style={{ width: "100%" }}
            disabled={!cart.length}
            onClick={onCheckout}
          >
            Finalizar compra
          </button>
        </div>

      </div>
    </>
  );
}