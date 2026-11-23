'use client';

import { useState } from 'react';
import { AudioLines, BookOpen, CalendarDays, CircuitBoard, ClipboardList, Code2, Cpu, Download, FileText, GraduationCap, Laptop, LifeBuoy, Megaphone, Mic2, Network, Radio, Radar, Timer, Wrench } from 'lucide-react';
import { experience, projects } from '../content/portfolio';

const workTools = [[CircuitBoard, Wrench], [Cpu, AudioLines], [LifeBuoy, ClipboardList]];
const leadershipTools = [[Network, ClipboardList], [Timer, CalendarDays], [Mic2, Megaphone]];
const projectTools = [BookOpen, ClipboardList, AudioLines, Radar];

function ExperienceTray({ leadership = false }: { leadership?: boolean }) {
  const roles = leadership ? experience.slice(3) : experience.slice(0, 3);
  const symbols = leadership ? leadershipTools : workTools;
  return <div className="organizer">
    {roles.map(({ role, org, date, detail }, i) => {
      const [MainTool, SmallTool] = symbols[i];
      return <details className="organizer-bin" key={role}>
        <summary>
          <div className="tool-cutout" aria-hidden="true"><MainTool size={55} strokeWidth={1.35} /><SmallTool size={27} strokeWidth={1.5} /></div>
          <strong>{role}</strong><span>{org}</span>
          <span className="tool-action">Inspect role</span>
        </summary>
        <div className="tool-record"><span>{date}</span><p>{detail}</p></div>
      </details>;
    })}
  </div>;
}

const drawers = [
  { name: 'Work experience', Icon: Wrench, content: <ExperienceTray /> },
  { name: 'Leadership', Icon: Megaphone, content: <ExperienceTray leadership /> },
  { name: 'Education', Icon: GraduationCap, content: <div className="organizer education-organizer">
    <article className="organizer-bin education-bin"><div className="tool-cutout" aria-hidden="true"><GraduationCap size={55} strokeWidth={1.35} /><BookOpen size={27} /></div><div>
      <strong>Toronto Metropolitan University</strong><p>Candidate for Bachelor of Engineering, Computer Engineering</p><p>Expected May 2029 · Dean’s List (3.8 GPA)</p>
    </div></article>
  </div> },
  { name: 'Projects', Icon: Radar, content: <div className="organizer project-organizer">{projects.map((project, i) => {
    const Icon = projectTools[i];
    return <a key={project.slug} className="organizer-bin project-bin" href={'/work/' + project.slug + '/'}><div className="tool-cutout" aria-hidden="true"><Icon size={52} strokeWidth={1.35} /></div><strong>{project.name}</strong><span>Open case study</span></a>;
  })}</div> },
  { name: 'Technical skills', Icon: Code2, content: <div className="organizer">
    <article className="organizer-bin skill-bin"><div className="tool-cutout" aria-hidden="true"><Code2 size={52} strokeWidth={1.35} /></div><strong>Languages</strong><p>JavaScript, TypeScript, Python, Java, HTML/CSS, SQL</p></article>
    <article className="organizer-bin skill-bin"><div className="tool-cutout" aria-hidden="true"><Laptop size={52} strokeWidth={1.35} /></div><strong>Frameworks & infrastructure</strong><p>React, Node.js, Flask, Docker, AWS, Supabase, Vercel</p></article>
    <article className="organizer-bin skill-bin"><div className="tool-cutout" aria-hidden="true"><Radio size={52} strokeWidth={1.35} /></div><strong>Collaboration & design</strong><p>Git/GitHub, Jira, Confluence, Figma</p></article>
  </div> },
];

export function ToolChest() {
  const [open, setOpen] = useState<string | null>(null);
  return <section id="toolkit" className="workshop-zone toolkit-zone" aria-labelledby="toolkit-title">
    <div className="zone-heading"><div><p className="zone-label">Résumé tool chest</p><h2 id="toolkit-title">My toolkit.</h2><p>Pull open a drawer, then inspect the tools inside.</p></div>
      <div className="resume-ports"><a href="/resume.pdf" target="_blank" rel="noreferrer"><FileText size={16} /> View résumé</a><a href="/resume.pdf" download="Navjot-Jaswal-Resume.pdf"><Download size={16} /> Download PDF</a></div>
    </div>
    <div className="tool-chest">
      <div className="chest-lid" aria-hidden="true"><span /><span /></div>
      {drawers.map(({ name, Icon, content }, i) => {
        const expanded = open === name;
        const id = 'chest-tray-' + i;
        return <div className="chest-drawer" data-open={expanded} key={name}>
          <button type="button" className="drawer-front-panel" aria-expanded={expanded} aria-controls={id} onClick={() => setOpen(expanded ? null : name)}>
            <span className="drawer-plaque"><Icon size={20} strokeWidth={1.5} /> {name}</span><span className="chest-handle" aria-hidden="true" /><span className="drawer-chevron" aria-hidden="true">⌄</span>
          </button>
          <div className="drawer-runner" id={id} inert={!expanded}><div className="drawer-basket"><div className="birdseye-tray">{content}</div></div></div>
        </div>;
      })}
      <div className="chest-base" aria-hidden="true" />
    </div>
  </section>;
}
