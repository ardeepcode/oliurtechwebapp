import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectDbPath = path.resolve(__dirname, '..', 'db.json');
const runtimeDbPath = path.resolve(process.env.TMPDIR || process.env.TEMP || '/tmp', 'oliurtech-db.json');

const defaultDb = {
  products: [],
  orders: [],
  serviceRequests: [],
  users: [],
  banners: [],
};

function getDbPath() {
  if (process.env.VERCEL) {
    if (!fs.existsSync(runtimeDbPath)) {
      if (fs.existsSync(projectDbPath)) {
        fs.copyFileSync(projectDbPath, runtimeDbPath);
      } else {
        fs.writeFileSync(runtimeDbPath, JSON.stringify(defaultDb, null, 2), 'utf-8');
      }
    }
    return runtimeDbPath;
  }

  if (!fs.existsSync(projectDbPath)) {
    fs.writeFileSync(projectDbPath, JSON.stringify(defaultDb, null, 2), 'utf-8');
  }

  return projectDbPath;
}

export function readDb() {
  try {
    const dbPath = getDbPath();
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read database:', err);
    return defaultDb;
  }
}

export function writeDb(data: any) {
  try {
    const dbPath = getDbPath();
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database:', err);
  }
}
