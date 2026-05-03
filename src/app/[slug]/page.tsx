import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import DynamicLandingClient from './DynamicLandingClient'

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const member = await db.member.findUnique({
    where: { customSlug: params.slug },
  })

  if (!member || !member.landingPageEnabled) {
    return { title: 'Not Found' }
  }

  return {
    title: `${member.name} - Katalog Undanganku`,
    description: `Katalog undangan digital dari ${member.name}`,
  }
}

export default async function CustomLandingPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const member = await db.member.findUnique({
    where: { customSlug: params.slug },
  })

  if (!member || !member.landingPageEnabled) {
    notFound()
  }

  const config = member.landingPageConfig as any

  return <DynamicLandingClient config={config || {}} member={member} />
}