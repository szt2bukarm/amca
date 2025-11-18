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
      if (isMobile) return;
      location.reload();
    };
   
    window.addEventListener("resize", handleResize);
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  useEffect(() => {
    if (!gsap) return;
    gsap.config({ nullTargetWarn: false });
    ScrollTrigger.config({ ignoreMobileResize: true });
  }, [gsap]);


  return (
    <ReactLenis
      className="current-page"
      root
      options={{
        lerp: 0.05,
        duration: 1.5,
      }}
    >
      <div
        className="w-full h-full opacity-0 transition-opacity duration-300"
        style={{ opacity: loaded ? 1 : 0 }}
      >
        {children}
      </div>
    </ReactLenis>
  );
}

export default SmoothScroll;
