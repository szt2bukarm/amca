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
  // const noiseCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [introDone, setIntroDone] = useState(false);
  const [idle, setIdle] = useState(1);
  const lenis = useLenis();
  CustomEase.create("cEase", "M0,0 C0.075,0.82 0.165,1 1,1");
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const intervalRef = useRef<NodeJS.Timer | null>(null);
  useEffect(() => {
    if (!lenis) return;
    lenis?.stop();
    intervalRef.current = setInterval(() => {
      setIdle((prev) => (prev + 1) % 2);
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [lenis]);

  useEffect(() => {
    if (!loaded || !loadedHeroFrames.length || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
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
        startScrollSequence();
        setIntroDone(true);
        return;
      }
      const img = loadedHeroFrames[Math.floor(frame)];
      if (img) drawImageCover(img);
      frame += introSpeed;
      requestAnimationFrame(playIntro);
    };
    setTimeout(() => {
    playIntro();
    }, isMobile ? 0 : 1200);

    const startScrollSequence = () => {
      const pinStart = canvasRef.current?.offsetTop || 0;
      const introFrames = 60;
      const maxScroll = 3000;

      const handleScroll = () => {
        const scrollTop = window.scrollY;
        const progress = Math.min(Math.max(scrollTop - pinStart - 300, 0), maxScroll) / maxScroll;
        const frameCount = loadedHeroFrames.length - introFrames;
        const idx = Math.floor(progress * frameCount) + introFrames;
        const img = loadedHeroFrames[idx];
        if (img) drawImageCover(img);
      };

      window.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    };

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [loaded, loadedHeroFrames, windowWidth]);

  useEffect(() => {
    if (lenis) lenis.stop();
  }, [loaded, lenis]);

  // pin
  useGSAP(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=3250 top",
        scrub: true,
        pin: true,
      });
    });
  });

  // reveal after intro
  useGSAP(() => {
    if (!introDone || !lenis) return;
    gsap.set("[data-gsap='idle-plane']", { opacity: 1 });
    // gsap.to("[data-gsap='hero-logo']", {
    //   opacity: 1,
    //   y: 0,
    //   duration: 0.75,
    //   stagger: 0.05,
    //   ease: "cEase",
    //   onComplete: () => {
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
    // });
    // gsap.set("[data-gsap='nav-logo-desktop'],[data-gsap='nav-logo-mobile']", {
    //   opacity: 1,
    //   y: 100,
    // });
    // gsap.to("[data-gsap='nav-logo-desktop'],[data-gsap='nav-logo-mobile']", {
    //   y: 0,
    //   duration: 1,
    //   ease: "power4.out",
    // });
    gsap.to("[data-gsap='nav-careers']", { opacity: 1 });
  }, [introDone, lenis]);

  // default state
  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.set("[data-gsap='idle-plane']", { opacity: 0 });
      // gsap.set("[data-gsap='hero-logo']", { y: 300, opacity: 0 });
    });
    return () => ctx.revert();
  }, []);

  // scroll animations
  useGSAP(() => {
    const ctx = gsap.context(() => {
      setTimeout(() => {
        ScrollTrigger.create({
          trigger: canvasRef.current,
          start: "top+=100 0%",
          end: "top+=300 0%",
          scrub: true,
          // animation: gsap.fromTo(
          //   "[data-gsap='hero-logo']",
          //   { y: 0, opacity: 1 },
          //   {
          //     y: -100,
          //     opacity: 0,
          //     stagger: 0.05,
          //     ease: "power1.inOut",
          //     immediateRender: false,
          //   }
          // ),
          onLeave: () => gsap.set("[data-gsap='idle-plane']", { opacity: 0 }),
          onEnterBack: () => gsap.set("[data-gsap='idle-plane']", { opacity: 1 }),
        });

        ScrollTrigger.create({
          trigger: canvasRef.current,
          start: "top+=100 0%",
          end: "top+=300 0%",
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

      }, 100);
    });
  }, []);

  // Hero text split + scroll fade
  // useGSAP(() => {
  //   if (!introDone) return;

  //   const split = new SplitText("[data-gsap='hero-text']", { type: "chars" });
  //   split.chars.forEach((char) => {
  //     const wrapper = document.createElement("div");
  //     wrapper.style.display = "inline-block";
  //     wrapper.style.overflow = "hidden";
  //     char.parentNode!.insertBefore(wrapper, char);
  //     wrapper.appendChild(char);
  //   });

  //   gsap.set(split.chars, { x: -30, y: -5, autoAlpha: 0 });

  //   const tl = gsap.timeline();
  //   tl.to(split.chars, {
  //     x: 0,
  //     autoAlpha: 1,
  //     duration: 1,
  //     ease: "power4.out",
  //     stagger: 0.015,
  //   });

  //   ScrollTrigger.create({
  //     trigger: canvasRef.current,
  //     start: "top+=100 0%",
  //     end: "top+=1200 0%",
  //     scrub: true,
  //     animation: gsap.fromTo(
  //       split.chars,
  //       { autoAlpha: 1, x: 0 },
  //       {
  //         autoAlpha: 0,
  //         x: 30,
  //         stagger: 0.005,
  //         immediateRender: false,
  //       }
  //     ),
  //   });
  // }, [introDone]);

  // Dim layer
  useGSAP(() => {
    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: canvasRef.current,
        start: "top+=3000 top",
        end: "top+=3250 top",
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

  // useEffect(() => {
  //   const noiseCanvas = noiseCanvasRef.current;
  //   if (!noiseCanvas) return;
  //   const ctx = noiseCanvas.getContext("2d");
  //   const resize = () => {
  //     noiseCanvas.width = window.innerWidth;
  //     noiseCanvas.height = window.innerHeight;
  //   };
  //   resize();
  //   window.addEventListener("resize", resize);

  //   const drawNoise = () => {
  //     const imageData = ctx.createImageData(noiseCanvas.width, noiseCanvas.height);
  //     const buffer32 = new Uint32Array(imageData.data.buffer);
  //     const len = buffer32.length;
  //     for (let i = 0; i < len; i++) {
  //       const val = Math.random() * 255 | 0;
  //       buffer32[i] = (255 << 24) | (val << 16) | (val << 8) | val;
  //     }
  //     ctx.putImageData(imageData, 0, 0);
  //   };

  //   let frame = 0;
  //   const loop = () => {
  //     frame++;
  //     if (frame % 10 === 0) drawNoise(); // every few frames for perf
  //     requestAnimationFrame(loop);
  //   };
  //   loop();

  //   return () => {
  //     window.removeEventListener("resize", resize);
  //   };
  // }, []);


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
      gsap.set(el, { x: e.clientX + 25, y: e.clientY - 5});
      gsap.to(el, {
        opacity: 1,
        duration: 0.1,
        ease: "linear",
      });
    };

    let trigger = ScrollTrigger.create({
      trigger: canvasRef.current,
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
    <div data-gsap="hero" ref={containerRef} className="relative">

      {isMobile && (
      <p className="absolute bottom-[5vh] left-[20px] w-screen h-fit text-[20px] text-white font-progRegular z-[10]">Scroll to explore</p>
      )}

      <canvas ref={canvasRef} style={{ width: "100vw", height: "100dvh" }} />
      {/* <canvas
        ref={noiseCanvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100dvh",
          pointerEvents: "none",
          mixBlendMode: "overlay",
          opacity: 0.1,
          zIndex: 50,
        }}
      /> */}
{/* 
      {windowWidth >= 1024 && (
        <div
          data-gsap="hero-logo-scroll"
          className="fixed top-[5vw] max-w-[1600px] w-[90%] left-[50%] translate-x-[-50%] overflow-hidden mix-blend-color-burn flex items-end gap-[1vw]"
        >
          <img data-gsap="hero-logo" src="amca_a.webp" className="w-[26.05%] h-full " />
          <img data-gsap="hero-logo" src="amca_m.webp" className="w-[32.05%] h-full " />
          <img data-gsap="hero-logo" src="amca_c.webp" className="w-[18.35%] h-full " />
          <img data-gsap="hero-logo" src="amca_a_lower.webp" className="w-[19%] h-full " />
        </div>
      )} */}

      {/* {windowWidth < 1024 && (
        <div className="flex flex-col fixed bottom-[5vw] w-[95%] left-[50%] translate-x-[-50%] gap-[5vw] z-20">
          {introDone && (
            <p
              data-gsap="hero-text"
              className="font-reckless text-[#FAF5E7] text-[5.5vw] leading-[5.5vw] sm:text-[4.5vw] sm:leading-[4.5vw]"
            >
              Advanced Manufacturing<br />Company of America
            </p>
          )}
          <div
            data-gsap="hero-logo-scroll"
            className=" overflow-hidden flex items-end gap-[1vw]"
          >
            <img data-gsap="hero-logo" src="amca_a.webp" className="w-[26.05%] h-full " />
            <img data-gsap="hero-logo" src="amca_m.webp" className="w-[32.05%] h-full " />
            <img data-gsap="hero-logo" src="amca_c.webp" className="w-[18.35%] h-full " />
            <img data-gsap="hero-logo" src="amca_a_lower.webp" className="w-[19%] h-full " />
          </div>
        </div>
      )}

      {introDone && windowWidth >= 1024 && (
        <p
          data-gsap="hero-text"
          className="font-reckless text-[#FAF5E7] text-[48px] leading-[48px] fixed bottom-[50px] left-[50px]"
        >
          Advanced Manufacturing<br />Company of America
        </p>
      )} */}


      {windowWidth >= 1024 && (
        <div data-gsap="plane-sky-wrapper" className="w-full h-full pointer-events-none z-1">
        <img data-gsap="plane-sky" src='plane_sky.avif' className="opacity-0 w-[150px] absolute top-0 right-0" />
        </div>
      )}

      {windowWidth > 1024 && (
        <div className="w-full h-full z-[2]" data-gsap="idle-plane-scroll">
          <div
            data-gsap="idle-plane"
            className="fixed left-0 top-0 w-screen h-[100dvh] opacity-0"
          >
            <img
              src={`sequence/desktop/idle_transparent_${idle}.avif`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {windowWidth <= 1024 && (
        <div className="w-full h-full" data-gsap="idle-plane-scroll">
          <div
            data-gsap="idle-plane"
            className="fixed left-0 top-0 w-screen h-[100dvh] opacity-0"
          >
            <img
              src={`sequence/mobile/hero6${idle}.avif`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}


      <div
        data-gsap="hero-dim"
        className="opacity-0 z-10 absolute top-0 left-0 w-full h-full bg-[#FFF]"
      ></div> */


      {!isMobile && (
        <div data-gsap="scroll-to-explore-wrapper" className="w-full h-full">
        <p data-gsap="scroll-to-explore" className="opacity-0 absolute top-0 left-0 text-white font-progRegular text-[16px]">Scroll to explore</p>
        </div>
        )}

    </div>
  );
}
