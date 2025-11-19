import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function ShowcaseAmcaLogo() {

    useGSAP(() => {
        const ctx = gsap.context(() => {
            let trigger: ScrollTrigger;
            let opacityTrigger: ScrollTrigger;
            setTimeout(() => {
                trigger = ScrollTrigger.create({
                    trigger: "[data-gsap='showcase']",
                    start: "top-=500 top",
                    end: "bottom+=500",
                    scrub: true,
                    animation: gsap.fromTo("[data-gsap='showcase-bg']", {y: -200, }, {y: 200, ease: "linear", }),
                });
                opacityTrigger = ScrollTrigger.create({
                    trigger: "[data-gsap='showcase-title']",
                    start: "50% 50%",
                    end: "bottom+=50% 50%",
                    scrub: true,
                    // markers: true,
                    animation: gsap.fromTo("[data-gsap='showcase-logo']", {opacity: 0, }, {opacity: 1, ease: "linear", }),
                })
            }, 100);
        })
    },[])

    return (
        <div data-gsap='showcase-logo' className="opacity-0 relative w-full h-[410px] md:h-[750px] lg:h-[960px] overflow-hidden">
            <div className="absolute scale-[1.5] md:scale-[1.5] left-[-20vw] lg:scale-150 top-[50%] md:top-[30%] lg:top-[20%] lg:left-0 w-full h-full">
                <img data-gsap="showcase-bg" src="/showcase/amcalogobg.webp" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#FAF5EF] via-transparent to-[#FAF5EF] z-1"></div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[-40%] flex flex-col w-screen px-[20px] md:px-[50px] gap-[4vw]">
                <div className="flex gap-[1vw] w-full items-end justify-center">
                    <img src="/amca_a_blue.webp" className="w-[25.5%] object-contain" />
                    <img src="/amca_m_blue.webp" className="w-[32.5%] object-contain" />
                    <img src="/amca_c_blue.webp" className="w-[18.7%] object-contain" />
                    <img src="/amca_a_blue_lower.webp" className="w-[19.45%] object-contain" />
                </div>

                <div className="flex flex-col w-full h-full">
                <p className="font-reckless text-[#272E2B] text-sm leading-[28px] md:text-lg md:leading-[44px]">Bringing</p>
                <p className="font-reckless text-[#272E2B] text-sm leading-[28px] md:text-lg md:leading-[44px] ml-[3.7ch]">Ambition Back</p>
                <p className="font-reckless text-[#272E2B] text-sm leading-[28px] md:text-lg md:leading-[44px] ml-[3.7ch]">To The Skies.</p>
                </div>
            </div>




        </div>
    )
}