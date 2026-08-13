import { useState } from "react";
import { Plus, LogOut, Pencil, Trash2, ImageOff } from "lucide-react";
import ProductForm from "./ProductForm";
import { catInfo, fmt } from "../../utils/helpers";

export default function AdminView({ products, onCreate, onUpdate, onDelete, saving, onLogout }) {
  const [editing, setEditing] = useState(null);

  const totalStock = products.reduce((t, p) => t + p.stock, 0);
  const totalValue = products.reduce((t, p) => t + p.price * p.stock, 0);

  if (editing) {
    return (
      <div className="gs-page-narrow">
        <ProductForm
          initial={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSave={(data) => {
            if (editing === "new") onCreate(data);
            else onUpdate(editing.id, data);
            setEditing(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="gs-page">
      <div className="gs-row-between" style={{ alignItems: "flex-end", marginBottom: 22, flexWrap: "wrap" }}>
        <div>
          <div className="gs-display" style={{ fontSize: 22, fontWeight: 700 }}>Panel de inventario</div>
          <div className="gs-muted" style={{ fontSize: 13.5, marginTop: 4 }}>
            {products.length} productos · {totalStock} unidades en stock · valor total {fmt(totalValue)}
            {saving && " · guardando…"}
          </div>
        </div>

        <div className="gs-row">
          <button className="gs-btn-primary gs-row" onClick={() => setEditing("new")}>
            <Plus size={15} /> Cargar producto
          </button>
          <button className="gs-btn-ghost gs-row" onClick={onLogout}>
            <LogOut size={14} /> Salir
          </button>
        </div>
      </div>

      <div className="gs-scrollbar" style={{ overflowX: "auto", border: "1px solid var(--line)", borderRadius: 12 }}>
        <table className="gs-table">
          <thead>
            <tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th></th></tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const cat = catInfo(product.category);
              return (
                <tr key={product.id}>
                  <td>
                    <div className="gs-row">
                      <div className="gs-imgwrap" style={{ width: 40, height: 40, borderRadius: 6, flexShrink: 0 }}>
                        {product.image ? <img src={product.image} alt={product.name} /> : <ImageOff size={14} color="var(--muted)" />}
                      </div>
                      <span style={{ fontWeight: 600 }}>{product.name}</span>
                    </div>
                  </td>
                  <td><span className="gs-tag" style={{ background: cat.color + "18", color: cat.color }}>{cat.label}</span></td>
                  <td className="gs-mono">{fmt(product.price)}</td>
                  <td className="gs-mono" style={{ color: product.stock === 0 ? "var(--danger)" : "inherit" }}>{product.stock}</td>
                  <td>
                    <div className="gs-row" style={{ gap: 6 }}>
                      <button className="gs-btn-ghost" style={{ padding: 7 }} onClick={() => setEditing(product)}><Pencil size={13} /></button>
                      <button
                        className="gs-btn-ghost"
                        style={{ padding: 7 }}
                        onClick={() => { if (confirm(`¿Eliminar "${product.name}" del inventario?`)) onDelete(product.id); }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
