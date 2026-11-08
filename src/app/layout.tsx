import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const display = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Asif Book Store — School Books & Uniforms",
  description:
    "Authorized dealer for uniforms and course books of The City School and other reputed schools. Course packs, O/A Level books, revision guides and official uniforms.",
  icons: { icon: "/assets/images/logo.jpeg" },
};

export const viewport: Viewport = {
  themeColor: "#fcfaf6",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} antialiased`}
    >
      <head>
        {/* Marks JS as available so reveal targets can start hidden without a flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="min-h-dvh bg-cream font-sans text-ink">{children}</body>
    </html>
  );
}
