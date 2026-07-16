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

        </div>
      ) : (
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            background: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "32px",
            height: "48px",
            padding: "0 32px",
            fontSize: "16px",
            fontWeight: "500",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            opacity: loading ? 0.7 : 1,
            boxShadow: "0 1px 6px rgba(32,33,36,.28)"
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28), 0 4px 12px rgba(32,33,36,.15)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28)";
              e.currentTarget.style.transform = "translateY(0)";
            }
          }}
        >
          {loading ? "..." : "mcg"}
        </button>
      )}
    </div>
  );
}
