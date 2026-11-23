import { ArrowUpRight, AudioLines, BookOpen, CalendarDays, CheckCircle2, Layers3, Play, Sparkles } from 'lucide-react';
import { type Project } from '../content/portfolio';
import { ModeCopy, ModeSwitch } from './interactive';

export function ProjectVisual({ project }: { project: Project }) {
  return <div className={'project-visual ' + project.style} role="img" aria-label={project.name + ' concept illustration'}>
    <div aria-hidden="true" className="art-grid" />
    <div aria-hidden="true" className="mockup">
      <div className="mockup-head"><span>{project.name}</span><span>● ● ●</span></div>
      {project.style === 'notion' && <div className="mockup-content"><BookOpen size={25} /><strong>Semester workspace</strong><div className="mock-row">Syllabus <span>Review</span></div><div className="mock-row">Course deadlines <CheckCircle2 size={14} /></div><div className="mock-row">Assignments <CheckCircle2 size={14} /></div></div>}
      {project.style === 'study' && <div className="mockup-content"><CalendarDays size={24} /><strong>This week</strong><div className="mock-columns"><div>Courses<i /><i /><i /></div><div>Due soon<i /><i /></div></div><div className="mock-row"><Sparkles size={12} /> Ask StudyBuddy</div></div>}
      {project.style === 'catch' && <div className="mockup-content"><div className="mock-video"><Play size={23} /><AudioLines size={25} /></div><div className="mock-timeline"><b /></div><strong>Pick up where you left off.</strong><div className="mock-row">Review the explanation</div></div>}
      {project.style === 'shift' && <div className="mockup-content"><Layers3 size={24} /><strong>Coverage desk</strong><div className="mock-row">Shift needs coverage <span>Review</span></div><div className="mock-row">Eligible replacements <CheckCircle2 size={14} /></div><div className="mock-row">Manager approval</div></div>}
    </div>
    <span className="art-caption" aria-hidden="true">Concept illustration</span>
  </div>;
}

export function CaseStudy({ project, standalone = false }: { project: Project; standalone?: boolean }) {
  const Heading = standalone ? 'h1' : 'h2';
  return <article className="case-study">
    <header className="case-hero">
      <span className="eyebrow">{project.name} / {project.category}</span>
      <Heading>{project.headline}</Heading>
      <p>{project.intro}</p>
      <a className="button primary" href={project.link} target="_blank" rel="noreferrer">{project.action} <ArrowUpRight size={18} /></a>
    </header>
    <ProjectVisual project={project} />
    <div className="case-body">
      <section><h2>The problem</h2><p>{project.problem}</p></section>
      <section><h2>What shaped the brief</h2><p>{project.insight}</p></section>
      <section className="case-mode"><ModeSwitch /><ModeCopy project={project} /></section>
      <section><h2>Key features</h2><ul className="feature-list">{project.features.map(feature => <li key={feature}><CheckCircle2 size={17} />{feature}</li>)}</ul></section>
      <section><h2>A decision that mattered</h2><p>{project.decision}</p></section>
      <section className="outcome"><h2>{project.outcomeLabel}</h2><p>{project.outcome}</p></section>
      <section><h2>What I took away</h2><p>{project.takeaway}</p></section>
    </div>
  </article>;
}
