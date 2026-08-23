import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { CATEGORIES } from "../../data/products";
import { supabase } from "../../lib/supabase";

const emptyForm = { name: "", category: "computadores", price: "", stock: "", description: "", image: null };

export default function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ? { ...emptyForm, ...initial } : emptyForm);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleImage = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
      setForm((f) => ({ ...f, image: data.publicUrl }));
    } catch (err) {
      console.error("Error subiendo imagen:", err?.message || err);
      alert("No se pudo subir la imagen:\n\n" + (err?.message || "Error desconocido"));
    } finally {
      setUploading(false);
    }
  };

  const valid = form.name.trim() && form.price !== "" && form.stock !== "";

  return (
    <div className="nt-panel">
      <div className="nt-display" style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
        {initial ? "Editar producto" : "Nuevo producto"}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="nt-full">
          <label className="nt-label">Nombre del producto</label>
          <input className="nt-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej. Monitor Arc 27 QHD" />
        </div>

        <div>
          <label className="nt-label">Categoría</label>
          <select className="nt-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>

        <div>
          <label className="nt-label">Stock disponible</label>
          <input className="nt-input" type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="0" />
        </div>

        <div className="nt-full">
          <label className="nt-label">Precio (COP)</label>
          <input className="nt-input" type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0" />
        </div>

        <div className="nt-full">
          <label className="nt-label">Descripción</label>
          <textarea className="nt-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción breve y clara del producto…" />
        </div>

        <div className="nt-full">
          <label className="nt-label">Imagen del producto</label>
          <div className="nt-dropzone" onClick={() => !uploading && fileRef.current?.click()} style={{ opacity: uploading ? 0.6 : 1, cursor: uploading ? "wait" : "pointer" }}>
            {uploading ? (
              <span>Subiendo imagen…</span>
            ) : form.image ? (
              <img src={form.image} alt="preview" style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 8 }} />
            ) : (
              <><Upload size={18} /><span>Haz clic para subir una imagen</span></>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleImage(e.target.files?.[0])} />
        </div>

      </div>

      <div className="nt-row" style={{ marginTop: 20, justifyContent: "flex-end" }}>
        <button className="nt-btn-ghost" onClick={onCancel}>Cancelar</button>
        <button
          className="nt-btn-primary"
          disabled={!valid || uploading}
          onClick={() => onSave({ ...form, price: Number(form.price) || 0, stock: Number(form.stock) || 0 })}
        >
          Guardar producto
        </button>
      </div>
    </div>
  );
}