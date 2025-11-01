import JobBoardTimeCard from "./JobBoardTimeCard";

interface Props {
    text: string;
    time: Date;
  }
  
  export default function JobBoardTime({ text, time }: Props) {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
  
    return (
      <div className="flex flex-col gap-[0.1vw]">
        <p className="font-progRegular text-white text-[1.2vw] leading-[1.2vw] text-center">{text}</p>

        <div className="flex gap-[0.1vw]">
            <JobBoardTimeCard number={hours[0]} />
            <JobBoardTimeCard number={hours[1]} />
            <p className="font-progRegular text-white text-[1.6vw] leading-[1.6vw]">:</p>
            <JobBoardTimeCard number={minutes[0]} />
            <JobBoardTimeCard number={minutes[1]} />
        </div>

        <p className="font-progRegular text-white text-[1.2vw] leading-[1.2vw] text-center">TIME</p>

      </div>
    );
  }
  