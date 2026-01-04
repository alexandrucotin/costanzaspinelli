import { config } from "dotenv";
config();

import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth-admin";

async function resetAdminPassword() {
  console.log("🔐 Resetting admin password...\n");

  const email = "admin@costanzaspinelli.com";
  const newPassword = "Admin123!";

  try {
    // Check if admin exists
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      console.log("❌ Admin user not found!");
      console.log(`   Email: ${email}`);
      process.exit(1);
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password
    await prisma.admin.update({
      where: { email },
      data: { passwordHash },
    });

    console.log("✅ Admin password reset successfully!");
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 New Password: ${newPassword}`);
    console.log("\n⚠️  IMPORTANT: Change this password after first login!");
  } catch (error) {
    console.error("❌ Error resetting password:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
