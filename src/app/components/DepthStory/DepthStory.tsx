import { Canvas } from "@react-three/fiber";
import DepthPlane from "../DepthImage";
import DepthStoryTimeline from "./DepthStoryTimeline";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useStore } from "@/app/useStore";

gsap.registerPlugin(ScrollTrigger,SplitText);

export default function DepthStory() {
  const [dpr, setDpr] = useState(1);
  const {depthPlaneTextures,isMobile} = useStore();

  useEffect(() => {
    setDpr(window.devicePixelRatio);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      let split: SplitText | null = null;
      let textTrigger: ScrollTrigger | null = null;
  
      const setup = () => {
        // kill existing if any
        textTrigger?.kill();
        split?.revert();
  
        // rebuild split each time
        split = new SplitText("[data-gsap='depthstory-text']", {
          type: "words",
        });
  
        gsap.set(split.words, { opacity: 0 });
  
        textTrigger = ScrollTrigger.create({
          trigger: "[data-pin='1']",
          start: "top+=5500 top",
          end: "top+=7500 top",
          scrub: true,
          animation: gsap.fromTo(
            split.words,
            { opacity: 0 },
            { opacity: 1, stagger: 0.1, ease: "power4.inOut" }
          ),
        });
      };
  
      // initial setup
      setTimeout(setup, 100);
  
      // handle resize + refresh properly
      ScrollTrigger.addEventListener("refreshInit", () => {
        setup();
      });
  
      window.addEventListener("resize", () => ScrollTrigger.refresh());
  

        ScrollTrigger.create({
            trigger: "[data-gsap='depthstory']",
            start: "top top",
            end: "+=11000", 
            pin: true,
            scrub: true,
            markers: true,
          });

      return () => {
        textTrigger?.kill();
        split?.revert();
      };
    })
    return () => ctx.revert();
  }, []);


    return (
        <div data-gsap="depthstory" className="mt-[300vh] relative h-[100dvh] bg-[#232323]">
          
        {/* gradient */}
        <div className="absolute top-0 left-0 w-screen h-[100dvh] z-10">
            <div className="relative w-full h-[100dvh]">
                <div className="absolute top-0 left-0 w-screen h-[220px] bg-gradient-to-b from-[#232323] to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-screen h-[220px] bg-gradient-to-t from-[#232323] to-transparent"></div>
                <DepthStoryTimeline />
            </div>
        </div>

        <p data-gsap="depthstory-text" className="absolute top-[50%] translate-y-[-50%] left-[20px] md:left-[50px] font-reckless text-sm leading-[28px] md:text-lg md:leading-[48px] text-[#FAF5EF] w-[348px] md:w-[642px] z-10">Aviation was once humanity's boldest ambition, but the industry hasn't successfully built a new plane in 40 years.</p>


        <div data-pin="1" className="h-screen  absolute top-0 left-0 z-[6]">
        <div data-gsap="clip-1" className="w-full h-full">
          {isMobile ? (
            <img src="depthstory/lounge_1.webp" className="w-screen h-screen object-cover" />
          ) : (
            <Canvas
            style={{
              width: "100vw",
              height: "100vh",
            }}
            dpr={[1,dpr]}
            >
          <DepthPlane
            textures={depthPlaneTextures?.[0]}
            hThreshold={50}
            vThreshold={70}
            scrollTarget="[data-pin='1']"
            start={0}
            end={6000}
            />
        </Canvas>
          )}
        </div>
      </div>
    <div data-pin="2" className="h-screen absolute top-0 left-0 z-[5]">
          <div data-gsap="clip-2" className="w-full h-full">
              {isMobile ? (
                <img src="depthstory/lounge_2.webp" className="w-screen h-screen object-cover" />
              ) : (
                  <Canvas
                  dpr={[1,dpr]}
                  style={{
                    width: "100vw",
                    height: "100vh",
                  }}
                  >
                  <DepthPlane 
                  textures={depthPlaneTextures?.[1]}
                  hThreshold={50}
                  vThreshold={70}
                  scrollTarget="[data-pin='2']"
                  start={0}
                  end={6000}
                  />
                  </Canvas>
                )}
          </div>
        </div>
      <div data-pin="3" className="h-screen absolute top-0 left-0 z-[4]">
      <div data-gsap="clip-3" className="w-full h-full">
      {isMobile ? (
                <img src="depthstory/lounge_3.webp" className="w-screen h-screen object-cover" />
              ) : (
        <Canvas
          dpr={[1,dpr]}
          style={{
            width: "100vw",
            height: "100vh",
          }}
        >
          <DepthPlane
            textures={depthPlaneTextures?.[2]}
            hThreshold={50}
            vThreshold={70}
            scrollTarget="[data-pin='3']"
            start={0}
            end={6000}
          />
        </Canvas>
              )}
        </div>
      </div>
      <div data-pin="4" className="h-screen absolute top-0 left-0 z-[3]">
      <div data-gsap="clip-4" className="w-full h-full">
      {isMobile ? (
                <img src="depthstory/lounge_4.webp" className="w-screen h-screen object-cover" />
              ) : (
        <Canvas
          dpr={[1,dpr]}
          style={{
            width: "100vw",
            height: "100vh",
          }}
        >
          <DepthPlane
            textures={depthPlaneTextures?.[3]}
            hThreshold={50}
            vThreshold={70}
            scrollTarget="[data-pin='4']"
            start={0}
            end={6000}
          />
        </Canvas>
              )}
        </div>
      </div>
      <div data-pin="5" className="h-screen absolute top-0 left-0 z-[2]">
      <div data-gsap="clip-5" className="w-full h-full">
      {isMobile ? (
                <img src="depthstory/lounge_5.webp" className="w-screen h-screen object-cover" />
              ) : (
        <Canvas
          dpr={[1,dpr]}
          style={{
            width: "100vw",
            height: "100vh",
          }}
        >
          <DepthPlane
            textures={depthPlaneTextures?.[4]}
            hThreshold={50}
            vThreshold={70}
            scrollTarget="[data-pin='5']"
            start={0}
            end={6000}
          />
        </Canvas>
              )}
        </div>
      </div>
      <div data-pin="6" className="h-screen absolute top-0 left-0 z-[1]">
      {isMobile ? (
                <img src="depthstory/wait_normal.jpg" className="w-screen h-screen object-cover" />
              ) : (
        <Canvas
          dpr={[1,dpr]}
          style={{
            width: "100vw",
            height: "100vh",
          }}
        >
          <DepthPlane
            textures={depthPlaneTextures?.[5]}
            hThreshold={50}
            vThreshold={70}
            scrollTarget="[data-pin='5']"
            start={0}
            end={6900}
          />
        </Canvas>
        )}
      </div>
    </div>
    )
}