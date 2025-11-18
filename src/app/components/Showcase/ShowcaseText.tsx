"use client"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";
gsap.registerPlugin(ScrollTrigger,SplitText);

interface Props {
    dotColor: string,
    textColor: string,
    wide?: boolean
    children: React.ReactNode
}

export default function ShowcaseText({ dotColor, textColor,wide=false, children} : Props) {
    const textRef = useRef<HTMLParagraphElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);


    useGSAP(() => {
        const ctx = gsap.context(() => {
            let trigger: ScrollTrigger;
            setTimeout(() => {
                let text = new SplitText(textRef.current, { type: "words" });
                gsap.set([dotRef.current, text.words], {opacity: 0});
                trigger = ScrollTrigger.create({
                    trigger: textRef.current,
                    start: "top-=200 50%",
                    end: "bottom-=150 50%",
                    scrub: true,
                    animation: gsap.fromTo([dotRef.current, text.words], {opacity: 0}, {opacity: 1,stagger: 0.1, ease: "power4.inOut"}),
                });
            }, 100);
            return () => trigger?.kill();
        })
        return () => ctx.revert();
    },[])

    return (
        <div className={`relative ${wide ? "lg:max-w-[1100px] !w-[80vw]" : "lg:w-[797px]"} md:w-[624px] w-[80%]`}>
            <div ref={dotRef} className={`${dotColor === "orange" && "bg-[#F5685B]"} ${dotColor === "blue" && "bg-[#3263CD]"} w-[15px] h-[15px] md:w-[25px] md:h-[25px] lg:w-[30px] lg:h-[30px] rounded-full absolute top-[5px] left-0 z-10`}></div>
            <p ref={textRef} className={`${textColor === "black" && "text-[#232323]"} ${textColor === "white" && "text-[#DDD8D1]"} font-reckless text-xs leading-[22px] md:text-md md:leading-[32px] lg:text-lg lg:leading-[40px]`}>{children}</p>
        </div>
    )
}