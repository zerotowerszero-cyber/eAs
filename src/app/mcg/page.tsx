import { headers, cookies } from "next/headers";
import { getAdminAuth } from "@/lib/db";
import Header from "@/components/Header";
import McgClient from "./McgClient";

export const dynamic = 'force-dynamic';

export default async function MasterCodeGeneratorPage() {
  const adminAuth = await getAdminAuth();
  
  if (!adminAuth.setupUsed) {
    return <NotFound />;
  }

  // Get IP
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  let ip = "127.0.0.1";
  if (forwardedFor) {
    ip = forwardedFor.split(',')[0].trim();
  } else if (realIp) {
    ip = realIp;
  }

  // Get HWID Cookie
  const cookiesList = await cookies();
  const hwidCookie = cookiesList.get("eas_hwid")?.value;

  // Authorization Check: IP matches OR HWID matches
  const isAuthorized = (adminAuth.ip === ip) || (adminAuth.deviceId && adminAuth.deviceId === hwidCookie);

  if (!isAuthorized) {
    return <NotFound />;
  }

  return (
    <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ flex: 1, padding: "32px 24px", maxWidth: "800px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        
        <McgClient />

      </div>
    </main>
  );
}

function NotFound() {
  return (
    <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h1 className="hero-title" style={{ fontSize: "24px" }}>404 - Not Found</h1>
      </div>
    </main>
  );
}
