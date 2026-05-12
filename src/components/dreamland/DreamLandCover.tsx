'use client'

import { motion, AnimatePresence } from 'framer-motion'

const P = '/templates/dream-land'
const ORNAMENT_SVG = "M5050 3677c-5,-24 -30,-16 -47,-14 -53,6 -105,15 -158,20 -344,32 -670,-17 -967,-204 -297,-187 -489,-461 -645,-766 -100,-195 -169,-404 -261,-602 -18,-38 -37,-75 -57,-111 -2,-212 -6,-561 9,-690 11,-96 49,-136 143,-152 50,-8 102,-10 152,-14 21,-1 47,5 48,-27 1,-36 -26,-33 -49,-33 -328,0 -656,1 -984,1 -4,0 -9,0 -13,0 -20,0 -38,2 -38,30 0,28 17,28 38,29 46,2 93,5 140,11 116,16 159,62 168,178 1,26 1,51 1,77 0,63 0,127 0,190 -76,-45 -161,-80 -254,-106 -137,-37 -278,-50 -429,-55 18,-23 30,-40 43,-56 105,-134 705,-902 811,-1035 126,-142 195,-190 310,-218 71,-18 143,-22 216,-20 23,1 41,-2 40,-34 -1,-28 -18,-28 -39,-28 -227,0 -455,0 -683,-1 -23,0 -37,4 -36,31 0,26 11,33 35,32 45,-1 89,1 132,15 51,16 74,45 43,95 -197,250 -881,1134 -1082,1388 -2,-22 -3,-29 -3,-37 0,-407 0,-813 0,-1220 0,-32 4,-63 8,-95 11,-75 56,-115 128,-132 54,-13 110,-13 165,-15 23,0 47,5 47,-33 -1,-30 -22,-27 -50,-28 -190,-2 -370,0 -556,0 -144,0 -289,0 -434,0 -19,0 -45,-4 -45,27 0,35 21,35 46,35 32,0 64,1 96,3 154,11 207,66 210,221 0,16 0,2345 0,2545l0 0c0,0 0,0 0,1 0,8 0,12 0,13l0 0c0,12 0,25 0,37 -3,155 -56,211 -210,222 -32,2 -64,2 -96,2 -25,0 -46,0 -46,35 0,31 26,27 45,27 145,1 290,0 434,0 186,0 366,2 556,0 28,0 49,2 50,-28 0,-38 -24,-32 -47,-33 -55,-2 -111,-2 -165,-15 -72,-17 -118,-57 -128,-132 -4,-31 -8,-63 -8,-95 0,-367 0,-734 0,-1102 10,-95 44,-176 114,-253 44,-49 82,-59 141,-48 232,43 409,170 551,352 33,42 63,86 90,132 0,231 0,461 0,692 0,190 -7,708 -7,898 -9,147 -26,280 -58,410 -63,256 -164,492 -376,663 -210,170 -458,231 -721,231 -469,1 -845,-187 -1094,-588 -429,-693 13,-1635 820,-1765 43,-8 67,1 58,-46 -6,-31 -32,-21 -69,-16 -135,23 -265,62 -385,129 -382,214 -593,542 -639,977 -45,424 86,780 413,1057 340,287 736,369 1166,286 539,-105 921,-413 1144,-916 5,-11 12,-22 16,-34l0 0c113,-234 116,-569 116,-601 0,-185 1,-370 1,-554 128,226 289,430 498,600 299,243 645,355 1025,369 197,7 391,-10 577,-80 15,-6 38,-11 35,-29l0 0z"

interface Props {
  isOpened: boolean
  onOpen: () => void
  guestName?: string
}

export default function DreamLandCover({ isOpened, onOpen, guestName }: Props) {
  return (
    <AnimatePresence>
      {!isOpened && (
        <motion.div
          key="cover"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Background */}
          <img
            src={`${P}/bg-5.jpg`}
            alt="bg"
            className="absolute inset-0 w-full h-full object-cover brightness-90"
          />
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5100 5000"
              className="breathing-1 w-24 md:w-40 lg:w-32 fill-[#b1914f] drop-shadow">
              <path d={ORNAMENT_SVG} />
            </svg>

            <p className="font-michelia text-[#b1914f] text-sm md:text-lg">
              The Wedding Of
            </p>

            {guestName && (
              <div className="text-center mt-2">
                <p className="font-cormorant text-[#555] text-sm">Kepada Yth.</p>
                <p className="font-cormorantSemiBold text-[#775D34] text-xl">{guestName}</p>
              </div>
            )}

            <button
              onClick={onOpen}
              className="mt-6 flex items-center gap-2 rounded-full bg-[#F6EAD3] px-7 py-3 shadow-lg
                font-cormorant text-[#777] hover:bg-[#fce3b2] active:bg-[#fce3b2] transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-4 fill-[#777]">
                <path d="M3 19V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2zm9-13c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm-1 9V9l4.5 3L11 15z"/>
              </svg>
              Buka Undangan
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
