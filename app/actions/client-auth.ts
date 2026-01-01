"use server";

import { revalidatePath } from "next/cache";
import {
  hashPassword,
  verifyPassword,
  getClientByActivationToken,
  getClientByEmail,
  createClientSession,
  deleteClientSession,
} from "@/lib/auth-client";
import { updateClientAction } from "./clients";

export async function activateClientAccountAction(
  token: string,
  password: string
) {
  // Validate password
  if (password.length < 8) {
    throw new Error("La password deve essere di almeno 8 caratteri");
  }

  // Find client by token
  const client = await getClientByActivationToken(token);

  if (!client) {
    throw new Error("Token non valido o scaduto");
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Update client
  await updateClientAction(client.id, {
    auth: {
      ...client.auth,
      passwordHash,
      isActivated: true,
      activationToken: undefined,
      activationTokenExpiry: undefined,
    },
  });

  // Create session
  await createClientSession(client);

  revalidatePath("/cliente/dashboard");

  return { success: true };
}

export async function loginClientAction(email: string, password: string) {
  // Find client by email
  const client = await getClientByEmail(email);

  if (!client) {
    throw new Error("Email o password non corretti");
  }

  // Check if account is activated
  if (!client.auth?.isActivated || !client.auth.passwordHash) {
    throw new Error("Account non ancora attivato");
  }

  // Verify password
  const isValid = await verifyPassword(password, client.auth.passwordHash);

  if (!isValid) {
    throw new Error("Email o password non corretti");
  }

  // Update last login
  await updateClientAction(client.id, {
    auth: {
      ...client.auth,
      lastLogin: new Date().toISOString(),
    },
  });

  // Create session
  await createClientSession(client);

  revalidatePath("/cliente/dashboard");

  return { success: true };
}

export async function logoutClientAction() {
  await deleteClientSession();
  revalidatePath("/cliente/login");
  return { success: true };
}
