export const contact = { email: 'njaswal@torontomu.ca', linkedin: 'https://www.linkedin.com/in/navjotjaswal', github: 'https://github.com/navjotjaswal30' };

export const projects = [
  {
    slug: 'notion-campus', name: 'Notion Campus', style: 'notion', category: 'Product discovery · PRD',
    headline: 'What if your syllabus could organize your semester for you?',
    intro: 'A product requirements document for turning course syllabi into an organized student workspace.',
    problem: 'Course deadlines are scattered across documents. Students have to read, interpret, and re-enter them before they can start planning.',
    insight: 'I interviewed 15 engineering students. 60% manually tracked deadlines, and 53% named repetitive data entry as their biggest frustration.',
    product: 'I translated the interviews into an MVP brief. The opportunity was to remove repetitive entry while keeping students in control of what goes into their workspace.',
    builder: 'The PRD specifies an AI extraction workflow with a human approval step. The proposed flow runs from syllabus input to extracted requirements, review, and workspace updates.',
    features: ['Syllabus extraction', 'Student approval', 'Workspace organization'],
    decision: 'Place review before import so students have a chance to correct an extraction before it becomes a deadline.',
    outcome: 'The PRD sets targets of 95% extraction accuracy and 90% user retention.',
    outcomeLabel: 'Proposed success targets',
    takeaway: 'The interviews narrowed a broad productivity idea into a specific job: getting deadlines out of a syllabus with less manual work.',
    link: 'https://drive.google.com/file/d/1t7dYk4zU_RTrdhX7U7F4p_mD6E7sNAVY/view', action: 'Read the PRD',
  },
  {
    slug: 'studybuddy', name: 'StudyBuddy', style: 'study', category: 'Full-stack AI · Student productivity',
    headline: 'Less time planning. More time actually learning.',
    intro: 'An AI academic assistant that turns course documents into a workspace for the semester.',
    problem: 'Planning a semester means gathering assignments, schedules, and requirements across multiple courses.',
    insight: 'Repeated manual work at the start of a course was the opportunity to shorten the path from a syllabus to a usable plan.',
    product: 'I designed the workflow around a clear first job: turn a course document into deadlines a student can review and act on.',
    builder: 'I designed, developed, and deployed the full-stack app using Next.js, Supabase, the Gemini API, and Vercel. Document processing feeds a multi-course workspace and a mobile-accessible assistant.',
    features: ['AI document processing', 'Deadline dashboard', 'Schedule-aware chat'],
    decision: 'Keep extracted information reviewable while centralizing deadlines, schedules, and insights in one place.',
    outcome: 'The designed workflow takes estimated semester planning time from more than two hours to under five minutes.',
    outcomeLabel: 'Workflow estimate',
    takeaway: 'Document extraction becomes more useful when the output fits directly into a student’s next decision.',
    link: 'https://studybuddy-iota-eosin.vercel.app/', action: 'Try StudyBuddy',
  },
  {
    slug: 'catchmeup', name: 'CatchMeUp', style: 'catch', category: 'Learning design · Hackathon',
    headline: 'Learning shouldn’t stop the moment you get lost.',
    intro: 'An AI lecture companion that helps students recover understanding and get back to a recorded lecture.',
    problem: 'One missed explanation can make the next part of a lecture hard to follow. Rewinding can leave students searching for the relevant moment.',
    insight: 'The product focuses on the moment a student becomes confused and the sequence that helps them resume.',
    product: 'Our team shaped a recovery flow around a single choice: flag the confusing moment and get help from the part of the lecture that explains it.',
    builder: 'The interaction connects a timestamp or transcript line to earlier lecture material, then offers an explanation, replay, or analogy and a practice question. The concept includes audio interaction and analogy preferences.',
    features: ['Flag a transcript line or timestamp', 'Recover the earlier explanation', 'Check understanding and resume'],
    decision: 'Give students a way to check understanding and return to the exact point where they paused.',
    outcome: 'Our team placed second at the University of Waterloo Product Management Conference competition.',
    outcomeLabel: 'Competition result',
    takeaway: 'Designing for a specific moment of confusion gave the product a clearer purpose than a broad lecture summary.',
    link: 'https://catch-me-up-1ugi-nfd1k3vj2-nav-deb2.vercel.app/', action: 'Explore CatchMeUp',
  },
  {
    slug: 'shiftpilotai', name: 'ShiftPilot AI', style: 'shift', category: 'AI operations · Decision support',
    headline: 'When a shift falls through, finding coverage shouldn’t mean making 30 calls.',
    intro: 'An emergency staffing control centre built for the Brampton AI Innovator Hackathon.',
    problem: 'Security managers have to find qualified, available replacements on short notice when shifts fall through.',
    insight: 'The challenge described roughly 20–30 calls per cancellation and several urgent client requests each day.',
    product: 'We explored how to make an urgent staffing decision easier to review by bringing eligibility, availability, and dispatch confidence together.',
    builder: 'The concept combines eligible-personnel matching, confidence indicators, coverage forecasting, and a manager-controlled dispatch step.',
    features: ['Replacement recommendations', 'Coverage forecasting', 'Approval-controlled dispatch'],
    decision: 'AI recommends. Humans approve. The manager has the final say on dispatch.',
    outcome: 'The hackathon prototype was designed to shorten the search for coverage and make the decision easier to review.',
    outcomeLabel: 'Intended outcome',
    takeaway: 'Approval is part of the decision workflow when someone needs to be accountable for the result.',
    link: 'https://shiftpilotai.vercel.app/', action: 'Explore ShiftPilot AI',
  },
];

