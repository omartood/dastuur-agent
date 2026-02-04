import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Use system fonts or google fonts as configured later. For now just basic.
// We can use the default fonts from create-next-app safely.
// Actually, to be safe and avoid missing font files, I'll use standard fonts or just remove the localFont imports for now and stick to Tailwind sans.

const siteConfig = {
  name: "Dastuur Agent",
  description: "Intelligent AI-powered assistant for the Somali Provisional Constitution. Ask questions and get accurate answers using advanced RAG technology.",
  url: "https://dastuur.omartood.com",
  ogImage: "/og-image.png", // Assuming an image will be provided or I can generate one
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Somali Constitution",
    "Somalia Law",
    "AI Assistant",
    "Dastuur",
    "Somali Provisional Constitution",
    "RAG",
    "Legal AI",
  ],
  authors: [
    {
      name: "Omartood",
      url: "https://omartood.com",
    },
  ],
  creator: "Omartood",
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@omartood",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
