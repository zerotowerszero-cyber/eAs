import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, setAdminAuth } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const adminAuth = await getAdminAuth();
    
    // Get IP
    const forwardedFor = req.headers.get('x-forwarded-for');
    const currentIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // Verify recovery is not used, IP matches, and deviceId exists
    if (!adminAuth.recoveryUsed && adminAuth.ip === currentIp && adminAuth.deviceId) {
      
      const cookiesList = await cookies();
      cookiesList.set("eas_hwid", adminAuth.deviceId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365 * 10 // 10 years
      });
      
      // Mark recovery as used
      adminAuth.recoveryUsed = true;
      await setAdminAuth(adminAuth);

      // Redirect to /mcg
      return NextResponse.redirect(new URL('/mcg', req.url));
    } else {
      // Failed recovery attempt (already used or IP mismatch)
      return NextResponse.json({ error: "Not Found or Unauthorized" }, { status: 404 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
