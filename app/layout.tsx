import "@livekit/components-styles";
import { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const fontSans = Montserrat({
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lamigo",
  description: "Your personal champion who never sleeps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${fontSans.className}`}>
      <body className="h-full">
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
