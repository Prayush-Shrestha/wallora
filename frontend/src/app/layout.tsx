import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "../hooks/useAuth";
import { Navbar } from "../components/navbar/Navbar";
import { Footer } from "../components/footer/Footer";
import { Toaster } from "../components/ui/Toast";
import { ThemeProvider, ThemeScript } from "../components/ui/Theme";

export const metadata: Metadata = {
  title: "Wallora — 4K & Ultra HD Wallpapers",
  description: "Discover curated 4K, Desktop, Phone and AI-generated wallpapers for every screen.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "Wallora — 4K & Ultra HD Wallpapers",
    description: "Discover curated 4K, Desktop, Phone and AI-generated wallpapers for every screen.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#08090C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="bg-base text-strong min-h-screen flex flex-col antialiased selection:bg-accent selection:text-accent-ink">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

