"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useEffect } from "react";
gsap.registerPlugin(ScrollTrigger);

export default function DepthStoryAbsoluteText() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // scoped selector for children inside wrapperRef
      const q = gsap.utils.selector(wrapperRef);
        gsap.set(q("[data-gsap='depthstory-absolute-text-item']"), { opacity: 0 });
      // timeline with your exact scroll range
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: "[data-pin='2']",
          start: "top+=9000 top",
          end: "top+=11000 top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // Fade + scale wrapper in
      timeline.fromTo(
        wrapperRef.current!,
        { opacity: 0 },
        { opacity: 1, ease: "none", duration: 0.3 }
      );

      // stagger text items in (use scoped selector q)
      timeline.fromTo(
        q("[data-gsap='depthstory-absolute-text-item']"),
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, stagger: 0.15, ease: "none", duration: 0.3 },
        ">0.05" // start together with wrapper fade
      );

      // mid: background color change on the wrapperRef node
      timeline.to(
        wrapperRef.current!,
        { backgroundColor: "#FAF5EF", ease: "none", duration: 0.5 },
        ">0.2"
      );

      // mid: change text color (scoped)
      timeline.to(
        q("[data-gsap='depthstory-absolute-text-item']"),
        { color: "#232323", ease: "none", duration: 0.5 },
        "<"
      );

  

      // ensure ScrollTrigger will refresh sizes on resize
      ScrollTrigger.addEventListener("refreshInit", () => {
        // force re-paint fix (helps with weird browser color issues)
        if (wrapperRef.current) {
          wrapperRef.current.style.willChange = "auto";
          void wrapperRef.current.offsetHeight;
          wrapperRef.current.style.willChange = "";
        }
      });
    }, wrapperRef);

    return () => {
      ctx.revert();
      ScrollTrigger.removeEventListener("refreshInit", () => {});
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      data-gsap="depthstory-absolute-text"
      className="pointer-events-none fixed top-0 left-0 w-screen h-screen z-20 bg-[#232323] flex items-center justify-center flex-col"
      // inline style fallback ensures GSAP can see an initial computed color
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