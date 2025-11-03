import type { Metadata } from "next";
import "./globals.css";
import Logo from "./components/Logo";
import SmoothScroll from "./components/SmoothScroll";
import Loader from "./components/Loader";
import MobileTest from "./components/MobileTest";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <script dangerouslySetInnerHTML={{ __html: `history.scrollRestoration = "manual"` }} />
      </head>
      <body
      >
        <MobileTest />
        <Loader />
        <Logo />
        <SmoothScroll>
        {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
