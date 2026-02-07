# scanPe

<div align="center">

![alt text](apps/native/assets/images/logo.png)

</div>

## Getting Started

First, install the dependencies:

```bash
bun install
```

Then run it using

```bash
bun dev
```

A QR will appear in terminal, make sure you are in the same `intranet`. Your PC
and mobile should be connected to same network. Now download `Expo-Go`
application from the playstore. Check it out here at https://expo.dev/go . Once
downloaded, scan it with your phone andthe app will open in your mobile.

## Database Setup

This project uses PostgreSQL with Prisma.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/server/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:

```bash
bun run db:push
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the
web application. Use the Expo Go app to run the mobile application. The API is
running at [http://localhost:3000](http://localhost:3000).

## Git Hooks and Formatting

- Initialize hooks: `bun run prepare`
- Format and lint fix: `bun run check`

## Project Structure

```
scanPe/
├── apps/
│   ├── web/         # Frontend application ()
│   ├── native/      # Mobile application (React Native, Expo)
│   └── server/      # Backend API (Express)
├── packages/
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run dev:server`: Start only the server
- `bun run check-types`: Check TypeScript types across all apps
- `bun run dev:native`: Start the React Native/Expo development server
- `bun run db:push`: Push schema changes to database
- `bun run db:generate`: Generate database client/types
- `bun run db:migrate`: Run database migrations
- `bun run db:studio`: Open database studio UI
- `bun run check`: Run Biome formatting and linting
