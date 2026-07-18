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
  const [selectedSeason, setSelectedSeason] = useState<number>(0);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(0);
  const [seasonDetails, setSeasonDetails] = useState<any>(null);
  
  // Info Modal State
  const [hoveredEpisode, setHoveredEpisode] = useState<number | null>(null);
  const [selectedInfo, setSelectedInfo] = useState<any>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/49218/details?type=${type}&id=${id}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to load details");
        }
        
        setDetails(data);
        
        if (type === "tv" && data.seasons && data.seasons.length > 0) {
          const savedProgress = localStorage.getItem(`eas_progress_${id}`);
          if (savedProgress) {
            const { s, e } = JSON.parse(savedProgress);
            setSelectedSeason(s);
            setSelectedEpisode(e);
          } else {
            const firstRealSeason = data.seasons.find((s: any) => s.season_number > 0) || data.seasons[0];
            setSelectedSeason(firstRealSeason.season_number);
          }
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
        const res = await fetch(`/api/49218/season?id=${id}&season=${selectedSeason}`);
        const data = await res.json();
        if (res.ok) {
          setSeasonDetails(data);
          // Auto-select episode 1 when changing seasons if it exists and no episode is selected
          if (data.episodes && data.episodes.length > 0 && selectedEpisode === 0) {
            setSelectedEpisode(data.episodes[0].episode_number);
          }
        }
      } catch (e) {
        console.error("Failed to load season", e);
      }
    };
    fetchSeason();
  }, [id, type, selectedSeason]);

  // Save progress when it changes (and is fully loaded)
  useEffect(() => {
    if (type === "tv" && selectedSeason > 0 && selectedEpisode > 0) {
      localStorage.setItem(`eas_progress_${id}`, JSON.stringify({ s: selectedSeason, e: selectedEpisode }));
    }
  }, [id, type, selectedSeason, selectedEpisode]);

  const handleSeasonChange = (sNum: number) => {
    setSelectedSeason(sNum);
    setSelectedEpisode(0); // Will auto-select episode 1 via the fetchSeason effect
  };

  const handleEpisodeChange = (epNum: number) => {
    setSelectedEpisode(epNum);
  };

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
          <Link href="/49218" style={{ color: "var(--primary)", textDecoration: "underline" }}>Back to Search</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      
      <div style={{ flex: 1, padding: "96px 24px 32px 24px", maxWidth: "1200px", margin: "0 auto", width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "32px" }}>
        
        <div>
          <Link href="/49218" style={{ color: "var(--foreground)", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", fontWeight: "500", opacity: 0.7 }}>
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
        {type === 'tv' && seasonDetails && (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px", width: "100%" }}>
            <div>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "18px" }}>Select Episode</h3>
            
              <div style={{ display: "flex", gap: "16px", marginBottom: "24px", overflowX: "auto", paddingBottom: "8px" }}>
                {details.seasons.map((s: any) => (
                  <button
                    key={s.id}
                    onClick={() => handleSeasonChange(s.season_number)}
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
                      onClick={() => handleEpisodeChange(ep.episode_number)}
                      onMouseEnter={() => setHoveredEpisode(ep.episode_number)}
                      onMouseLeave={() => setHoveredEpisode(null)}
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
                      <div style={{ overflow: "hidden", flex: 1 }}>
                        <div style={{ fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--foreground)" }}>
                          {ep.name}
                        </div>
                        <div style={{ fontSize: "12px", color: "#5f6368" }}>
                          {ep.runtime ? `${ep.runtime} min` : "TBA"}
                        </div>
                      </div>
                      {hoveredEpisode === ep.episode_number && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInfo({
                              title: `S${selectedSeason} E${ep.episode_number}: ${ep.name}`,
                              overview: ep.overview || details.overview,
                              releaseDate: ep.air_date,
                              rating: ep.vote_average,
                              previewImage: ep.still_path ? `https://image.tmdb.org/t/p/w780${ep.still_path}` : (details.backdrop_path ? `https://image.tmdb.org/t/p/w1280${details.backdrop_path}` : undefined)
                            });
                          }}
                          style={{
                            background: "var(--surface)",
                            color: "var(--foreground)",
                            border: "1px solid var(--border)",
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            boxShadow: "var(--shadow-sm)",
                            marginLeft: "auto",
                            flexShrink: 0
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Media Details */}
        <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
          {details.poster_path && (
            <img 
              src={`https://image.tmdb.org/t/p/w500${details.poster_path}`} 
              alt={details.title || details.name}
              style={{ width: "240px", borderRadius: "12px", boxShadow: "var(--shadow-md)", objectFit: "cover", flexShrink: 0 }}
            />
          )}
          <div style={{ flex: "1 1 400px" }}>
            <h1 className="hero-title" style={{ fontSize: "clamp(24px, 4vw, 40px)", margin: "0 0 12px 0", textAlign: "left", display: "flex", alignItems: "center", gap: "16px" }}>
              {details.title || details.name}
              {type === 'movie' && (
                <button
                  onClick={() => setSelectedInfo({
                    title: details.title || details.name,
                    overview: details.overview,
                    releaseDate: details.release_date,
                    rating: details.vote_average,
                    previewImage: details.backdrop_path ? `https://image.tmdb.org/t/p/w1280${details.backdrop_path}` : undefined
                  })}
                  style={{
                    background: "transparent",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  title="More Info"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </button>
              )}
            </h1>
            <div style={{ display: "flex", gap: "16px", color: "#5f6368", marginBottom: "24px", fontSize: "16px", fontWeight: "500", flexWrap: "wrap" }}>
              <span>{(details.release_date || details.first_air_date || "").split("-")[0]}</span>
              <span>•</span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#f29900" stroke="#f29900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                {details.vote_average?.toFixed(1)} / 10
              </span>
              {details.genres && (
                <>
                  <span>•</span>
                  <span>{details.genres.map((g: any) => g.name).join(", ")}</span>
                </>
              )}
            </div>
            
            <p style={{ lineHeight: 1.7, color: "var(--foreground)", fontSize: "18px" }}>
              {details.overview}
            </p>
          </div>
        </div>

        {/* Info Modal Overlay */}
        {selectedInfo && (
          <div 
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
              padding: "24px"
            }}
            onClick={() => setSelectedInfo(null)}
          >
            <div 
              style={{
                background: "var(--surface)",
                borderRadius: "24px",
                width: "100%",
                maxWidth: "600px",
                overflow: "hidden",
                boxShadow: "0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)",
                display: "flex",
                flexDirection: "column",
                color: "var(--foreground)",
                maxHeight: "90vh",
                overflowY: "auto"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {selectedInfo.previewImage && (
                <div style={{ width: "100%", height: "240px" }}>
                  <img 
                    src={selectedInfo.previewImage} 
                    alt={selectedInfo.title} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                </div>
              )}
              
              <div style={{ padding: "24px" }}>
                <h2 style={{ fontSize: "28px", margin: "0 0 12px 0", fontWeight: "600", color: "var(--foreground)" }}>
                  {selectedInfo.title}
                </h2>
                
                <div style={{ display: "flex", gap: "16px", marginBottom: "16px", fontSize: "14px", fontWeight: "500", color: "#9aa0a6" }}>
                  {selectedInfo.releaseDate && <span>{selectedInfo.releaseDate}</span>}
                  {selectedInfo.releaseDate && selectedInfo.rating && <span>•</span>}
                  {selectedInfo.rating && (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#f29900" stroke="#f29900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      {selectedInfo.rating.toFixed(1)}
                    </span>
                  )}
                </div>
                
                <p style={{ fontSize: "16px", lineHeight: "1.6", color: "var(--foreground)", margin: 0 }}>
                  {selectedInfo.overview || "No description available."}
                </p>
                
                <button 
                  onClick={() => setSelectedInfo(null)}
                  style={{
                    marginTop: "24px",
                    width: "100%",
                    padding: "12px",
                    background: "var(--primary)",
                    color: "white",
                    border: "none",
                    borderRadius: "32px",
                    fontSize: "16px",
                    fontWeight: "500",
                    cursor: "pointer"
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
