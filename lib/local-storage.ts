import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".local-data");

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

export async function getLocalData<T>(
  storeName: string,
  key: string
): Promise<T | null> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, `${storeName}-${key}.json`);

  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

export async function setLocalData<T>(
  storeName: string,
  key: string,
  data: T
): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, `${storeName}-${key}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function deleteLocalData(
  storeName: string,
  key: string
): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, `${storeName}-${key}.json`);

  try {
    await fs.unlink(filePath);
  } catch {
    // File doesn't exist, ignore
  }
}
