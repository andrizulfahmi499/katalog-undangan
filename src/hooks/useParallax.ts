'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

export type ParallaxState = {
  /** smoothed mouse X (-1..1) */
  rx: number
  /** smoothed mouse Y (-1..1) */
  ry: number
  /** scroll progress 0..1 */
  progress: number
  /** eased progress */
  eased: number
  /** whether the curtain has opened */
  isOpen: boolean
}

/**
 * Custom hook that drives the 3D parallax engine.
 * Attach `containerRef` to the scrollable wrapper and read `state` each frame.
 * Pass `relativeTo` to use container-relative mouse tracking (for preview frames).
 */
export function useParallax(relativeTo?: React.RefObject<HTMLElement | null>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({
    tx: 0, ty: 0, rx: 0, ry: 0,
    progress: 0, eased: 0,
    isOpen: false, rafId: 0,
  })
  const [state, setState] = useState<ParallaxState>({
    rx: 0, ry: 0, progress: 0, eased: 0, isOpen: false,
  })

  const open = useCallback(() => {
    stateRef.current.isOpen = true
    document.body.classList.remove('no-scroll')
  }, [])

  useEffect(() => {
    const s = stateRef.current
    const el = containerRef.current
    const frame = relativeTo?.current ?? null

    function updateTarget(e: MouseEvent | Touch) {
      if (frame) {
        const r = frame.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const clientX = 'clientX' in e ? e.clientX : (e as Touch).clientX
        const clientY = 'clientY' in e ? e.clientY : (e as Touch).clientY
        s.tx = clamp((clientX - cx) / (r.width / 2 || 1), -1, 1)
        s.ty = clamp((clientY - cy) / (r.height / 2 || 1), -1, 1)
      } else {
        const w = window.innerWidth || 1
        const h = window.innerHeight || 1
        const clientX = 'clientX' in e ? e.clientX : (e as Touch).clientX
        const clientY = 'clientY' in e ? e.clientY : (e as Touch).clientY
        s.tx = clamp((clientX - w / 2) / (w / 2), -1, 1)
        s.ty = clamp((clientY - h / 2) / (h / 2), -1, 1)
      }
    }

    const onMouse = (e: MouseEvent) => updateTarget(e)
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) updateTarget(e.touches[0])
    }

    const target = frame || window
    target.addEventListener('mousemove', onMouse as EventListener, { passive: true })
    target.addEventListener('touchmove', onTouch as EventListener, { passive: true })

    const MAG = { world: 6, portal: 7, curtainL: 14, curtainR: 14 }

    function tick() {
      s.rx = lerp(s.rx, s.tx, 0.07)
      s.ry = lerp(s.ry, s.ty, 0.07)

      if (el) {
        const rect = el.getBoundingClientRect()
        const viewH = frame ? frame.clientHeight : window.innerHeight
        const maxScroll = Math.max(1, el.scrollHeight - viewH)
        s.progress = clamp(-rect.top / maxScroll, 0, 1)
      }
      s.eased = easeInOut(s.progress)

      setState({
        rx: s.rx,
        ry: s.ry,
        progress: s.progress,
        eased: s.eased,
        isOpen: s.isOpen,
      })

      s.rafId = requestAnimationFrame(tick)
    }

    s.rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(s.rafId)
      target.removeEventListener('mousemove', onMouse as EventListener)
      target.removeEventListener('touchmove', onTouch as EventListener)
    }
  }, [relativeTo])

  /** Helper: compute world (background) layer transform */
  const worldTransform = useCallback((st: ParallaxState) => {
    const scale = lerp(1, 1.18, st.progress)
    return `scale(${scale}) translate3d(${st.rx * 6}px, ${st.ry * 6}px, 0)`
  }, [])

  /** Helper: compute curtain transforms */
  const curtainTransforms = useCallback((st: ParallaxState) => {
    const openingShift = st.isOpen ? 62 : 0
    const totalShift = openingShift + 150 * st.eased
    const scale = lerp(1, 1.3, st.eased)
    return {
      left: `translateX(calc(-${totalShift}% + ${st.rx * 14}px)) translateY(${st.ry * 14 * 0.3}px) scale(${scale}) translateZ(0)`,
      right: `translateX(calc(${totalShift}% + ${st.rx * 14}px)) translateY(${st.ry * 14 * 0.3}px) scale(${scale}) translateZ(0)`,
    }
  }, [])

  /** Helper: hero/cover opacity */
  const heroOpacity = useCallback((st: ParallaxState) => {
    return clamp(1 - st.progress / 0.22, 0, 1)
  }, [])

  return { containerRef, state, open, worldTransform, curtainTransforms, heroOpacity }
}
