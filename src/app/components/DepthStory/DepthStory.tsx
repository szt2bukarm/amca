import { Canvas } from "@react-three/fiber";
import DepthPlane from "../DepthImage";
import DepthStoryTimeline from "./DepthStoryTimeline";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function DepthStory() {
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    setDpr(window.devicePixelRatio);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
        ScrollTrigger.create({
            trigger: "[data-gsap='depthstory']",
            start: "top top",
            end: "+=12000", // total scroll distance for the pin
            pin: true,
            scrub: true,
            markers: true,
          });
    })
  }, []);


    return (
        <div data-gsap="depthstory" className="mt-[450vh] relative h-screen bg-[#232323]">

        {/* gradient */}
        <div className="absolute top-0 left-0 w-screen h-screen z-10">
            <div className="relative w-full h-full">
                <div className="absolute top-0 left-0 w-screen h-[220px] bg-gradient-to-b from-[#232323] to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-screen h-[220px] bg-gradient-to-t from-[#232323] to-transparent"></div>
                <DepthStoryTimeline />
            </div>
        </div>


        <div data-pin="1" className="h-[3000px] absolute top-0 left-0 z-[4]">
        <Canvas
          style={{
            width: "100vw",
            height: "100vh",
          }}
          dpr={[1,dpr]}
        >
          <DepthPlane
            image0="depthstory/dancefloor_normal.jpg"
            image1="depthstory/dancefloor_depth.jpg"
            hThreshold={50}
            vThreshold={70}
            scrollTarget="[data-pin='1']"
            start={0}
            end={3000}
          />
        </Canvas>
      </div>
    <div data-pin="2" className="h-[3000px] absolute top-0 left-0 z-[3]">
          <div data-gsap="clip" className="w-full h-full">
          <Canvas
          dpr={[1,dpr]}
          style={{
            width: "100vw",
            height: "100vh",
          }}
        >
          <DepthPlane 
            image0="depthstory/lounge_normal.jpg"
            image1="depthstory/lounge_depth.jpg"
            hThreshold={50}
            vThreshold={70}
            scrollTarget="[data-pin='2']"
            start={3000}
            end={7000}
          />
        </Canvas>
          </div>
      </div>
      <div data-pin="3" className="h-[3000px] absolute top-0 left-0 z-[2]">
        <Canvas
          dpr={[1,dpr]}
          style={{
            width: "100vw",
            height: "100vh",
          }}
        >
          <DepthPlane
            image0="depthstory/interior_normal.jpg"
            image1="depthstory/interior_depth.jpg"
            hThreshold={50}
            vThreshold={70}
            scrollTarget="[data-pin='3']"
            start={4500}
            end={9000}
          />
        </Canvas>
      </div>
      <div data-pin="4" className="h-[3000px] absolute top-0 left-0 z-[1]">
        <Canvas
          dpr={[1,dpr]}
          style={{
            width: "100vw",
            height: "100vh",
          }}
        >
          <DepthPlane
            image0="depthstory/wait_normal.jpg"
            image1="depthstory/wait_depth.jpg"
            hThreshold={50}
            vThreshold={70}
            scrollTarget="[data-pin='4']"
            start={9000}
            end={12000}
          />
        </Canvas>
      </div>
    </div>
    )
}