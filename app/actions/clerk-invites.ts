"use server";

import { clerkClient } from "@clerk/nextjs/server";

// Get organization ID from environment or use the slug to find it
const ORGANIZATION_SLUG = "costanza-spinelli-pt-1767303233";

async function getOrganizationId() {
  const orgId = process.env.CLERK_ORGANIZATION_ID;
  if (orgId) return orgId;

  // If no ID in env, try to find by slug
  try {
    const client = await clerkClient();
    const orgs = await client.organizations.getOrganizationList();
    const org = orgs.data.find((o) => o.slug === ORGANIZATION_SLUG);
    return org?.id;
  } catch (error) {
    console.error("Error finding organization:", error);
    throw new Error(
      "Organization not found. Please set CLERK_ORGANIZATION_ID in .env"
    );
  }
}

export async function createClientInvite(email: string, clientName: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      throw new Error("Organization ID not found");
    }

    const client = await clerkClient();

    // Create organization invitation
    const invitation = await client.organizations.createOrganizationInvitation({
      organizationId: organizationId,
      emailAddress: email,
      role: "org:member", // Client role
      publicMetadata: {
        clientName: clientName,
        isClient: true,
      },
    });

    // Generate the invitation URL
    const inviteUrl =
      invitation.publicMetadata?.invite_url ||
      `${process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}?__clerk_ticket=${invitation.id}`;

    return {
      success: true,
      invitationId: invitation.id,
      inviteUrl: inviteUrl,
    };
  } catch (error) {
    console.error("Error creating Clerk invitation:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create invitation",
    };
  }
}

export async function revokeClientInvite(invitationId: string) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      throw new Error("Organization ID not found");
    }

    const client = await clerkClient();

    await client.organizations.revokeOrganizationInvitation({
      organizationId: organizationId,
      invitationId: invitationId,
    });

    return { success: true };
  } catch (error) {
    console.error("Error revoking invitation:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to revoke invitation",
    };
  }
}

export async function getOrganizationInvitations() {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      throw new Error("Organization ID not found");
    }

    const client = await clerkClient();

    const invitations =
      await client.organizations.getOrganizationInvitationList({
        organizationId: organizationId,
      });

    return {
      success: true,
      invitations: invitations.data,
    };
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch invitations",
    };
  }
}
