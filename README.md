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

This repository is the Expo frontend. The separate `wanderly-backend` repository is a Node.js + Express API that validates Supabase access tokens and handles profile, trip, trip plan, expense, diary, and country database operations. Supabase provides Auth and PostgreSQL. See [connection setup](supabase/README.md) to run both projects.

The app includes light/dark themes, email/password login and signup, and four protected tabs: Map, Trips, Diary, and Profile. Profile shows the signed-in account and supports sign-out. Users can track the countries they have visited and the ones they want to visit ("My countries", from the Map and Profile tabs); these are saved in `user_countries` and appear as pins on the map (at each country's capital) and in the continent progress and profile stats. Trips and diary entries are also real data: the screens load, create, edit, and delete them through the Node API (shared cache in `src/data/travel-store.ts`, with loading, error, and pull-to-refresh states). Each trip has a plan with sections for stays, transport, activities, food, and other items, each with optional dates, time, and price; planned prices count toward the trip budget (requires the `trip_activities` migration in the backend repository). Date fields open the system calendar. Trip expenses are saved through the API too (add, edit, delete) and count toward the trip budget together with planned prices. All app data is now real; there is no sample data left. Authentication stays connected directly to Supabase.

Routes live in `src/app/(tabs)`. Shared screen, icon, and empty-state components live in `src/components/ui`, and theme tokens live in `src/constants/theme.ts`.

## Author

Mejra Kucevic
