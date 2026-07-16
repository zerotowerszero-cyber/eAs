"use client";

import { useState } from "react";
import Header from "@/components/Header";

export default function LinkShortener() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortUrl("");
    setCopied(false);

    let submitUrl = url.trim();
    if (!submitUrl.startsWith("http://") && !submitUrl.startsWith("https://")) {
      submitUrl = "https://" + submitUrl;
    }

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: submitUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to shorten URL");
      }

      setShortUrl(`${window.location.origin}/${data.code}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        
        <form 
          onSubmit={handleShorten}
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "32px", 
            width: "100%", 
            maxWidth: "700px", 
            alignItems: "center" 
          }}
        >
          <h1 className="hero-title" style={{ margin: 0, lineHeight: 1 }}>
            Shorten a link.
          </h1>
          <p className="hero-subtitle" style={{ margin: 0, lineHeight: 1 }}>
            Create a compact, easy-to-share eAs URL.
          </p>

          <div style={{ position: "relative", width: "100%" }}>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your long URL here"
              required
              style={{
                width: "100%",
                height: "64px",
                padding: "0 32px",
                fontSize: "18px",
                color: "var(--foreground)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "40px",
                outline: "none",
                transition: "all 0.2s ease",
                boxShadow: "var(--shadow-sm)",
                boxSizing: "border-box"
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = "var(--shadow-md)";
                e.target.style.borderColor = "transparent";
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = "var(--shadow-sm)";
                e.target.style.borderColor = "var(--border)";
              }}
            />
          </div>

          {error ? (
            <div style={{ color: "#d93025", fontSize: "16px", marginTop: "-16px" }}>
              {error}
            </div>
          ) : null}

          <button 
            type="submit" 
            disabled={loading || !url}
            style={{
              background: loading || !url ? "var(--border)" : "var(--primary)",
              color: loading || !url ? "#9aa0a6" : "#ffffff",
              border: "none",
              borderRadius: "40px",
              height: "64px",
              padding: "0 48px",
              fontSize: "18px",
              fontWeight: "500",
              cursor: loading || !url ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: loading || !url ? "none" : "var(--shadow-sm)",
              boxSizing: "border-box"
            }}
            onMouseOver={(e) => {
              if (!loading && url) e.currentTarget.style.boxShadow = "var(--shadow-md)";
            }}
            onMouseOut={(e) => {
              if (!loading && url) e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            }}
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </button>

          {shortUrl && (
            <div style={{ 
              height: "64px",
              padding: "0 32px", 
              background: "var(--surface)", 
              borderRadius: "40px",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              animation: "fadeIn 0.3s ease",
              boxShadow: "var(--shadow-sm)",
              boxSizing: "border-box"
            }}>
            <a 
              href={shortUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: "var(--primary)", 
                textDecoration: "none", 
                fontWeight: "500", 
                fontSize: "18px",
                wordBreak: "break-all" 
              }}
            >
              {shortUrl}
            </a>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                background: "transparent",
                color: copied ? "#137333" : "var(--foreground)",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "16px",
                transition: "color 0.2s ease"
              }}
            >
              {copied ? (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  Copy
                </>
              )}
            </button>
          </div>
        )}
        </form>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </main>
  );
}
