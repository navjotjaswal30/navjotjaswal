import { ArrowUpRight, CircuitBoard, Download, Send, Users } from 'lucide-react';
import { contact, experience, notes, projects } from '../content/portfolio';
import { IdeaMachine, TrophyShelf } from '../components/interactive';
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
  { id: 'experience', title: 'Tool cabinet', content: <div className="station-content">
    <h2>The journey so far.</h2><p>Open a drawer to see what each role involved.</p>
    <div className="timeline">{['Technology', 'Communities'].map(theme => <section key={theme}>
      <h3>{theme === 'Technology' ? <CircuitBoard size={21} /> : <Users size={21} />} Building {theme.toLowerCase()}</h3>
      {experience.filter(role => role.theme === theme).map(role => <details key={role.role}>
        <summary><span className="eyebrow">{role.date}</span><strong>{role.role}</strong><span>{role.org}</span></summary><p>{role.detail}</p>
      </details>)}
    </section>)}</div>
  </div> },
  { id: 'achievements', title: 'Trophy shelf', content: <div className="station-content"><h2>The trophy shelf.</h2><p>Pick up an award to see what it’s for.</p><TrophyShelf /></div> },
  { id: 'resume', title: 'Résumé drawer', content: <div className="station-content"><h2>My résumé.</h2><p>Education, engineering, projects, and leadership.</p>
    <div className="hero-actions"><a className="button primary" href="/resume.pdf" target="_blank" rel="noreferrer">View résumé <ArrowUpRight size={17} /></a><a className="button outline" href="/resume.pdf" download="Navjot-Jaswal-Resume.pdf"><Download size={17} /> Download PDF</a></div>
  </div> },
  { id: 'playground', title: 'Idea machine', content: <div className="station-content station-machine"><h2>The Idea Machine.</h2><p>Pull a prompt about products, people, or everyday problems.</p><IdeaMachine /></div> },
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
