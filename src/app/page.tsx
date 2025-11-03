"use client"
import { useEffect } from "react";
import Footer from "./components/Footer/Footer";
import JobBoardMobile from "./components/JobBoard/JobBoardMobile";
import JobBoard from "./components/JobBoard/JobBoardWrapper";
import useAshbyJobs from "./hooks/useAshbyJobs";
import { Canvas } from "@react-three/fiber";
import DepthStory from "./components/DepthStory/DepthStory";
import Hero from "./components/Hero/Hero";
import Showcase from "./components/Showcase/Showcase";
import DepthStoryAbsoluteText from "./components/DepthStory/DepthStoryAbsoluteText";
import HeroPin from "./components/Hero/HeroPin";
import { useGSAP } from "@gsap/react";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import gsap from "gsap";
gsap.registerPlugin(ScrollTrigger);
// import { DepthImage } from "./components/DepthImage";

  export default function Home() {
    useAshbyJobs()

    useGSAP(() => {
      setTimeout(() => {
        ScrollTrigger.create({
          trigger: "[data-scroll='jobboard']",
          id: "jobboard",
          start: "top top",
        })
      }, 1000);
    },[])

    return (
      <div className="relative w-full h-full">
        <HeroPin />
        {/* <div className="w-screen h-[800vh]"></div> */}
        <DepthStory />
        <DepthStoryAbsoluteText />
        <Showcase />
        <div className="h-[1px] w-screen bg-[#232323" data-scroll="jobboard" ></div>
        <JobBoard />
        <JobBoardMobile />
        <Footer />
      </div>
    );
  }
