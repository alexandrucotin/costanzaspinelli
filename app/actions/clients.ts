"use server";

import { revalidatePath } from "next/cache";
import { Client, ClientSchema } from "@/lib/types-client";
import {
  getClients,
  getClientById,
  saveClient,
  deleteClient,
} from "@/lib/db-adapter";

export async function getClientsAction() {
  return await getClients();
}

export async function getClientByIdAction(id: string) {
  return await getClientById(id);
}

export async function createClientAction(
  data: Omit<Client, "id" | "createdAt" | "updatedAt">
) {
  try {
    // Check if email already exists
    const existingClients = await getClients();
    const emailExists = existingClients.some(
      (c) => c.email.toLowerCase() === data.email.toLowerCase()
    );

    if (emailExists) {
      throw new Error(
        `Un cliente con l'email ${data.email} esiste già nel sistema`
      );
    }

    const client: Client = {
      ...data,
      id: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      firstAssessmentDate: data.firstAssessmentDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const validated = ClientSchema.parse(client);
    await saveClient(validated);
    revalidatePath("/admin/clienti");

    // Generate custom invitation token
    let inviteUrl: string | null = null;
    let inviteError: string | null = null;

    try {
      const { generateInvitationToken, generateInvitationUrl } = await import(
        "@/lib/client-invitations"
      );
      const { getSession } = await import("@/lib/auth-admin");

      // Get current admin session
      const session = await getSession();
      const createdBy = session?.email || "admin";

      // Generate invitation token
      const { token } = await generateInvitationToken(
        validated.email,
        validated.id,
        createdBy
      );

      // Generate invitation URL
      inviteUrl = generateInvitationUrl(token);
    } catch (inviteErr) {
      console.error("Error creating invitation:", inviteErr);
      inviteError =
        inviteErr instanceof Error
          ? inviteErr.message
          : "Failed to create invitation";
    }

    return {
      client: validated,
      inviteUrl,
      inviteError,
    };
  } catch (error) {
    console.error("Error creating client:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create client"
    );
  }
}

export async function updateClientAction(id: string, data: Partial<Client>) {
  const existing = await getClientById(id);

  if (!existing) {
    throw new Error("Cliente non trovato");
  }

  const updated: Client = {
    ...existing,
    ...data,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  const validated = ClientSchema.parse(updated);
  await saveClient(validated);
  revalidatePath("/admin/clienti");
  revalidatePath(`/admin/clienti/${id}`);
  return validated;
}

export async function deleteClientAction(id: string) {
  const client = await getClientById(id);

  if (!client) {
    throw new Error("Cliente non trovato");
  }

  // Delete client from database
  await deleteClient(id);
  revalidatePath("/admin/clienti");
  revalidatePath("/admin/clienti/" + id);
}

export async function deleteOwnAccountAction(email: string) {
  // Find client by email
  const clients = await getClients();
  const client = clients.find((c) => c.email === email);

  if (!client) {
    throw new Error("Cliente non trovato");
  }

  // Delete using the main delete action
  await deleteClientAction(client.id);

  return { success: true };
}

export async function addMeasurementAction(
  clientId: string,
  measurement: Omit<Client["measurements"][0], "id">
) {
  const client = await getClientById(clientId);

  if (!client) {
    throw new Error("Cliente non trovato");
  }

  const newMeasurement = {
    ...measurement,
    id: `measurement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };

  const updated: Client = {
    ...client,
    measurements: [...client.measurements, newMeasurement],
    lastAssessmentDate: newMeasurement.date,
    updatedAt: new Date().toISOString(),
  };

  await saveClient(updated);
  revalidatePath(`/admin/clienti/${clientId}`);
  return updated;
}

export async function assignPlanToClientAction(
  clientId: string,
  planId: string
) {
  const client = await getClientById(clientId);

  if (!client) {
    throw new Error("Cliente non trovato");
  }

  if (client.assignedPlanIds.includes(planId)) {
    return client; // Already assigned
  }

  const updated: Client = {
    ...client,
    assignedPlanIds: [...client.assignedPlanIds, planId],
    updatedAt: new Date().toISOString(),
  };

  await saveClient(updated);
  revalidatePath(`/admin/clienti/${clientId}`);
  revalidatePath(`/admin/schede/${planId}`);
  return updated;
}

export async function getClientInvitationAction(clientId: string) {
  const { getInvitationByClientId } = await import("@/lib/client-invitations");
  return await getInvitationByClientId(clientId);
}

export async function regenerateClientInvitationAction(clientId: string) {
  const client = await getClientById(clientId);

  if (!client) {
    throw new Error("Cliente non trovato");
  }

  if (client.auth?.isActivated) {
    throw new Error("Cliente già attivato, impossibile rigenerare l'invito");
  }

  try {
    const {
      invalidateClientInvitations,
      generateInvitationToken,
      generateInvitationUrl,
    } = await import("@/lib/client-invitations");
    const { getSession } = await import("@/lib/auth-admin");

    // Invalidate existing invitations
    await invalidateClientInvitations(clientId);

    // Get current admin session
    const session = await getSession();
    const createdBy = session?.email || "admin";

    // Generate new invitation token
    const { token } = await generateInvitationToken(
      client.email,
      clientId,
      createdBy
    );

    // Generate invitation URL
    const inviteUrl = generateInvitationUrl(token);

    revalidatePath(`/admin/clienti/${clientId}`);

    return {
      success: true,
      inviteUrl,
    };
  } catch (error) {
    console.error("Error regenerating invitation:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to regenerate invitation"
    );
  }
}
