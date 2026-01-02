"use server";

import { revalidatePath } from "next/cache";
import { Client, ClientSchema } from "@/lib/types-client";
import {
  getClients,
  saveClient,
  deleteClient,
  getClientById,
} from "@/lib/data-blobs";

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

    // Generate Clerk invitation - wrapped in try/catch to not block client creation
    let inviteUrl: string | null = null;
    let inviteError: string | null = "Invitation not attempted";

    try {
      const { createClientInvite } = await import("./clerk-invites");
      const inviteResult = await createClientInvite(
        validated.email,
        validated.fullName
      );

      if (inviteResult.success) {
        inviteUrl = inviteResult.inviteUrl as string;
        inviteError = null;

        // Store invitation ID in client metadata for tracking
        validated.privateNotes = validated.privateNotes
          ? `${validated.privateNotes}\n\nClerk Invitation ID: ${inviteResult.invitationId}\nInvite URL: ${inviteResult.inviteUrl}`
          : `Clerk Invitation ID: ${inviteResult.invitationId}\nInvite URL: ${inviteResult.inviteUrl}`;
        await saveClient(validated);
      } else {
        inviteError = inviteResult.error || "Unknown error";
      }
    } catch (inviteErr) {
      console.error("Error creating Clerk invitation:", inviteErr);
      // Continue anyway - client is created, just invitation failed
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

  // Try to delete user from Clerk if they exist
  try {
    const { clerkClient } = await import("@clerk/nextjs/server");
    const clerk = await clerkClient();

    // Find user by email
    const users = await clerk.users.getUserList({
      emailAddress: [client.email],
    });

    if (users.data.length > 0) {
      // Delete the user from Clerk
      await clerk.users.deleteUser(users.data[0].id);
    }
  } catch (error) {
    console.error("Error deleting user from Clerk:", error);
    // Continue with client deletion even if Clerk deletion fails
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
