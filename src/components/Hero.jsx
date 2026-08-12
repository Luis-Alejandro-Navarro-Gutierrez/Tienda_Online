import React from "react";
import {
  Package,
  Lock,
  Pencil,
  ShoppingCart,
} from "lucide-react";

export default function Hero({ onViewProducts }) {
  return (
    <>
      <section className="gs-hero">

        <div
          className="gs-container"
          style={{
            position: "relative",
            width: "min(1400px,calc(100% - 48px))",
          }}
        >

          <div className="gs-hero-content">

            <div className="gs-kicker">
              CATÁLOGO EN VIVO · MEDELLÍN
            </div>

            <h1>
              Tecnología <em>pensada</em>
              <br />
              para cómo trabajas,
              <br />
              juegas y creas.
            </h1>

            <p>
              Selección curada de equipos y
              accesorios, con specs reales y
              stock verificado — sin relleno,
              sin ruido.
            </p>

            <div className="gs-hero-buttons">

              <button
                className="gs-btn-primary"
                onClick={onViewProducts}
                style={{
                  padding: "12px 20px",
                }}
              >
                Ver productos
                <span style={{ marginLeft: 10 }}>
                  ›
                </span>
              </button>

              <button
                className="gs-btn-ghost"
                onClick={onViewProducts}
                style={{
                  padding: "12px 20px",
                  color: "#22D3EE",
                  borderColor: "#155E75",
                }}
              >
                Ofertas especiales
                <span style={{ marginLeft: 10 }}>
                  ♨
                </span>
              </button>

            </div>
          </div>

          <div
            className="gs-hero-art"
            aria-hidden="true"
          >
            <img
              src="/images/gamer-setup.png"
              alt=""
            />
          </div>

        </div>
      </section>

      <div
        className="gs-container"
        style={{ marginTop: "-1px" }}
      >
        <div className="gs-benefits">

          <div className="gs-benefit">
            <Package
              className="gs-benefit-icon"
              size={26}
            />

            <div>
              <strong>Envíos en 24H</strong>
              <span>
                Medellín y área metropolitana
              </span>
            </div>
          </div>

          <div className="gs-benefit">
            <Lock
              className="gs-benefit-icon"
              size={26}
            />

            <div>
              <strong>Garantía oficial</strong>
              <span>
                Productos con garantía local
              </span>
            </div>
          </div>

          <div className="gs-benefit">
            <Pencil
              className="gs-benefit-icon"
              size={26}
            />

            <div>
              <strong>Soporte real</strong>
              <span>
                Te ayudamos a elegir
              </span>
            </div>
          </div>

          <div className="gs-benefit">
            <ShoppingCart
              className="gs-benefit-icon"
              size={26}
            />

            <div>
              <strong>Pagos seguros</strong>
              <span>
                Tarjeta, PSE y contraentrega
              </span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}