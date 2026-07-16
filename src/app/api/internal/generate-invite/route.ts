import { NextRequest, NextResponse } from "next/server";
import { createInvite } from "@/lib/db";

const INTERNAL_SECRET = process.env.INTERNAL_BOT_SECRET || "eas-cx-internal-secret-2026";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${INTERNAL_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token, code } = await req.json();
    if (!token || !code) {
      return NextResponse.json({ error: "Missing token or code" }, { status: 400 });
    }

    await createInvite(token, code);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
