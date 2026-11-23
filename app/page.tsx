import { CircuitBoard, Send, Users } from 'lucide-react';
import { contact, experience, notes, projects } from '../content/portfolio';
import { CaseStudy } from '../components/projects';
import { Workshop, type Station } from '../components/workshop';
import './workshop.css';

const stations: Station[] = [
  { id: 'about', title: 'Maker’s notes', content: <div className="station-content">
    <h2>Hey, I’m Navjot.</h2>
    <p>I’m a Computer Engineering student at Toronto Metropolitan University, graduating in 2029. I like working where technology meets the way people actually do things.</p>
    <p>Whether I’m building an AI product, wiring up a rover, or helping run a student initiative, I’m usually asking how it could work better for the people using it.</p>
    <div className="pinboard">{notes.map(([title, content]) => <details key={title}><summary>{title}</summary><p>{content}</p></details>)}</div>
  </div> },
  ...['Technology', 'Communities'].map(theme => ({
    id: theme.toLowerCase(), title: theme === 'Technology' ? 'Circuit board' : 'Team roster',
    content: <div className="station-content">
      <h2>Building {theme.toLowerCase()}.</h2>
      <div className="timeline station-timeline"><section>
        <h3>{theme === 'Technology' ? <CircuitBoard size={21} /> : <Users size={21} />} {theme === 'Technology' ? 'Engineering work' : 'Leadership & operations'}</h3>
        {experience.filter(role => role.theme === theme).map(role => <details key={role.role}>
          <summary><span className="eyebrow">{role.date}</span><strong>{role.role}</strong><span>{role.org}</span></summary><p>{role.detail}</p>
        </details>)}
      </section></div>
    </div>,
  })),
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
