import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: {
    template: "%s | NanoLink",
    default: "NanoLink – The Premium URL Shortener",
  },
  description: "A fast, smart, and beautiful URL shortener built for product engineers. Secure your links, track analytics, and manage access with ease.",
  metadataBase: new URL("http://localhost:3000"), // TODO: Change to prod URL
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nanolink.app", // Replace with real URL later
    siteName: "NanoLink",
    title: "NanoLink – Intelligent Link Management",
    description: "Scale your impact with intelligent routing and beautiful link management.",
    images: [{ url: "/icon.png", width: 800, height: 600, alt: "NanoLink Cover" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NanoLink",
    description: "Scale your impact with intelligent routing.",
    images: ["/icon.png"],
  },
  icons: {
    icon: "/icon.png",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