export type Project = (typeof projects)[number];

export const experience = [
  { theme: 'Technology', role: 'Electrical Engineer', org: 'TorontoMet Robotics', date: 'May 2026 – Present', detail: 'Designed, fabricated, and validated four electrical subsystems, improving autonomous rover reliability by 12%. Resolved five technical issues and coordinated interfaces across three sub-teams, reducing hardware integration delays by 26%.' },
  { theme: 'Technology', role: 'Research Assistant', org: 'Faculty of Engineering and Architectural Science, TMU', date: 'January 2026 – Present', detail: 'Built C++ firmware for ESP32-based soft robotics with solenoid control, 6-axis telemetry, and Wi-Fi/Bluetooth. Improved experimental testing efficiency by 48% through software–hardware interface development and validation.' },
  { theme: 'Communities', role: 'Aquatic Supervisor', org: 'City of Brampton', date: 'January 2026 – Present', detail: 'Promoted from Swim Instructor & Lifeguard. Supervise and coach 10+ staff, support safe programming for 100+ swimmers, and coordinate schedules, staffing, and layouts for programming serving 300+ swimmers.' },
  { theme: 'Communities', role: 'Director of Computer Engineering', org: 'TMU Engineering Society', date: 'May 2026 – Present', detail: 'Elected after serving as First-Year Representative. Led 13 student initiatives engaging 500+ attendees and collaborated with nine sponsors and university stakeholders.' },
  { theme: 'Communities', role: 'Competition Lead', org: 'Ontario Engineering Competition', date: 'April 2026 – Present', detail: 'Led planning and logistics for 500+ competitors across nine engineering competitions, coordinating schedules, resources, and stakeholders.' },
  { theme: 'Communities', role: 'Engagement Commissioner', org: 'Engineering Student Societies’ Council of Ontario', date: 'April 2026 – Present', detail: 'Increased student engagement by 39% across 18 engineering societies through outreach, student ambassador leadership, and stakeholder communication.' },
];

export const notes = [
  ['Things that make me curious', 'How people work around bad tools, where hardware and software meet, and how AI can help people make better decisions.'],
  ['My competitive side', 'Hackathons and product competitions are a chance to test an idea, make a decision, and build something under pressure.'],
  ['Building with people', 'Student initiatives and cross-functional engineering teams have taught me how much a clear handoff matters.'],
  ['Beyond the résumé', 'A space for personal interests and stories from outside the workshop. More to come.'],
];

export const awards = [
  ['7×', 'Hackathon winner', 'Seven hackathon wins, as listed on my résumé.'],
  ['1st', 'MEC Engineering Competition', 'First place at the MEC Engineering Competition.'],
  ['1st', 'DECA Product Management', 'First place nationally in DECA Product Management.'],
  ['20', 'DECA Internationals', 'Top 20 internationally in DECA.'],
  ['2nd', 'Waterloo PM Conference', 'Second place in the University of Waterloo Product Management Conference competition with CatchMeUp.'],
  ['DL', 'TMU Dean’s List', 'Dean’s List recognition in Computer Engineering at Toronto Metropolitan University.'],
];

export const prompts = [
  'What if every university syllabus could talk to your calendar?',
  'How would you redesign the experience of waiting in line?',
  'What happens when a learning app notices confusion before the student gives up?',
  'Can a complicated workflow become a single confident decision?',
  'How would you help someone trust a recommendation they have to act on quickly?',
  'What would you remove from a group project tool if you could keep only three features?',
  'How could a campus map make someone feel more welcome on their first day?',
];
