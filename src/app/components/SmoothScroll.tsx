"use client";
import { useStore } from "@/app/useStore";
import { ReactLenis } from "@studio-freight/react-lenis";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import ScrollTrigger from "gsap/src/ScrollTrigger";
gsap.registerPlugin(CustomEase,ScrollTrigger);

function SmoothScroll({ children }: { children: React.ReactNode }) {
    const {loaded} = useStore();
    gsap.config({
      nullTargetWarn: false,
    });
    ScrollTrigger.config({
      ignoreMobileResize: true
    })

    
    if (!loaded) return;

  return (
    <ReactLenis className="current-page" root options={{ lerp: 0.05, duration: 1.5 }}>
      {children}
    </ReactLenis>
  );
}

export default SmoothScroll;