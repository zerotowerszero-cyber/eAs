import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserAuth, setUserAuth } from '@/lib/db';

export async function GET() {
  const cookieStore = await cookies();
  let deviceId = cookieStore.get('eas_device_id')?.value;

  let isNewDevice = false;
  if (!deviceId) {
    // Generate a new random device ID (UUID-like)
    deviceId = crypto.randomUUID();
    isNewDevice = true;
  }

  // Fetch or generate user auth
  const userAuth = await getUserAuth(deviceId);

  const response = NextResponse.json(userAuth);

  // If new device, set the device cookie
  if (isNewDevice) {
    response.cookies.set('eas_device_id', deviceId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365 * 10 // 10 years
    });
  }

  // If click auth is already granted in DB, make sure the cookie is present
  if (userAuth.clickAuthGranted) {
    response.cookies.set('eas_click_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365 * 10 // 10 years
    });
  }

  return response;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const deviceId = cookieStore.get('eas_device_id')?.value;

  if (!deviceId) {
    return NextResponse.json({ error: "No device ID" }, { status: 400 });
  }

  try {
    const { sequence } = await request.json();
    const userAuth = await getUserAuth(deviceId);

    if (userAuth.clickCode === sequence) {
      userAuth.clickAuthGranted = true;
      await setUserAuth(userAuth);
      
      const res = NextResponse.json({ success: true });
      res.cookies.set('eas_click_auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365 * 10 // 10 years
      });
      return res;
    } else {
      return NextResponse.json({ success: false, error: "Invalid sequence" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

