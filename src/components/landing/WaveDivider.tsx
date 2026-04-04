'use client'

interface WaveDividerProps {
  color?: string
  className?: string
  position?: 'top' | 'bottom'
}

export function WaveDivider({
  color = '#FFF0F5',
  className = '',
  position = 'bottom'
}: WaveDividerProps) {
  const transform = position === 'top' ? 'rotate(180deg)' : 'rotate(0deg)'

  return (
    <div
      className={`w-full ${className}`}
      style={{
        backgroundColor: color,
        transform,
        transformOrigin: 'center'
      }}
    >
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <path
          d="M0,64 C240,100 480,28 720,64 C960,100 1200,28 1440,64 L1440,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}
