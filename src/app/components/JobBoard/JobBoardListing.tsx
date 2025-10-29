"use client";
import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import JobBoardListingCard from "./JobBoardListingCard";

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
  }, [currentPage,jobs]);

  return (
    <div ref={containerRef} className="flex flex-col gap-[0.2vw]">
      <div className="flex w-[50vw] mb-[0.2vw]">
        <p className="w-[57%] font-progLightIta text-white text-[0.8vw]">
          TITLE
        </p>
        <p className="font-progLightIta text-white text-[0.8vw]">LOCATION</p>
      </div>

      {filledJobs.map((job, index) => (
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
      ))}
    </div>
  );
}
