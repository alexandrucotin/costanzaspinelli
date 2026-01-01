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
  return validated;
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
  await deleteClient(id);
  revalidatePath("/admin/clienti");
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
