import { headers } from "next/headers";
import { getInvite, getAuthCode, updateAuthCode, markInviteUsed } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";

export default async function AuthInvitePage({ params }: { params: { token: string } }) {
  const token = params.token;
  const invite = await getInvite(token);

  if (!invite || invite.used) {
    // Return a disguised 404 or generic page
    return (
      <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
          <h1 style={{ fontSize: "24px", color: "var(--foreground)" }}>Invalid or Expired Link</h1>
          <Link href="/" style={{ color: "var(--primary)", textDecoration: "none" }}>Return Home</Link>
        </div>
      </main>
    );
  }

  // Get the auth code object
  const authCodeData = await getAuthCode(invite.code);
  if (!authCodeData) {
    return (
      <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <h1 style={{ fontSize: "24px" }}>System Error</h1>
        </div>
      </main>
    );
  }

  // Get IP and User-Agent
  const headersList = headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  
  // Use the first IP from x-forwarded-for if it's a list, otherwise use realIp, otherwise fallback to local
  let ip = "127.0.0.1";
  if (forwardedFor) {
    ip = forwardedFor.split(',')[0].trim();
  } else if (realIp) {
    ip = realIp;
  }
  
  const userAgent = headersList.get("user-agent") || "unknown";

  // Bind the IP and User-Agent to the code
  authCodeData.ip = ip;
  authCodeData.userAgent = userAgent;
  await updateAuthCode(authCodeData);

  // Mark invite as used
  await markInviteUsed(token);

  // Show the generated code securely
  return (
    <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ flex: 1, padding: "32px 24px", maxWidth: "600px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="bento-card" style={{ 
          background: "var(--surface)", 
          borderRadius: "var(--radius-xl)", 
          padding: "48px", 
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
          textAlign: "center"
        }}>
          <h2 className="hero-title" style={{ fontSize: "32px", marginBottom: "16px" }}>Access Granted</h2>
          <p style={{ color: "#5f6368", marginBottom: "32px", fontSize: "16px" }}>
            Your connection has been successfully bound. Please save the following 10-digit code to access the vault. This code is permanently locked to your current network.
          </p>
          <div style={{ 
            background: "var(--background)", 
            padding: "24px", 
            borderRadius: "16px", 
            fontSize: "32px", 
            fontWeight: "700", 
            letterSpacing: "4px",
            fontFamily: "monospace",
            color: "var(--primary)",
            marginBottom: "32px"
          }}>
            {invite.code}
          </div>
          <Link 
            href="/movies/login" 
            style={{ 
              display: "inline-block",
              background: "var(--primary)", 
              color: "white", 
              padding: "16px 32px", 
              borderRadius: "40px", 
              textDecoration: "none",
              fontWeight: "500",
              fontSize: "16px",
              transition: "opacity 0.2s"
            }}
          >
            Enter Vault
          </Link>
        </div>
      </div>
    </main>
  );
}
