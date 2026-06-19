import type { Metadata } from "next";
import "./globals.css";

// Root layout is intentionally minimal: the per-tenant <html> theming,
// Navbar and Footer live in the tenant route group (app/_site/...), so
// the platform shell (builder, marketing) can use a different chrome.

export const metadata: Metadata = {
  title: "RentStack",
  description: "Multi-tenant car-rental site platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        />
      </head>
      <body className="font-body">{children}</body>
    </html>
  );
}
