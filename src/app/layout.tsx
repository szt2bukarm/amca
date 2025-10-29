import type { Metadata } from "next";
import "./globals.css";
import Logo from "./components/Logo";
import SmoothScroll from "./components/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <Logo />
        <SmoothScroll>
        {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
