import DashboardPage from "@/components/dashboard/board";
import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function BoardPage() {
  const user = await verifySession();

  if (!user || !user.isAuth) {
    redirect("/status");
  }

  return <DashboardPage />;
}
