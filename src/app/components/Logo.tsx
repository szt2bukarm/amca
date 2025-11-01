"use client"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)

export default function Logo() {

  useGSAP(() => {
    const ctx = gsap.context(() => {
      let navcolorTrigger: ScrollTrigger
      let navcolorTrigger2: ScrollTrigger

      setTimeout(() => {
        // set everything to normal at start
        gsap.set("[data-gsap='nav-logo-mobile'],[data-gsap='nav-logo-desktop'],[data-gsap='nav-careers']", {
          filter: "invert(0)"
        })


        // second trigger, also reversible
        navcolorTrigger2 = ScrollTrigger.create({
          trigger: "[data-gsap='showcase-nav-change']",
          start: "bottom top",
          end: "bottom top",
          scrub: true,
            onEnter: () => {
                gsap.to("[data-gsap='nav-logo-mobile'],[data-gsap='nav-logo-desktop'],[data-gsap='nav-careers']", {
                    filter: "invert(0)",
                    ease: "none",
                    overwrite: "auto",
                    duration: 0.25
                })
            },
            onEnterBack: () => {
                gsap.to("[data-gsap='nav-logo-mobile'],[data-gsap='nav-logo-desktop'],[data-gsap='nav-careers']", {
                    filter: "invert(1)",
                    ease: "none",
                    overwrite: "auto",
                    duration: 0.25
                })
            }
        })
      }, 100)
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="fixed top-0 left-0 w-screen p-[50px] flex items-center justify-between z-50">
      <p className="opacity-0 hidden lg:block font-progLight text-md leading-[28px] text-[#F4F5F2] tracking-[-1.25px]">
        Advanced Manufacturing<br />Company of America
      </p>

      <div className="block lg:hidden w-[52px] h-[36px] overflow-hidden">
        <svg data-gsap="nav-logo-mobile" xmlns="http://www.w3.org/2000/svg" width="52" height="36" viewBox="0 0 52 36" className="opacity-0" fill="none">
          <path d="M51.1851 25.0514L26.2632 0.27936C25.8884 -0.0931771 25.2831 -0.0930952 24.9084 0.279542L0 25.0514C2.98821 28.0232 6.37577 30.324 9.98365 32.0359L18.7213 19.1141C18.9932 18.7121 19.6151 19.0292 19.4494 19.4854L14.2663 33.7477C17.6401 34.8571 20.7652 35.4459 24.2767 35.5418L25.2252 28.8905C25.2916 28.4249 25.9609 28.4166 26.0389 28.8804L27.1564 35.5281C30.599 35.4185 33.6277 34.8297 36.9326 33.7477L31.7495 19.4854C31.5838 19.0292 32.2058 18.7121 32.4776 19.1141L41.2153 32.0359C44.8232 30.324 48.2107 28.0232 51.1989 25.0514H51.1851Z" fill="white" />
        </svg>
      </div>

      <div className="hidden lg:flex absolute top-0 left-0 w-screen p-[60px] items-center justify-center pointer-events-none">
        <div className="w-[52px] h-[36px] overflow-hidden">
          <svg data-gsap="nav-logo-desktop" className="opacity-0" xmlns="http://www.w3.org/2000/svg" width="52" height="36" viewBox="0 0 52 36" fill="none">
            <path d="M51.1851 25.0514L26.2632 0.27936C25.8884 -0.0931771 25.2831 -0.0930952 24.9084 0.279542L0 25.0514C2.98821 28.0232 6.37577 30.324 9.98365 32.0359L18.7213 19.1141C18.9932 18.7121 19.6151 19.0292 19.4494 19.4854L14.2663 33.7477C17.6401 34.8571 20.7652 35.4459 24.2767 35.5418L25.2252 28.8905C25.2916 28.4249 25.9609 28.4166 26.0389 28.8804L27.1564 35.5281C30.599 35.4185 33.6277 34.8297 36.9326 33.7477L31.7495 19.4854C31.5838 19.0292 32.2058 18.7121 32.4776 19.1141L41.2153 32.0359C44.8232 30.324 48.2107 28.0232 51.1989 25.0514H51.1851Z" fill="white" />
          </svg>
        </div>
      </div>

      <div data-gsap="nav-careers" className="opacity-0 w-fit h-full">
        <button className="cursor-pointer font-reckless text-sm leading-[28px] text-white tracking-[-1.1px] hover:opacity-50 duration-150 transition-opacity">
          Go to Careers&nbsp;&nbsp;→
        </button>
      </div>
    </div>
  )
}
