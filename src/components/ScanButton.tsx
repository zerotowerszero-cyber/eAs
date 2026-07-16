"use client";

import { useState } from "react";

interface ScanButtonProps {
  url: string;
}

export default function ScanButton({ url }: ScanButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    setIsOpen(true);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 202) {
          setError(data.message); // URL submitted for scanning, try again
        } else {
          setError(data.error || "Failed to scan link.");
        }
      } else {
        setResult(data.stats);
      }
    } catch (e) {
      setError("An unexpected error occurred while scanning.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleScan}
        style={{
          position: "fixed",
          bottom: "24px",
          left: "24px",
          background: "var(--surface)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          borderRadius: "40px",
          height: "48px",
          padding: "0 24px",
          fontSize: "14px",
          fontWeight: "500",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "var(--shadow-md)",
          transition: "all 0.2s ease",
          zIndex: 1000,
        }}
        onMouseOver={(e) => e.currentTarget.style.boxShadow = "var(--shadow-lg)"}
        onMouseOut={(e) => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
        Scan link with VirusTotal
      </button>

      {isOpen && (
        <div style={{
          position: "fixed",
          bottom: "80px",
          left: "24px",
          width: "320px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          boxShadow: "var(--shadow-lg)",
          padding: "24px",
          zIndex: 1000,
          animation: "fadeIn 0.2s ease"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "500", display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Security Scan
            </h3>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--foreground)", padding: "4px" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          {loading ? (
            <div style={{ padding: "24px 0", textAlign: "center", color: "#5f6368" }}>
              <div style={{ marginBottom: "12px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
              </div>
              Analyzing with VirusTotal...
            </div>
          ) : error ? (
            <div style={{ color: "#d93025", fontSize: "14px", lineHeight: 1.5 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "8px", verticalAlign: "middle" }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {error}
            </div>
          ) : result ? (
            <div>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "12px", 
                marginBottom: "16px",
                padding: "16px",
                background: result.malicious > 0 ? "#fce8e6" : "#e6f4ea",
                borderRadius: "8px",
                color: result.malicious > 0 ? "#c5221f" : "#137333"
              }}>
                {result.malicious > 0 ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                )}
                <div>
                  <div style={{ fontWeight: "600", fontSize: "16px" }}>
                    {result.malicious > 0 ? "Malicious link detected" : "No threats found"}
                  </div>
                  <div style={{ fontSize: "12px", opacity: 0.8 }}>
                    Powered by VirusTotal
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
                  <span style={{ color: "#5f6368" }}>Harmless</span>
                  <span style={{ fontWeight: "500" }}>{result.harmless || 0}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
                  <span style={{ color: "#5f6368" }}>Malicious</span>
                  <span style={{ fontWeight: "500", color: result.malicious > 0 ? "#d93025" : "inherit" }}>{result.malicious || 0}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#5f6368" }}>Suspicious</span>
                  <span style={{ fontWeight: "500", color: result.suspicious > 0 ? "#f29900" : "inherit" }}>{result.suspicious || 0}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#5f6368" }}>Undetected</span>
                  <span style={{ fontWeight: "500" }}>{result.undetected || 0}</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}} />
    </>
  );
}
