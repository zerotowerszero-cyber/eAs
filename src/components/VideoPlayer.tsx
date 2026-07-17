"use client";

import { useState } from "react";

type Provider = {
  id: string;
  name: string;
  getUrl: (type: "movie" | "tv", tmdbId: string, season?: number, episode?: number) => string;
};

const PROVIDERS: Provider[] = [
  {
    id: "cinesrc",
    name: "CineSrc (Recommended)",
    getUrl: (type, id, s, e) => `https://cinesrc.st/embed/${type}/${id}${type === "tv" ? `?s=${s}&e=${e}` : ""}`
  },
  {
    id: "vidlink",
    name: "VidLink (Fast)",
    getUrl: (type, id, s, e) => `https://vidlink.pro/${type}/${id}${type === "tv" ? `/${s}/${e}` : ""}`
  },
  {
    id: "vidfast",
    name: "VidFast",
    getUrl: (type, id, s, e) => `https://vidfast.pro/${type}/${id}${type === "tv" ? `/${s}/${e}` : ""}`
  },
  {
    id: "videasy",
    name: "VidEasy",
    getUrl: (type, id, s, e) => `https://videasy.net/embed/${type}/${id}${type === "tv" ? `/${s}/${e}` : ""}`
  },
  {
    id: "fmovies",
    name: "FMovies",
    getUrl: (type, id, s, e) => `https://www.fmovies.gd/${type}/${id}${type === "tv" ? `/${s}/${e}` : ""}`
  },
  {
    id: "vidzee",
    name: "VidZee",
    getUrl: (type, id, s, e) => `https://vidzee.wtf/embed/${type}/${id}${type === "tv" ? `/${s}/${e}` : ""}`
  },
  {
    id: "vixsrc",
    name: "VixSrc",
    getUrl: (type, id, s, e) => `https://vixsrc.to/${type}/${id}${type === "tv" ? `/${s}/${e}` : ""}`
  },
  {
    id: "vidnest",
    name: "VidNest",
    getUrl: (type, id, s, e) => `https://vidnest.fun/${type}/${id}${type === "tv" ? `/${s}/${e}` : ""}`
  },
  {
    id: "primewire",
    name: "PrimeWire",
    getUrl: (type, id, s, e) => `https://primewire.mov/${type}/${id}${type === "tv" ? `?s=${s}&e=${e}` : ""}`
  },
  {
    id: "aeon-watch",
    name: "Aeon-Watch",
    getUrl: (type, id, s, e) => `https://thisiscinema.pages.dev/embed/${type}/${id}${type === "tv" ? `/${s}/${e}` : ""}`
  },
  {
    id: "vidsrc-me",
    name: "VidSrc.me",
    getUrl: (type, id, s, e) => type === "movie" 
      ? `https://vidsrc.me/embed/movie?tmdb=${id}` 
      : `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`
  },
  {
    id: "vidsrc-to",
    name: "VidSrc.to",
    getUrl: (type, id, s, e) => `https://vidsrc.to/embed/${type}/${id}${type === "tv" ? `/${s}/${e}` : ""}`
  },
  {
    id: "vidsrc-pro",
    name: "VidSrc.pro",
    getUrl: (type, id, s, e) => `https://vidsrc.pro/embed/${type}/${id}${type === "tv" ? `/${s}/${e}` : ""}`
  },
  {
    id: "superembed",
    name: "SuperEmbed",
    getUrl: (type, id, s, e) => type === "movie"
      ? `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`
      : `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${s}&e=${e}`
  },
  {
    id: "embedsu",
    name: "Embed.su",
    getUrl: (type, id, s, e) => `https://embed.su/embed/${type}/${id}${type === "tv" ? `/${s}/${e}` : ""}`
  },
  {
    id: "autoembed",
    name: "AutoEmbed",
    getUrl: (type, id, s, e) => `https://player.autoembed.cc/embed/${type}/${id}${type === "tv" ? `/${s}/${e}` : ""}`
  },
  {
    id: "2embed",
    name: "2Embed",
    getUrl: (type, id, s, e) => type === "movie"
      ? `https://www.2embed.cc/embed/${id}`
      : `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`
  }
];

