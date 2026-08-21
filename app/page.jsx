import App from "../src/App";
import { supabase } from "../src/lib/supabase";

// Revalida el catálogo cada 60s en el servidor (ISR), en vez de pedirlo
// desde el navegador cada vez que alguien entra.
export const revalidate = 60;

export default async function Page() {
  const { data } = await supabase.from("products").select("*");
  return <App initialProducts={data || []} />;
}
