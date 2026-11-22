import React from 'react';

interface SegmentedBarProps {
  totalSegments?: number;
  percentage: number;
  activeColor?: string; // default blue or green when 100%
  inactiveColor?: string;
  className?: string;
}

export const SegmentedBar: React.FC<SegmentedBarProps> = ({
  totalSegments = 10,
  percentage,
  activeColor,
  inactiveColor = '#13212C',
  className = '',
}) => {
  const normalized = Math.min(100, Math.max(0, percentage));
  const filledCount = Math.round((normalized / 100) * totalSegments);
  
  // If 100%, defaults to green #24E4B4 as in screenshot, otherwise blue #299BFF
  const finalActiveColor = activeColor || (normalized >= 100 ? '#24E4B4' : '#299BFF');

  return (
    <div className={`flex items-center gap-[4.5px] w-full ${className}`}>
      {Array.from({ length: totalSegments }).map((_, index) => {
        const isFilled = index < filledCount;
        return (
          <div
            key={index}
            className="flex-1 h-[14px] rounded-[4px] transition-colors duration-300"
            style={{
              backgroundColor: isFilled ? finalActiveColor : inactiveColor,
            }}
          />
        );
      })}
    </div>
  );
};
