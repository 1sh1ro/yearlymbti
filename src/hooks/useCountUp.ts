import { useState, useEffect, useRef } from "react";

export const useCountUp = (
  end: number,
  duration: number = 2000,
  startOnMount: boolean = true
) => {
  const [count, setCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const start = () => {
    setIsComplete(false);
    startTimeRef.current = undefined;
    
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(easeOut * end));
      
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
        setIsComplete(true);
      }
    };
    
    frameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (startOnMount && end > 0) {
      start();
    }
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, startOnMount]);

  return { count, isComplete, start };
};

export const extractNumber = (value: string): number => {
  const match = value.replace(/,/g, "").match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

export const formatWithOriginal = (count: number, original: string): string => {
  const hasComma = original.includes(",");
  const suffix = original.replace(/[\d,.]+/g, "").trim();
  
  const formatted = hasComma ? count.toLocaleString() : count.toString();
  
  // 保持原始格式
  if (original.match(/^\d/)) {
    return formatted + " " + suffix;
  }
  return formatted + suffix;
};
