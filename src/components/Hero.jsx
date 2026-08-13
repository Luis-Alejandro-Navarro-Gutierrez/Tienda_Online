import { Package, Lock, Pencil, ShoppingCart } from "lucide-react";

const BENEFITS = [
  { icon: Package, title: "Envíos en 24H", text: "Medellín y área metropolitana" },
  { icon: Lock, title: "Garantía oficial", text: "Productos con garantía local" },
  { icon: Pencil, title: "Soporte real", text: "Te ayudamos a elegir" },
  { icon: ShoppingCart, title: "Pagos seguros", text: "Tarjeta, PSE y contraentrega" },
];

export default function Hero({ onViewProducts }) {
  return (
    <>
      <section className="gs-hero">
        <div className="gs-container" style={{ position: "relative", width: "min(1400px,calc(100% - 48px))" }}>
          <div className="gs-hero-content">
            <div className="gs-kicker">CATÁLOGO EN VIVO · MEDELLÍN</div>
            <h1>
              Tecnología <em>pensada</em>
              <br />para cómo trabajas,
              <br />juegas y creas.
            </h1>
            <p>Selección curada de equipos y accesorios, con specs reales y stock verificado — sin relleno, sin ruido.</p>
            <div className="gs-hero-buttons">
              <button className="gs-btn-primary" onClick={onViewProducts} style={{ padding: "12px 20px" }}>
                Ver productos <span style={{ marginLeft: 10 }}>›</span>
              </button>
              <button className="gs-btn-ghost" onClick={onViewProducts} style={{ padding: "12px 20px", color: "#0891B2", borderColor: "#A5E4EF" }}>
                Ofertas especiales <span style={{ marginLeft: 10 }}>♨</span>
              </button>
            </div>
          </div>

          <div className="gs-hero-art" aria-hidden="true">
            <img src="/images/gamer-setup.png" alt="" />
          </div>
        </div>
      </section>

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
