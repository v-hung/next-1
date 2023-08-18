import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL || ""
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: baseUrl + '/shop',
      lastModified: new Date(),
    },
    {
      url: baseUrl + '/lucky',
      lastModified: new Date(),
    },
  ]
}