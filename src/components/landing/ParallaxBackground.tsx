'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

export function ParallaxBackground() {
  const { scrollYProgress } = useScroll()
  
  // Physics configuration untuk kehalusan maksimal
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Global blur & opacity (elemen dekoratif memudar saat scroll jauh ke bawah)
  const globalOpacity = useTransform(smoothProgress, [0, 0.3, 0.9], [1, 1, 0])
  const globalBlur = useTransform(smoothProgress, [0, 0.2, 0.8], ["blur(0px)", "blur(0px)", "blur(10px)"])

  // Transformasi unik untuk tiap layer (diambil dari dearmylove.org source)
  const layer1Y = useTransform(smoothProgress, [0, 1], [0, -420])
  const layer1X = useTransform(smoothProgress, [0, 1], [0, -120])
  const layer1Scale = useTransform(smoothProgress, [0, 1], [1, 2])

  const layer2Y = useTransform(smoothProgress, [0, 1], [0, -330])
  const layer2X = useTransform(smoothProgress, [0, 1], [0, 240])
  const layer2Scale = useTransform(smoothProgress, [0, 1], [1, 2.1])

  const layer3Y = useTransform(smoothProgress, [0, 1], [0, 80])
  const layer3X = useTransform(smoothProgress, [0, 1], [0, 200])

  const layer4Y = useTransform(smoothProgress, [0, 1], [0, 30])
  const layer4X = useTransform(smoothProgress, [0, 1], [0, -260])

  const layerRotate1 = useTransform(smoothProgress, [0, 1], ["0deg", "-90deg"])
  const layerRotate2 = useTransform(smoothProgress, [0, 1], ["-90deg", "120deg"])

  const assets = [
    { id: 2, className: "fixed top-0 left-[-10vw] w-[80vw] md:w-[60vw] lg:w-[1000px] opacity-30", style: { y: layer1Y, x: layer1X, scale: layer1Scale, rotate: layerRotate1 } },
    { id: 3, className: "fixed top-0 right-0 w-[70vw] md:w-[50vw] lg:w-[800px] opacity-30", style: { y: layer2Y, x: layer2X, scale: layer2Scale } },
    { id: 4, className: "fixed bottom-0 -right-20 w-[80vw] md:w-[60vw] lg:w-[900px] opacity-25", style: { y: layer3Y, x: layer3X, scale: 1.5 } },
    { id: 2, className: "fixed bottom-0 -left-20 w-[80vw] md:w-[60vw] lg:w-[1000px] opacity-25", style: { y: layer4Y, x: layer4X, scale: 1.8 } },
    { id: 9, className: "fixed bottom-1/4 right-1/4 w-[15vw] md:w-[150px] opacity-20", style: { rotate: layerRotate1 } },
    { id: 7, className: "fixed bottom-1/3 left-1/4 w-[20vw] md:w-[200px] opacity-20", style: { rotate: layerRotate2 } },
    { id: 5, className: "fixed top-1/3 left-1/4 w-[15vw] md:w-[180px] opacity-20", style: { rotate: layerRotate1 } },
    { id: 9, className: "fixed top-1/4 right-1/3 w-[15vw] md:w-[150px] opacity-20", style: { rotate: layerRotate2 } },
  ]

  return (
    <motion.div 
      style={{ opacity: globalOpacity, filter: globalBlur }}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      {assets.map((asset, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.5, delay: 1 + (index * 0.1), ease: [0.25, 0.1, 0.25, 1] }}
          className={asset.className}
          style={asset.style}
        >
          <img 
            src={`/svg/dearmylove.org-${asset.id}.svg`} 
            alt="" 
            className="w-full h-auto"
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
