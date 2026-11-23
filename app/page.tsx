import { ArrowDown, ArrowUpRight, CircuitBoard, Compass, Download, FileText, MapPin, Send, Sparkles, Users } from 'lucide-react';
import { contact, experience, notes, projects } from '../content/portfolio';
import { FactoryControls, Gallery, Header, IdeaMachine, ModeSwitch, TrophyShelf } from '../components/interactive';
import { CaseStudy, ProjectVisual } from '../components/projects';

export default function Home() {
  return <>
    <Header />
    <main id="main">
      <section className="hero wrap" id="home">
        <div className="hero-copy">
          <p className="hero-label"><span /> WELCOME TO THE IDEA FACTORY</p>
          <h1>Hey, I’m Navjot.<br />I turn <em>“what if?”</em><br />into <em>“what’s next.”</em></h1>
          <p className="hero-description">I’m a Computer Engineering student at Toronto Metropolitan University. Curious about people, drawn to problems, and happiest when I’m building something new.</p>
          <div className="hero-actions"><a href="#work" className="button primary">Explore my work <ArrowUpRight size={17} /></a><a href="#about" className="button outline">A little about me</a></div>
          <a className="resume-link" href="#resume"><FileText size={16} /> View my résumé</a>
        </div>
        <div className="hero-visual">
          {/* Local vector artwork stays sharp at every viewport size. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/factory.svg" alt="Workshop schematic of a sage green machine turning a handwritten question into a paper idea." width="640" height="530" fetchPriority="high" />
          <FactoryControls />
          <span className="diagram-note">a work in progress <span aria-hidden="true">✳</span></span>
        </div>
        <div className="hero-base"><p><MapPin size={14} /> Toronto, Canada</p><a href="#about"><ArrowDown size={15} /> Scroll to explore</a><p>Engineering × Product</p></div>
      </section>

      <section id="about" className="section about-section">
        <div className="wrap"><p className="eyebrow section-label"><Compass size={16} /> Meet the inventor</p>
          <div className="about-layout">
            <div className="about-copy"><h2>A little about the person behind the ideas.</h2><p>I’m a Computer Engineering student at TMU who likes working where technology meets the way people actually do things.</p><p>Whether I’m building an AI product, wiring up a rover, or helping run a student initiative, I’m usually asking the same question: <em>How could this work better for the people using it?</em></p><span className="location-line">Computer Engineering · TMU · Class of 2029</span></div>
            <figure className="photo-card"><div className="photo-placeholder"><div className="portrait-monogram">NJ<span>✳</span></div></div><figcaption>Navjot Jaswal <span>Portrait coming soon</span></figcaption></figure>
          </div>
          <div className="pinboard">{notes.map(([title, content]) => <details key={title}><summary>{title}</summary><p>{content}</p></details>)}</div>
        </div>
      </section>

      <section id="work" className="section wrap">
        <div className="section-head"><div><p className="eyebrow section-label"><Sparkles size={16} /> The invention gallery</p><h2>Selected work.</h2><p>Four projects, each starting with a question worth answering.</p></div><ModeSwitch /></div>
        <Gallery entries={projects.map(project => ({ project, visual: <ProjectVisual project={project} />, study: <CaseStudy project={project} /> }))} />
      </section>

      <section id="experience" className="section experience-section"><div className="wrap">
        <p className="eyebrow section-label"><CircuitBoard size={16} /> Experience</p><h2>The journey so far.</h2>
        <p className="section-description">Engineering work and student leadership have both shaped how I build.</p>
        <div className="timeline">{['Technology', 'Communities'].map(theme => <section key={theme}>
          <h3>{theme === 'Technology' ? <CircuitBoard size={21} /> : <Users size={21} />} Building {theme.toLowerCase()}</h3>
          {experience.filter(role => role.theme === theme).map(role => <details key={role.role}>
            <summary><span className="eyebrow">{role.date}</span><strong>{role.role}</strong><span>{role.org}</span></summary>
            <p>{role.detail}</p>
          </details>)}
        </section>)}</div>
      </div></section>

      <section className="section wrap" id="achievements">
        <p className="eyebrow section-label"><Sparkles size={16} /> Achievements</p><h2>The trophy shelf.</h2>
        <TrophyShelf />
      </section>

      <section className="section resume-section" id="resume"><div className="wrap split">
        <div><p className="eyebrow section-label"><FileText size={16} /> Résumé</p><h2>The formal version of my story.</h2><p>My education, engineering work, projects, and leadership experience in one place.</p><div className="hero-actions"><a className="button primary" href="/resume.pdf" target="_blank" rel="noreferrer">View résumé <ArrowUpRight size={16} /></a><a className="button outline" href="/resume.pdf" download="Navjot-Jaswal-Resume.pdf"><Download size={17} /> Download PDF</a></div></div>
        <a className="resume-preview" href="/resume.pdf" target="_blank" rel="noreferrer" aria-label="Open complete résumé PDF"><span className="eyebrow">Curriculum vitae</span><strong>Navjot Jaswal</strong><span>Computer Engineering · Toronto Metropolitan University</span><span className="document-line">Education</span><span className="document-line">Experience</span><span className="document-line">Projects & leadership</span><span className="document-line">Awards & technical skills</span></a>
      </div></section>

      <section className="section wrap split" id="playground">
        <div><p className="eyebrow section-label"><Sparkles size={16} /> Creative playground</p><h2>The Idea Machine.</h2><p>Try the workshop’s prompt dispenser. It serves up questions about products, people, and everyday problems.</p></div>
        <IdeaMachine />
      </section>

      <section className="section guest-section" id="guestbook"><div className="wrap split">
        <div><p className="eyebrow section-label">Guestbook</p><h2>Leave a note in the workshop.</h2><p>The guestbook is coming soon. You can reach me by email in the meantime.</p></div>
        <form className="guest-form"><fieldset disabled><label>Name<input name="name" maxLength={60} placeholder="Your name" /></label><label>Short message<textarea name="message" maxLength={400} placeholder="What’s on your mind?" rows={3} /></label><button type="button" className="button outline">Posting coming soon</button></fieldset></form>
      </div></section>

      <section className="section contact-section" id="contact"><div className="wrap">
        <p className="eyebrow section-label"><Send size={16} /> Contact</p><h2>Got an idea?<br /><em>Let’s make something happen.</em></h2>
        <p>I’d love to hear what you’re working on, whether it’s a product idea, a collaboration, or a question you can’t stop thinking about.</p>
        <div className="contact-links"><a className="button cream email-button" href={'mailto:' + contact.email}>Email me <Send size={17} /></a><a href={contact.linkedin}>LinkedIn <ArrowUpRight size={15} /></a><a href={contact.github}>GitHub <ArrowUpRight size={15} /></a><a href="/resume.pdf">Résumé <ArrowUpRight size={15} /></a></div>
      </div></section>
    </main>
    <footer><div className="wrap"><span>Dreamed up, designed, and built by Navjot Jaswal.</span><a href="#home">Back to top ↑</a></div></footer>
  </>;
}
