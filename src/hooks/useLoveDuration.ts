import { useEffect, useState } from "react";

export interface LoveDuration {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function diffFrom(startDate: Date): LoveDuration {
  const now = new Date();
  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();
  let hours = now.getHours() - startDate.getHours();
  let minutes = now.getMinutes() - startDate.getMinutes();
  let seconds = now.getSeconds() - startDate.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days, hours, minutes, seconds };
}

export function useLoveDuration(startDateISO: string): LoveDuration {
  const [duration, setDuration] = useState<LoveDuration>(() => diffFrom(new Date(startDateISO)));

  useEffect(() => {
    const startDate = new Date(startDateISO);
    const interval = setInterval(() => {
      setDuration(diffFrom(startDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [startDateISO]);

  return duration;
}
