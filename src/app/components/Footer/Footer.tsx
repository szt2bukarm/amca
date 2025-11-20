"use client"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger);

export default function Footer() {

    useGSAP(() => {

        const ctx = gsap.context(() => {
            let trigger: ScrollTrigger
            let trigger2: ScrollTrigger
            setTimeout(() => {
                gsap.set("[data-gsap='footer-2'], [data-gsap='footer-3']", { opacity: 0, scale: 1.05 });
                trigger = ScrollTrigger.create({
                    trigger: "[data-gsap='footer-2']",
                    start: "top 70%",
                    end: "bottom 70%",
                    animation: gsap.fromTo("[data-gsap='footer-2'], [data-gsap='footer-3']", { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, stagger: 0.1, duration: 1, ease: "power2.out" }),
                })

                trigger2 = ScrollTrigger.create({
                    trigger: "[data-gsap='footer-2']",
                    start: "top+=100 85%",
                    end: "top+=200 85%",
                    scrub: true,
                    invalidateOnRefresh: true,
                    animation: gsap.fromTo("[data-gsap='nav-logo-desktop'],[data-gsap='nav-logo-mobile']", { opacity: 1 }, { opacity: 0, immediateRender: false }),
                })
            }, 100);
        }, [])
        return () => ctx.revert();
    }, [])

    return (
        <div className="relative pt-[170px] md:pt-[70px] pb-[200px] md:pb-[140px] w-screen h-fit bg-[#FAF5EF] flex flex-col items-center justify-center gap-[8vw] md:gap-[60px] overflow-hidden">

            <div className="flex flex-col items-center font-reckless w-fit h-fit text-[17.5vw] leading-[13vw] md:text-h2 md:leading-[80px] text-blue">
                {/* <p data-gsap="footer-1" className="tracking-[-0.9vw] md:tracking-[-7px] ml-[11.5vw] md:ml-[50px]">Now,</p> */}
                <p data-gsap="footer-2" className="tracking-[-0.9vw] md:tracking-[-7px] ">The Sky Has</p>
                <p data-gsap="footer-3" className="tracking-[-0.9vw] md:tracking-[-7px]">No Limits.</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-[10vw] md:w-[85px]" viewBox="0 0 85 59" fill="none">
                <path d="M84.9771 41.39L43.1508 0.275492C42.7769 -0.0920331 42.1774 -0.0919523 41.8036 0.275673L0 41.39C4.961 46.2691 10.585 50.0466 16.5748 52.8572L32.3106 29.8437C32.5843 29.4434 33.2042 29.763 33.0369 30.2181L23.6848 55.6678C29.2859 57.489 34.4741 58.4559 40.3039 58.6133L42.1258 45.9792C42.1928 45.5145 42.8606 45.5061 42.9393 45.969L45.0848 58.5908C50.8002 58.4109 55.8284 57.4441 61.3152 55.6678L51.9631 30.2181C51.7958 29.763 52.4157 29.4434 52.6894 29.8437L68.4252 52.8572C74.415 50.0466 80.039 46.2691 85 41.39H84.9771Z" fill="#3763C8" />
            </svg>

            {/* <div className="flex flex-col md:flex-row items-center justify-center gap-[2vw]  md:gap-[40px] text-blue text-[4.5vw] md:text-sm font-progLight">
                <a href="https://amca.com/about/" target="_blank" className="tracking-[-1px] hover:opacity-50 transition-opacity duration-150 cursor-pointer">About</a>
                <a href="https://amca.com/terms-and-policies/" target="_blank" className="tracking-[-1px] hover:opacity-50 transition-opacity duration-150 cursor-pointer">Terms & Policies</a>
                <a href="mailto:founders@amca.co" className="tracking-[-1px] hover:opacity-50 transition-opacity duration-150 cursor-pointer">Contact</a>
            </div> */}

        </div>
    )
}