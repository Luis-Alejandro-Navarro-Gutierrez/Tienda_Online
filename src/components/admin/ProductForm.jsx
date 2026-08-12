import React, { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

import { CATEGORIES } from "../../data/products";

const emptyForm = {
  name: "",
  category: "computadores",
  price: "",
  stock: "",
  description: "",
  specs: [
    {
      label: "",
      value: "",
    },
  ],
  image: null,
};

export default function ProductForm({
  initial,
  onSave,
  onCancel,
}) {
  const [form, setForm] =
    useState(initial || emptyForm);

  const fileRef = useRef(null);

  const handleImage = (file) => {
    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = () => {
      setForm((current) => ({
        ...current,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const setSpec = (
    index,
    key,
    value
  ) => {
    setForm((current) => {
      const specs = [
        ...current.specs,
      ];

      specs[index] = {
        ...specs[index],
        [key]: value,
      };

      return {
        ...current,
        specs,
      };
    });
  };

  const addSpec = () => {
    setForm((current) => ({
      ...current,
      specs: [
        ...current.specs,
        {
          label: "",
          value: "",
        },
      ],
    }));
  };

  const removeSpec = (index) => {
    setForm((current) => ({
      ...current,
      specs: current.specs.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const valid =
    form.name.trim() &&
    form.price !== "" &&
    form.stock !== "";

  return (
    <div
      style={{
        background:
          "var(--bg-raised)",
        border:
          "1px solid var(--line)",
        borderRadius: 14,
        padding: 22,
      }}
    >
      <div
        className="gs-display"
        style={{
          fontWeight: 700,
          fontSize: 16,
          marginBottom: 16,
        }}
      >
        {initial
          ? "Editar producto"
          : "Nuevo producto"}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: 14,
        }}
      >

        <div
          style={{
            gridColumn:
              "1 / -1",
          }}
        >
          <label className="gs-label">
            Nombre del producto
          </label>

          <input
            className="gs-input"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            placeholder="Ej. Monitor Arc 27 QHD"
          />
        </div>

        <div>
          <label className="gs-label">
            Categoría
          </label>

          <select
            className="gs-input"
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category:
                  e.target.value,
              })
            }
          >
            {CATEGORIES.map(
              (category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.label}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label className="gs-label">
            Stock disponible
          </label>

          <input
            className="gs-input"
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) =>
              setForm({
                ...form,
                stock: e.target.value,
              })
            }
            placeholder="0"
          />
        </div>

        <div
          style={{
            gridColumn:
              "1 / -1",
          }}
        >
          <label className="gs-label">
            Precio (COP)
          </label>

          <input
            className="gs-input"
            type="number"
            min="0"
            value={form.price}
            onChange={(e) =>
              setForm({
                ...form,
                price: e.target.value,
              })
            }
            placeholder="0"
          />
        </div>

        <div
          style={{
            gridColumn:
              "1 / -1",
          }}
        >
          <label className="gs-label">
            Descripción
          </label>

          <textarea
            className="gs-input"
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target.value,
              })
            }
            placeholder="Descripción breve y clara del producto…"
          />
        </div>

        <div
          style={{
            gridColumn:
              "1 / -1",
          }}
        >
          <label className="gs-label">
            Imagen del producto
          </label>

          <div
            className="gs-dropzone"
            onClick={() =>
              fileRef.current?.click()
            }
          >
            {form.image ? (
              <img
                src={form.image}
                alt="preview"
                style={{
                  width: 90,
                  height: 90,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            ) : (
              <>
                <Upload size={18} />
                <span>
                  Haz clic para subir
                  una imagen
                </span>
              </>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{
              display: "none",
            }}
            onChange={(e) =>
              handleImage(
                e.target.files?.[0]
              )
            }
          />
        </div>

        <div
          style={{
            gridColumn:
              "1 / -1",
          }}
        >
          <label className="gs-label">
            Características técnicas
          </label>

          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: 8,
            }}
          >
            {form.specs.map(
              (spec, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: 8,
                  }}
                >
                  <input
                    className="gs-input"
                    placeholder="Ej. RAM"
                    value={
                      spec.label
                    }
                    onChange={(e) =>
                      setSpec(
                        index,
                        "label",
                        e.target.value
                      )
                    }
                  />

                  <input
                    className="gs-input"
                    placeholder="Ej. 16GB"
                    value={
                      spec.value
                    }
                    onChange={(e) =>
                      setSpec(
                        index,
                        "value",
                        e.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    className="gs-btn-ghost"
                    style={{
                      padding:
                        "8px 10px",
                    }}
                    onClick={() =>
                      removeSpec(
                        index
                      )
                    }
                  >
                    <X size={14} />
                  </button>
                </div>
              )
            )}

            <button
              type="button"
              className="gs-btn-ghost"
              style={{
                alignSelf:
                  "flex-start",
                fontSize: 13,
              }}
              onClick={addSpec}
            >
              + Agregar
              característica
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 20,
          justifyContent:
            "flex-end",
        }}
      >
        <button
          className="gs-btn-ghost"
          onClick={onCancel}
        >
          Cancelar
        </button>

        <button
          className="gs-btn-primary"
          disabled={!valid}
          onClick={() =>
            onSave({
              ...form,
              price:
                Number(form.price) ||
                0,
              stock:
                Number(form.stock) ||
                0,
              specs:
                form.specs.filter(
                  (spec) =>
                    spec.label &&
                    spec.value
                ),
            })
          }
        >
          Guardar producto
        </button>
      </div>
    </div>
  );
}