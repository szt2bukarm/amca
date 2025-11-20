"use client";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { useStore } from "@/app/useStore";
import { useGSAP } from "@gsap/react";

const assets = [
  "/jobboard/jobboard-bg.webp",
  "/jobboard/jobboard-bottom.webp",
  "/jobboard/jobboard-top.webp",
  "/jobboard/jobboard.webp",
  "/jobboard/apply/1.webp",
  "/jobboard/apply/2.webp",
  "/jobboard/apply/3.webp",
  "/jobboard/apply/4.webp",
  "/jobboard/apply/5.webp",
  "/jobboard/apply/6.webp",
  "/jobboard/apply/7.webp",
  "/jobboard/apply/8.webp",
  "/jobboard/apply/9.webp",
  "/jobboard/apply/10.webp",
  "/jobboard/apply/11.webp",
  "/showcase/1.webp",
  "/showcase/2.webp",
  "/showcase/3.webp",
  "/showcase/4.webp",
  "/showcase/5.webp",
  "/showcase/6.webp",
  "/showcase/7.webp",
  "/showcase/8.webp",
  "/joinus.svg",
  "/sequence/desktop/idle_transparent_0.avif",
  "/sequence/desktop/idle_transparent_1.avif",
];

const depthPlanes = [
  { color: "/depthstory/lounge_1.webp", depth: "/depthstory/lounge_1_depth.webp" },
  { color: "/depthstory/lounge_2.webp", depth: "/depthstory/lounge_2_depth.webp" },
  { color: "/depthstory/lounge_3.webp", depth: "/depthstory/lounge_3_depth.webp" },
  { color: "/depthstory/lounge_4.webp", depth: "/depthstory/lounge_3_depth.webp" },
  { color: "/depthstory/lounge_5.webp", depth: "/depthstory/lounge_5_depth.webp" },
  { color: "/depthstory/wait_normal.jpg", depth: "/depthstory/wait_depth.jpg" },
];

const TOTAL_HERO_FRAMES = 122;

