import { useEffect, useState } from "react";

interface Props {
  target: string;
  duration?: number; // total time to reach target
  size?: string;     // Tailwind text size
  color?: string;    // Tailwind text color
  width?: string;    // Tailwind fixed width per letter
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function LetterRoll({
  target,
  duration = 600,
  size = "text-[1.3vw]",
  color = "white",
  width = "w-[1.2ch]",
}: Props) {
  const [index, setIndex] = useState(0);
  const isSpace = target === " ";
  const targetIndex = isSpace ? 0 : alphabet.indexOf(target.toUpperCase());

  useEffect(() => {
    if (isSpace) return;
    let i = 0;
    const step = duration / (targetIndex + 1);
    const interval = setInterval(() => {
      setIndex(i);
      i++;
      if (i > targetIndex) clearInterval(interval);
    }, step);
    return () => clearInterval(interval);
  }, [target, targetIndex, duration, isSpace]);

  const letterHeight = 1.3; // vw

  return (
    <div
      className={`relative overflow-hidden h-[${letterHeight}vw] flex justify-center ${width}`}
    >
      {isSpace ? (
        <div className={`h-[${letterHeight}vw] ${width}`} />
      ) : (
        <div
          className="transition-transform duration-75"
          style={{ transform: `translateY(-${index * letterHeight}vw)` }}
        >
          {alphabet.split("").map((char, i) => (
            <div
              key={i}
              className={`h-[${letterHeight}vw] ${width} flex items-end justify-center ${size}`}
              style={{ color }}
            >
              {target === target.toLowerCase() ? char.toLowerCase() : char}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
