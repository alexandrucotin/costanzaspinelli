import { redirect } from "next/navigation";
import { getClientSession } from "@/lib/auth-client";
import { getClientById } from "@/lib/data-blobs";
import { ClientProfile } from "@/components/client/client-profile";

export const dynamic = "force-dynamic";

export default async function ClientProfilePage() {
  const session = await getClientSession();

  if (!session) {
    redirect("/cliente/login");
  }

  const client = await getClientById(session.clientId);

  if (!client) {
    redirect("/cliente/login");
  }

  return <ClientProfile client={client} />;
}