export default function Loader() {
  const { setLoaded, loaded, setHeroFrames, setDepthPlaneTextures,isMobile } = useStore();
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const [domReady, setDomReady] = useState(false);

  // Unified progress tracking
  const totalItems = useRef(0);
  const loadedItems = useRef(0);

  const updateProgress = () => {
    loadedItems.current++;
    const prog = Math.min((loadedItems.current / totalItems.current) * 100, 100);
    setProgress(prog);
    progressRef.current = prog;
  };

  // Preload standard images
  const preloadImage = (url: string) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = url;

      const onFinish = () => {
        updateProgress();
        resolve();
      };

      img.onload = () => {
        // Try to decode if supported for smoother rendering
        if (img.decode) {
          img.decode().then(onFinish).catch(onFinish);
        } else {
          onFinish();
        }
      };

      img.onerror = () => {
        console.warn(`Failed to load image: ${url}`);
        onFinish(); // Proceed even on error
      };
    });
  };

  // Preload hero frames
  const preloadHeroFrames = () => {
    const windowWidth = window.innerWidth;
    const folder = windowWidth <= 1024 ? "sequence/mobile" : "sequence/desktop";
    const frames: HTMLImageElement[] = [];
    const promises: Promise<void>[] = [];

    for (let i = 1; i <= TOTAL_HERO_FRAMES; i++) {
      const p = new Promise<void>((resolve) => {
        const img = new Image();
        img.src = `/${folder}/hero${i}.${isMobile ? "webp" : "avif"}`;

        const onFinish = () => {
          frames[i] = img; // Store in index matching frame number
          updateProgress();
          resolve();
        };

        img.onload = () => {
          if (img.decode) {
            img.decode().then(onFinish).catch(onFinish);
          } else {
            onFinish();
          }
        };
        img.onerror = () => {
          console.warn(`Failed to load hero frame ${i}`);
          onFinish();
        };
      });
      promises.push(p);
    }

    return Promise.all(promises).then(() => {
      setHeroFrames(frames);
    });
  };

  // Preload depth planes (textures)
  const preloadDepthPlanes = () => {
    const loader = new THREE.TextureLoader();
    const textures: { color: THREE.Texture; depth: THREE.Texture }[] = [];
    const promises: Promise<void>[] = [];

    depthPlanes.forEach((dp, i) => {
      const p = Promise.all([
        new Promise<THREE.Texture>((resolve) => loader.load(dp.color, resolve)),
        new Promise<THREE.Texture>((resolve) => loader.load(dp.depth, resolve)),
      ]).then(([colorTex, depthTex]) => {
        colorTex.minFilter = colorTex.magFilter = THREE.LinearFilter;
        depthTex.minFilter = depthTex.magFilter = THREE.LinearFilter;
        textures[i] = { color: colorTex, depth: depthTex };
        // Count as 2 items loaded (color + depth)
        updateProgress();
        updateProgress();
      }).catch(err => {
        console.warn("Failed to load depth plane", err);
        updateProgress();
        updateProgress();
      });
      promises.push(p);
    });

    return Promise.all(promises).then(() => {
      setDepthPlaneTextures(textures);
    });
  };

  useGSAP(() => {
    gsap.to('[data-gsap="loader-logo"]', { clipPath: `inset(0% 0% ${progressRef.current}% 0%)`, duration: 0.1 });
  }, [progress]);

  // DOM ready
  useEffect(() => {
    const onDOMContentLoaded = () => setDomReady(true);
    if (document.readyState === "complete" || document.readyState === "interactive") {
      setDomReady(true);
    } else {
      window.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    }
    return () => window.removeEventListener("DOMContentLoaded", onDOMContentLoaded);
  }, []);

  useEffect(() => {
    if (isMobile == null) return;
    document.documentElement.style.cursor = "progress";

    totalItems.current = assets.length + TOTAL_HERO_FRAMES + (depthPlanes.length * 2);

    const loadAll = async () => {
      try {
        await Promise.all([
          Promise.all(assets.map(preloadImage)),
          preloadHeroFrames(),
          preloadDepthPlanes()
        ]);

        setLoaded(true);
        document.documentElement.style.cursor = "default";
      } catch (e) {
        console.error("Loader error:", e);
        setLoaded(true);
        document.documentElement.style.cursor = "default";
      }
    };

    loadAll();
  }, [isMobile]);

  // Hide loader when done
  useEffect(() => {
    if (loaded && domReady) {
      gsap.to('[data-gsap="loader"]', {
        opacity: 0,
        delay: 0.7,
        duration: 0.5,
        onStart: () => {
          gsap.set('[data-gsap="nav-logo-desktop"],[data-gsap="nav-logo-mobile"]', { opacity: 1 });
        },
        onComplete: () => {
          gsap.set('[data-gsap="loader"]', { display: "none" });
        }
      });
    }
  }, [loaded, domReady]);

  return (
    <div
      data-gsap="loader"
      className="pointer-events-none fixed top-0 left-0 w-screen h-[100dvh] bg-[#232323] z-[49] flex items-center justify-center"
    >
      <div className="h-[108px] w-[154px] relative overflow-hidden">
        <svg data-gsap="loader-logo-full" xmlns="http://www.w3.org/2000/svg" className="w-[154px] h-[108px] absolute top-0 left-0 " viewBox="0 0 52 36" fill="none">
          <path d="M51.1851 25.0514L26.2632 0.27936C25.8884 -0.0931771 25.2831 -0.0930952 24.9084 0.279542L0 25.0514C2.98821 28.0232 6.37577 30.324 9.98365 32.0359L18.7213 19.1141C18.9932 18.7121 19.6151 19.0292 19.4494 19.4854L14.2663 33.7477C17.6401 34.8571 20.7652 35.4459 24.2767 35.5418L25.2252 28.8905C25.2916 28.4249 25.9609 28.4166 26.0389 28.8804L27.1564 35.5281C30.599 35.4185 33.6277 34.8297 36.9326 33.7477L31.7495 19.4854C31.5838 19.0292 32.2058 18.7121 32.4776 19.1141L41.2153 32.0359C44.8232 30.324 48.2107 28.0232 51.1989 25.0514H51.1851Z" fill="white" />
        </svg>

        <svg data-gsap="loader-logo" xmlns="http://www.w3.org/2000/svg" className="brightness-50 absolute top-0 left-0 h-[108px] w-[154px] z-2" viewBox="0 0 52 36" fill="none">
          <path d="M51.1851 25.0514L26.2632 0.27936C25.8884 -0.0931771 25.2831 -0.0930952 24.9084 0.279542L0 25.0514C2.98821 28.0232 6.37577 30.324 9.98365 32.0359L18.7213 19.1141C18.9932 18.7121 19.6151 19.0292 19.4494 19.4854L14.2663 33.7477C17.6401 34.8571 20.7652 35.4459 24.2767 35.5418L25.2252 28.8905C25.2916 28.4249 25.9609 28.4166 26.0389 28.8804L27.1564 35.5281C30.599 35.4185 33.6277 34.8297 36.9326 33.7477L31.7495 19.4854C31.5838 19.0292 32.2058 18.7121 32.4776 19.1141L41.2153 32.0359C44.8232 30.324 48.2107 28.0232 51.1989 25.0514H51.1851Z" fill="white" />
        </svg>

        {progress != 100 && (
          <p className="absolute top-0 right-0 text-white text-[12px]">{Math.round(progress)}</p>
        )}
      </div>
    </div>
  );
}
