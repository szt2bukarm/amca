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
      const pins = 4;
      const maskMax = 100; // how far up the fade travels (percent)
      const fadeRange = 50; // softness of the fade in percent
  
      for (let i = 1; i <= pins; i++) {
        const startOffset = 500 + (i - 1) * 1000;
        const endOffset = 1500 + (i - 1) * 1000;
  
        ScrollTrigger.create({
          trigger: `[data-pin='${i}']`,
          start: `top+=${startOffset} top`,
          end: `top+=${endOffset} top`,
          scrub: true,
          // markers:true,
          // markers: true, // uncomment for debugging only
          onUpdate: (self) => {
            const progress = gsap.utils.clamp(0, 1, self.progress);
            const el = document.querySelector(`[data-gsap='clip-${i}']`) as HTMLElement;
            if (!el) return;
  
            const maskPercent = progress * maskMax;           // 0 .. maskMax
            const topStop = 100 - maskPercent;               // where transparent begins (in %)
  
            // If topStop is >= 100, the mask hasn't entered the element yet:
            // render a full black mask (element fully visible).
            if (topStop >= 100) {
              const full = "linear-gradient(to top, black 0%, black 100%)";
              el.style.webkitMaskImage = full;
              el.style.maskImage = full;
              el.style.webkitMaskRepeat = "no-repeat";
              el.style.maskRepeat = "no-repeat";
              return;
            }
  
            // Otherwise, compute a soft fade region inside the element.
            const fadeStart = Math.max(topStop - fadeRange, 0); // where fade starts
            const mid = fadeStart + (topStop - fadeStart) / 2;   // mid for softer feel
  
            // Build gradient: solid black up to fadeStart, then soften, then transparent at topStop
            const gradient = `linear-gradient(
              to top,
              black 0%,
              black ${fadeStart}%,
              rgba(0,0,0,0.6) ${Math.max(mid, fadeStart)}%,
              transparent ${topStop}%,
              transparent 100%
            )`;
  
            el.style.webkitMaskImage = gradient;
            el.style.maskImage = gradient;
            el.style.webkitMaskRepeat = "no-repeat";
            el.style.maskRepeat = "no-repeat";
          },
        });
      }
  
      ScrollTrigger.refresh();
    });
  
    return () => ctx.revert();
  }, []);


  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.set("[data-pin='6']", { opacity:0 });
      let textTrigger1: ScrollTrigger;
      let textTrigger2: ScrollTrigger;
      let pin5Trigger: ScrollTrigger;
      let pin6Trigger: ScrollTrigger;
      setTimeout(() => {
        textTrigger1 = ScrollTrigger.create({
          trigger: "[data-gsap='clip-1']",
          start: "top+=3000 top",
          end: "top+=3000 top",
          scrub: true,
          // markers: true,
          invalidateOnRefresh: true,
          onEnter: () => {
            setIndex(1);
          },
          onEnterBack: () => {
            setIndex(0);
          },
        });

        textTrigger2 = ScrollTrigger.create({
          trigger: "[data-gsap='clip-1']",
          start: "top+=7000 top",
          end: "top+=7000 top",
          scrub: true,
          // markers: true,
          invalidateOnRefresh: true,
          onEnter: () => {
            setIndex(2);
          },
          onEnterBack: () => {
            setIndex(1);
          },
        });

        // pin5Trigger = ScrollTrigger.create({
        //   trigger: "[data-pin='5']",
        //   start: "top+=5500 top",
        //   end: "top+=7000 top",
        //   scrub: true,
        //   // markers: true,
        //   invalidateOnRefresh: true,
        //   animation: gsap.fromTo(
        //     "[data-pin='5']",{opacity:1},{opacity:0,ease:"linear"}
        //   )
        // });


        // pin6Trigger = ScrollTrigger.create({
        //   trigger: "[data-pin='6']",
        //   start: "top+=7200 top",
        //   end: "top+=8200 top",
        //   scrub: true,
        //   // markers: true,
        //   invalidateOnRefresh: true,
        //   animation: gsap.fromTo(
        //     "[data-pin='6']",{opacity:0},{opacity:0.8,ease:"linear"}
        //   )
        // });

      }, 100);

      return () => {
        textTrigger1?.kill();
        textTrigger2?.kill();
        pin6Trigger?.kill();
      } 
    })
  
      return () => ctx.revert();
  })

  useGSAP(() => {
    const ctx = gsap.context(() => {
      let timeTrigger: ScrollTrigger;
      let timebgTrigger: ScrollTrigger;
  
      setTimeout(() => {
        const lineEl = document.querySelector("[data-gsap='depthstory-timeline-wrapper']") as HTMLElement;
        const planeEl = document.querySelector("[data-gsap='depthstory-timeline']") as HTMLElement;
  
        const updateTimelineAnim = () => {
          if (!lineEl || !planeEl) return;
  
          const containerWidth = lineEl.offsetWidth;
          const planeWidth = planeEl.offsetWidth;
  
          const targetX = containerWidth - planeWidth; // full line width minus plane width
          gsap.set(planeEl, { x: 0 }); // reset position before anim
          if (timeTrigger) timeTrigger.kill();
          if (timebgTrigger) timebgTrigger.kill();
  
          timeTrigger = ScrollTrigger.create({
            trigger: "[data-gsap='clip-1']",
            start: "top top",
            end: "top+=5000 top",
            scrub: true,
            invalidateOnRefresh: true,
            animation: gsap.fromTo(
              planeEl,
              { x: 0 },
              { x: targetX, ease: "linear" }
            ),
            onUpdate: (self) => {
              const direction = self.direction; // 1 = down, -1 = up
              gsap.to(planeEl, {
                scaleX: direction === 1 ? 1 : -1,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto",
              });
            }
          });
  
          timebgTrigger = ScrollTrigger.create({
            trigger: "[data-gsap='clip-1']",
            start: "top top",
            end: "top+=5000 top",
            scrub: true,
            invalidateOnRefresh: true,
            animation: gsap.fromTo(
              "[data-gsap='depthstory-timeline-bg']",
              { width: "0%" },
              { width: "100%", ease: "linear" }
            ),
          });
        };
  
        updateTimelineAnim();
        ScrollTrigger.addEventListener("refreshInit", updateTimelineAnim);
        ScrollTrigger.refresh();
      }, 100);
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
            <p className="font-progLight text-[#F4F5F2] text-xs leading-[23px] md:text-md md:leading-[32px] tracking-[-0.8px] md:tracking-[-1.2px]">
              Braniff International Airways Lounge, 1970
            </p>
          </div>
          <div className="flex flex-col justify-end min-h-[0]">
            <p className="font-progLight text-[#F4F5F2] text-xs leading-[23px] md:text-md md:leading-[32px] tracking-[-0.8px] md:tracking-[-1.2px]">
              Modern aircraft interior, 2020s
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-[30px] items-center justify-center">
        <p className="font-reckless text-white text-sm md:text-md tracking-[-1.2px]">1970s</p>

        <div data-gsap='depthstory-timeline-wrapper' className="relative w-full h-[1px] bg-[#a1a1a199]">
          <img
            data-gsap="depthstory-timeline"
            src="planeicon.svg"
            className="absolute left-0 top-[-8px] -translate-y-1/2"
          />
          <div data-gsap="depthstory-timeline-bg" className="absolute top-0 left-0 h-[1px] w-[0%] bg-[#DEDDDF]"></div>
        </div>

        <p className="font-reckless text-white text-sm md:text-md tracking-[-1.2px]">2020s</p>
      </div>

    </div>
  );
}
