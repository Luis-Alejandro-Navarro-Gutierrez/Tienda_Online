import { Package } from "lucide-react";
import { catInfo, fmt } from "../utils/helpers";

export default function ProductCard({ product, onOpen }) {
  const cat = catInfo(product.category);

  return (
    <article className="gs-card" onClick={() => onOpen(product)}>
      <div className="gs-imgwrap">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="gs-ph"><Package size={34} color="var(--muted)" /></div>
        )}

        {/* Etiqueta con fondo blanco sólido y borde/texto neón para evitar transparencias */}
        <span 
          className="gs-tag gs-tag-topleft" 
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
          <span className="gs-tag gs-tag-topright gs-tag-low" style={{ background: "#ffffff", zIndex: 2 }}>
            Últimas {product.stock}
          </span>
        )}
        {product.stock === 0 && (
          <span className="gs-tag gs-tag-topright gs-tag-out" style={{ background: "#ffffff", zIndex: 2 }}>
            Agotado
          </span>
        )}
      </div>

      <div className="gs-card-info">
        <div className="gs-card-name">{product.name}</div>

        {product.specs?.[0] && (
          <div className="gs-mono gs-card-spec">{product.specs[0].label}: {product.specs[0].value}</div>
        )}

        <div className="gs-card-price">{fmt(product.price)}</div>

        <div className="gs-stock-row">
          <span className="gs-stock">{product.stock} en stock</span>
          <span className="gs-stock-code gs-mono">ID {String(product.id).slice(-4)}</span>
        </div>
      </div>
    </article>
  );
}