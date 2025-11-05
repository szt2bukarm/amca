interface Props {
    number: string
}

export default function JobBoardTimeCard({number}:Props) {

    return (
        <div className="w-[1.6vw] h-[2vw] flex items-center justify-center bg-[#303030] [box-shadow:inset_0_1px_11.6px_0_rgba(0,0,0,0.93)]">
            <p className="font-progRegular text-[#faf5ef] text-[1.3vw] leading-[1.3vw] mt-[2px]">{number}</p>
        </div>
    )

}