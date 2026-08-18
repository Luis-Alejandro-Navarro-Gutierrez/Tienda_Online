import { Package } from "lucide-react";
import { catInfo, fmt } from "../utils/helpers";

export default function ProductCard({ product, onOpen }) {
  const cat = catInfo(product.category);

  return (
    <article className="nt-card" onClick={() => onOpen(product)}>
      <div className="nt-imgwrap">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="nt-ph"><Package size={34} color="var(--muted)" /></div>
        )}

        {/* Etiqueta con fondo blanco sólido y borde/texto neón para evitar transparencias */}
        <span 
          className="nt-tag nt-tag-topleft" 
          style={{ 
            background: "#ffffff", 
            color: cat.color, 
            border: `1px solid ${cat.color}`, 
            zIndex: 2 
          }}
        >
          {cat.label}
        </span>

        {product.stock <= 3 && product.stock > 0 && (
          <span className="nt-tag nt-tag-topright nt-tag-low" style={{ background: "#ffffff", zIndex: 2 }}>
            Últimas {product.stock}
          </span>
        )}
        {product.stock === 0 && (
          <span className="nt-tag nt-tag-topright nt-tag-out" style={{ background: "#ffffff", zIndex: 2 }}>
            Agotado
          </span>
        )}
      </div>

      <div className="nt-card-info">
        <div className="nt-card-name">{product.name}</div>

        {product.specs?.[0] && (
          <div className="nt-mono nt-card-spec">{product.specs[0].label}: {product.specs[0].value}</div>
        )}

        <div className="nt-card-price">{fmt(product.price)}</div>

        <div className="nt-stock-row">
          <span className="nt-stock">{product.stock} en stock</span>
          <span className="nt-stock-code nt-mono">ID {String(product.id).slice(-4)}</span>
        </div>
      </div>
    </article>
  );
}