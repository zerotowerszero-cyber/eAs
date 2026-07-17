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
      </div>
        
      {/* Controls Below Player */}
      <div>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "18px" }}>Select Provider</h3>
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
