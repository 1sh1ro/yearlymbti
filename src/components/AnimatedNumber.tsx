import { useCountUp, extractNumber, formatWithOriginal } from "@/hooks/useCountUp";

interface AnimatedNumberProps {
  value: string;
  className?: string;
  duration?: number;
}

const AnimatedNumber = ({ value, className, duration = 2000 }: AnimatedNumberProps) => {
  const numericValue = extractNumber(value);
  const { count } = useCountUp(numericValue, duration);
  
  return (
    <span className={className}>
      {formatWithOriginal(count, value)}
    </span>
  );
};

export default AnimatedNumber;
