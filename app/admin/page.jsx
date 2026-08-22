import App from "../../src/App";
import { supabase } from "../../src/lib/supabase";

// El panel de admin NUNCA debe mostrar datos en caché — siempre tiene que
// reflejar el estado real y actual de la base de datos, sin importar cuándo
// fue la última vez que alguien visitó esta página.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { data } = await supabase.from("products").select("*");
  return <App initialProducts={data || []} initialView="admin" />;
}
