import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@studio-freight/react-lenis";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";
import { CustomEase } from "gsap/all";

gsap.registerPlugin(ScrollTrigger,SplitText,CustomEase);

export default function Hero() {
  const canvasRef = useRef(null);
  const [idle,setIdle] = useState(0);
  const lenis = useLenis();
  CustomEase.create("cEase", "M0,0 C0,0.62 0.55,0.98 1,1");

  const totalFrames = 92; // total frames
  const introFrames = 60; // first frames autoplay
  const introSpeed = 0.25; // smaller = slower intro

  const currentFrame = (index) =>
    `sequence/desktop/${index.toString().padStart(4, "0")}.webp`;

  const intervalRef = useRef(null);

  useEffect(() => {
    if (!lenis) return;
    lenis?.stop();
    setTimeout(() => {
        intervalRef.current = setInterval(() => {
            setIdle(prev => {
              const next = (prev + 1) % 2;
              console.log(next); // correct logging
              return next;
            });
          }, 1000);
    }, 500);

    return () => clearInterval(intervalRef.current);
  }, [lenis]);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!lenis) return;
    gsap.set("[data-gsap='idle-plane']", {opacity: 0});
    gsap.set("[data-gsap='hero-logo']", {y:300});
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    let frame = 0;

    // Draw image with "object-cover" behavior
    const drawImageCover = (image) => {
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = image.width / image.height;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgRatio > canvasRatio) {
        // Image is wider → scale to height
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      } else {
        // Image is taller → scale to width
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Resize canvas to viewport
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawImageCover(img); // redraw current frame
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // --- 1) Intro: first 60 frames ---
    const playIntro = () => {
      if (frame >= introFrames) {
        startScrollSequence();
        gsap.set("[data-gsap='idle-plane']", {opacity: 1});
        gsap.to("[data-gsap='hero-logo']", {y:0,duration: 0.5,stagger:0.1, esae: "cEase",
            onComplete: () => {
                lenis?.start()
            }});
        return;
      }

      const idx = Math.floor(frame);
      img.src = currentFrame(idx);
      img.onload = () => drawImageCover(img);

      frame += introSpeed;
      requestAnimationFrame(playIntro);
    };
    playIntro();

    // --- 2) Scroll-controlled remaining frames ---
    const startScrollSequence = () => {
      const frameObj = { frame: introFrames };
      gsap.to(frameObj, {
        frame: totalFrames - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: "[data-gsap='hero-sequence']",
          start: "top+=350 top",
          end: "bottom bottom",
          scrub: true,
        },
        onUpdate: () => {
            const idx = Math.floor(frameObj.frame);
            img.src = currentFrame(idx);
            img.onload = () => drawImageCover(img);
        },
      });
    };

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [lenis]);

  useGSAP(() => {
    const ctx = gsap.context(() => {
        let trigger = ScrollTrigger.create({
            trigger: "[data-gsap='idle-plane-scroll']",
            start: "top+=100 0%",
            end: "top+=500 0%",
            scrub: true,
            markers: true,
            animation: gsap.to("[data-gsap='hero-logo-scroll']", {opacity: 0,scale:1.3, ease: "power1.inOut"}),
            onLeave: () => {
                gsap.set("[data-gsap='idle-plane']", {opacity: 0});
            },
            onEnterBack: () => {
                gsap.set("[data-gsap='idle-plane']", {opacity: 1});
            }
        })
        return () => trigger?.kill();
    })
    return () => ctx.revert();
  },[])

  useGSAP(() => {
    const split = new SplitText("[data-gsap='hero-text']", { type: "words" });

    // Wrap each word in a div with overflow hidden
    split.words.forEach(word => {
      const wrapper = document.createElement("div");
      wrapper.style.display = "inline-block"; // keep word inline
      wrapper.style.overflow = "hidden";

      // Move word inside wrapper
      word.parentNode.insertBefore(wrapper, word);
      wrapper.appendChild(word);
    });

    // Set initial opacity for animation
    gsap.set(split.words, { y: 100 });
    gsap.to(split.words, { y: 0, duration: 0.2, ease: "power4.out",stagger: 0.1,delay: 2.5 });

    let trigger = ScrollTrigger.create({
        trigger: "[data-gsap='hero-sequence']",
        start: "top+=100 0%",
        end: "top+=800 0%",
        scrub: true,
        markers: true,
        animation: gsap.to((split.words), { opacity: 0,scale:1.05,stagger: 0.1}),
    })

    let opacityTrigger = ScrollTrigger.create({
        trigger: "[data-gsap='hero-sequence']",
        start: "bottom-=200 0%",
        end: "bottom 0%",
        scrub: true,
        markers: true,
        animation: gsap.to("[data-gsap='hero-sequence']", { opacity: 0}),
    })
  },[])



  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-30 pointer-events-none">
            <div data-gsap="hero-sequence" style={{ height: "500vh",position: 'relative',zIndex: 30 }}>
      <canvas
        ref={canvasRef}
        style={{ position: "fixed", top: 0, left: 0 }}
      />

        <div data-gsap="hero-logo-scroll" className="fixed top-[5vw] max-w-[1600px] w-[90%] left-[50%] translate-x-[-50%] overflow-hidden mix-blend-color-burn flex items-end gap-[22.5px]">
            <img data-gsap="hero-logo" src="amca_a.webp" className="w-[26.05%] h-full " />
            <img data-gsap="hero-logo" src="amca_m.webp" className="w-[32.05%] h-full " />
            <img data-gsap="hero-logo" src="amca_c.webp" className="w-[18.35%] h-full " />
            <img data-gsap="hero-logo" src="amca_a_lower.webp" className="w-[19%] h-full " />
            {/* <img data-gsap="hero-logo" src="amca.webp" className="w-full h-full opacity-0" /> */}
        </div>

        <div className="w-full h-full" data-gsap="idle-plane-scroll">
            <div data-gsap="idle-plane" className="fixed left-0 top-0 w-screen h-screen opacity-0">
                <img src={`sequence/desktop/idle_transparent_${idle}.webp`} className="w-full h-full object-cover" />
            </div>
        </div>

        <p data-gsap="hero-text" className="font-reckless text-[#FAF5E7] text-[48px] leading-[48px] fixed bottom-[50px] left-[50px]">Advanced Manufacturing<br></br>Company of America</p>

    </div>

    </div>
  );
}
