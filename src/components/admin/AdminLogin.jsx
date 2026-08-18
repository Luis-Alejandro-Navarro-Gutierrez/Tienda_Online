"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, Mail, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function AdminLogin({ onSuccess = () => {} }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError("Credenciales incorrectas o usuario no autorizado.");
        return;
      }

      if (data?.session) {
        // OPCIONAL: Validar rol en metadatos o tabla 'profiles'
        const userRole = data.session.user?.user_metadata?.role;
        
        // Si manejas roles en app_metadata o user_metadata:
        if (userRole && userRole !== "admin") {
          await supabase.auth.signOut();
          setError("No tienes permisos suficientes para acceder como administrador.");
          return;
        }

        onSuccess(data.session);
      }
    } catch (err) {
      setError("Ocurrió un error inesperado al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 380, margin: "70px auto", padding: "0 20px" }}>
      <div className="gs-panel" style={{ textAlign: "center" }}>
        <div 
          style={{ 
            width: 44, 
            height: 44, 
            borderRadius: 12, 
            background: "var(--bg-raised-2)", 
            display: "grid", 
            placeItems: "center", 
            margin: "0 auto 16px" 
          }}
        >
          <Lock size={19} color="var(--purple)" />
        </div>

        <div className="gs-display" style={{ fontWeight: 700, fontSize: 19 }}>
          Acceso administrador
        </div>
        <p className="gs-muted" style={{ fontSize: 13.5, marginTop: 6, marginBottom: 20 }}>
          Esta sección solo es visible para el equipo de NavaTech.
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          <label className="gs-label" htmlFor="admin-email">Correo electrónico</label>
          <div style={{ position: "relative", marginBottom: 12 }}>
            <input
              id="admin-email"
              className="gs-input"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="email@navatech.com"
              style={{ paddingRight: 38 }}
              required
              autoFocus
            />
            <div 
              style={{ 
                position: "absolute", 
                right: 10, 
                top: "50%", 
                transform: "translateY(-50%)", 
                color: "var(--muted)", 
                pointerEvents: "none" 
              }}
            >
              <Mail size={15} />
            </div>
          </div>

          <label className="gs-label" htmlFor="admin-password">Contraseña</label>
          <div style={{ position: "relative", marginBottom: 12 }}>
            <input
              id="admin-password"
              className="gs-input"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="••••••••"
              style={{ paddingRight: 38 }}
              required
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
              style={{ 
                position: "absolute", 
                right: 8, 
                top: "50%", 
                transform: "translateY(-50%)", 
                background: "none", 
                border: "none", 
                cursor: "pointer", 
                color: "var(--muted)" 
              }}
            >
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {error && (
            <div style={{ color: "var(--danger)", fontSize: 12.5, marginBottom: 10 }}>
              {error}
            </div>
          )}

          <button
            className="gs-btn-primary"
            type="submit"
            style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}
            disabled={!email.trim() || !password || loading}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}