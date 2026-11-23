import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { projects } from '../../../content/portfolio';
import { Header } from '../../../components/interactive';
import { CaseStudy } from '../../../components/projects';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(entry => entry.slug === slug);
  if (!project) return {};
  return { title: project.name, description: project.intro,
    ...(process.env.SITE_URL && { alternates: { canonical: '/work/' + slug + '/' } }),
    openGraph: { title: project.name + ' | Navjot Jaswal', description: project.intro, ...(process.env.SITE_URL && { images: ['/social.png'] }) },
  };
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find(entry => entry.slug === slug);
  if (!project) notFound();
  return <><Header /><main id="main" className="wrap standalone-case"><Link href="/#work" className="back-link"><ArrowLeft size={17} /> Back to selected work</Link><CaseStudy project={project} standalone /></main></>;
}
