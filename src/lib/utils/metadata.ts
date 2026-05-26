import type { Metadata } from 'next'

interface MetadataOptions {
  title: string
  description: string
  path: string
  image?: string
  noIndex?: boolean
}

export function createMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: MetadataOptions): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://stockuptrend.com'
  const ogImage = image ?? `${siteUrl}/images/og-default.jpg`

  return {
    title: `${title} | StockUptrend`,
    description,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | StockUptrend`,
      description,
      url: `${siteUrl}${path}`,
      siteName: 'StockUptrend',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | StockUptrend`,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  }
}
