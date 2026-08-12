# GamerShop

Proyecto React + Next.js (App Router). Migrado desde Vite.

## Arrancar

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Build

```bash
npm run build
npm run start
```

## Admin

Contraseña de demo: `gamershop2026`

Los productos, carrito y sesión administrativa usan `localStorage`
(por eso toda la app corre como componente cliente, `"use client"`,
igual que en la versión original de Vite).

## Estructura

- `app/layout.jsx` — layout raíz de Next.js, importa `globals.css`.
- `app/page.jsx` — página principal, renderiza `<App />`.
- `src/App.jsx` — lógica principal de la app (antes en Vite `src/App.jsx`).
- `src/components/` — componentes de UI (tienda + panel admin).
- `src/hooks/useProducts.js` — hook de persistencia de productos.
- `src/data/products.js` — catálogo semilla y categorías.
- `src/utils/helpers.js` — formateo de precios, info de categoría, password demo.
- `public/images/` — activos estáticos (igual que en Vite, misma ruta `/images/...`).

## Notas de la migración

- Se reemplazó `vite.config.js` + `index.html` por el App Router de Next.js.
- El único punto de entrada de cliente es `src/App.jsx` (`"use client"`);
  todos los componentes que importa heredan ese límite automáticamente,
  así que no hace falta repetir la directiva en cada archivo.
- `styles.css` se renombró a `app/globals.css` y ahora se importa una sola
  vez en `app/layout.jsx` (regla de Next.js para CSS global).
- Las rutas de imágenes (`/images/...`) no cambiaron: `public/` en Next.js
  se sirve igual que en Vite.
