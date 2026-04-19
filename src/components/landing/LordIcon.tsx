'use client'

import Script from 'next/script'
import React from 'react'

interface LordIconProps {
  src: string
  trigger: string
  state: string
  size?: number
  className?: string
}

export function LordIcon({ src, trigger, state, size = 36, className }: LordIconProps) {
  return (
    <>
      <Script src="https://cdn.lordicon.com/lordicon.js" strategy="afterInteractive" />
      {React.createElement('lord-icon', {
        src,
        trigger,
        state,
        colors: 'primary:#66d7ee,secondary:#f4dc9c',
        style: `width:${size}px;height:${size}px`,
        class: className,
      })}
    </>
  )
}
