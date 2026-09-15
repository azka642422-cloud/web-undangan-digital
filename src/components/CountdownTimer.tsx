import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string; // YYYY-MM-DD or ISO string
  theme?: 'modern' | 'walimah' | 'kitab-kuning';
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, theme = 'modern' }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const getStyle = () => {
    switch (theme) {
      case 'kitab-kuning':
        return {
          box: 'bg-[#EBD8A8] border border-[#755B39] text-[#3D2C15] shadow-xs',
          num: 'text-[#4A3215] font-amiri font-bold',
          label: 'text-[#6A5232] text-xs font-serif uppercase tracking-wider',
        };
      case 'walimah':
        return {
          box: 'bg-emerald-900/40 border border-emerald-500/30 text-amber-100 backdrop-blur-xs',
          num: 'text-amber-300 font-serif font-bold',
          label: 'text-amber-200/80 text-xs tracking-wider uppercase',
        };
      default:
        return {
          box: 'bg-white/80 border border-amber-200 text-stone-800 shadow-sm backdrop-blur-xs',
          num: 'text-[#1E232A] font-serif-luxury font-bold',
          label: 'text-stone-500 text-xs tracking-wider uppercase',
        };
    }
  };

  const style = getStyle();

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm mx-auto my-6">
      <div className={`p-3 rounded-lg text-center ${style.box}`}>
        <span className={`block text-2xl sm:text-3xl ${style.num}`}>
          {timeLeft.days}
        </span>
        <span className={style.label}>Hari</span>
      </div>
      <div className={`p-3 rounded-lg text-center ${style.box}`}>
        <span className={`block text-2xl sm:text-3xl ${style.num}`}>
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className={style.label}>Jam</span>
      </div>
      <div className={`p-3 rounded-lg text-center ${style.box}`}>
        <span className={`block text-2xl sm:text-3xl ${style.num}`}>
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className={style.label}>Menit</span>
      </div>
      <div className={`p-3 rounded-lg text-center ${style.box}`}>
        <span className={`block text-2xl sm:text-3xl ${style.num}`}>
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span className={style.label}>Detik</span>
      </div>
    </div>
  );
};
