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
        
        <h1 className="hero-title" style={{ fontSize: "clamp(36px, 5vw, 48px)", margin: "0 auto 32px auto", textAlign: "center" }}>
          Vault Access
        </h1>

        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 10-digit access code"
            maxLength={10}
            style={{
              width: "100%",
              height: "56px",
              padding: "0 24px",
              fontSize: "18px",
              border: "1px solid var(--border)",
              borderRadius: "28px",
              background: "var(--surface)",
              color: "var(--foreground)",
              outline: "none",
              boxShadow: "var(--shadow-sm)",
              textAlign: "center",
              letterSpacing: "2px",
              fontFamily: "monospace"
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
              borderRadius: "28px",
              height: "48px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: loading || code.length !== 10 ? "not-allowed" : "pointer",
              transition: "all 0.2s ease"
            }}
          >
            {loading ? "Verifying..." : "Enter Vault"}
          </button>
        </form>

      </div>
    </main>
  );
}
