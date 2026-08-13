export const CATEGORIES = [
  { id: "computadores", label: "Computadores", color: "#7C3AED" },
  { id: "componentes", label: "Componentes", color: "#0891B2" },
  { id: "perifericos", label: "Periféricos", color: "#DB2777" },
  { id: "mobiliario", label: "Sillas & Mesas", color: "#16A34A" },
  { id: "accesorios", label: "Accesorios", color: "#EA580C" },
];

export const SEED_PRODUCTS = [
  {
    id: "seed-1", name: "UltraSlim 14 Pro", category: "computadores", price: 4890000, stock: 6,
    description: "Portátil de 14” en chasís de aluminio, pensado para trabajo y creación en movimiento.",
    specs: [{ label: "CPU", value: "8 núcleos · 4.6GHz" }, { label: "RAM", value: "16GB LPDDR5" }, { label: "Panel", value: "2.8K 120Hz" }],
    image: null,
  },
  {
    id: "seed-2", name: "Monitor Arc 27 QHD", category: "componentes", price: 1290000, stock: 14,
    description: "Panel curvo QHD de 165Hz con calibración de fábrica para diseño y juego.",
    specs: [{ label: "Resolución", value: "2560×1440" }, { label: "Refresco", value: "165Hz" }, { label: "Panel", value: "IPS curvo" }],
    image: null,
  },
  {
    id: "seed-3", name: "SSD NVMe Ray 1TB", category: "componentes", price: 380000, stock: 40,
    description: "Almacenamiento NVMe Gen4 con disipador integrado para cargas exigentes.",
    specs: [{ label: "Capacidad", value: "1TB" }, { label: "Lectura", value: "7,000 MB/s" }, { label: "Interfaz", value: "PCIe 4.0" }],
    image: null,
  },
  {
    id: "seed-4", name: "Teclado Compact 65%", category: "perifericos", price: 340000, stock: 22,
    description: "Teclado mecánico hot-swap en formato compacto, switches táctiles silenciosos, retroiluminación RGB.",
    specs: [{ label: "Formato", value: "65%" }, { label: "Switches", value: "Hot-swap" }, { label: "Conexión", value: "USB-C / BT" }],
    image: null,
  },
  {
    id: "seed-5", name: "Mouse Orbit Ergo", category: "perifericos", price: 210000, stock: 30,
    description: "Mouse inalámbrico de bajo perfil, sensor de 26K DPI y hasta 70 días de batería.",
    specs: [{ label: "Sensor", value: "26,000 DPI" }, { label: "Batería", value: "70 días" }, { label: "Peso", value: "68g" }],
    image: null,
  },
  {
    id: "seed-6", name: "Silla Mesh Studio", category: "mobiliario", price: 1180000, stock: 9,
    description: "Silla ergonómica en malla transpirable con soporte lumbar ajustable en 4 puntos.",
    specs: [{ label: "Respaldo", value: "Malla técnica" }, { label: "Ajustes", value: "4 puntos" }, { label: "Carga máx.", value: "130kg" }],
    image: null,
  },
  {
    id: "seed-7", name: "Audífonos Cancel Pro", category: "accesorios", price: 620000, stock: 17,
    description: "Cancelación de ruido activa híbrida con 40h de autonomía y audio hi-res.",
    specs: [{ label: "ANC", value: "Híbrida" }, { label: "Batería", value: "40h" }, { label: "Códec", value: "LDAC" }],
    image: null,
  },
  {
    id: "seed-8", name: "Mini PC Core Node", category: "computadores", price: 2450000, stock: 11,
    description: "Mini PC de escritorio silenciosa, lista para oficina, código o edición ligera.",
    specs: [{ label: "CPU", value: "6 núcleos · 4.2GHz" }, { label: "RAM", value: "16GB" }, { label: "Almac.", value: "512GB NVMe" }],
    image: null,
  },
];
