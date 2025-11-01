import type { Metadata } from "next";
import "./globals.css";
import Logo from "./components/Logo";
import SmoothScroll from "./components/SmoothScroll";
import Loader from "./components/Loader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <Loader />
        <Logo />
        <SmoothScroll>
        {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
