import { CATEGORIES } from "../data/products";

export const fmt = (n) => "$" + Number(n || 0).toLocaleString("es-CO");
export const catInfo = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];