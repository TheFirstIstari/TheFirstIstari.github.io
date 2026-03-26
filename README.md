# TheFirstIstari Portfolio

Personal portfolio website built with Astro, React, and Tailwind CSS.

## Tech Stack

- **Astro** - Static site generator with View Transitions
- **React** - UI components with Framer Motion animations
- **Tailwind CSS** - Styling and theming
- **Framer Motion** - Smooth animations

## Getting Started

```bash
npm install
npm run dev
```

## Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview build locally |

## Deployment

The site deploys automatically to GitHub Pages via GitHub Actions on push to main.

## Project Structure

```
src/
├── components/
│   ├── Hero.tsx
│   ├── ProjectCard.tsx
│   ├── SectionTitle.tsx
│   └── ThemeToggle.tsx
├── layouts/
│   └── Layout.astro
├── pages/
│   ├── index.astro
│   └── projects.astro
└── styles/
    └── global.css
```