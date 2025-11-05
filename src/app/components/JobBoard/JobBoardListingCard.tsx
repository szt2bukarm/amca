"use client"
import FlipTextRoll from "./FlipTextRoll";

interface Props {
  title: string;
  department: string;
  textDelay?: number
  imageNo?: number
  apply?: string
}

export default function JobBoardListingCard({ title, department, textDelay, imageNo, apply }: Props) {


  return (
    <a className="w-full h-full" href={apply} target="_blank" >
          <div className={`group w-[53vw] h-[2.2vw] ${title && "cursor-pointer"} [box-shadow:inset_0_1px_8.1px_0_rgba(0,0,0,0.5)]`}>
      {title && (
      <div className="job-card-content w-full h-full">
        <div className="relative w-full h-full [transform-style:preserve-3d] duration-[200ms] ease-in-out group-hover:[transform:rotateX(-180deg)]">
            
            {/* Front side */}
            <div className="absolute w-full h-full [backface-visibility:hidden] flex items-center px-[0.5vw]">

                <div className="max-w-[63%] min-w-[63%] flex items-center">
                    <FlipTextRoll text={title} delay={textDelay} color="#ddd8d1"/>
                </div>
                <div className="max-w-[23%] min-w-[23%] flex items-center ml-[1vw]">
                    <FlipTextRoll text={department} delay={textDelay} color="#ddd8d1"/>
                </div>
                <img src={`jobboard/apply/${imageNo}.webp`} className="w-[10%] ml-auto scale-[1.3] translate-x-[-0.5vw]"/>
            </div>

            {/* Back side */}
            <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateX(-180deg)] bg-[#ddd8d1] flex items-center px-[0.5vw]">
                <div className="max-w-[63%] min-w-[63%] flex items-center">
                  <FlipTextRoll text={title} delay={textDelay} color="black"/>
                </div>
                <div className="max-w-[23%] min-w-[23%] flex items-center ml-[1vw]">
                    <FlipTextRoll text={department} delay={textDelay} color="black"/>
                </div>
                <img src={`jobboard/apply/${imageNo}.webp`} className="w-[10%] ml-auto scale-[1.3] translate-x-[-0.5vw]"/>
            </div>
        </div>

      </div>
      )}
    </div>
    </a>
  );
}



  