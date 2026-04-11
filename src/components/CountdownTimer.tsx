'use client'

import { useEffect, useState } from 'react'

type CountdownTimerProps = {
  targetDate: string
}

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(target: Date): TimeLeft {
  const now = new Date().getTime()
  const distance = target.getTime() - now

  if (distance <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  }
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(new Date(targetDate)))

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft(new Date(targetDate)))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [targetDate])

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div className="rounded-[28px] bg-white/95 p-4 text-center shadow-sm border border-slate-200">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Days</p>
        <p className="mt-3 text-3xl font-semibold text-slate-900">{String(timeLeft.days).padStart(2, '0')}</p>
      </div>
      <div className="rounded-[28px] bg-white/95 p-4 text-center shadow-sm border border-slate-200">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Hours</p>
        <p className="mt-3 text-3xl font-semibold text-slate-900">{String(timeLeft.hours).padStart(2, '0')}</p>
      </div>
      <div className="rounded-[28px] bg-white/95 p-4 text-center shadow-sm border border-slate-200">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Minutes</p>
        <p className="mt-3 text-3xl font-semibold text-slate-900">{String(timeLeft.minutes).padStart(2, '0')}</p>
      </div>
      <div className="rounded-[28px] bg-white/95 p-4 text-center shadow-sm border border-slate-200">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Seconds</p>
        <p className="mt-3 text-3xl font-semibold text-slate-900">{String(timeLeft.seconds).padStart(2, '0')}</p>
      </div>
    </div>
  )
}
