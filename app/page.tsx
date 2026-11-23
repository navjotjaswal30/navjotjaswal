import { projects } from '../content/portfolio';
import { CaseStudy } from '../components/projects';
import { Workshop } from '../components/workshop';
import './workshop.css';
import './workshop-floor.css';
import './workshop-details.css';

export default function Home() {
  return <Workshop projects={projects} studies={projects.map(project => <CaseStudy key={project.slug} project={project} />)} />;
}
