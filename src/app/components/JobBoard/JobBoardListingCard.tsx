"use client"
import FlipTextRoll from "./FlipTextRoll";

interface Props {
  title: string;
  location: string;
  textDelay?: number
  imageNo?: number
  apply?: string
}

export default function JobBoardListingCard({ title, location, textDelay, imageNo, apply }: Props) {


  return (
    <a className="w-full h-full" href={apply} target="_blank" >
          <div className={`group w-[50vw] h-[2.2vw] ${title && "cursor-pointer"} [box-shadow:inset_0_1px_8.1px_0_rgba(0,0,0,0.5)]`}>
      {title && (
      <div className="job-card-content w-full h-full">
        <div className="relative w-full h-full [transform-style:preserve-3d] duration-[200ms] ease-in-out group-hover:[transform:rotateX(-180deg)]">
            
            {/* Front side */}
            <div className="absolute w-full h-full [backface-visibility:hidden] flex items-center px-[0.5vw]">

                <div className="w-[60%]">
                    <FlipTextRoll text={title} delay={textDelay} color="white"/>
                </div>
                <div className="w-[35%]">
                    <FlipTextRoll text={location} delay={textDelay} color="white"/>
                </div>
                <img src={`jobboard/apply/${imageNo}.webp`} className="w-[10%] scale-[1.3] translate-x-[-0.5vw]"/>
            </div>

            {/* Back side */}
            <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateX(-180deg)] bg-white flex items-center px-[0.5vw]">
            <div className="w-[60%]">
                    <FlipTextRoll text={title} delay={textDelay} color="black"/>
                </div>
                <div className="w-[35%]">
                    <FlipTextRoll text={location} delay={textDelay} color="black"/>
                </div>
                <img src={`jobboard/apply/${imageNo}.webp`} className="w-[10%] scale-[1.3] translate-x-[-0.5vw]"/>
            </div>
        </div>

      </div>
      )}
    </div>
    </a>
  );
}



  