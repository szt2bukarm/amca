"use client"
import { useGSAP } from "@gsap/react";
import JobBoard from "./JobBoard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import useAshbyJobs from "@/app/hooks/useAshbyJobs";
gsap.registerPlugin(ScrollTrigger);

export default function JobBoardWrapper() {
    useAshbyJobs();

    useGSAP(() => {
        setTimeout(() => {
          ScrollTrigger.create({
            trigger: "[data-scroll='jobboard']",
            id: "jobboard",
            start: "top-=200 top",
            end: "top top",
            scrub: true,
            animation: gsap.fromTo("[data-gsap='nav-careers']", {opacity: 1}, {opacity: 0, immediateRender: false}),
  
          })
        }, 1000);
      },[])

    useGSAP(() => {
        const ctx = gsap.context(() => {
            let trigger: ScrollTrigger
            setTimeout(() => {
                gsap.set("[data-gsap='jobboard-bg']", {x: "-0%"});
                trigger = ScrollTrigger.create({
                    trigger: "[data-gsap='jobboard']",
                    start: "top-=600 top",
                    end: "bottom+=600 top",
                    scrub: true,
                    animation: gsap.fromTo("[data-gsap='jobboard-bg']", {y: 0, scale: 1}, {y: 100, scale: 0.8, ease: "linear", }),
                });
            }, 100);
            return () => trigger?.kill();
        })
        return () => ctx.revert();
    },[])

    useGSAP(() => {
        const ctx = gsap.context(() => {
            let trigger: ScrollTrigger
            setTimeout(() => {
                trigger = ScrollTrigger.create({
                    trigger: "[data-gsap='jobboard-title']",
                    start: "top 70%",
                    end: "bottom 70%",
                    scrub: true,
                    animation: gsap.fromTo("[data-gsap='jobboard-title']", {opacity: 0, scale: 1.05}, {opacity: 1, scale: 1, ease: "power4.inOut"}),
                });
            }, 100);
            return () => trigger?.kill();
        })
        return () => ctx.revert();
    },[])

    return (
        <div data-gsap="jobboard" className="hidden md:block relative w-full h-[110vw] lg:h-[88vw] overflow-hidden">

            {/* title */}
            <p data-gsap="jobboard-title" className="font-reckless text-[7vw] tracking-[-5.35px] z-[11] absolute top-[7.5vw] left-[50%] translate-x-[-50%] text-title">Open Roles</p>

            {/* gradient */}
            <div className="absolute top-0 left-0 w-screen h-[110vw] lg:h-[73vw] bg-[linear-gradient(180deg,#232323_20%,#3263CD_80.29%)]"></div>

            {/* glass bg */}
            <div className="min-w-[180vw] lg:min-w-[160vw] absolute bottom-0 left-1/2 translate-x-[-50%] mix-blend-plus-lighter [mask-image:linear-gradient(to_bottom,transparent_25%,black_100%)] [mask-size:100%_100%] [mask-repeat:no-repeat]">
            <img
            
            data-gsap="jobboard-bg"
            src="/jobboard/jobboard-bg.webp"
            alt="Job Board Glass Tile Background"
            className="w-full h-full "
            />
            </div>

            {/* job board */}
            <img src="/jobboard/jobboard.webp" alt="Job Board Glass Tile Background" className="z-[11] min-w-[150vw] lg:min-w-[110vw] absolute bottom-0 left-[50%] translate-x-[-50.5%] " />
            <JobBoard />

            {/* bottom white cutoff */}
            <div className="absolute z-10 left-0 bottom-0 w-screen h-[20vw] lg:h-[15vw] bg-title"></div>

        </div>
    )
}