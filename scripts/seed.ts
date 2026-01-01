import fs from "fs/promises";
import path from "path";
import { seedExercises } from "../lib/seed-data";

async function seed() {
  const dataDir = path.join(process.cwd(), "data");

  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }

  const exercisesFile = path.join(dataDir, "exercises.json");
  const plansFile = path.join(dataDir, "plans.json");
  const leadsFile = path.join(dataDir, "leads.json");

  await fs.writeFile(exercisesFile, JSON.stringify(seedExercises, null, 2));
  await fs.writeFile(plansFile, JSON.stringify([], null, 2));
  await fs.writeFile(leadsFile, JSON.stringify([], null, 2));

  console.log("✅ Seed data initialized successfully!");
  console.log(`   - ${seedExercises.length} exercises created`);
  console.log(`   - Data directory: ${dataDir}`);
}

seed().catch(console.error);
