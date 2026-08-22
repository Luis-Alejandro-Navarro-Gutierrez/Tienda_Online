import { Package, Lock, Pencil, ShoppingCart, Headphones, ChevronRight } from "lucide-react";

const BENEFITS = [
  { icon: Package, title: "Envíos en 24H", text: "Medellín y área metropolitana" },
  { icon: Lock, title: "Garantía oficial", text: "Productos con garantía local" },
  { icon: Pencil, title: "Soporte real", text: "Te ayudamos a elegir y reparar tus equipos" },
  { icon: ShoppingCart, title: "Pagos seguros", text: "Contraentrega" },
];

export default function Hero({ onViewProducts, onOpenSupport }) {
  return (
    <>
      <section className="nt-hero">
        <div className="nt-container" style={{ position: "relative", width: "min(1400px, calc(100% - 48px))" }}>
          
          {/* Contenido Principal */}
          <div className="nt-hero-content">
            <div className="nt-kicker">CATÁLOGO EN VIVO · MEDELLÍN</div>
            
            <h1>
              Tecnología de 
              <br /><em>confianza</em>
            </h1>
            
            <p>
              Equipos y accesorios, con specs reales y stock verificado
              <br />sin relleno, sin ruido.
            </p>

            {/* Acciones principales */}
            <div className="nt-hero-buttons">
              <button className="nt-btn-primary nt-row" onClick={onViewProducts}>
                <span>Ver productos</span>
                <ChevronRight size={16} />
              </button>

              <button className="nt-btn-ghost nt-row" onClick={onOpenSupport}>
                <Headphones size={16} color="var(--purple)" />
                <span>Soporte Técnico</span>
              </button>
            </div>
          </div>

          {/* Imagen de Apoyo */}
          <div className="nt-hero-art" aria-hidden="true">
            <img src="/images/gamer-setup.png" alt="Tech Setup" />
          </div>

        </div>
      </section>

      {/* Barra de Beneficios */}
      <div className="nt-container" style={{ marginTop: "-1px", paddingTop: 38 }}>
        <div className="nt-benefits">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <div className="nt-benefit" key={title}>
              <Icon className="nt-benefit-icon" size={26} />
              <div>
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}