import React from 'react';

interface HeaderProps {
  topKicker?: string;
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  topKicker,
  title,
  subtitle,
}) => {
  return (
    <header className="pt-3 pb-4">
      {topKicker && (
        <div className="flex items-center justify-between text-[13px] text-[#91A8C4] font-medium mb-1.5">
          <span>{topKicker}</span>
        </div>
      )}

      <div>
        <h1 className="text-[26px] font-bold tracking-tight text-[#F7F9FC] leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13px] text-[#91A8C4] mt-1 font-normal">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
};
