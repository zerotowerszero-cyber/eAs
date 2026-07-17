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
}

export default function VideoPlayer({ type, tmdbId, season, episode }: VideoPlayerProps) {
  const [activeProvider, setActiveProvider] = useState<Provider>(PROVIDERS[0]);
  const [iframeKey, setIframeKey] = useState(0); // To force reload iframe
  const [isFullscreen, setIsFullscreen] = useState(false);

  const url = activeProvider.getUrl(type, tmdbId, season, episode);

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provider = PROVIDERS.find(p => p.id === e.target.value);
    if (provider) {
      setActiveProvider(provider);
      setIframeKey(k => k + 1);
    }
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Video Player */}
      <div style={
        isFullscreen 
          ? { position: "fixed", top: 0, left: 0, width: "100vw", height: "100dvh", zIndex: 9999, background: "#000" }
          : { width: "100%", aspectRatio: "16/9", background: "#000", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-md)", position: "relative" }
      }>
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
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
          />
        )}
        
        {isFullscreen && (
          <button
            onClick={() => setIsFullscreen(false)}
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              background: "rgba(0,0,0,0.5)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 10000,
              backdropFilter: "blur(4px)"
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"></path><path d="M21 8h-3a2 2 0 0 1-2-2V3"></path><path d="M3 16h3a2 2 0 0 1 2 2v3"></path><path d="M16 21v-3a2 2 0 0 1 2-2h3"></path></svg>
          </button>
        )}
      </div>
        
      {/* Controls Below Player */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 0 16px 0" }}>
          <h3 style={{ margin: 0, fontSize: "18px" }}>Select Provider</h3>
          <button
            className="mobile-only"
            onClick={() => setIsFullscreen(true)}
            style={{
              background: "transparent",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              padding: "6px 16px",
              borderRadius: "40px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s ease"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"></path><path d="M21 8V5a2 2 0 0 0-2-2h-3"></path><path d="M3 16v3a2 2 0 0 0 2 2h3"></path><path d="M16 21h3a2 2 0 0 0 2-2v-3"></path></svg>
            Fullscreen
          </button>
        </div>
        <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "8px" }}>
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                const newProvider = PROVIDERS.find((prov) => prov.id === p.id);
                if (newProvider) {
                  setActiveProvider(newProvider);
                  setIframeKey(prev => prev + 1);
                }
              }}
              style={{
                background: activeProvider.id === p.id ? "var(--primary)" : "transparent",
                color: activeProvider.id === p.id ? "white" : "var(--foreground)",
                border: `1px solid ${activeProvider.id === p.id ? "var(--primary)" : "var(--border)"}`,
                padding: "8px 24px",
                borderRadius: "40px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontWeight: "500",
                transition: "all 0.2s ease"
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
