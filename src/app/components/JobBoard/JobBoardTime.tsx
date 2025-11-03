"use client";
import { useEffect, useState } from "react";
import JobBoardTimeCard from "./JobBoardTimeCard";

interface Props {
  text: string;
  timeZone: string; // pass a timezone string like "America/New_York"
}

export default function JobBoardTime({ text, timeZone }: Props) {
  const [now, setNow] = useState(new Date());

  // update the clock
  useEffect(() => {
    const updateNow = () => setNow(new Date());
  
    updateNow(); // initial update
  
    // compute milliseconds until next minute
    const nowDate = new Date();
    const msUntilNextMinute =
      (60 - nowDate.getSeconds()) * 1000 - nowDate.getMilliseconds();
  
    const timeout = setTimeout(() => {
      updateNow();
  
      // start interval every minute
      const interval = setInterval(updateNow, 60 * 1000);
      // cleanup interval when component unmounts
      return () => clearInterval(interval);
    }, msUntilNextMinute);
  
    return () => clearTimeout(timeout);
  }, []); // <- empty array, only run once on mount

  // create Date in the given timezone
  const tzTime = new Date(now.toLocaleString("en-US", { timeZone }));

  const hours = tzTime.getHours().toString().padStart(2, "0");
  const minutes = tzTime.getMinutes().toString().padStart(2, "0");

  return (
    <div className="flex flex-col gap-[0.1vw]">
      <p className="font-progRegular text-white text-[1.2vw] leading-[1.2vw] text-center">
        {text}
      </p>

      <div className="flex gap-[0.1vw]">
        <JobBoardTimeCard number={hours[0]} />
        <JobBoardTimeCard number={hours[1]} />
        <p className="font-progRegular text-white text-[1.6vw] leading-[1.6vw]">:</p>
        <JobBoardTimeCard number={minutes[0]} />
        <JobBoardTimeCard number={minutes[1]} />
      </div>

      <p className="font-progRegular text-white text-[1.2vw] leading-[1.2vw] text-center">
        TIME
      </p>
    </div>
  );
}
