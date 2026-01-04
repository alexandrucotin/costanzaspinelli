import { prisma } from "@/lib/prisma";

/**
 * Generate initial weekly check-ins for all active clients
 * Run this script once to populate check-ins for existing clients
 */
async function generateInitialCheckIns() {
  console.log("🔄 Generating initial check-ins for active clients...");

  // Get all active clients
  const activeClients = await prisma.client.findMany({
    where: {
      status: "active",
      isActivated: true,
    },
    select: {
      id: true,
      fullName: true,
    },
  });

  console.log(`📊 Found ${activeClients.length} active clients`);

  if (activeClients.length === 0) {
    console.log("✅ No active clients found. Nothing to do.");
    return;
  }

  // Calculate next Sunday at 20:00
  const now = new Date();
  const nextSunday = new Date(now);
  const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
  nextSunday.setDate(now.getDate() + daysUntilSunday);
  nextSunday.setHours(20, 0, 0, 0);

  console.log(
    `📅 Next check-in scheduled for: ${nextSunday.toLocaleString("it-IT")}`
  );

  // Create check-ins
  let created = 0;
  let skipped = 0;

  for (const client of activeClients) {
    // Check if check-in already exists
    const existing = await prisma.checkIn.findFirst({
      where: {
        clientId: client.id,
        scheduledAt: nextSunday,
        type: "weekly",
      },
    });

    if (existing) {
      console.log(`⏭️  Skipping ${client.fullName} - check-in already exists`);
      skipped++;
      continue;
    }

    // Create check-in
    await prisma.checkIn.create({
      data: {
        clientId: client.id,
        type: "weekly",
        status: "pending",
        scheduledAt: nextSunday,
      },
    });

    console.log(`✅ Created check-in for ${client.fullName}`);
    created++;
  }

  console.log("\n📊 Summary:");
  console.log(`   ✅ Created: ${created}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   📝 Total: ${activeClients.length}`);
  console.log("\n✨ Done!");
}

// Run the script
generateInitialCheckIns()
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
