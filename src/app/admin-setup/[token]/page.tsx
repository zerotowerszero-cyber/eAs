import { headers, cookies } from "next/headers";
import { getAdminAuth, setAdminAuth } from "@/lib/db";
import Header from "@/components/Header";
import crypto from "crypto";

export default async function AdminSetupPage({ params }: { params: { token: string } }) {
  const token = params.token;
  const expectedToken = process.env.ADMIN_SETUP_TOKEN || "eas-cx-admin-2026";

  if (token !== expectedToken) {
    return (
      <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <h1 className="hero-title" style={{ fontSize: "24px" }}>404 - Not Found</h1>
          <p style={{ color: "#5f6368", marginTop: "16px" }}>Expected: {expectedToken}</p>
          <p style={{ color: "#5f6368" }}>Received: {token}</p>
        </div>
      </main>
    );
  }

  const adminAuth = await getAdminAuth();
  
  if (adminAuth.setupUsed) {
    return (
      <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <h1 className="hero-title" style={{ fontSize: "24px", color: "#d93025" }}>Setup link has already been used.</h1>
        </div>
      </main>
    );
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

  // Generate HWID (device_id)
  const deviceId = crypto.randomUUID();

  // Save to DB
  await setAdminAuth({
    ip,
    deviceId,
    setupUsed: true
  });

  // Set HWID Cookie
  const cookiesList = await cookies();
  cookiesList.set("eas_hwid", deviceId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365 * 10 // 10 years
  });

  return (
    <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ flex: 1, padding: "32px 24px", maxWidth: "600px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
        
        <h1 className="hero-title" style={{ fontSize: "clamp(36px, 5vw, 48px)", margin: "0 auto 24px auto" }}>
          Authorization Complete
        </h1>
        <p style={{ color: "#5f6368", fontSize: "18px", marginBottom: "40px" }}>
          Your IP address and hardware signature have been permanently registered as the Master Admin. You can now access the Master Code Generator.
        </p>
        
        <div>
          <a 
            href="/mcg"
            style={{
              display: "inline-block",
              background: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "28px",
              padding: "0 32px",
              height: "56px",
              lineHeight: "56px",
              fontSize: "16px",
              fontWeight: "500",
              textDecoration: "none",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              boxShadow: "0 1px 6px rgba(32,33,36,.28)"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28), 0 4px 12px rgba(32,33,36,.15)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28)";
            }}
          >
            Go to Generator
          </a>
        </div>
      </div>
    </main>
  );
}
