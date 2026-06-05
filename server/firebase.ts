import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectId = process.env.FIREBASE_PROJECT_ID;
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

const firebaseAvailable = Boolean(projectId && (serviceAccountPath || process.env.GOOGLE_APPLICATION_CREDENTIALS));
let firestore: admin.firestore.Firestore | null = null;

function createApp() {
  if (firestore) return firestore;
  if (!firebaseAvailable) {
    return null;
  }

  let credential: admin.credential.Credential;
  if (serviceAccountPath) {
    const resolvedPath = path.isAbsolute(serviceAccountPath)
      ? serviceAccountPath
      : path.resolve(__dirname, '..', serviceAccountPath);

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Firebase service account file not found at ${resolvedPath}`);
    }

    const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
    credential = admin.credential.cert(serviceAccount);
  } else {
    credential = admin.credential.applicationDefault();
  }

  firestore = admin.initializeApp({
    credential,
    projectId,
  }).firestore();

  return firestore;
}

export function isFirebaseEnabled() {
  return firebaseAvailable;
}

export function getFirestore() {
  const db = createApp();
  if (!db) {
    throw new Error('Firebase is not configured. Set FIREBASE_PROJECT_ID and FIREBASE_SERVICE_ACCOUNT_PATH or GOOGLE_APPLICATION_CREDENTIALS.');
  }
  return db;
}

export function normalizeDoc(doc: any) {
  return { id: doc.id, ...doc.data() } as Record<string, any>;
}
