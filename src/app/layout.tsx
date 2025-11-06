import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import Loader from "./components/Loader";
import MobileTest from "./components/MobileTest";
import Nav from "./components/Nav";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "AMCA - careers",
  description: "Amca is building airplanes for the 21st century, starting by designing new hardware that flies on today’s planes. We’re a team of engineers creating new parts and subsystems to launch our civilization’s next great airplane. Everyone here moves fast, speaks honestly, and takes full ownership of their work. Everything we design goes on planes today that millions of people fly on. But we’re just getting started, and we’d love your help bringing new life to aerospace.",
  keywords: [  
    "aerospace jobs",
    "aerospace careers",
    "spacex careers",
    "aerospace startup jobs",
    "aerospace talent",
    "aviation jobs",
    "aviation startup jobs",
    "high-growth startup jobs",
    "aviation careers",
    "fast-paced careers"
  ],
  openGraph: {
    title: "Amca Careers",
    description: "Amca is building airplanes for the 21st century, starting by designing new hardware that flies on today’s planes. We’re a team of engineers creating new parts and subsystems to launch our civilization’s next great airplane. Everyone here moves fast, speaks honestly, and takes full ownership of their work. Everything we design goes on planes today that millions of people fly on. But we’re just getting started, and we’d love your help bringing new life to aerospace.",
    url: "https://careers.amca.com",
    siteName: "Amca Careers",
    type: "website",
  },
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
        <Analytics />
      </body>
    </html>
  );
}
