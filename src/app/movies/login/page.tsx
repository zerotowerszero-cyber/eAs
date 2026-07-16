"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 10) {
      setError("Code must be exactly 10 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push("/movies");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ flex: 1, padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>

        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter password"
            maxLength={10}
            style={{
              width: "100%",
              height: "64px",
              padding: "0 32px",
              fontSize: "18px",
              fontWeight: "500",
              border: "1px solid transparent",
              borderRadius: "40px",
              background: "var(--surface)",
              color: "var(--foreground)",
              outline: "none",
              boxShadow: "0 1px 6px rgba(32,33,36,.28)",
              textAlign: "center",
              letterSpacing: code.length > 0 ? "4px" : "normal",
              fontFamily: code.length > 0 ? "'Google Sans Mono', 'Roboto Mono', monospace" : "'Google Sans Text', 'Google Sans', sans-serif",
              transition: "all 0.2s ease"
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28)";
              e.currentTarget.style.background = "var(--surface)";
            }}
            onBlur={(e) => e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28)"}
            onMouseOver={(e) => {
              if (document.activeElement !== e.currentTarget) {
                e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28), 0 2px 8px rgba(32,33,36,.15)";
              }
            }}
            onMouseOut={(e) => {
              if (document.activeElement !== e.currentTarget) {
                e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28)";
              }
            }}
          />
          {error && <div style={{ color: "#d93025", textAlign: "center", fontSize: "14px", fontWeight: "500" }}>{error}</div>}
          
          <button
            type="submit"
            disabled={loading || code.length !== 10}
            style={{
              background: loading || code.length !== 10 ? "#dadce0" : "var(--primary)",
              color: loading || code.length !== 10 ? "#5f6368" : "white",
              border: "none",
              borderRadius: "32px",
              padding: "16px 48px",
              fontSize: "18px",
              fontWeight: "500",
              cursor: loading || code.length !== 10 ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: loading || code.length !== 10 ? "none" : "0 1px 6px rgba(32,33,36,.28)",
              marginTop: "8px"
            }}
            onMouseOver={(e) => {
              if (!loading && code.length === 10) {
                e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28), 0 4px 12px rgba(32,33,36,.15)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseOut={(e) => {
              if (!loading && code.length === 10) {
                e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28)";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            {loading ? "Verifying..." : "Submit"}
          </button>
        </form>

      </div>
    </main>
  );
}
