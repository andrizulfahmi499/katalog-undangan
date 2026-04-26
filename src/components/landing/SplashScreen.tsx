'use client'

import { motion } from 'framer-motion'

// ─── Rose SVG path (elegant rose outline for drawing animation) ──────────────
const ROSE_PATH = "M1431 5750c0,-651 0,-1302 0,-1954 -205,-447 -746,-551 -950,-512 -613,115 -279,-290 49,302 269,394 572,437 901,210 0,-300 0,-600 0,-900 226,-16 504,-84 555,-264 166,-514 319,-435 246,-367 -67,62 -192,66 -277,71 -175,2 -284,8 -435,75 -368,163 -72,305 -97,-131 -8,-140 -56,-244 -99,-348 -218,-530 324,-205 -238,-118 -392,60 -855,28 -1003,-404 -126,-386 130,-448 437,-302 233,111 471,263 708,358 114,46 239,82 362,50 297,-90 466,-207 464,-541 -1,-281 -201,-121 -337,-48 -282,150 -659,293 -940,63 -158,-133 -172,-263 -153,-454 9,-86 23,-170 -66,-215 -113,-38 -186,56 -232,146 -53,104 -75,280 -21,388 113,191 455,209 649,279 150,53 235,205 337,237 149,41 180,-159 34,-211 -259,-86 -557,-125 -647,-426 -82,-293 489,-36 599,45 211,163 366,434 657,442 173,-18 365,-211 414,-373 46,-155 -48,-191 -154,-301 -150,-153 -35,-471 -484,-313 -223,78 -397,349 -147,420 112,32 227,-5 256,-128 15,-63 -2,-120 -32,-175 -170,-271 -457,-314 -753,-291 -171,14 -320,172 -252,348 128,194 506,438 738,333 99,-52 152,-141 84,-243 -77,-116 -304,-161 -381,-33 -95,176 255,491 370,596 90,82 160,145 239,244 203,260 45,279 29,252 -22,-37 41,-89 65,-107 113,-77 272,-120 335,-251 34,-75 119,-353 242,-259 83,63 28,204 -21,271 -114,154 -312,266 -451,406 -125,128 -177,160 -346,216 -486,155 -767,-103 -1066,-439 -111,-125 -258,-304 -423,-354"

// ─── Leaf SVG paths for decorative elements ──────────────────────────────────
const LEAF_PATH_1 = "M20 50 Q30 20 50 10 Q40 30 45 50 Q35 40 20 50 Z"
const LEAF_PATH_2 = "M80 50 Q70 20 50 10 Q60 30 55 50 Q65 40 80 50 Z"

export function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.05,
        filter: 'blur(12px)',
        transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ backgroundColor: '#172a26' }}
    >
      {/* Subtle radial gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(34,62,54,0.4) 0%, transparent 70%)'
        }}
      />

      {/* Main content container */}
      <div className="relative flex flex-col items-center gap-0">
        
        {/* Rose SVG Drawing Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2600 5800"
            width="80"
            stroke="rgba(237,237,237,0.5)"
            strokeWidth="40"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_15px_rgba(237,237,237,0.1)]"
          >
            <motion.path
              d={ROSE_PATH}
              initial={{ pathLength: 0, opacity: 0.3 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{
                pathLength: { duration: 1.8, ease: [0.25, 0.1, 0.25, 1] },
                opacity: { duration: 0.5, ease: 'easeOut' }
              }}
            />
            {/* Ghost trail for glow effect */}
            <motion.path
              d={ROSE_PATH}
              stroke="rgba(237,237,237,0.15)"
              strokeWidth="60"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                pathLength: { duration: 1.8, ease: [0.25, 0.1, 0.25, 1] },
              }}
            />
          </svg>
        </motion.div>

        {/* Decorative leaf accents */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] pointer-events-none">
          <motion.svg
            viewBox="0 0 100 60"
            className="absolute -left-8 top-1/2 -translate-y-1/2 w-10 h-6"
            fill="none"
            stroke="rgba(237,237,237,0.2)"
            strokeWidth="1"
          >
            <motion.path
              d={LEAF_PATH_1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.8, ease: 'easeInOut' }}
            />
          </motion.svg>
          <motion.svg
            viewBox="0 0 100 60"
            className="absolute -right-8 top-1/2 -translate-y-1/2 w-10 h-6"
            fill="none"
            stroke="rgba(237,237,237,0.2)"
            strokeWidth="1"
          >
            <motion.path
              d={LEAF_PATH_2}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.9, ease: 'easeInOut' }}
            />
          </motion.svg>
        </div>

        {/* Logo: DEAR my LOVE */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center mt-4"
        >
          {/* DEAR */}
          <motion.span
            initial={{ opacity: 0, letterSpacing: '0.8em' }}
            animate={{ opacity: 1, letterSpacing: '0.35em' }}
            transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '1.1em', fontWeight: 700 }}
            className="text-white uppercase"
          >
            DEAR
          </motion.span>

          {/* my */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.75, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: "'Arapey', Georgia, serif", fontSize: '0.7em', fontStyle: 'italic', letterSpacing: '0.08em', lineHeight: 1 }}
            className="text-white/75 -mt-0.5"
          >
            my
          </motion.span>

          {/* LOVE */}
          <motion.span
            initial={{ opacity: 0, letterSpacing: '0.8em' }}
            animate={{ opacity: 1, letterSpacing: '0.35em' }}
            transition={{ duration: 1, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '1.1em', fontWeight: 700 }}
            className="text-white uppercase"
          >
            LOVE
          </motion.span>
        </motion.div>

        {/* Shimmer line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 h-[0.5px] w-20 origin-center"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(237,237,237,0.4), transparent)'
          }}
        />

        {/* Tagline text */}
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6, ease: 'easeOut' }}
          className="text-[#ededed]/30 text-[9px] tracking-[0.35em] uppercase mt-3"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          wedding invitation
        </motion.p>
      </div>

      {/* Ambient floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              backgroundColor: 'rgba(237,237,237,0.08)',
              left: `${15 + Math.random() * 70}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              y: [20, -30, -60],
            }}
            transition={{
              duration: 2.5 + Math.random() * 1.5,
              delay: 0.3 + i * 0.2,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
