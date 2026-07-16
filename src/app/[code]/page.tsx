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

  // Otherwise, render the warning UI that perfectly matches the site's design system
  return (
    <main style={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      
      {/* Optical centering spacer */}
      <div style={{ height: "32px", flexShrink: 0 }}></div>

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
          display: "flex", 
          flexDirection: "column", 
          gap: "32px", 
          width: "100%", 
          maxWidth: "700px", 
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
            justifyContent: "center"
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>

          <h1 className="hero-title" style={{ margin: 0, lineHeight: 1 }}>
            This website isn't commonly known
          </h1>
          
          <p className="hero-subtitle" style={{ margin: 0, lineHeight: 1.5, textAlign: "center", maxWidth: "600px" }}>
            The short link you clicked is trying to send you to a website that isn't on our list of safe, commonly known domains. Please review the link below before continuing.
          </p>

          <div style={{
            width: "100%",
            height: "64px",
            padding: "0 32px",
            fontSize: "18px",
            color: "var(--foreground)",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "40px",
            boxShadow: "var(--shadow-sm)",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            {originalUrl}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", alignItems: "center" }}>
            <a 
              href="/"
              style={{
                background: "var(--primary)",
                color: "#ffffff",
                border: "none",
                borderRadius: "40px",
                height: "64px",
                padding: "0 48px",
                fontSize: "18px",
                fontWeight: "500",
                cursor: "pointer",
                textDecoration: "none",
                transition: "all 0.2s ease",
                boxShadow: "var(--shadow-sm)",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%"
              }}
            >
              Go back to safety (Recommended)
            </a>
            
            <a 
              href={originalUrl}
              style={{
                background: "transparent",
                color: "var(--foreground)",
                opacity: 0.7,
                border: "none",
                padding: "16px 32px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
                textDecoration: "underline",
                transition: "opacity 0.2s ease",
                display: "inline-block",
                textAlign: "center"
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = "1"}
              onMouseOut={(e) => e.currentTarget.style.opacity = "0.7"}
            >
              Yes, I am sure. Continue to site.
            </a>
          </div>

        </div>
      </div>
    </main>
  );
}
