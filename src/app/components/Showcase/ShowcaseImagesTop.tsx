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
        const mm = gsap.matchMedia();

        mm.add("(min-width: 640px)", () => {
            let trigger: ScrollTrigger;
            let anim: gsap.core.Tween;
            const timer = setTimeout(() => {
                anim = gsap.fromTo("[data-gsap='showcase-top-card']", { y: -150, }, { y: 150, stagger: { each: 0.03, from: "edges" }, ease: "linear", });
                trigger = ScrollTrigger.create({
                    trigger: "[data-gsap='showcase-top-card']",
                    start: "top-=2000 top",
                    end: "bottom+=2000 top",
                    scrub: true,
                    animation: anim,
                });
            }, 100);
            return () => {
                clearTimeout(timer);
                if (anim) anim.kill();
                if (trigger) trigger.kill();
                gsap.set("[data-gsap='showcase-top-card']", { clearProps: "y" });
            };
        });
        mm.add("(max-width: 639px)", () => {
            gsap.set("[data-gsap='showcase-top-card']", { clearProps: "y" });
        });
    });

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
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-[1vw] mx-auto max-w-[2000px]">

            <div data-gsap="showcase-top-card" className="overflow-hidden z-2 relative w-full sm:translate-y-[6vw] rounded-[5px] md:rounded-[16px] translate-y-[50px]">
                <img alt="Image showing Amca's plane parts" data-gsap="showcase-img-top" src="/showcase/1_1.webp" className="scale-[1.15] w-full h-full object-cover" />
            </div>
            <div data-gsap="showcase-top-card" className="overflow-hidden z-2 relative w-full rounded-[5px] md:rounded-[16px]">
                <div className="w-full h-full translate-y-[-10px]">
                    <img alt="Image showing Amca's plane parts" data-gsap="showcase-img-top" src="/showcase/1_2.webp" className="scale-[1.15] w-full h-full object-cover" />
                </div>
            </div>
            <div data-gsap="showcase-top-card" className="overflow-hidden z-2 relative w-full   rounded-[5px] md:rounded-[16px] translate-y-[50px]">
                <img alt="Image showing Amca's plane parts" data-gsap="showcase-img-top" src="/showcase/1_3.webp" className="scale-[1.15] w-full h-full object-cover" />
            </div>
            <div data-gsap="showcase-top-card" className="overflow-hidden z-2 relative w-full sm:translate-y-[12vw] rounded-[5px] md:rounded-[16px]">
                <img alt="Image showing Amca's plane parts" data-gsap="showcase-img-top" src="/showcase/1_4.webp" className="scale-[1.15] w-full h-full object-cover" />
            </div>
        </div>
    )
}