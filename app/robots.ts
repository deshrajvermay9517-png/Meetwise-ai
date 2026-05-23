import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://meetwise.app'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/meetings/', '/settings/', '/upload/', '/search/', '/api/'],
    },
    sitemap: `${appUrl}/sitemap.xml`,
  }
}
