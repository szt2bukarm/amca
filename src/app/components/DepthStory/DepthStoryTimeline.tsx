import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useState, useRef, useEffect } from "react";
gsap.registerPlugin(ScrollTrigger);

export default function DepthStoryTimeline() {
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stepHeight, setStepHeight] = useState(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    function measure() {
      if (!textRef.current || !containerRef.current) return;
      const children = Array.from(textRef.current.children) as HTMLElement[];
      if (children.length === 0) return;
  
      // Reset previous minHeight so measurement is correct
      children.forEach(child => {
        child.style.minHeight = '0';
      });
  
      // Measure max height after reset
      const maxHeight = Math.max(...children.map(child => child.getBoundingClientRect().height));
      setStepHeight(maxHeight);
  
      // Set container height
      containerRef.current.style.height = `${maxHeight}px`;
  
      // Apply new minHeight to all children
      children.forEach(child => {
        child.style.minHeight = `${maxHeight}px`;
      });
    }
  
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useGSAP(() => {
    const ctx = gsap.context(() => {
        gsap.set("[data-pin='1']", {opacity: 1})
        // gsap.set("[data-pin='2'], [data-pin='3'], [data-pin='4']", {opacity: 0})
        setTimeout(() => {
            ScrollTrigger.create({
                trigger: "[data-pin='1']",
                start: "top+=3000 top",
                end: "top+=3000 top",
                markers:true,
                invalidateOnRefresh: true,
                onLeave: () => {
                    setIndex(1)
                    gsap.to("[data-pin='1']", {duration: 0.3, opacity: 0})
                    // gsap.to("[data-pin='2']", {duration: 0.3, opacity: 1})
                },
                onEnterBack: () => {
                    setIndex(0)
                    gsap.to("[data-pin='1']", {duration: 0.3, opacity: 1})
                    // gsap.to("[data-pin='2']", {duration: 0.3, opacity: 0})
                },
              });

              ScrollTrigger.create({
                trigger: "[data-pin='2']",
                start: "top+=4500 top",
                end: "top+=7000 top",
                scrub: true,
                markers: true,
                onUpdate: (self) => {
                  const rawProgress = self.progress;
              
                  const delay = 0.4;
                  let progress = (rawProgress - delay) / (1 - delay);
                  progress = Math.min(Math.max(progress, 0), 1); 
              
                  const el = document.querySelector("[data-gsap='clip']") as HTMLElement;
                  if (!el) return;
              
                  const maskPercent = progress * 50; // 0 → 100
                  el.style.webkitMaskImage = `linear-gradient(to top, black 0%, black ${100 - maskPercent}%, transparent ${100 - maskPercent}%, transparent 100%)`;
                  el.style.maskImage = `linear-gradient(to top, black 0%, black ${100 - maskPercent}%, transparent ${100 - maskPercent}%, transparent 100%)`;
              
                  // Saturation: start immediately
                  el.style.filter = `saturate(${1 - rawProgress*1.5})`;
                }
              });
              
              
            ScrollTrigger.create({
                trigger: "[data-pin='3']",
                start: "top+=6000 top",
                end: "top+=6000 top",
                markers:true,
                invalidateOnRefresh: true,
                onLeave: () => {
                    setIndex(2)
                    // gsap.to("[data-pin='2']", {duration: 0.3, opacity: 0})
                    // gsap.to("[data-pin='3']", {duration: 0.3, opacity: 1})
                },
                onEnterBack: () => {
                    setIndex(1)
                    gsap.to("[data-pin='2']", {duration: 0.3, opacity: 1})
                    // gsap.to("[data-pin='3']", {duration: 0.3, opacity: 0})
                },
              });
              ScrollTrigger.create({
                trigger: "[data-pin='4']",
                start: "top+=9000 top",
                end: "top+=9000 top",
                markers:true,
                invalidateOnRefresh: true,
                onLeave: () => {
                    setIndex(3)
                    gsap.to("[data-pin='3']", {duration: 0.3, opacity: 0})
                    // gsap.to("[data-pin='4']", {duration: 0.3, opacity: 1})
                },
                onEnterBack: () => {
                    setIndex(2)
                    gsap.to("[data-pin='3']", {duration: 0.3, opacity: 1})
                    // gsap.to("[data-pin='4']", {duration: 0.3, opacity: 0})
                },
              });
        
              ScrollTrigger.create({
                trigger: "[data-gsap='depthstory']",
                start: "top top",
                end: "top+=12000 top",
                scrub: true,
                invalidateOnRefresh: true,
                animation: gsap.fromTo(
                  "[data-gsap='depthstory-timeline']",
                  { x: 0 },
                  { left: "100%", ease: "linear" }
                )
              });        
        }, 100);

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-screen p-[25px] md:p-[55px] z-10 flex flex-col gap-[18px] md:gap-[25px]">

      {/* Dynamic container height */}
      <div ref={containerRef} className="relative overflow-hidden w-full">
        <div
          ref={textRef}
          data-gsap="depthstory-timeline-text"
          style={{
            transform: `translateY(-${index * stepHeight}px)`,
            transition: "transform 0.5s cubic-bezier(.19,1,.22,1)",
          }}
          className="absolute top-0 left-0 w-full"
        >
    <div className="flex flex-col justify-end min-h-[0]">
      <p className="font-progLight text-[#F4F5F2] text-sm leading-[28px] md:text-md md:leading-[32px] tracking-[-0.8px] md:tracking-[-1.2px]">
        Air Canada Disco Lounge, 1970
      </p>
    </div>
    <div className="flex flex-col justify-end min-h-[0]">
      <p className="font-progLight text-[#F4F5F2] text-sm leading-[28px] md:text-md md:leading-[32px] tracking-[-0.8px] md:tracking-[-1.2px]">
        Braniff International Airways Lounge, 1970
      </p>
    </div>
    <div className="flex flex-col justify-end min-h-[0]">
      <p className="font-progLight text-[#F4F5F2] text-sm leading-[28px] md:text-md md:leading-[32px] tracking-[-0.8px] md:tracking-[-1.2px]">
        Plane interior nowadays
      </p>
    </div>
        </div>
      </div>

      <div className="flex gap-[30px] items-center justify-center">
        <p className="font-reckless text-white text-sm md:text-md tracking-[-1.2px]">1970s</p>

        <div className="relative w-full h-[1px] bg-white">
          <div
            data-gsap="depthstory-timeline"
            className="w-[22px] h-[22px] rounded-[50%] bg-white absolute left-0 top-1/2 -translate-y-1/2"
          ></div>
        </div>

        <p className="font-reckless text-white text-sm md:text-md tracking-[-1.2px]">Nowadays</p>
      </div>

    </div>
  );
}
