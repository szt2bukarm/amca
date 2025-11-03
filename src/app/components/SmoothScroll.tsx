"use client";
import { useStore } from "@/app/useStore";
import { ReactLenis } from "@studio-freight/react-lenis";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(CustomEase, ScrollTrigger);

function SmoothScroll({ children }: { children: React.ReactNode }) {
  const { loaded, isMobile } = useStore();
  
  useEffect(() => {
    const handleResize = () => {
      location.reload();
    };
  
    window.addEventListener("resize", handleResize);
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  gsap.config({ nullTargetWarn: false });
  ScrollTrigger.config({ ignoreMobileResize: true });



  if (!loaded) return null;

  return (
    <ReactLenis
      className="current-page"
      root
      options={{
        lerp: 0.05,
        duration: 1.5,
      }}
    >
      {children}
    </ReactLenis>
  );
}

export default SmoothScroll;
