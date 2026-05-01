"use client"

import { useState, useEffect, useRef } from "react"

interface UseCountUpOptions {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  enabled?: boolean
}

export function useCountUp({ end, duration = 2000, prefix = "", suffix = "", enabled = true }: UseCountUpOptions) {
  const [value, setValue] = useState(0)
  const startTime = useRef<number | null>(null)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) {
      setValue(0)
      return
    }

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)

    const tick = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp
      const elapsed = timestamp - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutQuart(progress)
      setValue(Math.floor(eased * end))

      if (progress < 1) {
        raf.current = requestAnimationFrame(tick)
      } else {
        setValue(end)
      }
    }

    raf.current = requestAnimationFrame(tick)

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
      startTime.current = null
    }
  }, [end, duration, enabled])

  return `${prefix}${value.toLocaleString()}${suffix}`
}
