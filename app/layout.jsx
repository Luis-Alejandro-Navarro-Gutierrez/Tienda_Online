import "./globals.css";

export const metadata = {
  title: "GamerShop",
  description: "GamerShop — tienda gamer de tecnología y accesorios.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F5F5FB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
