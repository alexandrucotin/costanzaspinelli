/**
 * Script to create initial admin user
 * Run with: npx tsx scripts/create-admin.ts
 */

import { config } from "dotenv";

// Load environment variables BEFORE importing prisma
config({ path: ".env.local" });
config({ path: ".env" });

import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth-admin";

async function createAdmin() {
  console.log("🔐 Creating admin user...\n");

  const email = "admin@costanzaspinelli.com";
  const password = "Admin123!"; // Change this in production!
  const name = "Costanza Spinelli";

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.name}`);
      console.log(
        "\nTo reset password, delete the admin and run this script again."
      );
      return;
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        email,
        passwordHash,
        name,
        role: "super_admin",
        isActive: true,
      },
    });

    console.log("✅ Admin user created successfully!\n");
    console.log("📧 Email:", admin.email);
    console.log("🔑 Password:", password);
    console.log("👤 Name:", admin.name);
    console.log("🎭 Role:", admin.role);
    console.log("\n⚠️  IMPORTANT: Change the password after first login!");
    console.log("🔗 Login at: http://localhost:3000/admin/login");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
