import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import gsap from "gsap";
gsap.registerPlugin(ScrollTrigger);

export default function PinTest() {

    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: "[data-gsap='pin-test']",
                start: "top top",
                end: "+=12000", // total scroll distance for the pin
                pin: true,
                scrub: true,
                markers: true,
              });
        })
      }, []);

    return (
        <div data-gsap="pin-test" className="mt-[300px] relative w-full h-screen bg-red-500"></div>
    )
}