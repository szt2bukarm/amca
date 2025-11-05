import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ShowcaseImagesBottom() {

    useGSAP(() => {
        const ctx = gsap.context(() => {
            let trigger: ScrollTrigger;
            setTimeout(() => {
                trigger = ScrollTrigger.create({
                    trigger: "[data-gsap='showcase-img-bottom']",
                    start: "top-=500 top",
                    end: "bottom+=500",
                    scrub: true,
                    animation: gsap.fromTo("[data-gsap='showcase-img-bottom']", {y: 0, }, {y: 30, ease: "linear", }),
                });
            }, 100);
            return () => trigger?.kill();
        })
        return () => ctx.revert();
    })

    useGSAP(() => {
        const ctx = gsap.context(() => {
            let trigger: ScrollTrigger;
            setTimeout(() => {
                trigger = ScrollTrigger.create({
                    trigger: "[data-gsap='showcase-bottom-card']",
                    start: "top-=2000 top",
                    end: "bottom+=1000 top",
                    scrub: true,
                    animation: gsap.fromTo("[data-gsap='showcase-bottom-card']", {y: -150, }, {y: 150,stagger:0.05, ease: "linear", }),
                });
            }, 100);
            return () => trigger?.kill();
        })
        return () => ctx.revert();
    })

    useGSAP(() => {
        const ctx = gsap.context(() => {
            let trigger: ScrollTrigger;
            setTimeout(() => {
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
            return () => trigger?.kill();
        })
    },[])

    return (
        <div className="grid grid-cols-4 gap-[1vw] mx-auto max-w-[2000px] bg-[#232323] md:pb-[70px]">

            <div data-gsap="showcase-bottom-card" className="overflow-hidden z-2 relative w-full h-[28vw] bg-gradient-to-b from-[#F4B7A8] to-[#E4E0DA]  rounded-[16px]">
                <img data-gsap="showcase-img-bottom" src="showcase/5.webp" className="scale-[1.35] md:scale-[1.15] w-full h-full object-cover" />
            </div>
            <div data-gsap="showcase-bottom-card" className="overflow-hidden z-2 relative w-full h-[30vw] bg-gradient-to-b from-[#F4B7A8] to-[#E4E0DA] mt-[10vw] rounded-[16px]">
                <img data-gsap="showcase-img-bottom" src="showcase/6.webp" className="scale-[1.35] md:scale-[1.15] w-full h-full object-cover" />
            </div>
            <div data-gsap="showcase-bottom-card" className="overflow-hidden z-2 relative w-full h-[35vw] bg-gradient-to-b from-[#F4B7A8] to-[#E4E0DA] mt-[10vw] rounded-[16px]">
                <img data-gsap="showcase-img-bottom" src="showcase/7.webp" className="scale-[1.35] md:scale-[1.15] w-full h-full object-cover" />
            </div>
            <div data-gsap="showcase-bottom-card" className="overflow-hidden z-2 relative w-full h-[28vw] bg-gradient-to-b from-[#F4B7A8] to-[#E4E0DA]  rounded-[16px]">
                <img data-gsap="showcase-img-bottom" src="showcase/8.webp" className="scale-[1.35] md:scale-[1.15] w-full h-full object-cover" />
            </div>
        </div>
    )
}