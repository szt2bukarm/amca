import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ShowcaseImagesTop() {

    useGSAP(() => {
        const ctx = gsap.context(() => {
            let trigger: ScrollTrigger;
            const timer = setTimeout(() => {
                trigger = ScrollTrigger.create({
                    trigger: "[data-gsap='showcase-img-top']",
                    start: "top-=500 top",
                    end: "bottom+=500",
                    scrub: true,
                    animation: gsap.fromTo("[data-gsap='showcase-img-top']", { y: -0, }, { y: 30, ease: "linear", }),
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
                trigger = ScrollTrigger.create({
                    trigger: "[data-gsap='showcase-img-top']",
                    start: "top-=500 top",
                    end: "top+=500 top",
                    scrub: true,
                    invalidateOnRefresh: true,
                    onRefresh: (self) => {
                        if (self.progress === 1) {
                            gsap.set("[data-gsap='nav-logo-desktop'],[data-gsap='nav-logo-mobile'],[data-gsap='nav-careers']", { filter: "invert(0)" });
                        } else if (self.progress > 0) {
                            gsap.set("[data-gsap='nav-logo-desktop'],[data-gsap='nav-logo-mobile'],[data-gsap='nav-careers']", { filter: "invert(1)" });
                        }
                    },
                    animation: gsap.fromTo(
                        "[data-gsap='nav-logo-desktop'],[data-gsap='nav-logo-mobile'],[data-gsap='nav-careers']",
                        { filter: "invert(1)" },
                        { filter: "invert(0)", ease: "linear", immediateRender: false }
                    ),
                });
                gsap.set("[data-gsap='nav-logo-desktop'],[data-gsap='nav-logo-mobile'],[data-gsap='nav-careers']", { filter: "invert(0)" });
            }, 100);
            return () => {
                clearTimeout(timer);
                trigger?.kill();
            };
        })
        return () => ctx.revert();
    }, [])

    useGSAP(() => {
        const ctx = gsap.context(() => {
            let trigger: ScrollTrigger;
            const timer = setTimeout(() => {
                trigger = ScrollTrigger.create({
                    trigger: "[data-gsap='showcase-top-card']",
                    start: "top-=2000 top",
                    end: "bottom+=2000 top",
                    scrub: true,
                    animation: gsap.fromTo("[data-gsap='showcase-top-card']", { y: -150, }, { y: 150, stagger: 0.05, ease: "linear", }),
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
                gsap.set("[data-gsap='showcase-top-card']", {
                    clipPath: "inset(0% 0% 100% 0%)",
                    filter: "brightness(1000%)",
                });
                trigger = ScrollTrigger.create({
                    trigger: "[data-gsap='showcase-top-card']",
                    start: "top-=650 top",
                    onEnter: () => {
                        gsap.to("[data-gsap='showcase-top-card']", {
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
        <div className="relative grid grid-cols-4 gap-[1vw] mx-auto max-w-[2000px]">

            <div data-gsap="showcase-top-card" className="overflow-hidden z-2 relative w-full h-[33vw] bg-gradient-to-b from-[#94CBD7] to-[#E4E0DA] mt-[6vw] rounded-[5px] md:rounded-[16px]">
                <img alt="Image showing Amca's plane parts" data-gsap="showcase-img-top" src="/showcase/1.webp" className="scale-[1.35] md:scale-[1.15] w-full h-full object-cover" />
            </div>
            <div data-gsap="showcase-top-card" className="overflow-hidden z-2 relative w-full h-[25vw] bg-gradient-to-b from-[#94CBD7] to-[#E4E0DA] rounded-[5px] md:rounded-[16px]">
                <img alt="Image showing Amca's plane parts" data-gsap="showcase-img-top" src="/showcase/2.webp" className="scale-[1.35] md:scale-[1.15] w-full h-full object-cover" />
            </div>
            <div data-gsap="showcase-top-card" className="overflow-hidden z-2 relative w-full h-[20vw] bg-gradient-to-b from-[#94CBD7] to-[#E4E0DA] rounded-[5px] md:rounded-[16px]">
                <img alt="Image showing Amca's plane parts" data-gsap="showcase-img-top" src="/showcase/3.webp" className="scale-[1.35] md:scale-[1.15] w-full h-full object-cover" />
            </div>
            <div data-gsap="showcase-top-card" className="overflow-hidden z-2 relative w-full h-[33vw] bg-gradient-to-b from-[#94CBD7] to-[#E4E0DA] mt-[6vw] rounded-[5px] md:rounded-[16px]">
                <img alt="Image showing Amca's plane parts" data-gsap="showcase-img-top" src="/showcase/4.webp" className="scale-[1.35] md:scale-[1.15] w-full h-full object-cover" />
            </div>
        </div>
    )
}