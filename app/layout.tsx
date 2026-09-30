import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { StoreProvider } from "@/components/StoreProvider";
import { SessionProvider } from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Wallora — Find a wallpaper that feels like you",
  description: "Discover wallpapers for every mood, screen and style. Browse, download, upload and generate custom AI wallpapers.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Wallora" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans bg-[#0D0D0D] light:bg-[#FAF9F6] text-[#F5F5F5] light:text-neutral-900 min-h-screen">
        <SessionProvider>
          <ThemeProvider>
            <StoreProvider>
              <Navbar transparent={false} />
              <div className="pt-16">
                <main id="main" className="min-h-[70vh]">{children}</main>
              </div>
              <Footer />
              <MobileBottomNav />
            </StoreProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
