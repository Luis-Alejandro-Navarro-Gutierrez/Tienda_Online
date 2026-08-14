import { useState, useRef } from "react";
import { Plus, LogOut, Pencil, Trash2, ImageOff, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import ProductForm from "./ProductForm";
import { catInfo, fmt } from "../../utils/helpers";

export default function AdminView({ products, onCreate, onUpdate, onDelete, saving, onLogout }) {
  const [editing, setEditing] = useState(null);
  const fileInputRef = useRef(null);

  const totalStock = products.reduce((t, p) => t + p.stock, 0);
  const totalValue = products.reduce((t, p) => t + p.price * p.stock, 0);

  // --- LÓGICA DE CARGUE MASIVO CON EXCEL ---
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convertir la hoja a JSON
        const rawJson = XLSX.utils.sheet_to_json(worksheet);

        // Mapear y validar la estructura de productos
        const newProducts = rawJson.map((item) => {
          // Si el usuario pone "mouse.png", lo convertimos a "/images/mouse.png"
          let imageName = item.image ? String(item.image).trim() : "";
          if (imageName && !imageName.startsWith("/")) {
            imageName = `/images/${imageName}`;
          }

          return {
            name: item.name ? String(item.name).trim() : "Producto sin nombre",
            category: item.category ? String(item.category).trim().toLowerCase() : "accesorios",
            price: Number(item.price) || 0,
            stock: Number(item.stock) || 0,
            image: imageName,
            description: item.description ? String(item.description).trim() : "",
          };
        });

        if (newProducts.length === 0) {
          alert("El archivo Excel no contiene datos o la estructura es inválida.");
          return;
        }

        // ✅ Cargar todos los productos juntos enviando el array completo
        onCreate(newProducts);
        alert(`¡Éxito! Se cargaron ${newProducts.length} productos al inventario.`);

      } catch (err) {
        console.error("Error al procesar el archivo Excel:", err);
        alert("Ocurrió un error al leer el archivo. Revisa que sea un formato .xlsx válido.");
      } finally {
        // Limpiar el input para permitir volver a subir el mismo archivo si es necesario
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    reader.readAsArrayBuffer(file);
  };

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

        <div className="gs-row" style={{ gap: 10 }}>
          {/* Input oculto para subir archivo */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls"
            style={{ display: "none" }}
          />

          {/* Botón Cargue Masivo */}
          <button 
            className="gs-btn-ghost gs-row" 
            onClick={() => fileInputRef.current?.click()}
            title="Cargar productos en lote desde un archivo Excel"
          >
            <FileSpreadsheet size={15} color="#107C41" /> Cargue masivo
          </button>

          {/* Botón Cargar Producto Individual */}
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