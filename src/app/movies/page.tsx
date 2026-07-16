"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

export default function MoviesSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrending = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/movies/trending');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch trending");
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/movies/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to search");
      }
      
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      performSearch(q);
    } else {
      setQuery("");
      fetchTrending();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/movies?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/movies`);
    }
  };

  return (
    <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      
      <div style={{ flex: 1, padding: "32px 24px", maxWidth: "1200px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        
        <div style={{ textAlign: "center", marginBottom: "64px", marginTop: "8vh" }}>
          <h1 className="hero-title" style={{ 
            fontSize: "clamp(36px, 5vw, 48px)", 
            margin: "0 auto 32px auto", 
          }}>
            Search Movies & Shows
          </h1>
          <form onSubmit={handleSearch} style={{ display: "flex", maxWidth: "684px", margin: "0 auto", position: "relative" }}>
            <div style={{
              position: "absolute",
              left: "20px",
              top: "0",
              bottom: "0",
              display: "flex",
              alignItems: "center",
              color: "#9aa0a6",
              pointerEvents: "none"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to watch?"
              style={{
                width: "100%",
                height: "56px",
                padding: "0 24px 0 52px",
                fontSize: "16px",
                border: "1px solid transparent",
                borderRadius: "28px",
                background: "var(--surface)",
                color: "var(--foreground)",
                outline: "none",
                boxShadow: "0 1px 6px rgba(32,33,36,.28)",
                transition: "all 0.2s ease"
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = "0 1px 6px rgba(32,33,36,.28)";
                e.target.style.background = "var(--surface)";
              }}
              onBlur={(e) => e.target.style.boxShadow = "0 1px 6px rgba(32,33,36,.28)"}
              onMouseOver={(e) => {
                if (document.activeElement !== e.target) {
                  e.target.style.boxShadow = "0 1px 6px rgba(32,33,36,.28), 0 2px 8px rgba(32,33,36,.1)";
                }
              }}
              onMouseOut={(e) => {
                if (document.activeElement !== e.target) {
                  e.target.style.boxShadow = "0 1px 6px rgba(32,33,36,.28)";
                }
              }}
            />
          </form>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "var(--primary)", padding: "48px" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", color: "#d93025", padding: "48px" }}>
            {error}
          </div>
        ) : results.length > 0 ? (
          <>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", 
              gap: "24px" 
            }}>
              {results.map((item) => (
                <Link 
                  href={`/movies/${item.media_type}/${item.id}`} 
                  key={item.id}
                  style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", transition: "transform 0.2s ease" }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <div style={{ 
                    width: "100%", 
                    aspectRatio: "2/3", 
                    backgroundColor: "var(--border)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    marginBottom: "12px",
                    position: "relative",
                    boxShadow: "var(--shadow-sm)"
                  }}>
                    {item.poster_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
                        alt={item.title || item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9aa0a6" }}>
                        No Image
                      </div>
                    )}
                    <div style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: "rgba(0,0,0,0.7)",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      backdropFilter: "blur(4px)"
                    }}>
                      {item.media_type === 'movie' ? 'Movie' : 'TV'}
                    </div>
                  </div>
                  <div style={{ fontWeight: "600", fontSize: "16px", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.title || item.name}
                  </div>
                  <div style={{ fontSize: "14px", color: "#5f6368" }}>
                    {(item.release_date || item.first_air_date || "").split("-")[0]}
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : searchParams.get("q") ? (
          <div style={{ textAlign: "center", color: "#5f6368", padding: "48px" }}>
            No results found for &quot;{searchParams.get("q")}&quot;
          </div>
        ) : null}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}} />
    </main>
  );
}
