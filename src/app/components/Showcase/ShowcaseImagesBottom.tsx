import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ShowcaseImagesBottom() {


    useGSAP(() => {
        const ctx = gsap.context(() => {
            let trigger: ScrollTrigger;
            const timer = setTimeout(() => {
                trigger = ScrollTrigger.create({
                    trigger: "[data-gsap='showcase-bottom-card']",
                    start: "top-=2000 top",
                    end: "bottom+=2000 top",
                    scrub: true,
                    animation: gsap.fromTo("[data-gsap='showcase-bottom-card']", { y: -150, }, { y: 150, stagger: { each: 0.05, from: "center" }, ease: "linear", }),
                });
            }, 100);
            return () => {
                clearTimeout(timer);
                trigger?.kill();
            };
        })
        return () => ctx.revert();
    })

    useGSAP(() => {
        const ctx = gsap.context(() => {
            let trigger: ScrollTrigger;
            const timer = setTimeout(() => {
                gsap.set("[data-gsap='showcase-bottom-card']", {
                    clipPath: "inset(0% 0% 100% 0%)",
                    filter: "brightness(1000%)",
                });
                trigger = ScrollTrigger.create({
                    trigger: "[data-gsap='showcase-bottom-card']",
                    start: "top-=650 top",
                    onEnter: () => {
                        gsap.to("[data-gsap='showcase-bottom-card']", {
                            clipPath: "inset(0% 0% 0% 0%)",
                            filter: "brightness(100%)",
                            duration: 1,
                            stagger: 0.15,
                            ease: "power4.out",
                        });
                    }
                });
            }, 100);
            return () => {
                clearTimeout(timer);
                trigger?.kill();
            };
        })
        return () => ctx.revert();
    }, [])

    return (
        <div className="grid grid-cols-4 gap-[1vw] mx-auto max-w-[2000px] bg-[#232323] md:pb-[70px] mt-[70px]">

            <div data-gsap="showcase-bottom-card" className="overflow-hidden z-2 relative w-full   rounded-[5px] md:rounded-[16px]">
                <img alt="Image showing Amca's plane parts" data-gsap="showcase-img-bottom" src="/showcase/2_1.webp" className=" w-full h-full object-cover" />
            </div>
            <div data-gsap="showcase-bottom-card" className="overflow-hidden z-2 relative w-full rounded-[5px] md:rounded-[16px]">
                <img alt="Image showing Amca's plane parts" data-gsap="showcase-img-bottom" src="/showcase/2_2.webp" className=" w-full h-full object-cover" />
            </div>
            <div data-gsap="showcase-bottom-card" className="overflow-hidden z-2 relative w-full rounded-[5px] md:rounded-[16px]">
                <img alt="Image showing Amca's plane parts" data-gsap="showcase-img-bottom" src="/showcase/2_3.webp" className=" w-full h-full object-cover" />
            </div>
            <div data-gsap="showcase-bottom-card" className="overflow-hidden z-2 relative w-full   rounded-[5px] md:rounded-[16px]">
                <img alt="Image showing Amca's plane parts" data-gsap="showcase-img-bottom" src="/showcase/2_4.webp" className=" w-full h-full object-cover" />
            </div>
        </div>
    )
}