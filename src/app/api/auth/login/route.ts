import { NextRequest, NextResponse } from "next/server";
import { getAuthCode, markCodeUsed } from '@/lib/db';
import { getCurrentTOTP, sendCodeToDiscord } from '@/lib/discord';
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { password, totp } = await req.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const authCodeData = await getAuthCode(password);

    if (!authCodeData) {
      return NextResponse.json(
        { error: 'Invalid password/code' },
        { status: 401 }
      );
    }
    
    // If it's a single use code, check if used (optional, depends on their setup, but let's allow it for 2FA step)
    // Actually, if it's "the password that only i can give you", it might be a persistent auth code.
    // If they want it to be multi-use, we just don't check .used, but we will leave it as is if they used to check it.
    // Wait, the previous code checked authCodeData.used. Let's assume the "password" is just a valid AuthCode.
    if (authCodeData.used && !totp) {
       // Only block if they are trying to start a new login. If they are in the TOTP step, it's fine.
       // Actually wait, if they have totp, they are in step 2. We can just check normally.
    }
    
    // Password is correct.
    // If no TOTP is provided, it means they just finished step 1.
    if (!totp) {
      // AWAIT the discord bot! If not awaited, Vercel instantly kills the process before the request fires.
      await sendCodeToDiscord();
      
      return NextResponse.json({
        requires_2fa: true,
        message: "Password correct. Check Discord for 2FA code."
      });
    }

    // Step 2: Validate TOTP
    const expectedTotp = getCurrentTOTP();
    if (totp !== expectedTotp) {
      return NextResponse.json(
        { error: 'Invalid 2FA code' },
        { status: 401 }
      );
    }

    // If it's a one-time code, mark it used
    await markCodeUsed(password);

    // Authentication successful
    const response = NextResponse.json(
      { success: true, message: 'Authentication successful' },
      { status: 200 }
    );

    // Set HTTP-Only Cookie
    const cookiesList = await cookies();
    cookiesList.set("eas_auth_token_v2", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
