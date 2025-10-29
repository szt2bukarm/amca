"use client";
import { useStore } from "@/app/useStore";
import { ReactLenis } from "@studio-freight/react-lenis";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
gsap.registerPlugin(CustomEase);

function SmoothScroll({ children }: { children: React.ReactNode }) {
    gsap.config({
      nullTargetWarn: false,
    });

  return (
    <ReactLenis className="current-page" root options={{ lerp: 0.1, duration: 1 }}>
      {children}
    </ReactLenis>
  );
}

export default SmoothScroll;