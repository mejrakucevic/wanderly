# 🌍 Wanderly — Travel Planner & Diary

Wanderly is a mobile travel planning and journaling application developed using React Native and Expo.

## About the App

Wanderly helps users organize their travels, explore destinations, track expenses, and preserve travel memories in one place.

## Planned Features

- Interactive map with custom location pins
- Create, edit, and delete trips
- Search trips and saved destinations
- Travel budget and expense tracking
- Travel diary with photos and notes
- AI-powered itinerary generator
- User authentication and private data

## Technologies

- React Native
- Expo
- TypeScript
- Supabase
- React Native Maps
- Expo ImagePicker

## Getting Started

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npx expo start
```

Check the code before opening a pull request:

```bash
npm run lint
npm run typecheck
```

## Environment Variables

`.env.example` contains placeholders for the planned Supabase integration. The app does not use these values yet. When authentication is implemented, copy this file to `.env` and fill in the client-safe project URL and publishable key. Environment files are ignored by Git; keep only the example in the repository.

Variables prefixed with `EXPO_PUBLIC_` are bundled into the app. Never put Supabase service-role keys or AI provider secrets there. AI secrets belong in Supabase Edge Function secrets.

## GitHub Workflow

- Work on a branch such as `mejra/project-foundation`, never directly on `main`.
- Use one task, one branch, and one pull request. Include the DoneByMe task link in the PR description.
- Use lowercase branch names with hyphens and commit prefixes such as `feat:`, `fix:`, or `chore:`.
- Describe what AI generated and what you personally verified in every PR.
- Have another team member review and leave at least one comment before merging.
- Keep meaningful commits that you can explain during the exam.

## Design and Planning

Miro Board: (https://miro.com/app/board/uXjVEPjMFTQ=/?share_link_id=653986321950)

The board will contain the app brief, MVP, user flow, wireframes, and moodboard.

## Project Status

In development.

## Author

Mejra Kucevic
