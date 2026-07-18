import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, createAuthCode } from "@/lib/db";
import { cookies } from "next/headers";
import crypto from "crypto";

function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const adminAuth = await getAdminAuth();
    
    if (!adminAuth.setupUsed) {
      return NextResponse.json({ error: "System not set up" }, { status: 403 });
    }

    // Get IP
    const forwardedFor = req.headers.get('x-forwarded-for');
    const currentIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // Get HWID Cookie
    const cookiesList = await cookies();
    const hwidCookie = cookiesList.get("eas_hwid")?.value;

    // Authorization Check: BOTH HWID and IP must match perfectly
    const isAuthorized = adminAuth.deviceId === hwidCookie && adminAuth.ip === currentIp;

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate 10-digit code
    const code = generateRandomString(10);
    
    // Save to DB
    await createAuthCode(code);

    return NextResponse.json({ success: true, code });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
