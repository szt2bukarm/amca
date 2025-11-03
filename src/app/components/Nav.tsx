"use client"
import { useGSAP } from "@gsap/react"
import { useLenis } from "@studio-freight/react-lenis";
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText";
import { useStore } from "../useStore";
import { useEffect, useState } from "react";
gsap.registerPlugin(SplitText,ScrollTrigger);


export default function Nav() {
  const lenis = useLenis();
  const {setShowData,loaded} = useStore();
  const [allowButton, setAllowButton] = useState(false);

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        setAllowButton(true);
      }, 4500);
    }
  }, [loaded]);

    useGSAP(() => {
        const split = new SplitText("[data-gsap='nav-text']", {
            type: "chars",
        })
        gsap.set(split.chars, { x: -30,y:-2, autoAlpha: 0 });
        
        split.chars.forEach((char) => {
            const wrapper = document.createElement("div");
            wrapper.style.display = "inline-block";
            wrapper.style.overflow = "hidden";
            char.parentNode!.insertBefore(wrapper, char);
            wrapper.appendChild(char);
          });

        // Scroll fade with fromTo for better control
        ScrollTrigger.create({
          trigger: document.body,
          start: "top+=4500 0%",
          end: "top+=5500 0%",
          scrub: true,
          // markers: true,
          animation: gsap.fromTo(split.chars, 
            {
              autoAlpha: 0,
              x: -30
            },
            {
              autoAlpha: 1,
              x: 0,
              stagger: 0.005,
            }
          ),
        });
    },[])

    const scrollToCarriers = () => {
      if (lenis) {
        setShowData(false);
        const element = ScrollTrigger.getById("jobboard")
        console.log(element.start);
        // console.log(element.scrollTop);
        lenis.scrollTo(element?.start, {
          duration: 2
        })
      }
      setTimeout(() => {
        setShowData(true);
      }, 1500);
    };

  return (
    <div className="fixed top-0 left-0 w-screen p-[20px] md:p-[50px] flex items-center justify-between z-50">
      <p data-gsap="nav-text" className="hidden lg:block font-progLight text-md leading-[28px] text-[#F4F5F2] tracking-[-1.25px]">
        Advanced Manufacturing<br />Company of America
      </p>

      <a href="https://amca.com/" target="_blank" className="block lg:hidden w-[52px] h-[36px] overflow-hidden">
        <svg data-gsap="nav-logo-mobile" xmlns="http://www.w3.org/2000/svg" width="52" height="36" viewBox="0 0 52 36" className="opacity-0" fill="none">
          <path d="M51.1851 25.0514L26.2632 0.27936C25.8884 -0.0931771 25.2831 -0.0930952 24.9084 0.279542L0 25.0514C2.98821 28.0232 6.37577 30.324 9.98365 32.0359L18.7213 19.1141C18.9932 18.7121 19.6151 19.0292 19.4494 19.4854L14.2663 33.7477C17.6401 34.8571 20.7652 35.4459 24.2767 35.5418L25.2252 28.8905C25.2916 28.4249 25.9609 28.4166 26.0389 28.8804L27.1564 35.5281C30.599 35.4185 33.6277 34.8297 36.9326 33.7477L31.7495 19.4854C31.5838 19.0292 32.2058 18.7121 32.4776 19.1141L41.2153 32.0359C44.8232 30.324 48.2107 28.0232 51.1989 25.0514H51.1851Z" fill="white" />
        </svg>
      </a >

      <a href="https://amca.com/" target="_blank" className="hidden lg:flex absolute top-[50px] left-[50%] translate-x-[-50%] w-[52px] h-[36px] items-center justify-center">
        <div className="w-[52px] h-[36px] overflow-hidden">
          <svg data-gsap="nav-logo-desktop" className="opacity-0" xmlns="http://www.w3.org/2000/svg" width="52" height="36" viewBox="0 0 52 36" fill="none">
            <path d="M51.1851 25.0514L26.2632 0.27936C25.8884 -0.0931771 25.2831 -0.0930952 24.9084 0.279542L0 25.0514C2.98821 28.0232 6.37577 30.324 9.98365 32.0359L18.7213 19.1141C18.9932 18.7121 19.6151 19.0292 19.4494 19.4854L14.2663 33.7477C17.6401 34.8571 20.7652 35.4459 24.2767 35.5418L25.2252 28.8905C25.2916 28.4249 25.9609 28.4166 26.0389 28.8804L27.1564 35.5281C30.599 35.4185 33.6277 34.8297 36.9326 33.7477L31.7495 19.4854C31.5838 19.0292 32.2058 18.7121 32.4776 19.1141L41.2153 32.0359C44.8232 30.324 48.2107 28.0232 51.1989 25.0514H51.1851Z" fill="white" />
          </svg>
        </div>
      </a>

      <div data-gsap="nav-careers" className="opacity-0 w-fit h-full">
        <button disabled={!allowButton} onClick={scrollToCarriers} className="cursor-pointer font-reckless text-sm leading-[28px] text-white tracking-[-1.1px] hover:opacity-50 duration-150 transition-opacity">
          Go to Careers&nbsp;&nbsp;→
        </button>
      </div>
    </div>
  )
}
