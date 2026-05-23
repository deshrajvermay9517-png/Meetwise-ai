import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://meetwise.app'
  
  const routes = ['', '/pricing', '/privacy', '/terms', '/contact', '/refund'].map(route => ({
    url: `${appUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  return routes
}
