import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "eAs",
  description: "We are focused on making anything that is coding: websites, browsers, apps, or bots.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Product+Sans&amp;family=Google+Sans+Display:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&amp;family=Google+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&amp;family=Google+Sans+Text:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&amp;family=Google+Sans+Mono:wght@400;500;700&amp;family=Roboto+Mono:wght@400;500;700&amp;display=swap" />
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const matcher = window.matchMedia('(prefers-color-scheme: dark)');
              matcher.addEventListener('change', () => {
                const icon = document.querySelector('link[rel="icon"]');
                if (icon) {
                  const currentHref = icon.href.split('?')[0];
                  icon.href = currentHref + '?v=' + Date.now();
                }
              });
            })();
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
