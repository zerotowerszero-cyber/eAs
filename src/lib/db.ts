import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

// A simple fallback mechanism for local development if Vercel KV is not configured.
const LOCAL_DB_PATH = path.join(process.cwd(), '.local-db.json');

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
  const hasKV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
  
  if (hasKV) {
    return await kv.get<string>(`url:${code}`);
  } else {
    const data = getLocalData();
    return data[code] || null;
  }
}

/**
 * Saves a URL to a short code.
 */
export async function saveUrl(code: string, url: string): Promise<void> {
  const hasKV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
  
  if (hasKV) {
    await kv.set(`url:${code}`, url);
  } else {
    const data = getLocalData();
    data[code] = url;
    saveLocalData(data);
  }
}