interface VideoPlayerProps {
  type: "movie" | "tv";
  tmdbId: string;
  season?: number;
  episode?: number;
  info?: {
    title: string;
    overview: string;
    releaseDate?: string;
    rating?: number;
    previewImage?: string;
  };
}

export default function VideoPlayer({ type, tmdbId, season, episode, info }: VideoPlayerProps) {
  const [activeProvider, setActiveProvider] = useState<Provider>(PROVIDERS[0]);
  const [iframeKey, setIframeKey] = useState(0); // To force reload iframe
  const [showInfo, setShowInfo] = useState(false);

  const url = activeProvider.getUrl(type, tmdbId, season, episode);

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provider = PROVIDERS.find(p => p.id === e.target.value);
    if (provider) {
      setActiveProvider(provider);
      setIframeKey(k => k + 1);
    }
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Provider Selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)", padding: "12px 24px", borderRadius: "40px", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "500", color: "var(--foreground)" }}>
          Server / Provider
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {info && (
            <button
              onClick={() => setShowInfo(!showInfo)}
              style={{
                background: showInfo ? "var(--primary)" : "transparent",
                color: showInfo ? "white" : "var(--foreground)",
                border: "1px solid var(--border)",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              title="More Info"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </button>
          )}
          <select 
            value={activeProvider.id}
            onChange={handleProviderChange}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "40px",
              padding: "8px 32px 8px 16px",
              fontSize: "14px",
              color: "var(--foreground)",
              outline: "none",
              cursor: "pointer",
              appearance: "none",
              backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%235f6368%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px top 50%",
              backgroundSize: "12px auto"
            }}
          >
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Video Player */}
      <div style={{ 
        width: "100%", 
        aspectRatio: "16/9", 
        background: "#000", 
        borderRadius: "16px", 
        overflow: "hidden",
        boxShadow: "var(--shadow-md)"
      }}>
        {type === 'tv' && (!season || !episode) ? (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
            Please select a season and episode to start watching.
          </div>
        ) : (
          <iframe
            key={iframeKey}
            src={url}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            allowFullScreen
            allow="autoplay; encrypted-media"
          />
        )}
        
        {/* Info Modal Overlay */}
        {showInfo && info && (
          <div 
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              padding: "24px"
            }}
            onClick={() => setShowInfo(false)}
          >
            <div 
              style={{
                background: "var(--surface)",
                borderRadius: "24px",
                width: "100%",
                maxWidth: "600px",
                overflow: "hidden",
                boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
                display: "flex",
                flexDirection: "column",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "var(--foreground)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {info.previewImage && (
                <div style={{ width: "100%", height: "240px", position: "relative" }}>
                  <img 
                    src={info.previewImage} 
                    alt={info.title} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "120px", background: "linear-gradient(to top, var(--surface), transparent)" }} />
                </div>
              )}
              
              <div style={{ padding: "24px", marginTop: info.previewImage ? "-48px" : "0", position: "relative", zIndex: 2 }}>
                <h2 style={{ fontSize: "28px", margin: "0 0 12px 0", fontWeight: "600", color: "var(--foreground)", textShadow: info.previewImage ? "0 2px 4px rgba(0,0,0,0.5)" : "none" }}>
                  {info.title}
                </h2>
                
                <div style={{ display: "flex", gap: "16px", marginBottom: "16px", fontSize: "14px", fontWeight: "500", color: "#9aa0a6" }}>
                  {info.releaseDate && <span>{info.releaseDate}</span>}
                  {info.releaseDate && info.rating && <span>•</span>}
                  {info.rating && (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#f29900" stroke="#f29900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      {info.rating.toFixed(1)}
                    </span>
                  )}
                </div>
                
                <p style={{ fontSize: "16px", lineHeight: "1.6", color: "var(--foreground)", margin: 0 }}>
                  {info.overview || "No description available."}
                </p>
                
                <button 
                  onClick={() => setShowInfo(false)}
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
    </div>
  );
}
