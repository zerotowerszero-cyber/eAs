"use client";

import { useState } from "react";

interface ScanButtonProps {
  url: string;
}

export default function ScanButton({ url }: ScanButtonProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
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

  if (result) {
    const isMalicious = result.malicious > 0;
    return (
      <div style={{
        width: "100%",
        padding: "24px",
        background: isMalicious ? "#fce8e6" : "var(--surface)",
        border: "1px solid",
        borderColor: isMalicious ? "#fad2cf" : "var(--border)",
        borderRadius: "24px",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        animation: "fadeIn 0.3s ease",
        boxSizing: "border-box"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isMalicious ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c5221f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#137333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          )}
          <div>
            <div style={{ fontWeight: "500", fontSize: "18px", color: isMalicious ? "#c5221f" : "#137333" }}>
              {isMalicious ? "Malicious site detected" : "Safe browsing status"}
            </div>
            <div style={{ fontSize: "14px", color: "#5f6368" }}>
              Provided by VirusTotal
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "24px", fontSize: "14px", marginTop: "8px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "24px", fontWeight: "400", color: "#137333" }}>{result.harmless || 0}</span>
            <span style={{ color: "#5f6368" }}>Harmless</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "24px", fontWeight: "400", color: isMalicious ? "#c5221f" : "#5f6368" }}>{result.malicious || 0}</span>
            <span style={{ color: "#5f6368" }}>Malicious</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "24px", fontWeight: "400", color: result.suspicious > 0 ? "#f29900" : "#5f6368" }}>{result.suspicious || 0}</span>
            <span style={{ color: "#5f6368" }}>Suspicious</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleScan}
        disabled={loading}
        style={{
          background: "transparent",
          color: "var(--primary)",
          border: "1px solid var(--border)",
          borderRadius: "40px",
          height: "48px",
          padding: "0 32px",
          fontSize: "16px",
          fontWeight: "500",
          cursor: loading ? "default" : "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          transition: "all 0.2s ease",
          boxSizing: "border-box",
          opacity: loading ? 0.7 : 1
        }}
        onMouseOver={(e) => {
          if (!loading) e.currentTarget.style.background = "rgba(26, 115, 232, 0.04)";
        }}
        onMouseOut={(e) => {
          if (!loading) e.currentTarget.style.background = "transparent";
        }}
      >
        {loading ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
            Scanning...
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            Run security scan
          </>
        )}
      </button>

      {error && (
        <div style={{ color: "#d93025", fontSize: "14px", marginTop: "8px", textAlign: "center" }}>
          {error}
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
