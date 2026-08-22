import { useState, useRef } from "react";
import { Plus, LogOut, Pencil, Trash2, ImageOff, FileSpreadsheet, Tags } from "lucide-react";
import * as XLSX from "xlsx";
import ProductForm from "./ProductForm";
import { catInfo, fmt } from "../../utils/helpers";

// Normaliza nombres para comparar sin fallar por mayúsculas, tildes o espacios extra
const normalizeName = (str) =>
  String(str || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export default function AdminView({ products = [], onCreate, onUpdate, onBulkUpdate, onDelete, saving, onLogout }) {
  const [editing, setEditing] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const fileInputRef = useRef(null);
  const priceFileInputRef = useRef(null);

  const totalStock = products.reduce((t, p) => t + (Number(p.stock) || 0), 0);
  const totalValue = products.reduce((t, p) => t + ((Number(p.price) || 0) * (Number(p.stock) || 0)), 0);

  // --- LÓGICA DE SELECCIÓN MÚLTIPLE ---
  const isAllSelected = products.length > 0 && selectedIds.length === products.length;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(products.map((p) => String(p.id)));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    const strId = String(id);
    setSelectedIds((prev) =>
      prev.includes(strId) ? prev.filter((item) => item !== strId) : [...prev, strId]
    );
  };

  const handleSingleDelete = (id, name) => {
    if (confirm(`¿Eliminar "${name}" del inventario?`)) {
      const strId = String(id);
      onDelete(strId);
      setSelectedIds((prev) => prev.filter((item) => item !== strId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;

    const count = selectedIds.length;
    if (confirm(`¿Estás seguro de que deseas eliminar ${count} producto(s) seleccionado(s)?`)) {
      onDelete(selectedIds);
      setSelectedIds([]);
    }
  };

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

        const rawJson = XLSX.utils.sheet_to_json(worksheet);

        const newProducts = rawJson.map((item, index) => {
          let imageName = item.image ? String(item.image).trim() : "";
          if (imageName && !imageName.startsWith("/") && !imageName.startsWith("http")) {
            imageName = `/images/${imageName}`;
          }

          let rawDescription = item.description ? String(item.description).trim() : "";
          const regexSpecs = /(N\/P\s*:|Pantalla\s*:|Procesador\s*:|Memoria\s*:|Disco Duro\s*:|Cámara\s*:|Puertos Traseros|Puertos Laterales|Sistema Operativo\s*:|Keyboard|Garantía\s*:|\d+\.\s+)/gi;
          const formattedDescription = rawDescription
            .replace(regexSpecs, '\n$1')
            .trim();

          return {
            id: item.id ? String(item.id) : "p-" + (Date.now() + index),
            name: item.name ? String(item.name).trim() : "Producto sin nombre",
            category: item.category ? String(item.category).trim().toLowerCase() : "accesorios",
            price: Number(item.price) || 0,
            stock: Number(item.stock) || 0,
            image: imageName,
            description: formattedDescription,
          };
        });

        if (newProducts.length === 0) {
          alert("El archivo Excel no contiene datos o la estructura es inválida.");
          return;
        }

        onCreate(newProducts);
        alert(`¡Éxito! Se cargaron ${newProducts.length} productos al inventario.`);

      } catch (err) {
        console.error("Error al procesar el archivo Excel:", err);
        alert("Ocurrió un error al leer el archivo. Revisa que sea un formato .xlsx válido.");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // --- LÓGICA DE ACTUALIZACIÓN MASIVA DE PRECIOS (por nombre) ---
  const handlePriceUpdateFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawJson = XLSX.utils.sheet_to_json(worksheet);

        if (rawJson.length === 0) {
          alert("El archivo Excel no contiene datos o la estructura es inválida.");
          return;
        }

        // Mapa: nombre normalizado -> nuevo precio
        const priceMap = new Map();
        rawJson.forEach((row) => {
          const key = normalizeName(row.name);
          if (key && row.price !== undefined && row.price !== "") {
            priceMap.set(key, Number(row.price) || 0);
          }
        });

        const matchedNames = new Set();
        const updatedProducts = products.map((p) => {
          const key = normalizeName(p.name);
          if (priceMap.has(key)) {
            matchedNames.add(key);
            return { ...p, price: priceMap.get(key) };
          }
          return p;
        });

        const unmatched = [...priceMap.keys()].filter((key) => !matchedNames.has(key));

        onBulkUpdate(updatedProducts);

        let msg = `¡Listo! Se actualizó el precio de ${matchedNames.size} producto(s).`;
        if (unmatched.length > 0) {
          const originalNames = rawJson
            .filter((row) => unmatched.includes(normalizeName(row.name)))
            .map((row) => row.name);
          msg += `\n\nNo se encontró ningún producto con estos nombres (revisa si hay un typo):\n- ${originalNames.join("\n- ")}`;
        }
        alert(msg);
      } catch (err) {
        console.error("Error al procesar el archivo de precios:", err);
        alert("Ocurrió un error al leer el archivo. Revisa que sea un formato .xlsx válido.");
      } finally {
        if (priceFileInputRef.current) priceFileInputRef.current.value = "";
      }
    };

    reader.readAsArrayBuffer(file);
  };

  if (editing) {
    return (
      <div className="nt-page-narrow">
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
    <div className="nt-page">
      <div className="nt-row-between" style={{ alignItems: "flex-end", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="nt-display" style={{ fontSize: 22, fontWeight: 700 }}>Panel de inventario</div>
          <div className="nt-muted" style={{ fontSize: 13.5, marginTop: 4 }}>
            {products.length} productos · {totalStock} unidades en stock · valor total {fmt(totalValue)}
            {saving && " · guardando…"}
          </div>
        </div>

        <div className="nt-row" style={{ gap: 10, flexWrap: "wrap" }}>
          {selectedIds.length > 0 && (
            <button
              className="nt-btn-ghost nt-row"
              onClick={handleBulkDelete}
              style={{ color: "var(--danger)", border: "1px solid var(--danger)", background: "#fff0f0" }}
            >
              <Trash2 size={15} /> Eliminar ({selectedIds.length})
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls"
            style={{ display: "none" }}
          />

          <input
            type="file"
            ref={priceFileInputRef}
            onChange={handlePriceUpdateFile}
            accept=".xlsx, .xls"
            style={{ display: "none" }}
          />

          <button
            className="nt-btn-ghost nt-row"
            onClick={() => priceFileInputRef.current?.click()}
            title="Actualizar solo el precio de productos existentes, buscándolos por nombre"
          >
            <Tags size={15} color="var(--purple)" /> Actualizar precios
          </button>

          <button 
            className="nt-btn-ghost nt-row" 
            onClick={() => fileInputRef.current?.click()}
            title="Cargar productos en lote desde un archivo Excel"
          >
            <FileSpreadsheet size={15} color="#107C41" /> Cargue masivo
          </button>

          <button className="nt-btn-primary nt-row" onClick={() => setEditing("new")}>
            <Plus size={15} /> Cargar producto
          </button>

          <button className="nt-btn-ghost nt-row" onClick={onLogout}>
            <LogOut size={14} /> Salir
          </button>
        </div>
      </div>

      <div className="nt-scrollbar" style={{ overflowX: "auto", border: "1px solid var(--line)", borderRadius: 12 }}>
        <table className="nt-table">
          <thead>
            <tr>
              <th style={{ width: 40, textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  style={{ cursor: "pointer", width: 16, height: 16 }}
                />
              </th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "30px 0", color: "var(--muted)" }}>
                  No hay productos registrados en el inventario.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const cat = catInfo(product.category);
                const strId = String(product.id);
                const isSelected = selectedIds.includes(strId);

                return (
                  <tr key={strId} style={{ backgroundColor: isSelected ? "var(--bg-hover, #f8f9fa)" : "transparent" }}>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOne(strId)}
                        style={{ cursor: "pointer", width: 16, height: 16 }}
                      />
                    </td>
                    <td>
                      <div className="nt-row">
                        <div className="nt-imgwrap" style={{ width: 40, height: 40, borderRadius: 6, flexShrink: 0 }}>
                          {product.image ? <img src={product.image} alt={product.name} /> : <ImageOff size={14} color="var(--muted)" />}
                        </div>
                        <span style={{ fontWeight: 600 }}>{product.name}</span>
                      </div>
                    </td>
                    <td><span className="nt-tag" style={{ background: cat.color + "18", color: cat.color }}>{cat.label}</span></td>
                    <td className="nt-mono">{fmt(product.price)}</td>
                    <td className="nt-mono" style={{ color: product.stock === 0 ? "var(--danger)" : "inherit" }}>{product.stock}</td>
                    <td>
                      <div className="nt-row" style={{ gap: 6 }}>
                        <button className="nt-btn-ghost" style={{ padding: 7 }} onClick={() => setEditing(product)}>
                          <Pencil size={13} />
                        </button>
                        <button
                          className="nt-btn-ghost"
                          style={{ padding: 7 }}
                          onClick={() => handleSingleDelete(product.id, product.name)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}