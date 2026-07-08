import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/mypage/', '/sales-manager/', '/cart'],
    },
    sitemap: 'https://ultravkorea.com/sitemap.xml',
  }
}
