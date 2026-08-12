import React, { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  DEFAULT_ADMIN_PASSWORD,
} from "../../utils/helpers";

export default function AdminLogin({
  onSuccess,
}) {
  const [password, setPassword] =
    useState("");

  const [show, setShow] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      password.trim() ===
      DEFAULT_ADMIN_PASSWORD
    ) {
      setError("");
      onSuccess();

      try {
        localStorage.setItem(
          "gamershop-admin-session",
          "true"
        );
      } catch {}
    } else {
      setError(
        "Contraseña incorrecta."
      );
    }
  };

  return (
    <div
      style={{
        maxWidth: 380,
        margin: "70px auto",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          background:
            "var(--bg-raised)",
          border:
            "1px solid var(--line)",
          borderRadius: 16,
          padding: 30,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background:
              "var(--bg-raised-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <Lock
            size={19}
            color="#7C3AED"
          />
        </div>

        <div
          className="gs-display"
          style={{
            fontWeight: 700,
            fontSize: 19,
          }}
        >
          Acceso administrador
        </div>

        <p
          style={{
            color:
              "var(--text-dim)",
            fontSize: 13.5,
            marginTop: 6,
            marginBottom: 20,
          }}
        >
          Esta sección solo es visible
          para el equipo de GamerShop.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            textAlign: "left",
          }}
        >
          <label className="gs-label">
            Contraseña
          </label>

          <div
            style={{
              position: "relative",
              marginBottom: 12,
            }}
          >
            <input
              className="gs-input"
              type={
                show
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(e) => {
                setPassword(
                  e.target.value
                );
                setError("");
              }}
              placeholder="••••••••"
              style={{
                paddingRight: 38,
              }}
              autoFocus
            />

            <button
              type="button"
              onClick={() =>
                setShow((s) => !s)
              }
              style={{
                position:
                  "absolute",
                right: 8,
                top: "50%",
                transform:
                  "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color:
                  "var(--text-dim)",
              }}
            >
              {show ? (
                <EyeOff size={15} />
              ) : (
                <Eye size={15} />
              )}
            </button>
          </div>

          {error && (
            <div
              style={{
                color: "#DC2626",
                fontSize: 12.5,
                marginBottom: 10,
              }}
            >
              {error}
            </div>
          )}

          <button
            className="gs-btn-primary"
            type="submit"
            style={{
              width: "100%",
            }}
            disabled={!password}
          >
            Entrar
          </button>
        </form>

        <p
          className="gs-mono"
          style={{
            color:
              "var(--text-dim)",
            fontSize: 11,
            marginTop: 16,
          }}
        >
          Contraseña inicial:
          {" "}
          {DEFAULT_ADMIN_PASSWORD}
          {" "}· cámbiala antes de
          publicar
        </p>
      </div>
    </div>
  );
}