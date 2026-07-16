"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import VideoPlayer from "@/components/VideoPlayer";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function MovieDetailsPage() {
  const params = useParams();
  const type = params.type as "movie" | "tv";
  const id = params.id as string;

  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TV Show State
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [seasonDetails, setSeasonDetails] = useState<any>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/movies/details?type=${type}&id=${id}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to load details");
        }
        
        setDetails(data);
        
        // If it's a TV show, try to find the first valid season (sometimes season 0 is specials)
        if (type === "tv" && data.seasons && data.seasons.length > 0) {
          const firstRealSeason = data.seasons.find((s: any) => s.season_number > 0) || data.seasons[0];
          setSelectedSeason(firstRealSeason.season_number);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [type, id]);

  useEffect(() => {
    const fetchSeason = async () => {
      if (type !== "tv" || !selectedSeason) return;
      try {
        const res = await fetch(`/api/movies/season?id=${id}&season=${selectedSeason}`);
        const data = await res.json();
        if (res.ok) {
          setSeasonDetails(data);
          // Auto-select episode 1 when changing seasons if it exists
          if (data.episodes && data.episodes.length > 0) {
            setSelectedEpisode(data.episodes[0].episode_number);
          }
        }
      } catch (e) {
        console.error("Failed to load season", e);
      }
    };
    fetchSeason();
  }, [id, type, selectedSeason]);

  if (loading) {
    return (
      <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
           <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
        </div>
        <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
      </main>
    );
  }

  if (error || !details) {
    return (
      <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#d93025", gap: "16px" }}>
          <div>{error || "Failed to load media"}</div>
          <Link href="/movies" style={{ color: "var(--primary)", textDecoration: "underline" }}>Back to Search</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      
      <div style={{ flex: 1, padding: "32px 24px", maxWidth: "1200px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        
        <div style={{ marginBottom: "24px" }}>
          <Link href="/movies" style={{ color: "var(--foreground)", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", fontWeight: "500", opacity: 0.7 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to Search
          </Link>
        </div>

        <VideoPlayer 
          type={type} 
          tmdbId={id} 
          season={type === 'tv' ? selectedSeason : undefined} 
          episode={type === 'tv' ? selectedEpisode : undefined} 
        />

        {/* Season & Episode Selector for TV Shows */}
        {type === 'tv' && details.seasons && (
          <div style={{ marginTop: "24px", padding: "24px", background: "var(--surface)", borderRadius: "16px", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "18px" }}>Select Episode</h3>
            
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px", overflowX: "auto", paddingBottom: "8px" }}>
              {details.seasons.map((s: any) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSeason(s.season_number)}
                  style={{
                    background: selectedSeason === s.season_number ? "var(--primary)" : "transparent",
                    color: selectedSeason === s.season_number ? "white" : "var(--foreground)",
                    border: `1px solid ${selectedSeason === s.season_number ? "var(--primary)" : "var(--border)"}`,
                    padding: "8px 24px",
                    borderRadius: "40px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    fontWeight: "500",
                    transition: "all 0.2s ease"
                  }}
                >
                  {s.name}
                </button>
              ))}
            </div>

            {seasonDetails && seasonDetails.episodes && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "12px", maxHeight: "300px", overflowY: "auto", paddingRight: "8px" }}>
                {seasonDetails.episodes.map((ep: any) => (
                  <button
                    key={ep.id}
                    onClick={() => setSelectedEpisode(ep.episode_number)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      background: selectedEpisode === ep.episode_number ? "rgba(26, 115, 232, 0.1)" : "transparent",
                      border: `1px solid ${selectedEpisode === ep.episode_number ? "var(--primary)" : "var(--border)"}`,
                      padding: "12px 16px",
                      borderRadius: "40px",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div style={{ 
                      width: "32px", 
                      height: "32px", 
                      background: selectedEpisode === ep.episode_number ? "var(--primary)" : "var(--border)", 
                      color: selectedEpisode === ep.episode_number ? "white" : "inherit",
                      borderRadius: "50%", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      fontWeight: "600",
                      flexShrink: 0
                    }}>
                      {ep.episode_number}
                    </div>
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--foreground)" }}>
                        {ep.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#5f6368" }}>
                        {ep.runtime ? `${ep.runtime} min` : "TBA"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Media Details */}
        <div style={{ marginTop: "32px", display: "flex", gap: "32px", flexWrap: "wrap" }}>
          {details.poster_path && (
            <img 
              src={`https://image.tmdb.org/t/p/w500${details.poster_path}`} 
              alt={details.title || details.name}
              style={{ width: "200px", borderRadius: "12px", boxShadow: "var(--shadow-md)", objectFit: "cover", flexShrink: 0 }}
            />
          )}
          <div style={{ flex: "1 1 400px" }}>
            <h1 className="hero-title" style={{ fontSize: "clamp(24px, 4vw, 40px)", margin: "0 0 8px 0" }}>
              {details.title || details.name}
            </h1>
            <div style={{ display: "flex", gap: "16px", color: "#5f6368", marginBottom: "16px", fontSize: "14px", fontWeight: "500", flexWrap: "wrap" }}>
              <span>{(details.release_date || details.first_air_date || "").split("-")[0]}</span>
              <span>•</span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#f29900" stroke="#f29900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                {details.vote_average?.toFixed(1)} / 10
              </span>
              {details.genres && (
                <>
                  <span>•</span>
                  <span>{details.genres.map((g: any) => g.name).join(", ")}</span>
                </>
              )}
            </div>
            
            <p style={{ lineHeight: 1.6, color: "var(--foreground)", fontSize: "16px" }}>
              {details.overview}
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
