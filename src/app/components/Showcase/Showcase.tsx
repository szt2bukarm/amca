import { useGSAP } from "@gsap/react";
import ShowcaseAmcaLogo from "./ShowcaseAmcaLogo";
import ShowcaseImagesBottom from "./ShowcaseImagesBottom";
import ShowcaseImagesTop from "./ShowcaseImagesTop";
import ShowcaseText from "./ShowcaseText";
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);


export default function Showcase() {

    useGSAP(() => {
        const ctx = gsap.context(() => {
            let trigger: ScrollTrigger;
            setTimeout(() => {
                trigger = ScrollTrigger.create({
                    trigger: "[data-gsap='showcase-title']",
                    start: "50% 50%",
                    end: "50% 50%",
                    scrub: true,
                    // markers: true,
                    onLeave: () => {
                        gsap.set("[data-gsap='depthstory-absolute-text']", {opacity: 0})
                    },
                    onLeaveBack: () => {
                        gsap.set("[data-gsap='depthstory-absolute-text']", {opacity: 1})
                    }
                });
            }, 100);
            return () => trigger?.kill();
        })
        return () => ctx.revert();
    },[])

    return (
        <div data-gsap='showcase' className="pt-[100vh] relative w-full h-full bg-[#FAF5EF] z-10">

                <div data-gsap="showcase-title" className="absolute top-[calc(100vh-150px)] md:top-[calc(100vh-200px)] left-[50%] translate-x-[-50%] flex flex-col justify-center items-center z-10">
                    <p className="font-reckless text-[#232323] text-lg leading-[44px] md:text-h4 md:leading-[60px] lg:text-h3 lg:leading-[74px] w-screen text-center">We don't</p>
                    <p className="font-reckless text-[#232323] text-lg leading-[44px] md:text-h4 md:leading-[60px] lg:text-h3 lg:leading-[74px] w-screen text-center">think it has to</p>
                    <p className="font-reckless text-[#232323] text-lg leading-[44px] md:text-h4 md:leading-[60px] lg:text-h3 lg:leading-[74px] w-screen text-center">be this way.</p>
                </div>

                <ShowcaseAmcaLogo />
                
                <div data-gsap='showcase-nav-change' className="flex items-center justify-center w-full h-full pt-[30px] pb-[200px]">
                    <ShowcaseText dotColor="blue" textColor="black">
                    <span style={{ display: "inline-block", width: "3.5ch" }}></span>
                    Amca is building airplanes for the 21st century, starting by designing new hardware that flies on today’s planes. 
                    </ShowcaseText>
                </div>

                <ShowcaseImagesTop />
    
                <div className="flex items-center justify-center w-full h-full py-[150px] md:py-[250px] lg:pb-[200px] lg:pt-[300px] bg-[#232323]">
                    <ShowcaseText wide dotColor="orange" textColor="white">
                    <span style={{ display: "inline-block", width: "3.5ch" }}></span>
                    We’re a small team of engineers creating new parts and subsystems to launch our civilization’s next great airplane. Everyone here moves fast, speaks honestly, and takes full ownership of their work. <br></br><br></br>Everything we design goes on planes today that millions of people fly on. But we’re just getting started, and we’d love your help bringing new life to aerospace.
                    </ShowcaseText>
                </div>

                <ShowcaseImagesBottom />

        </div>
    )
}