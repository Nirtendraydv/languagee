"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const shapes = ["●", "▲", "■", "★"];

const items = [...letters, ...shapes];

type FloatingItem = {
  id: number;
  char: string;
  style: React.CSSProperties;
};

export default function FloatingLetters() {
  const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    const generateItems = () => {
      const newItems: FloatingItem[] = Array.from({ length: 30 }).map((_, i) => {
        const duration = Math.random() * 10 + 10; // 10s to 20s
        const delay = Math.random() * -20; // -20s to 0s
        const size = Math.random() * 40 + 20; // 20px to 60px
        const isLetter = Math.random() > 0.3;
        return {
          id: i,
          char: isLetter ? items[Math.floor(Math.random() * items.length)] : shapes[Math.floor(Math.random() * shapes.length)],
          style: {
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${size}px`,
            animation: `float ${duration}s ease-in-out ${delay}s infinite`,
            opacity: Math.random() * 0.3 + 0.1,
          },
        };
      });
      setFloatingItems(newItems);
    };

    generateItems();
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {floatingItems.map((item) => (
        <span
          key={item.id}
          className={cn("absolute font-headline text-white/50", item.char === '★' ? 'text-accent/50' : '')}
          style={item.style}
        >
          {item.char}
        </span>
      ))}
    </div>
  );
}
