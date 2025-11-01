import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function DepthStoryAbsoluteText() {

    useGSAP(() => {
        const ctx = gsap.context(() => {
            gsap.set("[data-gsap='depthstory-absolute-text']", {opacity: 0});
            let trigger: ScrollTrigger;
            let textTrigger: ScrollTrigger;
            let bgTrigger: ScrollTrigger;
            let textTrigger2: ScrollTrigger;
            setTimeout(() => {
                trigger = ScrollTrigger.create({
                    trigger: "[data-pin='2']",
                    start: "top+=9000 top",
                    end: "top+=10000 top",
                    scrub: true,
                    animation: gsap.fromTo("[data-gsap='depthstory-absolute-text']", {opacity: 0, scale: 1.05}, {opacity: 1, scale: 1, ease: "linear"}),
                });

                textTrigger = ScrollTrigger.create({
                    trigger: "[data-pin='2']",
                    start: "top+=9700 top",
                    end: "top+=10500 top",
                    scrub: true,
                    animation: gsap.fromTo("[data-gsap='depthstory-absolute-text-item']", {opacity: 0, scale: 1.1}, {opacity: 1, scale: 1,stagger: 0.15, ease: "linear"}),
                })

                bgTrigger = ScrollTrigger.create({
                    trigger: "[data-pin='2']",
                    start: "top+=11000 top",
                    end: "top+=12000 top",
                    scrub: true,
                    animation: gsap.fromTo("[data-gsap='depthstory-absolute-text']", {background: "#232323"}, {background: "#FAF5EF", ease: "linear"}),
                });

                textTrigger2 = ScrollTrigger.create({
                    trigger: "[data-pin='2']",
                    start: "top+=11000 top",
                    end: "top+=12000 top",
                    scrub: true,
                    animation: gsap.fromTo("[data-gsap='depthstory-absolute-text-item']", {color: "#FFF"}, {color: "#232323", ease: "linear"}),
                });


            }, 100);

            const handleResize = () => {
                trigger?.refresh();
                bgTrigger?.refresh();
                textTrigger?.refresh();
            };
            window.addEventListener("resize", handleResize);

            return () => {
                trigger?.kill();
                bgTrigger?.kill();
                textTrigger?.kill();
            };
        })
        return () => ctx.revert();
    },[])

    return (
        <div data-gsap="depthstory-absolute-text" className="pointer-events-none opacity-0 fixed top-0 left-0 w-screen h-screen z-20 bg-[#232323] flex items-center justify-center flex-col">
            <p data-gsap="depthstory-absolute-text-item" className="font-reckless text-[#FFF] text-lg leading-[44px] md:text-h4 md:leading-[60px] lg:text-h3 lg:leading-[74px] w-screen text-center">We don't</p>
            <p data-gsap="depthstory-absolute-text-item" className="font-reckless text-[#FFF] text-lg leading-[44px] md:text-h4 md:leading-[60px] lg:text-h3 lg:leading-[74px] w-screen text-center">think it has to</p>
            <p data-gsap="depthstory-absolute-text-item" className="font-reckless text-[#FFF] text-lg leading-[44px] md:text-h4 md:leading-[60px] lg:text-h3 lg:leading-[74px] w-screen text-center">be this way.</p>
        </div>
    )
}