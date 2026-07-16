import { redirect } from 'next/navigation';
import { getUrl } from '@/lib/db';
import Header from '@/components/Header';

// List of commonly known domains that skip the warning screen.
// We check if the hostname ends with these domains (to catch subdomains).
const SAFE_DOMAINS = [
  'google.com',
  'youtube.com',
  'github.com',
  'roblox.com',
  'twitter.com',
  'x.com',
  'facebook.com',
  'instagram.com',
  'linkedin.com',
  'tiktok.com',
  'apple.com',
  'microsoft.com',
  'amazon.com',
  'netflix.com',
  'eas.cx',
  'vercel.app',
  'vercel.com'
];

function isDomainSafe(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    
    // Check if the hostname exactly matches or is a subdomain of a safe domain
    return SAFE_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch (e) {
    return false; // If URL parsing fails, treat it as unsafe
  }
}

export default async function RedirectPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  
  let originalUrl: string | null = null;
  try {
    originalUrl = await getUrl(code);
  } catch (error) {
    console.error('Error fetching URL for redirect:', error);
  }

  // If the code doesn't exist, redirect to homepage
  if (!originalUrl) {
    redirect('/?error=not-found');
  }

  // If the domain is in our safe list, redirect instantly
  if (isDomainSafe(originalUrl)) {
    redirect(originalUrl);
  }

  // Otherwise, render the warning UI
  return (
    <main style={{ height: "100dvh", display: "flex", flexDirection: "column", backgroundColor: "#f8f9fa" }}>
      <Header />
      
      {/* Spacer to push content exactly below the fixed 64px header */}
      <div style={{ height: "64px", flexShrink: 0 }}></div>

      <div style={{ 
        flexGrow: 1, 
        padding: "0 24px",
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box"
      }}>
        
        <div style={{
          background: "#ffffff",
          borderRadius: "24px",
          padding: "48px 40px",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          
          <div style={{ 
            width: "64px", 
            height: "64px", 
            backgroundColor: "#fef0d9", 
            color: "#ea8600", 
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px"
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>

          <h1 style={{ 
            fontSize: "28px", 
            fontWeight: "500", 
            color: "#202124", 
            marginBottom: "16px",
            letterSpacing: "-0.5px",
            fontFamily: "'Google Sans Display', 'Google Sans', sans-serif"
          }}>
            This website isn't commonly known
          </h1>
          
          <p style={{
            fontSize: "16px",
            color: "#5f6368",
            marginBottom: "24px",
            lineHeight: "1.5"
          }}>
            The short link you clicked is trying to send you to a website that isn't on our list of safe, commonly known domains. Please review the link below before continuing.
          </p>

          <div style={{
            width: "100%",
            padding: "16px",
            backgroundColor: "#f1f3f4",
            borderRadius: "12px",
            marginBottom: "40px",
            wordBreak: "break-all",
            color: "#202124",
            fontWeight: "500"
          }}>
            {originalUrl}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
            <a 
              href="/"
              style={{
                background: "#1a73e8",
                color: "#ffffff",
                border: "none",
                borderRadius: "24px",
                padding: "14px 32px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
                textDecoration: "none",
                transition: "background 0.2s ease",
                width: "100%",
                display: "inline-block"
              }}
            >
              Go back to safety (Recommended)
            </a>
            
            <a 
              href={originalUrl}
              style={{
                background: "transparent",
                color: "#5f6368",
                border: "none",
                padding: "14px 32px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
                textDecoration: "underline",
                width: "100%",
                display: "inline-block"
              }}
            >
              Yes, I am sure. Continue to site.
            </a>
          </div>

        </div>
      </div>
    </main>
  );
}
