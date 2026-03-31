import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner"; // 1. Import Toaster
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marketplace System",
  description: "Frontend foundation for the used-items marketplace app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--surface)] text-[var(--foreground)]">
        <AuthProvider>
          <CartProvider>
            {/* 2. CHÈN HEADER Ở ĐÂY */}
            <Header />

            <main className="flex-1">{children}</main>

            <Footer />

            <Toaster
              position="top-right"
              richColors
              expand={false}
              closeButton
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}