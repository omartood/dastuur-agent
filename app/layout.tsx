import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Use system fonts or google fonts as configured later. For now just basic.
// We can use the default fonts from create-next-app safely.
// Actually, to be safe and avoid missing font files, I'll use standard fonts or just remove the localFont imports for now and stick to Tailwind sans.

export const metadata: Metadata = {
  title: "Somali Constitution AI",
  description: "Legal retrieval QA system for the Somali Federal Constitution",
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
