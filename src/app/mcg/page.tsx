import { headers, cookies } from "next/headers";
import { getAdminAuth, setAdminAuth } from "@/lib/db";
import Header from "@/components/Header";
import McgClient from "./McgClient";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function MasterCodeGeneratorPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const adminAuth = await getAdminAuth();
  const sp = await searchParams;
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  const currentIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

  if (!adminAuth.setupUsed) {
    return <NotFound />;
  }

  // Get HWID Cookie
  const cookiesList2 = await cookies();
  const hwidCookie = cookiesList2.get("eas_hwid")?.value;

  // Authorization Check: BOTH HWID and IP must match perfectly
  const isAuthorized = adminAuth.deviceId === hwidCookie && adminAuth.ip === currentIp;

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
