import { getClientSession } from "@/lib/auth-client";
import { getClients } from "@/lib/db-adapter";
import { ClientNavbar } from "@/components/client/client-navbar";
import { redirect } from "next/navigation";

export default async function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication
  const session = await getClientSession();

  // If no session and not on login page, middleware will handle redirect
  if (!session) {
    return <>{children}</>;
  }

  // Get client info for navbar
  const clients = await getClients();
  const client = clients.find((c) => c.id === session.clientId);

  if (!client) {
    redirect("/cliente/login");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <ClientNavbar clientName={client.fullName} />
      <main>{children}</main>
    </div>
  );
}
