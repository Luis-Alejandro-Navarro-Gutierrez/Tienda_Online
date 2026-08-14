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
      <section className="gs-hero">
        <div className="gs-container" style={{ position: "relative", width: "min(1400px, calc(100% - 48px))" }}>
          
          {/* Contenido Principal */}
          <div className="gs-hero-content">
            <div className="gs-kicker">CATÁLOGO EN VIVO · MEDELLÍN</div>
            
            <h1>
              Tecnología <em>pensada</em>
              <br />para cómo trabajas,
              <br />juegas y creas.
            </h1>
            
            <p>
              Selección curada de equipos y accesorios, con specs reales y stock verificado — sin relleno, sin ruido.
            </p>

            {/* Acciones principales */}
            <div className="gs-hero-buttons">
              <button className="gs-btn-primary gs-row" onClick={onViewProducts}>
                <span>Ver productos</span>
                <ChevronRight size={16} />
              </button>

              <button className="gs-btn-ghost gs-row" onClick={onOpenSupport}>
                <Headphones size={16} color="var(--purple)" />
                <span>Soporte Técnico</span>
              </button>
            </div>
          </div>

          {/* Imagen de Apoyo */}
          <div className="gs-hero-art" aria-hidden="true">
            <img src="/images/gamer-setup.png" alt="Gamer Setup" />
          </div>

        </div>
      </section>

      {/* Barra de Beneficios */}
      <div className="gs-container" style={{ marginTop: "-1px" }}>
        <div className="gs-benefits">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <div className="gs-benefit" key={title}>
              <Icon className="gs-benefit-icon" size={26} />
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