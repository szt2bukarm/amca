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
  const lenis = useLenis();
  CustomEase.create("cEase", "M0,0 C0.075,0.82 0.165,1 1,1");
  const [windowWidth, setWindowWidth] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const intervalRef = useRef<NodeJS.Timer | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!lenis) return;
    lenis?.stop();
    intervalRef.current = setInterval(() => {
      setIdle((prev) => (prev + 1) % 2);
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [lenis]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!loaded || !loadedHeroFrames.length || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx?.scale(1, 1);
    if (!ctx) return;

    let frame = 0;
    const totalFrames = loadedHeroFrames.length;
    const introFrames = 60;
    const introSpeed = isMobile ? 0.5 : 0.25;

    const drawImageCover = (image: HTMLImageElement) => {
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

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const img = loadedHeroFrames[Math.floor(frame)];
      if (img) drawImageCover(img);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const playIntro = () => {
      if (frame >= introFrames) {
        setIntroDone(true);
        return;
      }
      const img = loadedHeroFrames[Math.floor(frame)];
      if (img) drawImageCover(img);
      frame += introSpeed;
      requestAnimationFrame(playIntro);
    };

    if (!introDone) {
      setTimeout(() => {
        playIntro();
      }, isMobile ? 0 : 1200);
    } 


    return () => {
      window.removeEventListener("resize", resizeCanvas);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [loaded, loadedHeroFrames]); // Removed windowWidth dependency

  // Frame Sequence ScrollTrigger
  useGSAP(() => {
    if (!introDone || !loadedHeroFrames.length || !canvasRef.current) return;

    const introFrames = 60;
    const frameCount = loadedHeroFrames.length - introFrames;

    const drawImageCover = (image: HTMLImageElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
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

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    };

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top+=300 top", 
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const idx = Math.min(Math.floor(progress * frameCount) + introFrames, loadedHeroFrames.length - 1);
        const img = loadedHeroFrames[idx];
        if (img) drawImageCover(img);
      }
    });

  }, [introDone, loadedHeroFrames, windowWidth]); 

  useEffect(() => {
    if (lenis) lenis.stop();
  }, [loaded, lenis]);

  // reveal after intro
  useGSAP(() => {
    if (!introDone || !lenis) return;
    gsap.set("[data-gsap='idle-plane']", { opacity: 1 });
    gsap.to("[data-gsap='nav-careers']", { opacity: 1 });

    setTimeout(() => {
      lenis?.start();
      document.documentElement.style.overflow = "auto";
      document.documentElement.style.touchAction = "auto";
      if (isMobile) {
        ScrollTrigger.normalizeScroll(true);
      } else {
        ScrollTrigger.normalizeScroll(false);
      }
    }, 200);
  }, [introDone, lenis]);

  // default state
  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.set("[data-gsap='idle-plane']", { opacity: 0 });
    });
    return () => ctx.revert();
  }, []);

  // scroll animations
  useGSAP(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top+=100 top",
        end: "top+=300 top",
        scrub: true,
        animation: gsap.to("[data-gsap='idle-plane']", {
          opacity: 0,
          ease: "linear",
          immediateRender: false
        }),
      });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top+=100 top",
        end: "top+=300 top",
        scrub: true,
        animation: gsap.fromTo(
          "[data-gsap='plane-sky-wrapper']",
          { opacity: 1 },
          {
            opacity: 0,
            ease: "linear",
            immediateRender: false,
          }
        ),
      });
    });
    return () => ctx.revert();
  }, []);

  // Dim layer
  useGSAP(() => {
    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "bottom-=250 bottom", 
        end: "bottom bottom",
        scrub: true,
        animation: gsap.fromTo(
          "[data-gsap='hero-dim']",
          { opacity: 0 },
          { opacity: 1, ease: "linear" }
        ),
      });
      return () => trigger.kill();
    });
    return () => ctx.revert();
  });

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
          const delay = (Math.random() * (15 - 5) + 5) * 1000; // 5–15s
          setTimeout(flyPlane, delay);
        }
      });
    };

    const initialDelay = 5000;
    const timer = setTimeout(flyPlane, initialDelay);

    return () => clearTimeout(timer);
  }, [introDone]);


  useEffect(() => {
    if (isMobile || !introDone) return; // skip mobile, no mouse
    const el = document.querySelector("[data-gsap='scroll-to-explore']");
    if (!el) return;

    const move = (e) => {
      gsap.set(el, { x: e.clientX + 25, y: e.clientY - 5 });
      gsap.to(el, {
        opacity: 1,
        duration: 0.1,
        ease: "linear",
      });
    };

    let trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top+=100 top",
      end: "top+=300 top",
      scrub: true,
      animation: gsap.fromTo(
        "[data-gsap='scroll-to-explore-wrapper']",
        { opacity: 1 },
        { opacity: 0, ease: "linear" }
      ),
    });

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, [isMobile, introDone]);


  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: "calc(100lvh + 2000px)" }} 
    >
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden"
      >
        <div data-gsap="hero" className="relative w-full h-full">

          <p
            className="absolute bottom-[6vh] left-[20px] w-screen h-fit text-[20px] text-white font-progRegular z-[10]"
            style={{ display: mounted && isMobile ? "block" : "none" }}
          >
            Scroll to explore
          </p>

          <canvas ref={canvasRef} style={{ width: "100vw", height: "100lvh" }} />

          <div
            data-gsap="plane-sky-wrapper"
            className="w-full h-full pointer-events-none z-1 absolute top-0 left-0"
            style={{ display: mounted && windowWidth >= 1024 ? "block" : "none" }}
          >
            <img
              alt="A plane in the sky"
              aria-label="A plane in the sky"
              data-gsap="plane-sky"
              src="/plane_sky.avif"
              className="opacity-0 w-[150px] absolute top-0 right-0"
            />
          </div>

          <div
            className="w-full h-full z-[2] absolute top-0 left-0"
            data-gsap="idle-plane-scroll"
            style={{ display: mounted && windowWidth > 1024 ? "block" : "none" }}
          >
            <div
              data-gsap="idle-plane"
              className="absolute left-0 top-0 w-screen h-[100dvh] opacity-0"
            >
              <img
                aria-label="Image showing a plane with a red light blinking"
                alt="Image showing a plane with a red light blinking"
                src={`/sequence/desktop/idle_transparent_${idle}.avif`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div
            className="w-full h-full z-[2] absolute top-0 left-0"
            data-gsap="idle-plane-scroll"
            style={{ display: mounted && windowWidth <= 1024 ? "block" : "none" }}
          >
            <div
              data-gsap="idle-plane"
              className="absolute left-0 top-0 w-screen h-[100lvh] opacity-0"
            >
              <img
                aria-label="Image showing a plane with a red light blinking"
                alt="Image showing a plane with a red light blinking"
                src={`/sequence/mobile/hero6${idle}.avif`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div
            data-gsap="hero-dim"
            className="opacity-0 z-10 absolute top-0 left-0 w-full h-full bg-[#FFF]"
          ></div>

          <div
            data-gsap="scroll-to-explore-wrapper"
            className="w-full h-full absolute top-0 left-0 z-[5]"
            style={{ display: mounted && !isMobile ? "block" : "none" }}
          >
            <p
              data-gsap="scroll-to-explore"
              className="opacity-0 absolute top-0 left-0 text-white font-progRegular text-[16px]"
            >
              Scroll to explore
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
