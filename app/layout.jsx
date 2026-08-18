import "./globals.css";

export const metadata = {
  title: "NavaTech",
  description: "NavaTech — tecnología de confianza.",
  icons: {
    icon: "/images/favicon.png", // Coloca tu archivo favicon.png en la carpeta public/
  },
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
