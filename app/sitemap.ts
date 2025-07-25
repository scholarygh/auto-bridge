import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://auto-bridge.vercel.app'
  
  // Static pages
  const staticPages = [
    '',
    '/cars',
    '/services',
    '/about',
    '/contact',
    '/support',
    '/privacy',
    '/terms',
    '/blog',
    '/faq',
    '/careers',
    '/sitemap',
    '/help-center',
    '/safety-tips',
    '/cookies',
  ].map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: page === '' ? 1 : 0.8,
  }))

  return staticPages
} 