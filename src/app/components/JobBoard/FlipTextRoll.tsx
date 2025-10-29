"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface FlipTextRollProps {
  text: string;
  color?: string;
  delay?: number;
  stepDuration?: number; 
}

export default function FlipTextRoll({ text, color, delay, stepDuration = 0.025 }: FlipTextRollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const letters = text.split("");
    containerRef.current.innerHTML = "";

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    letters.forEach((letter) => {
      const span = document.createElement("span");

        if (letter === " ") {
          span.textContent = " ";
          span.style.minWidth = "0.3vw";
        } else { 
            span.textContent = "A"; // start from A
            span.style.minWidth = "0"; // prevent weird gaps
        }
      span.style.display = "inline-block";
      span.style.width = "auto"; // allow natural width
      span.style.textAlign = "center";
      span.style.fontFamily = "Programme-Regular"; // custom font
      span.style.color = color;
      span.style.fontSize = "1.3vw"; // font size
      containerRef.current?.appendChild(span);

      // skip animation for non-alphabet
      if (!/[a-zA-Z]/.test(letter)) {
        span.textContent = letter;
        return;
      }

      const targetIndex = alphabet.indexOf(letter.toUpperCase());
      const isUpper = letter === letter.toUpperCase();

      const tl = gsap.timeline();
      setTimeout(() => {
        for (let i = 0; i <= targetIndex; i++) {
            tl.to(span, {
              duration: stepDuration,
              textContent: alphabet[i],
              ease: "none",
            });
          }
      }, delay);

      // make sure the last letter keeps the original case
      tl.to(span, {
        duration: 0,
        textContent: letter.toUpperCase(),
      });
    });
  }, [text, stepDuration]);

  return <div ref={containerRef} className="flex gap-[0.05ch]" />; // smaller gap
}
