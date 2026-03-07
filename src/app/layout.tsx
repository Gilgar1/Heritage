import type { Metadata } from "next";
import "./globals.css";
import { HeritageProvider } from "@/context/HeritageContext";

export const metadata: Metadata = {
  title: "Heritage – Preserve Your African Identity",
  description: "A digital platform for Cameroonians to preserve lineage, document identity, and maintain structured family trees within a privacy-aware system.",
  keywords: ["heritage", "cameroon", "family tree", "lineage", "identity", "africa", "genealogy"],
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <HeritageProvider>
          {children}
        </HeritageProvider>
      </body>
    </html>
  );
}
