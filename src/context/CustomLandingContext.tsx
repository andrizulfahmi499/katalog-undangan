'use client'

import { createContext, useContext } from 'react'

export const CustomLandingContext = createContext<any>(null)

export const useCustomLanding = () => useContext(CustomLandingContext)
