"use client";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { useStore } from "@/app/useStore";
import { useGSAP } from "@gsap/react";

const assets = [
  "jobboard/jobboard-bg.webp",
  "jobboard/jobboard-bottom.webp",
  "jobboard/jobboard-top.webp",
  "jobboard/jobboard.webp",
  "jobboard/apply/1.webp",
  "jobboard/apply/2.webp",
  "jobboard/apply/3.webp",
  "jobboard/apply/4.webp",
  "jobboard/apply/5.webp",
  "jobboard/apply/6.webp",
  "jobboard/apply/7.webp",
  "jobboard/apply/8.webp",
  "jobboard/apply/9.webp",
  "jobboard/apply/10.webp",
  "jobboard/apply/11.webp",
  "showcase/1.webp",
  "showcase/2.webp",
  "showcase/3.webp",
  "showcase/4.webp",
  "showcase/5.webp",
  "showcase/6.webp",
  "showcase/7.webp",
  "showcase/8.webp",
  "showcase/amcalogobg.webp",
  "amca_a_blue_lower.webp",
  "amca_a_blue.webp",
  "amca_a_lower.webp",
  "amca_a.webp",
  "amca_c_blue.webp",
  "amca_c.webp",
  "amca_m_blue.webp",
  "amca_m.webp",
  "amca.webp",
  "joinus.svg",
  "sequence/desktop/idle_transparent_0.avif",
  "sequence/desktop/idle_transparent_1.avif",
];

const depthPlanes = [
  { color: "depthstory/lounge_1.webp", depth: "depthstory/lounge_1_depth.webp" },
  { color: "depthstory/lounge_2.webp", depth: "depthstory/lounge_2_depth.webp" },
  { color: "depthstory/lounge_3.webp", depth: "depthstory/lounge_3_depth.webp" },
  { color: "depthstory/lounge_4.webp", depth: "depthstory/lounge_3_depth.webp" },
  { color: "depthstory/lounge_5.webp", depth: "depthstory/lounge_5_depth.webp" },
  { color: "depthstory/wait_normal.jpg", depth: "depthstory/wait_depth.jpg" },
];

const TOTAL_HERO_FRAMES = 122;

export default function Loader() {
  const { setLoaded, loaded, setHeroFrames, setDepthPlaneTextures } = useStore();
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const [domReady, setDomReady] = useState(false);

  // preload normal assets
  const preloadAssets = (urls: string[]) =>
    new Promise<void>((resolve) => {
      let loadedCount = 0;
      const total = urls.length;
      urls.forEach((url) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loadedCount++;
          const prog = (loadedCount / total) * 20; // first 20% for normal assets
          setProgress(prog);
          progressRef.current = prog;
          if (loadedCount >= total) resolve();
        };
        img.src = url;
      });
    });

  // preload hero frames
  const preloadHeroFrames = (totalFrames: number) =>
    new Promise<void>((resolve) => {
      const frames: HTMLImageElement[] = [];
      const windowWidth = window.innerWidth;
      const folder = windowWidth < 1024 ? "sequence/mobile" : "sequence/desktop";
      let loadedCount = 0;

      for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        img.src = `${folder}/hero${i}.avif`;
        img.onload = img.onerror = () => {
          loadedCount++;
          frames[i] = img;
          const prog = 20 + (loadedCount / totalFrames) * 30; // next 30% for hero frames
          setProgress(prog);
          progressRef.current = prog;
          if (loadedCount >= totalFrames) {
            setHeroFrames(frames);
            resolve();
          }
        };
      }
    });

  // preload depthplane textures
  const preloadDepthPlanes = () =>
    new Promise<void>((resolve) => {
      const loader = new THREE.TextureLoader();
      const textures: { color: THREE.Texture; depth: THREE.Texture }[] = [];
      let loadedCount = 0;
      const total = depthPlanes.length;

      depthPlanes.forEach((dp, i) => {
        Promise.all([
          new Promise<THREE.Texture>((res) => loader.load(dp.color, res)),
          new Promise<THREE.Texture>((res) => loader.load(dp.depth, res)),
        ]).then(([colorTex, depthTex]) => {
          colorTex.minFilter = colorTex.magFilter = THREE.LinearFilter;
          depthTex.minFilter = depthTex.magFilter = THREE.LinearFilter;
          textures[i] = { color: colorTex, depth: depthTex };
          loadedCount++;
          const prog = 50 + (loadedCount / total) * 50; // last 50%
          setProgress(prog);
          progressRef.current = prog;
          if (loadedCount === total) {
            setDepthPlaneTextures(textures);
            resolve();
          }
        });
      });
    });

  useGSAP(() => {
    console.log(progress);
    gsap.to('[data-gsap="loader-logo"]', { clipPath: `inset(0% 0% ${progressRef.current}% 0%)`,duration: 0.1 });
  },[progress])

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

  // load everything
  useEffect(() => {
    document.documentElement.style.cursor = "progress";
    const loadAll = async () => {
      try {
        await preloadAssets(assets);
        await preloadHeroFrames(TOTAL_HERO_FRAMES);
        await preloadDepthPlanes();
        setLoaded(true);
        document.documentElement.style.cursor = "default";
      } catch (e) {
        console.error("Loader error:", e);
      }
    };
    loadAll();
  }, []);

  // hide loader when done
  useEffect(() => {
    if (loaded && domReady) {
      gsap.to('[data-gsap="loader-logo-full"]', {
        y: -150,
        ease: "power4.in",
        duration: 0.5,
        delay: 0.35,
        onComplete: () => {
          gsap.to('[data-gsap="loader"]', {
              opacity: 0,
              duration: 1,
              onComplete: () => {
                gsap.set('[data-gsap="loader"]', { display: "none" });
              }
          })
        }
      });
    }
  }, [loaded, domReady]);

  return (
    <div
      data-gsap="loader"
      className="pointer-events-none fixed top-0 left-0 w-screen h-[100dvh] bg-[#232323] z-[9999] flex items-center justify-center"
    >
        <div className="h-[108px] w-[154px] relative overflow-hidden">
            <img data-gsap="loader-logo-full" src="amca_logo.webp" className="absolute top-0 left-0 h-[108px] w-[154px] z-1" />
            <img data-gsap="loader-logo" src="amca_logo.webp" className="brightness-50 absolute top-0 left-0 h-[108px] w-[154px] z-2" />
            {progress != 100 && (
            <p className="absolute top-[-5px] right-0 text-white text-[12px]">{Math.round(progress)}</p>
            )}
        </div>
      {/* <p className="text-white text-h1">
        {loaded ? "loaded" : "loading " + Math.floor(progress) + "%"}
      </p> */}
    </div>
  );
}
