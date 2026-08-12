import React, { useState } from "react";
import {
  Plus,
  LogOut,
  Pencil,
  Trash2,
  ImageOff,
} from "lucide-react";

import ProductForm from "./ProductForm";
import {
  catInfo,
  fmt,
} from "../../utils/helpers";

export default function AdminView({
  products,
  onCreate,
  onUpdate,
  onDelete,
  saving,
  onLogout,
}) {
  const [editing, setEditing] =
    useState(null);

  const totalStock =
    products.reduce(
      (total, product) =>
        total + product.stock,
      0
    );

  const totalValue =
    products.reduce(
      (total, product) =>
        total +
        product.price *
          product.stock,
      0
    );

  if (editing) {
    return (
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "32px 20px",
        }}
      >
        <ProductForm
          initial={
            editing === "new"
              ? null
              : editing
          }
          onCancel={() =>
            setEditing(null)
          }
          onSave={(data) => {
            if (
              editing === "new"
            ) {
              onCreate(data);
            } else {
              onUpdate(
                editing.id,
                data
              );
            }

            setEditing(null);
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1180,
        margin: "0 auto",
        padding: "32px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "flex-end",
          marginBottom: 22,
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        <div>
          <div
            className="gs-display"
            style={{
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            Panel de inventario
          </div>

          <div
            style={{
              color:
                "var(--text-dim)",
              fontSize: 13.5,
              marginTop: 4,
            }}
          >
            {products.length} productos
            {" · "}
            {totalStock} unidades en
            stock
            {" · "}
            valor total{" "}
            {fmt(totalValue)}
            {saving &&
              " · guardando…"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <button
            className="gs-btn-primary"
            onClick={() =>
              setEditing("new")
            }
            style={{
              display: "flex",
              alignItems:
                "center",
              gap: 6,
            }}
          >
            <Plus size={15} />
            Cargar producto
          </button>

          <button
            className="gs-btn-ghost"
            onClick={onLogout}
            style={{
              display: "flex",
              alignItems:
                "center",
              gap: 6,
            }}
          >
            <LogOut size={14} />
            Salir
          </button>
        </div>
      </div>

      <div
        className="gs-scrollbar"
        style={{
          overflowX: "auto",
          border:
            "1px solid var(--line)",
          borderRadius: 12,
        }}
      >
        <table
          className="gs-table"
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {products.map(
              (product) => {
                const cat =
                  catInfo(
                    product.category
                  );

                return (
                  <tr
                    key={product.id}
                  >
                    <td>
                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: 10,
                        }}
                      >
                        <div
                          className="gs-imgwrap"
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 6,
                            flexShrink: 0,
                          }}
                        >
                          {product.image ? (
                            <img
                              src={
                                product.image
                              }
                              alt={
                                product.name
                              }
                            />
                          ) : (
                            <ImageOff
                              size={14}
                              color="#C9C4E8"
                            />
                          )}
                        </div>

                        <span
                          style={{
                            fontWeight:
                              600,
                          }}
                        >
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span
                        className="gs-tag"
                        style={{
                          background:
                            cat.color +
                            "18",
                          color:
                            cat.color,
                        }}
                      >
                        {cat.label}
                      </span>
                    </td>

                    <td className="gs-mono">
                      {fmt(
                        product.price
                      )}
                    </td>

                    <td
                      className="gs-mono"
                      style={{
                        color:
                          product.stock ===
                          0
                            ? "#DC2626"
                            : "inherit",
                      }}
                    >
                      {product.stock}
                    </td>

                    <td>
                      <div
                        style={{
                          display:
                            "flex",
                          gap: 6,
                        }}
                      >
                        <button
                          className="gs-btn-ghost"
                          style={{
                            padding: 7,
                          }}
                          onClick={() =>
                            setEditing(
                              product
                            )
                          }
                        >
                          <Pencil
                            size={13}
                          />
                        </button>

                        <button
                          className="gs-btn-ghost"
                          style={{
                            padding: 7,
                          }}
                          onClick={() => {
                            if (
                              confirm(
                                `¿Eliminar "${product.name}" del inventario?`
                              )
                            ) {
                              onDelete(
                                product.id
                              );
                            }
                          }}
                        >
                          <Trash2
                            size={13}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}