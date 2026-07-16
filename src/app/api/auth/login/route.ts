import { NextRequest, NextResponse } from "next/server";
import { getAuthCode } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const authCodeData = await getAuthCode(code);
    if (!authCodeData) {
      return NextResponse.json({ error: "Invalid code" }, { status: 401 });
    }

    // Check IP Binding
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    let currentIp = "127.0.0.1";
    if (forwardedFor) {
      currentIp = forwardedFor.split(',')[0].trim();
    } else if (realIp) {
      currentIp = realIp;
    }

    // Allow bypass for local dev ONLY if the bound IP is also local
    // In production, this strict check ensures the IPs match perfectly.
    if (authCodeData.ip !== currentIp && currentIp !== "127.0.0.1" && authCodeData.ip !== "127.0.0.1") {
      // IP Mismatch - Deny access
      return NextResponse.json({ error: "Network mismatch. This code is locked to a different connection." }, { status: 403 });
    }

    // Set HTTP-Only Cookie
    cookies().set("eas_auth_token", code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
