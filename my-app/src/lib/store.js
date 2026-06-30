// store.js — fully client-side persistence.
// Files (blobs) live in IndexedDB; the demo auth lives in localStorage.
// Nothing leaves the browser. A production Express + MongoDB + S3 backend
// is included in /src for real deployments.

const DB_NAME = "storit";
const DB_VERSION = 1;
const FILES = "files";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(FILES)) {
        const store = db.createObjectStore(FILES, { keyPath: "id" });
        store.createIndex("owner", "owner", { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function promisify(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function write(fn) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FILES, "readwrite");
    fn(tx.objectStore(FILES));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ---- Files -------------------------------------------------------------

export async function saveFile(record) {
  await write((store) => store.put(record));
}

export async function listFiles(owner) {
  const db = await openDB();
  const tx = db.transaction(FILES, "readonly");
  const index = tx.objectStore(FILES).index("owner");
  const rows = await promisify(index.getAll(owner));
  return rows.sort((a, b) => b.uploadedAt - a.uploadedAt);
}

export async function deleteFile(id) {
  await write((store) => store.delete(id));
}

// ---- Demo auth (localStorage + SHA-256) --------------------------------

const USERS_KEY = "storit:users";
const SESSION_KEY = "storit:session";

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

export async function register(username, password) {
  const name = username.trim();
  if (!name || !password) throw new Error("Username and password are required.");
  const users = readUsers();
  if (users[name]) throw new Error("That username is already taken.");
  users[name] = await sha256(password);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(SESSION_KEY, name);
  return name;
}

export async function login(username, password) {
  const name = username.trim();
  const users = readUsers();
  const hashed = await sha256(password);
  if (!users[name] || users[name] !== hashed) {
    throw new Error("Invalid username or password.");
  }
  localStorage.setItem(SESSION_KEY, name);
  return name;
}

export function currentUser() {
  return localStorage.getItem(SESSION_KEY);
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

// ---- Helpers -----------------------------------------------------------

export function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function extOf(name) {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1).toUpperCase().slice(0, 4) : "FILE";
}
