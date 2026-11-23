import type { MetadataRoute } from 'next';
import { projects } from '../content/portfolio';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.SITE_URL;
  if (!origin) return [];
  return ['/', ...projects.map(project => '/work/' + project.slug + '/')].map(path => ({ url: new URL(path, origin).href }));
}
