import { NextRequest, NextResponse } from "next/server";
import { getAuthCode, markCodeUsed } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const authCodeData = await getAuthCode(code);
    
    // Check if code exists and is unused
    if (!authCodeData) {
      return NextResponse.json({ error: "Invalid code" }, { status: 401 });
    }
    
    if (authCodeData.used) {
      return NextResponse.json({ error: "Code has already been used" }, { status: 403 });
    }

    // Mark code as used (single-use)
    await markCodeUsed(code);

    // Set HTTP-Only Cookie
    const cookiesList = await cookies();
    cookiesList.set("eas_auth_token", code, {
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
