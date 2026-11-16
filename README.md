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
- Node.js + Express (separate wanderly-backend repository)
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

## Design and Planning

Miro Board: (https://miro.com/app/board/uXjVEPjMFTQ=/?share_link_id=653986321950)

The board will contain the app brief, MVP, user flow, wireframes, and moodboard.

## Project Status

This repository is the Expo frontend. The separate `wanderly-backend` repository is a Node.js + Express API that validates Supabase access tokens and handles profile, trip, and diary database operations. Supabase provides Auth and PostgreSQL. See [connection setup](supabase/README.md) to run both projects.

The app includes light/dark themes, email/password login and signup, and four protected tabs: Map, Trips, Diary, and Profile. Profile shows the signed-in account and supports sign-out. Trip, diary, and map screens still use placeholders; their forms and travel features remain to be built. Authentication stays connected directly to Supabase; all existing data service functions now call the Node API.

Routes live in `src/app/(tabs)`. Shared screen, icon, and empty-state components live in `src/components/ui`, and theme tokens live in `src/constants/theme.ts`.

## Author

Mejra Kucevic
