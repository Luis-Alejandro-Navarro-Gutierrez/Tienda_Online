import { X, Headphones, MessageSquare, PhoneCall } from "lucide-react";

export default function SupportModal({ open, onClose }) {
  if (!open) return null;

  const whatsappUrl = "https://wa.me/573015194439?text=Hola%20Camilo,%20necesito%20soporte%20t%C3%A9cnico%20especializado";

  return (
    <div className="nt-modal" onClick={onClose}>
      <div 
        className="nt-modal-card" 
        style={{ maxWidth: 420, padding: 24, margin: "0 16px" }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="nt-row-between" style={{ marginBottom: 16 }}>
          <div className="nt-row">
            <div className="nt-brand-icon" style={{ width: 34, height: 34, background: "var(--purple)", borderRadius: 9 }}>
              <Headphones size={18} color="#fff" />
            </div>
            <strong style={{ fontSize: 18, fontFamily: "Space Grotesk" }}>
              Soporte Técnico
            </strong>
          </div>
          <button className="nt-btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div 
          style={{ 
            background: "var(--surface-2)", 
            border: "1px solid var(--line)", 
            borderRadius: 12, 
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 6 
          }}
        >
          <div className="nt-stock" style={{ alignSelf: "flex-start" }}>
            ● Atención Directa & Especializada
          </div>

          <h3 style={{ margin: "6px 0 0", fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
            Camilo Andrés Navarro Gutiérrez
          </h3>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>
            Soporte técnico especializado
          </span>

          <div className="nt-row" style={{ marginTop: 10, fontSize: 13, color: "var(--text)" }}>
            <PhoneCall size={15} color="var(--purple)" />
            <strong>+57 301 519 4439</strong>
          </div>
        </div>

        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="nt-btn-primary"
          style={{ 
            marginTop: 20, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: 8, 
            textDecoration: "none",
            background: "#25D366"
          }}
        >
          <MessageSquare size={16} />
          <span>Contactar por WhatsApp</span>
        </a>
      </div>
    </div>
  );
}