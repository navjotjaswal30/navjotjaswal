import type { Metadata } from 'next';
import { ModeProvider } from '../components/interactive';
import './globals.css';

const origin = process.env.SITE_URL;
const description = 'Explore the projects, product thinking, engineering work, and creative experiments of Navjot Jaswal, a Computer Engineering student at Toronto Metropolitan University.';
export const metadata: Metadata = {
  ...(origin && { metadataBase: new URL(origin), alternates: { canonical: './' } }),
  title: 'Navjot Jaswal',
  description,
  openGraph: { title: 'Navjot Jaswal — The Idea Factory', description, type: 'website', ...(origin && { images: ['/social.png'] }) },
  twitter: { card: 'summary_large_image', title: 'Navjot Jaswal — The Idea Factory', description, ...(origin && { images: ['/social.png'] }) },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-CA"><body><a className="skip" href="#main">Skip to content</a><ModeProvider>{children}</ModeProvider></body></html>;
}
