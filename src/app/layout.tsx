import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import Loader from "./components/Loader";
import MobileTest from "./components/MobileTest";
import Nav from "./components/Nav";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Amca - Careers",
  description: "Amca is building airplanes for the 21st century, starting by designing new hardware that flies on today’s planes. We’re a team of engineers creating new parts and subsystems to launch our civilization’s next great airplane.",
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
    title: "Amca - Careers",
    description: "Amca is building airplanes for the 21st century, starting by designing new hardware that flies on today’s planes. We’re a team of engineers creating new parts and subsystems to launch our civilization’s next great airplane.",
    url: "https://careers.amca.com",
    siteName: "Amca Careers",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://careers.amca.com/og.jpg",
        width: 1200,
        height: 630,
        alt: "Amca Careers",
      },
    ]
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
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
    />
    <script
      dangerouslySetInnerHTML={{
        __html: `
          history.scrollRestoration = "manual";
          (function() {
            document.documentElement.style.touchAction = 'manipulation';
            document.documentElement.addEventListener('gesturestart', function(e) { e.preventDefault(); });
            document.documentElement.style.overflow = "hidden";
          })();
        `
      }}
    />
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
