import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 43,
    hours: 4,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 43);
    targetDate.setHours(targetDate.getHours() + 4);

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePodwayClick = () => {
    window.open('https://www.podwaynepal.com/', '_blank');
  };

  return (
    <button 
      onClick={handlePodwayClick}
      className="group w-full bg-[#2b3139]/50 border border-[#2b3139] hover:border-emerald-500/50 rounded p-2.5 flex items-center justify-between transition-all"
    >
      <div className="flex items-center gap-2">
        <Timer className="w-4 h-4 text-emerald-500" />
        <div className="flex gap-1 font-mono text-xs text-[#EAECEF]">
          <span>{String(timeLeft.days).padStart(2, '0')}d</span>:
          <span>{String(timeLeft.hours).padStart(2, '0')}h</span>:
          <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
        </div>
      </div>
      <div className="text-[10px] font-bold text-emerald-500 group-hover:text-emerald-400 uppercase tracking-wide">
        Podway Launch &rarr;
      </div>
    </button>
  );
};

export default CountdownTimer;