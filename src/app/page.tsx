  "use client"
  import { useEffect } from "react";
  import Footer from "./components/Footer/Footer";
  import JobBoardMobile from "./components/JobBoard/JobBoardMobile";
  import JobBoard from "./components/JobBoard/JobBoardWrapper";
  import useAshbyJobs from "./hooks/useAshbyJobs";
  import { Canvas } from "@react-three/fiber";
  import Fake3DEffect from "./components/DepthImage";
  import DepthPlane from "./components/DepthImage";
import DepthStory from "./components/DepthStory/DepthStory";
import Hero from "./components/Hero/Hero";
import PinTest from "./components/PinTest";
  // import { DepthImage } from "./components/DepthImage";

  export default function Home() {
    useAshbyJobs()


    return (
      <div className="relative w-full h-full">
        <Hero />
        <DepthStory />
        <div className="pt-[800px] bg-[#232323] w-full h-full z-20 relative overflow-hidden">
        <JobBoard />
        <JobBoardMobile />
        <Footer />
        </div> 

      </div>
    );
  }
