import { prisma } from "@/lib/prisma";

const habitTemplates = [
  // Hydration
  {
    name: "Bere 2L di acqua",
    description:
      "Mantieni una corretta idratazione bevendo almeno 2 litri d'acqua al giorno",
    type: "number",
    category: "hydration",
    frequency: "daily",
    target: { value: 2, unit: "litri" },
    icon: "💧",
    color: "#3b82f6",
  },
  {
    name: "Acqua al risveglio",
    description: "Bevi un bicchiere d'acqua appena sveglio",
    type: "checkbox",
    category: "hydration",
    frequency: "daily",
    icon: "💧",
    color: "#3b82f6",
  },

  // Sleep
  {
    name: "Dormire 7-8 ore",
    description: "Dormi almeno 7-8 ore per un recupero ottimale",
    type: "number",
    category: "sleep",
    frequency: "daily",
    target: { min: 7, max: 8, unit: "ore" },
    icon: "😴",
    color: "#8b5cf6",
  },
  {
    name: "A letto prima delle 23:00",
    description:
      "Vai a letto entro le 23:00 per migliorare la qualità del sonno",
    type: "checkbox",
    category: "sleep",
    frequency: "daily",
    icon: "🌙",
    color: "#8b5cf6",
  },
  {
    name: "Qualità del sonno",
    description: "Valuta la qualità del tuo sonno da 1 (pessima) a 10 (ottima)",
    type: "scale",
    category: "sleep",
    frequency: "daily",
    target: { min: 1, max: 10 },
    icon: "⭐",
    color: "#8b5cf6",
  },

  // Nutrition
  {
    name: "Seguire piano alimentare",
    description: "Segui il piano alimentare fornito dal coach",
    type: "checkbox",
    category: "nutrition",
    frequency: "daily",
    icon: "🥗",
    color: "#10b981",
  },
  {
    name: "Meal prep settimanale",
    description: "Prepara i pasti per la settimana",
    type: "checkbox",
    category: "nutrition",
    frequency: "weekly",
    icon: "🍱",
    color: "#10b981",
  },
  {
    name: "Evitare snack serali",
    description: "Non mangiare snack dopo cena",
    type: "checkbox",
    category: "nutrition",
    frequency: "daily",
    icon: "🚫",
    color: "#10b981",
  },
  {
    name: "5 porzioni frutta/verdura",
    description: "Consuma almeno 5 porzioni di frutta e verdura",
    type: "number",
    category: "nutrition",
    frequency: "daily",
    target: { value: 5, unit: "porzioni" },
    icon: "🍎",
    color: "#10b981",
  },

  // Recovery
  {
    name: "Stretching post-workout",
    description: "Fai stretching dopo ogni allenamento",
    type: "checkbox",
    category: "recovery",
    frequency: "daily",
    icon: "🧘",
    color: "#f59e0b",
  },
  {
    name: "Foam rolling",
    description: "Usa il foam roller per il recupero muscolare",
    type: "checkbox",
    category: "recovery",
    frequency: "daily",
    icon: "🎯",
    color: "#f59e0b",
  },
  {
    name: "Giorno di riposo",
    description: "Prendi un giorno di riposo attivo",
    type: "checkbox",
    category: "recovery",
    frequency: "weekly",
    icon: "🛋️",
    color: "#f59e0b",
  },

  // Movement
  {
    name: "10.000 passi al giorno",
    description: "Raggiungi l'obiettivo di 10.000 passi giornalieri",
    type: "number",
    category: "movement",
    frequency: "daily",
    target: { value: 10000, unit: "passi" },
    icon: "🚶",
    color: "#ef4444",
  },
  {
    name: "Scale invece dell'ascensore",
    description: "Usa le scale quando possibile",
    type: "checkbox",
    category: "movement",
    frequency: "daily",
    icon: "🪜",
    color: "#ef4444",
  },

  // Mindset
  {
    name: "Meditazione 10 minuti",
    description: "Pratica meditazione o mindfulness per 10 minuti",
    type: "checkbox",
    category: "mindset",
    frequency: "daily",
    icon: "🧘‍♀️",
    color: "#ec4899",
  },
  {
    name: "Journaling",
    description: "Scrivi nel tuo diario personale",
    type: "checkbox",
    category: "mindset",
    frequency: "daily",
    icon: "📝",
    color: "#ec4899",
  },
  {
    name: "Gratitudine giornaliera",
    description: "Scrivi 3 cose per cui sei grato",
    type: "checkbox",
    category: "mindset",
    frequency: "daily",
    icon: "🙏",
    color: "#ec4899",
  },
];

async function seedHabitTemplates() {
  console.log("🌱 Seeding habit templates...");

  try {
    // Check if templates already exist
    const existingCount = await prisma.habitTemplate.count();

    if (existingCount > 0) {
      console.log(
        `⏭️  ${existingCount} templates already exist. Skipping seed.`
      );
      console.log("   To re-seed, delete existing templates first.");
      return;
    }

    // Create all templates
    let created = 0;
    for (const template of habitTemplates) {
      await prisma.habitTemplate.create({
        data: {
          ...template,
          isDefault: true,
        } as any,
      });
      created++;
      console.log(`✅ Created: ${template.name}`);
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Created: ${created} templates`);
    console.log(`   📝 Total: ${habitTemplates.length}`);
    console.log("\n✨ Done!");
  } catch (error) {
    console.error("❌ Error seeding templates:", error);
    throw error;
  }
}

// Run the script
seedHabitTemplates()
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
