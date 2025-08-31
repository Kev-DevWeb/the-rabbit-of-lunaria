# Gemini Guidelines

This document provides guidelines for interacting with the Gemini AI assistant in this project.

## Project Overview

"La madriguera de Lunaria" is a web application designed for tarot enthusiasts. The main features include:
- A system for scheduling appointments for tarot readings.
- A blog-style section to discuss topics about magic.
- Informational content about the history of tarot.
- A basic guide for beginners to start learning tarot.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (assumed from `postcss.config.mjs`)
- **Backend/DB:** Firebase (`src/lib/firebase.ts`)
- **Linting:** ESLint (`eslint.config.mjs`)

## Project Structure

- `src/app/`: Contains the pages and routes of the application.
  - `src/app/citas/`: Appointments page.
  - `src/app/magia/`: Magic page.
  - `src/app/sobre-mi/`: About me page.
- `src/components/`: Contains reusable React components.
- `src/lib/`: Contains library code, like the Firebase configuration.
- `public/`: Contains static assets like images.

## How to Run the Project

1.  Install dependencies: `npm install`
2.  Run the development server: `npm run dev`

## Coding Conventions

- Follow the existing coding style and patterns.
- Use TypeScript for all new code.
- Keep components small and focused on a single responsibility.

## Commits

- Use conventional commits for your commit messages. For example: `feat: add user authentication` or `fix: correct typo in header`.
