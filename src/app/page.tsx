  "use client"
  import { useEffect } from "react";
  import Footer from "./components/Footer/Footer";
  import JobBoardMobile from "./components/JobBoard/JobBoardMobile";
  import JobBoard from "./components/JobBoard/JobBoardWrapper";
  import useAshbyJobs from "./hooks/useAshbyJobs";
  import { Canvas } from "@react-three/fiber";
import DepthStory from "./components/DepthStory/DepthStory";
import Hero from "./components/Hero/Hero";
import PinTest from "./components/PinTest";
import Showcase from "./components/Showcase/Showcase";
import DepthStoryAbsoluteText from "./components/DepthStory/DepthStoryAbsoluteText";
  // import { DepthImage } from "./components/DepthImage";

  export default function Home() {
    useAshbyJobs()


    return (
      <div className="relative w-full h-full">
        {/* <Hero /> */}
        <DepthStory />
        <DepthStoryAbsoluteText />
        <Showcase />
        <JobBoard />
        <JobBoardMobile />
        <Footer />
      </div>
    );
  }
