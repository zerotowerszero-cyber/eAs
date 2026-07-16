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
    if (loading || result) return;
    
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
          setError(data.message);
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        Run security scan
      </button>

      {isOpen && (
        <div style={{
          position: "fixed",
          bottom: "84px",
          left: "24px",
          width: "320px",
          background: result && result.malicious > 0 ? "#fce8e6" : "var(--surface)",
          border: "1px solid",
          borderColor: result && result.malicious > 0 ? "#fad2cf" : "var(--border)",
          borderRadius: "24px",
          boxShadow: "var(--shadow-lg)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          zIndex: 1000,
          animation: "fadeIn 0.2s ease",
          boxSizing: "border-box"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {loading || !result ? (
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              ) : result.malicious > 0 ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c5221f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#137333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              )}
              <div>
                <div style={{ fontWeight: "500", fontSize: "16px", color: result?.malicious > 0 ? "#c5221f" : (result ? "#137333" : "var(--foreground)") }}>
                  {loading ? "Scanning link..." : error ? "Scan failed" : result ? (result.malicious > 0 ? "Malicious link" : "Safe browsing status") : "Security Scan"}
                </div>
                <div style={{ fontSize: "12px", color: "#5f6368" }}>
                  Powered by VirusTotal
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--foreground)", padding: "4px", marginTop: "-4px", marginRight: "-4px" }}
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
            <div style={{ color: "#d93025", fontSize: "14px", lineHeight: 1.5, padding: "8px 0" }}>
              {error}
            </div>
          ) : result ? (
            <div style={{ display: "flex", gap: "24px", fontSize: "14px", marginTop: "8px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "24px", fontWeight: "400", color: "#137333" }}>{result.harmless || 0}</span>
                <span style={{ color: "#5f6368" }}>Harmless</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "24px", fontWeight: "400", color: result.malicious > 0 ? "#c5221f" : "#5f6368" }}>{result.malicious || 0}</span>
                <span style={{ color: "#5f6368" }}>Malicious</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "24px", fontWeight: "400", color: result.suspicious > 0 ? "#f29900" : "#5f6368" }}>{result.suspicious || 0}</span>
                <span style={{ color: "#5f6368" }}>Suspicious</span>
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
