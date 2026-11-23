# Navjot Jaswal · The Idea Factory

A personal portfolio built with the Next.js App Router, React, and TypeScript. The production build exports an interactive workshop and four individually addressable case studies. On the workshop floor, visitors can pause, drag, or step the conveyor and open projects or wall stations. The conveyor starts stopped for visitors who prefer reduced motion. Product Thinking Mode saves the visitor’s preference locally.

## Run locally

Use Node.js 20.9 or later.

```sh
npm ci
npm run dev
```

Open http://localhost:3000.

```sh
npm run lint
npm run build
npm run typecheck
```

The build emits `out/`. Set `SITE_URL` to the full deployment origin before building to generate canonical URLs, social image metadata, and the sitemap.

## Deploy on Vercel

Import this repository in Vercel and select the Next.js preset. Set `SITE_URL` in the project’s production environment to the final HTTPS origin. Vercel can run the standard `npm run build` command. The static output can also be deployed from `out/` to a host that serves directory index files.

## Update content

- Edit project stories, external links, experience, awards, pinboard notes, idea prompts, and contact information in `content/portfolio.ts`.
- Replace `public/resume.pdf` with the current résumé and update the index card in `app/page.tsx` if its labels change.
- Add a headshot to `public/images/`, then include it with descriptive alt text in the Maker’s notes station in `app/page.tsx`.
- Add verified screenshots under `public/images/projects/` and update `ProjectVisual` in `components/projects.tsx`. The illustrations currently shown are explicitly labelled as concepts.
- Replace `public/social.png` to update the social preview.

## Guestbook

The current guestbook displays a disabled form. To activate it, add a server endpoint or a separately hosted Supabase Edge Function and connect the form to it. Validate name and message length on the server, throttle requests, and store submissions as pending. Publish only moderated entries, render them as text, and keep privileged keys server-side. If running the endpoint in this Next.js project, switch from static export to a server-backed deployment first.
