import AdminDashboard from "@/components/admin/AdminDashboard";
import { readStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const store = await readStore();
  return <AdminDashboard initial={store} />;
}
