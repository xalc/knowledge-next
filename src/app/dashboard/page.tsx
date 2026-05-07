import DashboardPage from "@/components/dashboard/board";
import { verifySession } from "@/lib/dal";
import { isMcpEnabled } from "@/lib/site-config";
import { redirect } from "next/navigation";

export default async function BoardPage() {
  const user = await verifySession();
  const mcpEnabled = await isMcpEnabled();

  if (!user || !user.isAuth) {
    redirect("/utils/status");
  }

  return <DashboardPage mcpEnabled={mcpEnabled} />;
}
