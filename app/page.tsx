import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { projects } from '../content/portfolio';
import { CaseStudy } from '../components/projects';
import { Workshop } from '../components/workshop';
import './workshop.css';
import './workshop-floor.css';
import './workshop-details.css';

export default function Home() {
  const portrait = '/images/navjot-portrait.jpg';
  return <Workshop portrait={existsSync(join(process.cwd(), 'public', portrait)) ? portrait : undefined} projects={projects} studies={projects.map(project => <CaseStudy key={project.slug} project={project} />)} />;
}
