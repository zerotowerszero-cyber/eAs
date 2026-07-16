"use client";

import { useState } from "react";

export default function McgClient() {
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setCode(null);

    try {
      const res = await fetch("/api/mcg/generate", {
        method: "POST"
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate code");
      }

      setCode(data.code);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "800px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      
      {error && <div style={{ color: "#d93025", textAlign: "center", fontWeight: "500", marginBottom: "24px" }}>{error}</div>}

      {code ? (
        <div style={{ textAlign: "center", width: "100%" }}>
          <h1 
            className="hero-title" 
            style={{ 
              fontSize: "clamp(36px, 5vw, 48px)", 
              margin: "0 auto", 
              textAlign: "center",
              fontFamily: "'Google Sans Mono', 'Roboto Mono', monospace",
              letterSpacing: "4px",
              color: "var(--foreground)"
            }}
          >
            {code}
          </h1>
          <button 
            onClick={() => navigator.clipboard.writeText(code)}
            style={{
              marginTop: "24px",
              background: "transparent",
              border: "none",
              color: "var(--primary)",
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "16px",
              padding: "8px 16px",
              borderRadius: "20px"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "var(--surface)"}
            onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
          >
            Copy to Clipboard
          </button>
        </div>
      ) : (
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            background: "transparent",
            color: loading ? "#5f6368" : "var(--foreground)",
            border: "none",
            fontSize: "24px",
            fontWeight: "500",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "opacity 0.2s ease",
            opacity: loading ? 0.5 : 1
          }}
        >
          {loading ? "..." : "mcg"}
        </button>
      )}
    </div>
  );
}
