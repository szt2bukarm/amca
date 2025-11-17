"use client"
import { useStore } from "@/app/useStore"
import { useMemo } from "react"

export default function JobBoardMobile() {
    const { jobs } = useStore();

    const imageNumbers = useMemo(() => {
        const maxImages = 11;
        const totalJobs = jobs?.length || 0;

        // Helper: shuffle array
        const shuffle = (arr: number[]) => arr.sort(() => Math.random() - 0.5);

        const result: number[] = [];
        let pool = shuffle(Array.from({ length: maxImages }, (_, i) => i + 1));

        for (let i = 0; i < totalJobs; i++) {
            if (pool.length === 0) {
                pool = shuffle(Array.from({ length: maxImages }, (_, i) => i + 1));
            }

            const next = pool.pop()!;
            if (i > 0 && next === result[i - 1]) {
                if (pool.length > 0) {
                    const alt = pool.pop()!;
                    pool.push(next); 
                    result.push(alt);
                } else {
                    result.push(next);
                }
            } else {
                result.push(next);
            }
        }

        return result;
    }, [jobs]);

    return (
        <div className="block md:hidden relative w-full h-fit overflow-hidden">
            <p className="font-reckless relative text-[15vw] tracking-[-1vw] text-center z-[11] py-[150px] text-title">
                Open Roles
            </p>

            {/* gradient */}
            <div className="absolute top-0 left-0 w-screen h-full bg-[linear-gradient(180deg,#232323_20%,#3263CD_80.29%)]" />

            {/* glass bg */}
            <img
                src="jobboard/jobboard-bg.webp"
                alt="Job Board Glass Tile Background"
                className="min-w-[180vw] absolute top-[100px] left-1/2 translate-x-[-50%] mix-blend-plus-lighter [mask-image:linear-gradient(to_bottom,transparent_25%,black_100%)] [mask-size:100%_100%] [mask-repeat:no-repeat]"
            />

            <div className="relative flex flex-col z-10">
                <img src="jobboard/jobboard-top.webp" className="w-full h-full" />
                <img src="joinus.svg" className="absolute left-1/2 translate-x-[-50%] top-[15vw] w-[40vw]" />

                <div className="w-full h-full bg-[#232323]">
                    <p className="text-[#ddd8d1] font-progLightIta text-[14px] ml-[20px] mt-[10px] mb-[10px]">
                        TITLE AND DEPARTMENT
                    </p>

                    {jobs.map((job: any, index: number) => (
                        <a key={index} className="w-full h-full" href={job.apply} target="_blank" >
                        <div
                            key={index}
                            className="cursor-pointer transition-colors duration-150 group w-[calc(100%-20px)] h-fit flex p-[10px] bg-[#303032] hover:bg-[#ddd8d1] shadow-[inset_0_1px_8.1px_0_rgba(0,0,0,0.5)] mx-[10px] items-center"
                        >
                            <div className="flex flex-col justify-center w-[80%] mr-[20px]">
                                <p className="transition-colors duration-150 font-inriaRegular text-[18px] text-[#ddd8d1] group-hover:text-black">
                                    {job.title}
                                </p>
                                <p className="transition-colors duration-150 font-inriaRegular text-[18px] text-[#ddd8d1] group-hover:text-black opacity-50">
                                    {job.department}
                                </p>
                            </div>
                            <img
                                src={`jobboard/apply/${imageNumbers[index]}.webp`}
                                alt={`Job ${job.title}`}
                                className="w-[20%]"
                            />
                        </div>
                        </a>
                    ))}
                </div>
                <img src="jobboard/jobboard-bottom.webp" className="w-full h-full" />
            </div>

            <div className="absolute bottom-0 left-0 h-[50px] w-screen bg-[#F0EDE8]" />
        </div>
    );
}
