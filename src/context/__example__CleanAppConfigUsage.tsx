/**
 * Example usage of CleanAppConfigContext
 * 
 * This file demonstrates how to use the CleanAppConfigProvider and useCleanAppConfig hook.
 * This is for documentation purposes and can be deleted after implementation is complete.
 */

import { CleanAppConfigProvider, useCleanAppConfig } from './CleanAppConfigContext'

// Example 1: Basic usage in a component
function HeroSection() {
  const { config, isLoading, error } = useCleanAppConfig()

  if (isLoading) {
    return <div>Loading configuration...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <section style={{ backgroundColor: config.colors.background }}>
      <h1 style={{ color: config.colors.primary }}>{config.hero.title}</h1>
      <p style={{ color: config.colors.textSecondary }}>{config.hero.subtitle}</p>
      <button>{config.hero.ctaText}</button>
    </section>
  )
}

// Example 2: Using the provider with a member slug
function MemberLandingPage({ slug }: { slug: string }) {
  return (
    <CleanAppConfigProvider slug={slug}>
      <HeroSection />
      {/* Other CleanApp components */}
    </CleanAppConfigProvider>
  )
}

// Example 3: Using the provider with initial config (SSR)
function ServerRenderedPage({ initialConfig }: { initialConfig: any }) {
  return (
    <CleanAppConfigProvider initialConfig={initialConfig}>
      <HeroSection />
      {/* Other CleanApp components */}
    </CleanAppConfigProvider>
  )
}

// Example 4: Accessing specific configuration sections
function FeaturesSection() {
  const { config } = useCleanAppConfig()

  return (
    <section>
      <h2>{config.features.title}</h2>
      <div>
        {config.features.items.map((feature, index) => (
          <div key={index}>
            <span>{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// Example 5: Refetching configuration
function ConfigRefreshButton() {
  const { refetch, isLoading } = useCleanAppConfig()

  return (
    <button onClick={refetch} disabled={isLoading}>
      {isLoading ? 'Refreshing...' : 'Refresh Configuration'}
    </button>
  )
}

export {
  HeroSection,
  MemberLandingPage,
  ServerRenderedPage,
  FeaturesSection,
  ConfigRefreshButton,
}
