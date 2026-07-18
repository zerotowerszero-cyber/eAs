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

  const handleResend = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to resend");
      // The API will have triggered the discord bot again
      setTotp("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid = password.length > 0;
  const isTotpValid = totp.length === 6;
  const isFormValid = requires2fa ? isTotpValid : isPasswordValid;

  return (
    <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ flex: 1, padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {!requires2fa ? (
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                letterSpacing: password.length > 0 ? "4px" : "normal",
                fontFamily: password.length > 0 ? "'Google Sans Mono', 'Roboto Mono', monospace" : "'Google Sans Text', 'Google Sans', sans-serif",
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
              required
            />
          ) : (
            <input
              type="text"
              placeholder="000 000"
              value={totp}
              onChange={(e) => {
                // Only allow numbers and max 6 chars, strip spaces for state
                const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                setTotp(val);
              }}
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
                letterSpacing: totp.length > 0 ? "4px" : "normal",
                fontFamily: "'Google Sans Mono', 'Roboto Mono', monospace",
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
              required
            />
          )}

          {error && <div style={{ color: "#d93025", textAlign: "center", fontSize: "14px", fontWeight: "500" }}>{error}</div>}

          <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
            <button 
              type="submit" 
              disabled={loading || !isFormValid}
              style={{ 
                background: loading || !isFormValid ? "#dadce0" : "var(--primary)",
                color: loading || !isFormValid ? "#5f6368" : "white",
                border: "none",
                borderRadius: "32px",
                padding: "16px 48px",
                fontSize: "18px",
                fontWeight: "500",
                cursor: loading || !isFormValid ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                boxShadow: loading || !isFormValid ? "none" : "0 1px 6px rgba(32,33,36,.28)",
                marginTop: "8px",
                display: "flex",
                justifyContent: "center"
              }}
              onMouseOver={(e) => {
                if (!loading && isFormValid) {
                  e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28), 0 4px 12px rgba(32,33,36,.15)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseOut={(e) => {
                if (!loading && isFormValid) {
                  e.currentTarget.style.boxShadow = "0 1px 6px rgba(32,33,36,.28)";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {loading ? "Verifying..." : requires2fa ? "Submit" : "Continue"}
            </button>

            {requires2fa && (
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                style={{
                  background: "transparent",
                  color: "var(--primary)",
                  border: "none",
                  padding: "0",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: loading ? "not-allowed" : "pointer",
                  marginTop: "8px",
                  textDecoration: "underline",
                  opacity: loading ? 0.5 : 0.8
                }}
                onMouseOver={(e) => {
                  if (!loading) e.currentTarget.style.opacity = "1";
                }}
                onMouseOut={(e) => {
                  if (!loading) e.currentTarget.style.opacity = "0.8";
                }}
              >
                Resend Code
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
