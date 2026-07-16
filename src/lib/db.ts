import { createClient } from 'redis';
import fs from 'fs';
import path from 'path';

// A simple fallback mechanism for local development if Redis is not configured.
const LOCAL_DB_PATH = path.join(process.cwd(), '.local-db.json');

let redisClient: any = null;

async function getRedisClient() {
  if (redisClient) return redisClient;
  
  if (process.env.REDIS_URL) {
    redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.on('error', (err: any) => console.error('Redis Client Error', err));
    await redisClient.connect();
    return redisClient;
  }
  
  return null;
}

function getLocalData(): Record<string, string> {
  if (fs.existsSync(LOCAL_DB_PATH)) {
    try {
      const data = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      return {};
    }
  }
  return {};
}

function saveLocalData(data: Record<string, string>) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error("Failed to write to local DB on Vercel (Expected if Redis is missing)", e);
  }
}

/**
 * Gets a URL by its short code.
 */
export async function getUrl(code: string): Promise<string | null> {
  const client = await getRedisClient();
  
  if (client) {
    return await client.get(`url:${code}`);
  } else {
    const data = getLocalData();
    return data[code] || null;
  }
}

/**
 * Saves a URL to a short code.
 */
export async function saveUrl(code: string, url: string): Promise<void> {
  const client = await getRedisClient();
  
  if (client) {
    await client.set(`url:${code}`, url);
  } else {
    const data = getLocalData();
    data[`url:${code}`] = url;
    saveLocalData(data);
  }
}

// Admin Auth Types
export interface AdminAuth {
  ip: string | null;
  deviceId: string | null; // This acts as the "HWID"
  setupUsed: boolean;
}

// Viewer Auth Types
export interface AuthCode {
  code: string;
  used: boolean;
}

// ---------------- Admin Auth Methods ----------------

export async function getAdminAuth(): Promise<AdminAuth> {
  const client = await getRedisClient();
  let strData = null;
  if (client) {
    strData = await client.get('admin:auth');
  } else {
    strData = getLocalData()['admin:auth'];
  }
  
  if (strData) {
    return JSON.parse(strData);
  }
  
  // Default state if not set up
  return { ip: null, deviceId: null, setupUsed: false };
}

export async function setAdminAuth(auth: AdminAuth): Promise<void> {
  const client = await getRedisClient();
  if (client) {
    await client.set('admin:auth', JSON.stringify(auth));
  } else {
    const data = getLocalData();
    data['admin:auth'] = JSON.stringify(auth);
    saveLocalData(data);
  }
}

// ---------------- Auth Code Methods ----------------

export async function createAuthCode(code: string): Promise<void> {
  const client = await getRedisClient();
  const authCode: AuthCode = { code, used: false };

  if (client) {
    await client.set(`code:${code}`, JSON.stringify(authCode));
  } else {
    const data = getLocalData();
    data[`code:${code}`] = JSON.stringify(authCode);
    saveLocalData(data);
  }
}

export async function getAuthCode(code: string): Promise<AuthCode | null> {
  const client = await getRedisClient();
  let strData = null;
  if (client) {
    strData = await client.get(`code:${code}`);
  } else {
    strData = getLocalData()[`code:${code}`];
  }
  return strData ? JSON.parse(strData) : null;
}

export async function markCodeUsed(code: string): Promise<void> {
  const authCode = await getAuthCode(code);
  if (authCode) {
    authCode.used = true;
    const client = await getRedisClient();
    if (client) {
      await client.set(`code:${code}`, JSON.stringify(authCode));
    } else {
      const data = getLocalData();
      data[`code:${code}`] = JSON.stringify(authCode);
      saveLocalData(data);
    }
  }
}
