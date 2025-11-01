import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@studio-freight/react-lenis";
import { useGSAP } from "@gsap/react";
import { SplitText, CustomEase } from "gsap/all";
import { useStore } from "@/app/useStore";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

export default function Hero() {
  const { loadedHeroFrames, loaded } = useStore(); // <- use loader frames
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [idle, setIdle] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const lenis = useLenis();
  CustomEase.create("cEase", "M0,0 C0.075,0.82 0.165,1 1,1");

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalFrames = 123;
  const introFrames = 61;
  const introSpeed = 0.2;
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    if (!lenis) return;
    lenis.stop();
    intervalRef.current = setInterval(() => {
      setIdle((prev) => (prev + 1) % 2);
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [lenis]);

  useEffect(() => {
    if (!loaded || !loadedHeroFrames.length || !canvasRef.current || !lenis)
      return;
    gsap.set("[data-gsap='idle-plane']", {opacity: 0});
    gsap.set("[data-gsap='hero-logo']", {y:300,opacity:0});
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;

    const drawImageCover = (image: HTMLImageElement) => {
      if (!image) return;
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

    const currentFrame = (index: number) =>
      windowWidth < 1024
        ? loadedHeroFrames[index] // mobile frames
        : loadedHeroFrames[index]; // desktop frames (already preloaded)

    const totalFrames = loadedHeroFrames.length;
    const introFrames = 61;
    const introSpeed = 0.2;

    const playIntro = () => {
      if (frame >= introFrames) {
        setIntroDone(true);
        startScrollSequence();
        gsap.set("[data-gsap='idle-plane']", { opacity: 1 });
        gsap.to("[data-gsap='hero-logo']", {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.05,
          ease: "cEase",
          onComplete: () => lenis.start(),
        });
        gsap.set("[data-gsap='nav-logo-desktop'],[data-gsap='nav-logo-mobile']", {opacity: 1, y:100});
        gsap.to("[data-gsap='nav-logo-desktop'],[data-gsap='nav-logo-mobile']", {y:0, duration: 1, ease: "power4.out"});
        gsap.to("[data-gsap='nav-careers']",{opacity:1 })
        return;
      }

      const img = currentFrame(Math.floor(frame));
      if (img) drawImageCover(img);

      frame += introSpeed;
      requestAnimationFrame(playIntro);
    };
    setTimeout(() => {
    playIntro();
    }, 1200);

    const startScrollSequence = () => {
      const frameObj = { frame: introFrames };
      gsap.to(frameObj, {
        frame: totalFrames - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: "[data-gsap='hero-sequence']",
          start: "top+=250 top",
          end: "bottom bottom",
          scrub: true,
          markers: true,
        },
        onUpdate: () => {
          const idx = Math.floor(frameObj.frame);
          const img = currentFrame(idx);
          if (img) drawImageCover(img);
        },
      });
    };

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [loaded, loadedHeroFrames, lenis, windowWidth]);

  // --- idle-plane scroll & hero logo GSAP ---
  useGSAP(() => {
    if (!loaded) return;
    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: "[data-gsap='idle-plane-scroll']",
        start: "top+=100 0%",
        end: "top+=300 0%",
        scrub: true,
        markers: true,
        animation: gsap.to("[data-gsap='hero-logo']", {
          y: -100,
          opacity: 0,
          stagger: 0.05,
          ease: "power1.inOut",
        }),
        onLeave: () => gsap.set("[data-gsap='idle-plane']", { opacity: 0 }),
        onEnterBack: () => gsap.set("[data-gsap='idle-plane']", { opacity: 1 }),
      });
      return () => trigger?.kill();
    });
    return () => ctx.revert();
  }, [loaded]);

  // --- hero text animation ---
  useGSAP(() => {
    if (!loaded || !introDone) return;
    const split = new SplitText("[data-gsap='hero-text']", { type: "chars" });

    split.chars.forEach((char) => {
      const wrapper = document.createElement("div");
      wrapper.style.display = "inline-block";
      wrapper.style.overflow = "hidden";
      char.parentNode!.insertBefore(wrapper, char);
      wrapper.appendChild(char);
    });

    gsap.set(split.chars, { x: -30, opacity: 0 });
    gsap.to(split.chars.slice(0, 21), {
      x: 0,
      opacity: 1,
      duration: 1,
      ease: "power4.out",
      stagger: 0.015,
    });
    gsap.to(split.chars.slice(21), {
      x: 0,
      opacity: 1,
      duration: 1,
      ease: "power4.out",
      delay: 0.15,
      stagger: 0.015,
    });

    const trigger = ScrollTrigger.create({
      trigger: "[data-gsap='hero-sequence']",
      start: "top+=100 0%",
      end: "top+=800 0%",
      scrub: true,
      markers: true,
      animation: gsap.to(split.chars, { opacity: 0, scale: 1.05, stagger: 0.1 }),
    });

    const opacityTrigger = ScrollTrigger.create({
      trigger: "[data-gsap='hero-sequence']",
      start: "bottom-=600 0%",
      end: "bottom 0%",
      scrub: true,
      markers: true,
      animation: gsap.to("[data-gsap='hero-sequence']", { opacity: 0 }),
    });
  }, [introDone, loaded]);

  return (
    <div className="fixed top-0 left-0 w-full h-screen z-30 pointer-events-none">
            <div data-gsap="hero-sequence" style={{ height: "400vh",position: 'relative',zIndex: 30 }}>
      <canvas
        ref={canvasRef}
        style={{ position: "fixed", top: 0, left: 0 }}
      />

        {windowWidth >= 1024 && (
          <div data-gsap="hero-logo-scroll" className="fixed top-[5vw] max-w-[1600px] w-[90%] left-[50%] translate-x-[-50%] overflow-hidden mix-blend-color-burn flex items-end gap-[1vw]">
            <img data-gsap="hero-logo" src="amca_a.webp" className="w-[26.05%] h-full " />
            <img data-gsap="hero-logo" src="amca_m.webp" className="w-[32.05%] h-full " />
            <img data-gsap="hero-logo" src="amca_c.webp" className="w-[18.35%] h-full " />
            <img data-gsap="hero-logo" src="amca_a_lower.webp" className="w-[19%] h-full " />
          </div>
        )}

        {windowWidth < 1024 && (
          <div className="flex flex-col fixed bottom-[5vw] w-[95%] left-[50%] translate-x-[-50%] gap-[5vw] z-20">
            {introDone && (
              <p data-gsap="hero-text" className="font-reckless text-[#FAF5E7] text-[5.5vw] leading-[5.5vw] sm:text-[4.5vw] sm:leading-[4.5vw]">Advanced Manufacturing<br></br>Company of America</p>
            )}
            <div data-gsap="hero-logo-scroll" className=" overflow-hidden flex items-end gap-[1vw]">
                <img data-gsap="hero-logo" src="amca_a.webp" className="w-[26.05%] h-full " />
                <img data-gsap="hero-logo" src="amca_m.webp" className="w-[32.05%] h-full " />
                <img data-gsap="hero-logo" src="amca_c.webp" className="w-[18.35%] h-full " />
                <img data-gsap="hero-logo" src="amca_a_lower.webp" className="w-[19%] h-full " />
            </div>
          </div>
        )}

        {windowWidth >= 1024 && (
          <div className="w-full h-full" data-gsap="idle-plane-scroll">
            <div data-gsap="idle-plane" className="fixed left-0 top-0 w-screen h-screen opacity-0">
                <img src={`sequence/desktop/idle_transparent_${idle}.avif`} className="w-full h-full object-cover" />
            </div>
        </div>
        )}
        {
          windowWidth < 1024 &&
          <div className="w-full h-full" data-gsap="idle-plane-scroll">
            <div data-gsap="idle-plane" className="fixed left-0 top-0 w-screen h-screen opacity-0">
                <img src={`sequence/mobile/hero6${idle}.avif`} className="w-full h-full object-cover" />
            </div>
        </div>
        }

        {(introDone && windowWidth >= 1024) && (
        <p data-gsap="hero-text" className="font-reckless text-[#FAF5E7] text-[48px] leading-[48px] fixed bottom-[50px] left-[50px]">Advanced Manufacturing<br></br>Company of America</p>
        )}

    </div>

    </div>
  );
}
