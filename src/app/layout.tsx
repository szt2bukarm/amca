import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import Loader from "./components/Loader";
import MobileTest from "./components/MobileTest";
import Nav from "./components/Nav";

export const metadata: Metadata = {
  title: "AMCA - careers",
  description: "",
  icons: {
    icon: "/favicon.png",
  }
};

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
      <link rel="favicon" href="/favicon.png" />
      <body
      >
        <MobileTest />
        <Loader />
        <Nav />
        <SmoothScroll>
        {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
