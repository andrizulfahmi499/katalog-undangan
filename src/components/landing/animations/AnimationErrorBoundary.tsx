'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * AnimationErrorBoundary Component
 * 
 * Error boundary specifically for animation components.
 * Catches errors in animation components and provides graceful fallback.
 * 
 * @example
 * ```tsx
 * <AnimationErrorBoundary>
 *   <FloatingElement>
 *     <Icon />
 *   </FloatingElement>
 * </AnimationErrorBoundary>
 * ```
 */
export class AnimationErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Animation Error:', error)
      console.error('Error Info:', errorInfo)
    }

    // In production, you might want to log to an error reporting service
    // Example: logErrorToService(error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      // Render fallback UI (children without animation)
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback: render children without animation wrapper
      return this.props.children
    }

    return this.props.children
  }
}
