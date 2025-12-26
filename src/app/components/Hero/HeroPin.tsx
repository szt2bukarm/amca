"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";
import { useStore } from "@/app/useStore";
import { useGSAP } from "@gsap/react";
import { useLenis } from "@studio-freight/react-lenis";

gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText);

export default function HeroPin() {
  const { loadedHeroFrames, loaded, isMobile } = useStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const [introDone, setIntroDone] = useState(false);
  const [idle, setIdle] = useState(1);
  const [mounted, setMounted] = useState(false);

  const lenis = useLenis();
  CustomEase.create("cEase", "M0,0 C0.075,0.82 0.165,1 1,1");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Idle animation timer
  useEffect(() => {
    if (typeof window === "undefined" || !lenis) return;
    lenis.stop();
    const interval = setInterval(() => {
      setIdle((prev) => (prev + 1) % 2);
    }, 1000);
    return () => clearInterval(interval);
  }, [lenis]);

  // Canvas Drawing & Resize Logic
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!loaded || !loadedHeroFrames.length || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const mobileCap = isMobile ? 1.5 : 2;
    const dpr = Math.min(window.devicePixelRatio || 1, mobileCap);
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;


    let frame = 0;
    const introFrames = 60;
    const introSpeed = isMobile ? 0.5 : 0.25;
    let animationFrameId: number;

    const drawImageCover = (image: HTMLImageElement) => {
      if (!ctx || !canvas) return;
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = image.width / image.height;
      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgRatio > canvasRatio) {
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Stable Resize Logic
    let lastWidth = window.innerWidth;
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const isWidthChange = Math.abs(newWidth - lastWidth) > 0.5;

      if (isWidthChange) {
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        const img = loadedHeroFrames[Math.floor(frame)];
        if (img) drawImageCover(img);
        lastWidth = newWidth;
      }
    };

    // Initial size
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    const initialImg = loadedHeroFrames[Math.floor(frame)];
    if (initialImg) drawImageCover(initialImg);

    window.addEventListener("resize", handleResize);

    // Intro Animation
    const playIntro = () => {
      if (frame >= introFrames) {
        setIntroDone(true);
        return;
      }
      const img = loadedHeroFrames[Math.floor(frame)];
      if (img) drawImageCover(img);
      frame += introSpeed;
      animationFrameId = requestAnimationFrame(playIntro);
    };

    let introTimer: NodeJS.Timeout;
    if (!introDone) {
      introTimer = setTimeout(() => {
        playIntro();
      }, isMobile ? 0 : 1200);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(introTimer);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [loaded, loadedHeroFrames]);

  // Scroll Controlled Animation
  useGSAP(() => {
    if (!introDone || !loadedHeroFrames.length || !canvasRef.current) return;

    const introFrames = 60;
    const frameCount = loadedHeroFrames.length - introFrames;
    let lastFrame = -1;

    const drawImageCover = (image: HTMLImageElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = image.width / image.height;
      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgRatio > canvasRatio) {
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      }
      ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    };

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top+=300 top",
      end: "bottom bottom",
      scrub: 0.3, 
      onUpdate: (self: ScrollTrigger) => {
        const progress = self.progress;
        const idx = Math.min((Math.floor(progress * frameCount) | 0) + introFrames, loadedHeroFrames.length - 1); // | 0 hint for integer

        if (idx !== lastFrame) {
          const img = loadedHeroFrames[idx];
          if (img) drawImageCover(img);
          lastFrame = idx;
        }
      }
    });

  }, [introDone, loadedHeroFrames]);

  // Unlock Scroll & Intro Complete
  useGSAP(() => {
    if (!introDone || !lenis) return;

    gsap.set("[data-gsap='idle-plane']", { opacity: 1 });
    gsap.to("[data-gsap='nav-careers']", { opacity: 1 });

    const timer = setTimeout(() => {
      lenis?.start();
      document.documentElement.style.overflow = "auto";
      document.documentElement.style.touchAction = "auto";
      // NO normalizeScroll here!
    }, 200);

    return () => clearTimeout(timer);
  }, [introDone, lenis]);

  // Plane Exit Animation
  useGSAP(() => {
    if (!introDone) return;

    const flyPlane = () => {
      const plane = "[data-gsap='plane-sky']";
      gsap.set(plane, {
        opacity: 1,
        scale: 1,
        y: window.innerHeight / 4,
        x: (window.innerWidth / 3.5) * -1
      });

      gsap.to(plane, {
        y: -150,
        x: -window.innerWidth / 1.5,
        scale: 0.5,
        duration: 2.2,
        ease: "linear",
        onComplete: () => {
          const delay = (Math.random() * (15 - 5) + 5) * 1000;
          setTimeout(flyPlane, delay);
        }
      });
    };

    const timer = setTimeout(flyPlane, 5000);
    return () => clearTimeout(timer);
  }, [introDone]);

  // Mouse Interaction (Desktop only optimization)
  useEffect(() => {
    if (isMobile || !introDone) return;

    const el = document.querySelector("[data-gsap='scroll-to-explore']") as HTMLElement;
    if (!el) return;

    const move = (e: MouseEvent) => {
      gsap.set(el, { x: e.clientX + 25, y: e.clientY - 5 });
      gsap.to(el, { opacity: 1, duration: 0.1, ease: "linear" });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [isMobile, introDone]);

  // Legacy Animations (Idle Plane Fade, Dimmer)
  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Idle Plane Fade Out
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top+=100 top",
        end: "top+=300 top",
        scrub: true,
        animation: gsap.to("[data-gsap='idle-plane']", { opacity: 0, ease: "linear", immediateRender: false }),
      });

      // Sky Plane Wrapper Fade Out
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top+=100 top",
        end: "top+=300 top",
        scrub: true,
        animation: gsap.fromTo("[data-gsap='plane-sky-wrapper']", { opacity: 1 }, { opacity: 0, ease: "linear", immediateRender: false }),
      });

      // Explore Text Fade Out
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top+=100 top",
        end: "top+=300 top",
        scrub: true,
        animation: gsap.fromTo("[data-gsap='scroll-to-explore-wrapper']", { opacity: 1 }, { opacity: 0, ease: "linear" }),
      });

      // Dimmer
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "bottom-=250 bottom",
        end: "bottom bottom",
        scrub: true,
        animation: gsap.fromTo("[data-gsap='hero-dim']", { opacity: 0 }, { opacity: 1, ease: "linear" }),
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: "calc(100dvh + 2000px)" }}>
      <div ref={stickyRef} className="sticky top-0 w-full h-[100vh] lg:h-[100vh] mobile:h-[100dvh] overflow-hidden will-change-transform">
        <div data-gsap="hero" className="relative w-full h-full">

          {/* Scroll to Explore (Mobile) - Dynamic Position - Isolated Layer */}
          <div className={`absolute top-0 left-0 w-full h-[100dvh] pointer-events-none z-[10] will-change-transform ${mounted && isMobile ? 'block' : 'hidden'}`}>
            <p className="absolute bottom-[20px] left-[20px] w-screen h-fit text-[20px] text-white font-progRegular pointer-events-auto">
              Scroll to explore
            </p>
          </div>

          <canvas
            ref={canvasRef}
            className="w-screen h-full object-cover block will-change-transform"
            style={{ transform: 'translate3d(0,0,0)' }} // Force GPU layer
          />

          {/* Sky Plane Wrapper - Hidden on Mobile via CSS */}
          <div
            data-gsap="plane-sky-wrapper"
            className="w-full h-full pointer-events-none z-1 absolute top-0 left-0 hidden lg:block"
          >
            <img
              alt="A plane in the sky"
              data-gsap="plane-sky"
              src="/plane_sky.avif"
              className="opacity-0 w-[150px] absolute top-0 right-0"
            />
          </div>

          {/* Idle Desktop Plane */}
          <div className="w-full h-full z-[2] absolute top-0 left-0 hidden lg:block" data-gsap="idle-plane-scroll">
            <div data-gsap="idle-plane" className="absolute left-0 top-0 w-screen h-full opacity-0">
              <img
                src={`/sequence/desktop/idle_transparent_${idle}.avif`}
                alt="Idle plane"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Idle Mobile Plane */}
          <div className="w-full h-[100lvh] z-[2] absolute top-0 left-0 block lg:hidden" data-gsap="idle-plane-scroll">
            <div data-gsap="idle-plane" className="absolute left-0 top-0 w-screen h-full opacity-0">
              <img
                src={`/sequence/mobile/hero6${idle}.avif`}
                alt="Idle plane"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div data-gsap="hero-dim" className="opacity-0 z-10 absolute top-0 left-0 w-full h-full bg-[#FFF]"></div>

          {/* Scroll to Explore (Desktop) */}
          <div
            data-gsap="scroll-to-explore-wrapper"
            className={`w-full h-full absolute top-0 left-0 z-[5] ${mounted && !isMobile ? 'block' : 'hidden'}`}
          >
            <p data-gsap="scroll-to-explore" className="opacity-0 absolute top-0 left-0 text-white font-progRegular text-[16px]">
              Scroll to explore
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
