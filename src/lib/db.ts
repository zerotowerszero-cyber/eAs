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
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
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

// Auth Types
export interface Invite {
  token: string;
  code: string;
  used: boolean;
}

export interface AuthCode {
  code: string;
  ip: string | null;
  userAgent: string | null;
  used: boolean;
}

export async function createInvite(token: string, code: string): Promise<void> {
  const client = await getRedisClient();
  const invite: Invite = { token, code, used: false };
  const authCode: AuthCode = { code, ip: null, userAgent: null, used: false };

  if (client) {
    await client.set(`invite:${token}`, JSON.stringify(invite));
    await client.set(`code:${code}`, JSON.stringify(authCode));
  } else {
    const data = getLocalData();
    data[`invite:${token}`] = JSON.stringify(invite);
    data[`code:${code}`] = JSON.stringify(authCode);
    saveLocalData(data);
  }
}

export async function getInvite(token: string): Promise<Invite | null> {
  const client = await getRedisClient();
  let strData = null;
  if (client) {
    strData = await client.get(`invite:${token}`);
  } else {
    strData = getLocalData()[`invite:${token}`];
  }
  return strData ? JSON.parse(strData) : null;
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

export async function updateAuthCode(authCode: AuthCode): Promise<void> {
  const client = await getRedisClient();
  if (client) {
    await client.set(`code:${authCode.code}`, JSON.stringify(authCode));
  } else {
    const data = getLocalData();
    data[`code:${authCode.code}`] = JSON.stringify(authCode);
    saveLocalData(data);
  }
}

export async function markInviteUsed(token: string): Promise<void> {
  const invite = await getInvite(token);
  if (invite) {
    invite.used = true;
    const client = await getRedisClient();
    if (client) {
      await client.set(`invite:${token}`, JSON.stringify(invite));
    } else {
      const data = getLocalData();
      data[`invite:${token}`] = JSON.stringify(invite);
      saveLocalData(data);
    }
  }
}
