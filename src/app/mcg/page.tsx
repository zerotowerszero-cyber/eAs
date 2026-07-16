import { headers, cookies } from "next/headers";
import { getAdminAuth } from "@/lib/db";
import Header from "@/components/Header";
import McgClient from "./McgClient";

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
      <div style={{ flex: 1, padding: "32px 24px", maxWidth: "800px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        <h1 className="hero-title" style={{ fontSize: "clamp(36px, 5vw, 48px)", margin: "8vh auto 16px auto", textAlign: "center" }}>
          Master Code Generator
        </h1>
        <p style={{ color: "#5f6368", fontSize: "16px", marginBottom: "48px", textAlign: "center" }}>
          Authorized Secure Portal. Generate single-use access codes.
        </p>

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
