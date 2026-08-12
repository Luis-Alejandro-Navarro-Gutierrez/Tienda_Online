import React from "react";
import { Package } from "lucide-react";

import { catInfo } from "../utils/helpers";
import { fmt } from "../utils/helpers";

export default function ProductCard({
  product,
  onOpen,
}) {
  const cat = catInfo(product.category);

  return (
    <article
      className="gs-card"
      onClick={() => onOpen(product)}
    >
      <div className="gs-imgwrap">

        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
          />
        ) : (
          <div
            style={{
              width: "64%",
              height: "62%",
              borderRadius: 12,
              display: "grid",
              placeItems: "center",
              background:
                "linear-gradient(145deg,#18152D,#0B0B13)",
              border: "1px solid #27244B",
              boxShadow:
                "0 0 35px rgba(124,58,237,.08)",
            }}
          >
            <Package
              size={34}
              color="#8D86B8"
            />
          </div>
        )}

        <span
          className="gs-tag"
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: cat.color + "18",
            color: cat.color,
            border:
              `1px solid ${cat.color}44`,
          }}
        >
          {cat.label}
        </span>

        {product.stock <= 3 &&
          product.stock > 0 && (
            <span
              className="gs-tag"
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "#3B1018",
                color: "#FB7185",
                border:
                  "1px solid #7F1D2D",
              }}
            >
              Últimas {product.stock}
            </span>
          )}

        {product.stock === 0 && (
          <span
            className="gs-tag"
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "#151522",
              color: "#9999AD",
              border:
                "1px solid #303044",
            }}
          >
            Agotado
          </span>
        )}

      </div>

      <div className="gs-card-info">

        <div className="gs-card-name">
          {product.name}
        </div>

        {product.specs?.[0] && (
          <div
            className="gs-mono"
            style={{
              fontSize: 9.5,
              color: "#77778F",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {product.specs[0].label}:{" "}
            {product.specs[0].value}
          </div>
        )}

        <div className="gs-card-price">
          {fmt(product.price)}
        </div>

        <div className="gs-stock-row">
          <span className="gs-stock">
            {product.stock} en stock
          </span>

          <span className="gs-stock-code gs-mono">
            ID {String(product.id).slice(-4)}
          </span>
        </div>

      </div>
    </article>
  );
}