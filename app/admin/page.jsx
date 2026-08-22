import App from "../../src/App";
import { supabase } from "../../src/lib/supabase";

export const revalidate = 60;

export default async function AdminPage() {
  const { data } = await supabase.from("products").select("*");
  return <App initialProducts={data || []} initialView="admin" />;
}
