import { Send } from 'lucide-react';
import { contact, projects } from '../content/portfolio';
import { CaseStudy } from '../components/projects';
import { Workshop, type Station } from '../components/workshop';
import './workshop.css';
import './workshop-floor.css';

const stations: Station[] = [
  { id: 'contact', title: 'Outgoing mail', content: <div className="station-content"><h2>Got an idea?</h2><p>I’d love to hear what you’re working on, whether it’s a product idea, a collaboration, or a question you can’t stop thinking about.</p>
    <div className="hero-actions"><a className="button primary email-button" href={'mailto:' + contact.email}>Email me <Send size={17} /></a><a className="button outline" href={contact.linkedin}>LinkedIn</a><a className="button outline" href={contact.github}>GitHub</a></div>
    <details className="guest-drawer"><summary>Workshop guestbook</summary><p>Guestbook posting is coming soon. You can reach me by email in the meantime.</p>
      <form className="guest-form"><fieldset disabled><label>Name<input name="name" maxLength={60} /></label><label>Short message<textarea name="message" maxLength={400} rows={3} /></label><button type="button" className="button outline">Posting coming soon</button></fieldset></form>
    </details>
  </div> },
];

export default function Home() {
  return <Workshop projects={projects} stations={stations} studies={projects.map(project => <CaseStudy key={project.slug} project={project} />)} />;
}
