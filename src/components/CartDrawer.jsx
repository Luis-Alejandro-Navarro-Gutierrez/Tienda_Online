import { X, Package, Trash2 } from "lucide-react";
import { fmt } from "../utils/helpers";

// Número de WhatsApp configurado (Colombia +57)
const WHATSAPP_PHONE = "573044730989"; 

export default function CartDrawer({ open, onClose, cart, updateQty, removeItem, total, onCheckout }) {

  const handleWhatsAppCheckout = () => {
    if (!cart.length) return;

    let text = "*¡Hola! Quisiera realizar el siguiente pedido:*\n\n";
    text += "```\n";
    text += "CANT  PRODUCTO             TOTAL\n";
    text += "----------------------------------\n";

    cart.forEach((item) => {
      const qty = String(item.qty).padEnd(5, " ");
      const name = item.name.length > 17 
        ? item.name.substring(0, 14) + "..." 
        : item.name.padEnd(17, " ");
      const subtotal = fmt(item.price * item.qty);

      text += `${qty}${name}${subtotal}\n`;
    });

    text += "----------------------------------\n";
    text += "```\n";
    text += `\n*TOTAL A PAGAR:* *${fmt(total)}*\n\n`;
    text += "Quedo atento a la confirmación y datos de envío. ¡Gracias!";

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;

    window.open(whatsappUrl, "_blank");

    if (onCheckout) onCheckout();
  };

  return (
    <>
      <div className={"gs-overlay" + (open ? " open" : "")} onClick={onClose} />

      <div className={"gs-drawer" + (open ? " open" : "")}>
        <div className="gs-drawer-head">
          <span className="gs-display" style={{ fontWeight: 700, fontSize: 17 }}>Tu carrito</span>
          <button className="gs-btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="gs-drawer-body gs-scrollbar">
          {cart.length === 0 ? (
            <div className="gs-muted" style={{ fontSize: 14, textAlign: "center", marginTop: 40 }}>
              Aún no has agregado productos.
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="gs-cart-item">
                <div className="gs-imgwrap gs-cart-thumb">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <Package size={20} color="var(--muted)" />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{item.name}</div>
                  <div className="gs-mono gs-muted" style={{ fontSize: 12 }}>{fmt(item.price)}</div>

                  <div className="gs-row" style={{ marginTop: 6 }}>
                    <button className="gs-btn-ghost gs-qty-btn" onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                    <span className="gs-mono" style={{ fontSize: 12.5 }}>{item.qty}</span>
                    <button className="gs-btn-ghost gs-qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                    <button onClick={() => removeItem(item.id)} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="gs-drawer-foot">
          <div className="gs-row-between" style={{ marginBottom: 12 }}>
            <span className="gs-muted" style={{ fontSize: 14 }}>Subtotal</span>
            <span className="gs-display" style={{ fontWeight: 700, fontSize: 18 }}>{fmt(total)}</span>
          </div>
          <button 
            className="gs-btn-primary" 
            style={{ width: "100%" }} 
            disabled={!cart.length} 
            onClick={handleWhatsAppCheckout}
          >
            Finalizar pedido por WhatsApp
          </button>
        </div>
      </div>
    </>
  );
}