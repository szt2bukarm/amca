"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function DepthStoryAbsoluteText() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      setTimeout(() => {

        // setup initial state
        gsap.set(wrapperRef.current, { opacity: 0, backgroundColor: "#232323" });
        gsap.set("[data-gsap='depthstory-absolute-text-item']", {
          opacity: 0,
          scale: 1.08,
          color: "#fff",
        });
  
        // 1️⃣ wrapper fade-in
        ScrollTrigger.create({
          trigger: "[data-gsap='clip-1']",
          start: "top+=6500 top",
          end: "top+=7500 top",
          scrub: true,
          // markers: true,
          animation: gsap.fromTo(
            wrapperRef.current,
            { opacity: 0 },
            { opacity: 1, immediateRender: false }
          ),
        });
  
        // 2️⃣ text fade + scale
        ScrollTrigger.create({
          trigger: "[data-gsap='clip-1']",
          start: "top+=7000 top",
          end: "top+=8000 top",
          scrub: true,
          // markers: true,
          animation: gsap.fromTo(
            "[data-gsap='depthstory-absolute-text-item']",
            { opacity: 0, scale: 1.08 },
            { opacity: 1, scale: 1, stagger: 0.1, ease: "linear" }
          ),
        });
  
        // 3️⃣ color transition
        ScrollTrigger.create({
          trigger: "[data-gsap='clip-1']",
          start: "top+=8000 top",
          end: "top+=9000 top",
          scrub: true,
          // markers: true,
          animation: gsap.fromTo(
            "[data-gsap='depthstory-absolute-text-item']",
            { color: "#fff" },
            { color: "#000", ease: "linear" }
          ),
        });

        ScrollTrigger.create({
          trigger: "[data-gsap='clip-1']",
          start: "top+=8000 top",
          end: "top+=9000 top",
          scrub: true,
          // markers: true,
          animation: gsap.fromTo(
            "[data-gsap='depthstory-absolute-text']",
            { background: "#232323" },
            { background: "#FAF5EF", ease: "linear" }
          ),
        });

        ScrollTrigger.create({
          trigger: "[data-gsap='clip-2']",
          start: "top+=8000 top",
          end: "top+=9000 top",
          scrub: true,
          // markers: true,
          animation: gsap.fromTo(
            "[data-gsap='nav-logo-desktop'],[data-gsap='nav-logo-mobile'],[data-gsap='nav-careers'],[data-gsap='nav-text']",
            { filter: "invert(0)" },
            { filter: "invert(1)", ease: "linear",immediateRender: false }
          ),
        });


        // fast scroll safety triggers
        ScrollTrigger.create({
          trigger: "[data-gsap='clip-1']",
          start: "top+=2000 top",
          end: "top+=1000 top",
          scrub: true,
          animation: gsap.fromTo(
            wrapperRef.current,
            { opacity: 1 },
            { opacity: 0,duration: 0, immediateRender: false }
          ),
        })

        ScrollTrigger.create({
          trigger: "[data-gsap='showcase']",
          start: "top+=1000 top",
          end: "top+=2000 top",
          scrub: true,
          animation: gsap.fromTo(
            wrapperRef.current,
            { opacity: 1 },
            { opacity: 0,duration:0, immediateRender: false }
          ),
        })

      }, 100);
    });
  
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapperRef}
      data-gsap="depthstory-absolute-text"
      className="pointer-events-none fixed top-0 left-0 w-screen h-[100dvh] z-20 flex items-center justify-center flex-col"
      style={{ backgroundColor: "#232323" }}
    >
      <p
        data-gsap="depthstory-absolute-text-item"
        className="font-reckless text-white text-lg md:text-h4 lg:text-h3 w-screen text-center leading-[44px] md:leading-[60px] lg:leading-[74px]"
      >
        We don't
      </p>
      <p
        data-gsap="depthstory-absolute-text-item"
        className="font-reckless text-white text-lg md:text-h4 lg:text-h3 w-screen text-center leading-[44px] md:leading-[60px] lg:leading-[74px]"
      >
        think it has to
      </p>
      <p
        data-gsap="depthstory-absolute-text-item"
        className="font-reckless text-white text-lg md:text-h4 lg:text-h3 w-screen text-center leading-[44px] md:leading-[60px] lg:leading-[74px]"
      >
        be this way.
      </p>
    </div>
  );
}
