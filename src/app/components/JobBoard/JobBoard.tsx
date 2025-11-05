"use client";
import { useStore } from "@/app/useStore";
import JobBoardListing from "./JobBoardListing";
import JobBoardTime from "./JobBoardTime";
import { useEffect, useState } from "react";

export default function JobBoard() {
  const { jobs } = useStore();
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (!jobs) return;
    const totalpage = Math.ceil(jobs.length / 7);
    setTotalPage(totalpage);
    setCurrentPage(0);
  }, [jobs]);



  return (
    <div className="scale-125 lg:scale-100 z-[11] min-w-[95vw] absolute top-[31vw] lg:top-[28vw] left-[50%] translate-x-[-50%] flex items-center justify-center flex-col">
      {/* title */}
      <img src="joinus.svg" className="w-[12vw]" />

      <div className="flex items-center justify-center min-h-[20vw] gap-[4.5vw]">
        <JobBoardTime text="LOS ANGELES" timeZone="America/Los_Angeles" />
        <JobBoardListing
          jobs={jobs.slice(currentPage * 7, (currentPage + 1) * 7)}
          currentPage={currentPage}
        />
        <JobBoardTime text="NEW YORK" timeZone="America/New_York" />
      </div>

      <div className="flex flex-col items-center justify-center gap-[0.5vw]">
        <p className="font-progRegular text-[#faf5ef] opacity-50 text-[1.3vw] leading-[1.3vw]">
          PAGE {currentPage + 1} OF {totalPage}
        </p>

        <div className="flex gap-[2vw]">
          <button
            disabled={currentPage === 0}
            className="cursor-pointer disabled:opacity-20 hover:opacity-75 transition-all duration-150 font-progRegular text-[#faf5ef] text-[1.5vw] leading-[1.5vw]"
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            {"< PREV."}
          </button>

          <button
            disabled={currentPage === totalPage - 1}
            className="cursor-pointer disabled:opacity-20 hover:opacity-75 transition-all duration-150 font-progRegular text-[#faf5ef] text-[1.5vw] leading-[1.5vw]"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            {"NEXT >"}
          </button>
        </div>
      </div>
    </div>
  );
}
