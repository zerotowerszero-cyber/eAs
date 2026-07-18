"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [requires2fa, setRequires2fa] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, totp: requires2fa ? totp : undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      if (data.requires_2fa) {
        setRequires2fa(true);
        return;
      }

      router.push("/49218");
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
          
          {!requires2fa ? (
            <input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "var(--background)",
                color: "var(--foreground)",
                fontSize: "16px",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s"
              }}
              required
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ fontSize: "14px", color: "var(--primary)", fontWeight: "500", textAlign: "center", marginBottom: "8px" }}>
                Check Discord #code channel for your 6-digit code.
              </div>
              <input
                type="text"
                placeholder="000000"
                value={totp}
                onChange={(e) => setTotp(e.target.value)}
                maxLength={6}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  background: "var(--background)",
                  color: "var(--foreground)",
                  fontSize: "24px",
                  textAlign: "center",
                  letterSpacing: "8px",
                  fontFamily: "'Google Sans Mono', monospace",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s"
                }}
                required
              />
            </div>
          )}

          {error && <div style={{ color: "#d93025", textAlign: "center", fontSize: "14px", fontWeight: "500" }}>{error}</div>}

          <button 
            type="submit" 
            className="btn-sailwhale"
            disabled={loading || (!requires2fa && !password) || (requires2fa && totp.length !== 6)}
            style={{ 
              width: "100%", 
              justifyContent: "center", 
              opacity: loading ? 0.7 : 1,
              marginTop: "8px",
              padding: "16px",
              borderRadius: "32px",
              fontSize: "18px",
              fontWeight: "500",
              background: "var(--primary)",
              color: "white",
              border: "none",
              cursor: "pointer"
            }}
          >
            {loading ? "Verifying..." : requires2fa ? "Complete Login" : "Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}
