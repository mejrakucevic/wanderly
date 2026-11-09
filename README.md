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

## Design and Planning

Miro Board: (https://miro.com/app/board/uXjVEPjMFTQ=/?share_link_id=653986321950)

The board will contain the app brief, MVP, user flow, wireframes, and moodboard.

## Project Status

In development. The app currently includes the Wanderly light/dark theme and four tabs: Map (Home), Trips, Diary, and Profile. These screens use empty states; the map, authentication, data storage, and travel statistics are not connected yet.

Routes live in `src/app/(tabs)`. Shared screen, icon, and empty-state components live in `src/components/ui`, and theme tokens live in `src/constants/theme.ts`.

## Author

Mejra Kucevic
