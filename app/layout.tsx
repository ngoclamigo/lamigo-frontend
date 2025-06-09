import "@livekit/components-styles";
import { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";

const rubik = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lamigo AI",
  description: "Your personal champion who never sleeps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${rubik.className}`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
