"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import JobBoardListingCard from "./JobBoardListingCard";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "@/app/useStore";
gsap.registerPlugin(ScrollTrigger);

interface Job {
  title: string;
  location: string;
  apply: string;
}

interface Props {
  jobs: Job[];
  currentPage: number;
}

export default function JobBoardListing({ jobs = [], currentPage }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {showData,setShowData} = useStore();

  useGSAP(() => {
    const ctx = gsap.context(() => {
      let trigger: ScrollTrigger;
      setTimeout(() => {
        trigger = ScrollTrigger.create({
          trigger: "[data-gsap='jobboard']",
          start: "top+=100 top",
          end: "top+=100 top",
          scrub: true,
          // markers: true,
          onEnter: () => {
            const current = useStore.getState().showData;
            if (current) return;
            useStore.getState().setShowData(true);
          }
        });
      }, 100);
      return () => trigger?.kill();
    })
    return () => ctx.revert();
  },[showData])

  const imageNumbers = useMemo(() => {
    const result: number[] = [];
    while (result.length < 7) {
      const random = Math.floor(Math.random() * 7) + 1; // numbers 1–7
      if (!result.includes(random)) {
        result.push(random);
      }
    }
    return result;
  }, [jobs]);

  // always make sure there are exactly 7 jobs
  const filledJobs = [
    ...jobs,
    ...Array(Math.max(0, 7 - jobs.length)).fill({
      title: "",
      location: "",
    }),
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll<HTMLDivElement>(
      ".job-card-content"
    );

    gsap.set(cards, { rotateX: -90 });

    gsap.to(cards, {
      rotateX: 0,
      duration: 0.15,
      stagger: 0.1,
      ease: "power4.inOut",
    });
  }, [currentPage,jobs,showData]);

  return (
    <div ref={containerRef} className="flex flex-col gap-[0.2vw]">
      <div className="flex w-[53vw] mb-[0.2vw]">
        <p className="w-[65%] font-progLightIta text-white text-[0.8vw]">
          TITLE
        </p>
        <p className="font-progLightIta text-white text-[0.8vw]">LOCATION</p>
      </div>
  
      {Array(7)
        .fill(null)
        .map((_, index) => {
          const job = showData
            ? filledJobs[index] || { title: "", location: "", apply: "" }
            : { title: "", location: "", apply: "" };
  
          return (
            <div
              key={`${currentPage}-${index}`}
              className="job-card-wrapper w-full h-full"
            >
              <div className="job-card-inner w-full h-full [transform-style:preserve-3d]">
                <JobBoardListingCard
                  title={job.title}
                  location={job.location}
                  textDelay={index * 100}
                  apply={job.apply}
                  imageNo={imageNumbers[index]}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}