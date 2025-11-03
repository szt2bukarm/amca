"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface FlipTextRollProps {
  text: string;
  color?: string;
  delay?: number;
  stepDuration?: number;
}

export default function FlipTextRoll({
  text,
  color,
  delay = 0,
  stepDuration = 0.025,
}: FlipTextRollProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = "";
    const letters = text.split("");
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    letters.forEach((letter) => {
      const span = document.createElement("span");

      if (letter === " ") {
        span.textContent = " ";
        span.style.minWidth = "0.3vw";
      } else {
        span.textContent = "A";
        span.style.minWidth = "0";
      }

      span.style.display = "inline-block";
      span.style.width = "auto";
      span.style.textAlign = "center";
      span.style.fontFamily = "Programme-Regular";
      span.style.color = color;
      span.style.fontSize = "1.3vw";
      span.style.flexShrink = "0";
      container.appendChild(span);

      if (!/[a-zA-Z]/.test(letter)) {
        span.textContent = letter;
        return;
      }

      const targetIndex = alphabet.indexOf(letter.toUpperCase());
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

      tl.to(span, {
        duration: 0,
        textContent: letter.toUpperCase(),
      });
    });

    if (!containerRef.current || !wrapperRef.current) return;

    setTimeout(() => {
      const wrapperWidth = wrapperRef.current?.parentElement?.offsetWidth;        // visible width
      const containerWidth = containerRef.current?.scrollWidth;    // full content width
      const distance = containerWidth - wrapperWidth;  // how much to slide
    
      if (distance > 0) {
        marquee(container, distance);
      }
    }, 50);

  }, []);

  const marquee = (target,distance) => {
    gsap.to(target, {
      x: -distance,
      duration: Math.max(2, distance * 0.03),
      delay: 1,
      ease: "power1.inOut",
      onComplete: () => {
        gsap.to(target, {
          opacity: 0,
          duration: 0.5,
          delay: 1,
          onComplete: () => {
            gsap.set(target, {
              x: 0,
              onComplete: () => {
                gsap.to(target, {
                  opacity: 1,
                  duration: 0.5,
                  onComplete: () => {
                    marquee(target, distance);
                  }
                });
              }
            });
          }
        });
      }
    })
  }

  return (
    <div
      ref={wrapperRef}
      className="overflow-hidden w-full"
      style={{
        whiteSpace: "nowrap",
        display: "inline-block",
      }}
    >
      <div
        ref={containerRef}
        className="inline-flex gap-[0.05ch] whitespace-nowrap will-change-transform"
        style={{
          flexShrink: 0,
          display: "inline-flex",
          position: "relative",
          transform: "translateX(0)",
        }}
      />
    </div>
  );
}
