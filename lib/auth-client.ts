import { cookies } from "next/headers";
import { Client } from "./types-client";
import { getClients } from "./data-blobs";
import bcrypt from "bcryptjs";

const SESSION_COOKIE_NAME = "client_session";

export interface ClientSession {
  clientId: string;
  email: string;
  fullName: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Get client by activation token
export async function getClientByActivationToken(
  token: string
): Promise<Client | null> {
  const clients = await getClients();
  const client = clients.find(
    (c) =>
      c.auth?.activationToken === token &&
      !c.auth.isActivated &&
      c.auth.activationTokenExpiry &&
      new Date(c.auth.activationTokenExpiry) > new Date()
  );
  return client || null;
}

// Get client by email
export async function getClientByEmail(email: string): Promise<Client | null> {
  const clients = await getClients();
  return clients.find((c) => c.email === email) || null;
}

// Create session
export async function createClientSession(client: Client) {
  const session: ClientSession = {
    clientId: client.id,
    email: client.email,
    fullName: client.fullName,
  };

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
}

// Get current session
export async function getClientSession(): Promise<ClientSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return null;
    }

    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

// Delete session
export async function deleteClientSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Verify client is authenticated
export async function requireClientAuth(): Promise<ClientSession> {
  const session = await getClientSession();

  if (!session) {
    throw new Error("Non autenticato");
  }

  return session;
}
