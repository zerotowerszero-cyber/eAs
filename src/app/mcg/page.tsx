import { headers, cookies } from "next/headers";
import { getAdminAuth } from "@/lib/db";
import Header from "@/components/Header";
import McgClient from "./McgClient";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function MasterCodeGeneratorPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const adminAuth = await getAdminAuth();
  const sp = await searchParams;
  
  if (sp.recover === "admin") {
    if (adminAuth.deviceId) {
      const cookiesList = await cookies();
      cookiesList.set("eas_hwid", adminAuth.deviceId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365 * 10 // 10 years
      });
      redirect("/mcg");
    }
  }

  if (!adminAuth.setupUsed) {
    return <NotFound />;
  }

  // Get HWID Cookie
  const cookiesList = await cookies();
  const hwidCookie = cookiesList.get("eas_hwid")?.value;

  // Authorization Check: HWID matches
  const isAuthorized = adminAuth.deviceId && adminAuth.deviceId === hwidCookie;

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
