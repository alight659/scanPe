# scanPe - AI Chat Mobile Application

## 1. Project Overview

scanPe is a modern mobile application with AI chat capabilities, built as a full-stack solution with a React Native mobile app and Express.js backend. The application enables users to authenticate and chat with Google's Gemini AI in real-time.

### Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| **Mobile App** | React Native + Expo |
| **Backend** | Express.js + Node.js |
| **AI** | Google Gemini 2.5 Flash via Vercel AI SDK |
| **Database** | PostgreSQL (Neon) + Prisma ORM |
| **Authentication** | Better-Auth |
| **Monorepo** | Turborepo + Bun |
| **Linting** | Biome |

### Purpose and Main Features

- **User Authentication**: Secure email/password authentication with session management
- **AI Chat Interface**: Real-time chat with Google Gemini AI
- **Cross-Platform**: Works on iOS and Android
- **Dark/Light Theme**: Automatic system theme detection
- **Modern Navigation**: Drawer + Tab navigation with expo-router

---

## 2. Architecture & Structure

### Monorepo Structure

The project uses **Turborepo** for efficient monorepo management, enabling shared packages, parallel task execution, and optimized builds.

### Workspace Organization

```
scanPe/
├── apps/
│   ├── native/          # React Native mobile app
│   └── server/          # Express.js backend
├── packages/
│   ├── db/              # Prisma database client
│   ├── auth/            # Better-Auth configuration
│   ├── env/             # Environment variables validation
│   └── config/          # Shared TypeScript config
└── turbo.json           # Turborepo configuration
```

### Dependency Flow

```
┌─────────────────────────────────────────────────────────┐
│                      apps/native                        │
│  ┌──────────┬──────────┬──────────┬──────────┐          │
│  │  @scanPe │  @scanPe │  @scanPe │  @scanPe │          │
│  │    db    │   auth   │    env   │  config  │          │
│  └──────────┴──────────┴──────────┴──────────┘          │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│                      apps/server                        │
│  ┌──────────┬──────────┬──────────┬──────────┐          │
│  │  @scanPe │  @scanPe │  @scanPe │  @scanPe │          │
│  │    db    │   auth   │    env   │  config  │          │
│  └──────────┴──────────┴──────────┴──────────┘          │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Apps Directory

### 3.1 Native App (`apps/native/`)

The mobile application built with **React Native** and **Expo**, utilizing the latest Expo SDK features.

#### Framework Details

- **Expo SDK**: Latest with SDK 52
- **Routing**: File-based routing via `expo-router`
- **Navigation Pattern**: Drawer navigation with nested Tab navigation
- **State Management**: React hooks + Better-Auth session management

#### Navigation Structure

```
Drawer Navigator
├── Home (drawer) - Authentication UI
├── AI Chat (drawer) - Gemini chat interface
└── Tabs Navigator
    ├── Tab One - Placeholder screen
    └── Tab Two - Placeholder screen
        └── Modal - Simple modal overlay
```

#### Screens

| Screen | Route | Description |
|--------|-------|-------------|
| **Home** | `/` | Main landing page with Sign In/Sign Up UI |
| **AI Chat** | `/ai` | Chat interface with Gemini AI |
| **Tab One** | `/(tabs)/one` | First tab placeholder |
| **Tab Two** | `/(tabs)/two` | Second tab with modal capability |
| **Modal** | `/modal` | Simple overlay modal |

#### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `Container` | `components/Container.tsx` | Wrapper component with consistent styling |
| `SignIn` | `components/SignIn.tsx` | Authentication sign-in form |
| `SignUp` | `components/SignUp.tsx` | User registration form |
| `HeaderButton` | `components/HeaderButton.tsx` | Navigation header button |
| `TabBarIcon` | `components/TabBarIcon.tsx` | Tab bar icon with focused state |

#### Theming System

- **Light/Dark Mode**: Automatic detection via `useColorScheme()`
- **Theme Constants**: Defined in `constants/NAV_THEME.ts`
- **Android Navigation**: Platform-specific handling for Android navigation bar
- **Colors**: Theme-aware color palette for all UI elements

#### Authentication Integration

```typescript
// Using Better-Auth with Expo client
import { expoClient } from "@better-auth/expo/client";

const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_SERVER_URL,
  plugins: [expoClient()],
});

// Session management
const { data: session } = authClient.useSession();
```

#### AI Integration

```typescript
// Using Vercel AI SDK with Expo fetch
import { useChat } from "@ai-sdk/react";
import { expoFetch } from "expo/fetch";

const { messages, input, handleInputChange, handleSubmit } = useChat({
  fetch: expoFetch,
  api: `${process.env.EXPO_PUBLIC_SERVER_URL}/ai`,
});
```

### 3.2 Server App (`apps/server/`)

The backend API built with **Express.js**, providing authentication and AI chat capabilities.

#### Server Configuration

- **Port**: `3000`
- **Framework**: Express.js 4.x
- **Runtime**: Node.js with Bun

#### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check endpoint |
| `ALL` | `/api/auth/*` | Better-Auth authentication handlers |
| `POST` | `/ai` | AI chat endpoint using Gemini 2.5 Flash |

#### Middleware Stack

```typescript
// CORS configuration for cross-origin requests
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
```

#### AI SDK Configuration

```typescript
import { google } from "@ai-sdk/google";
import { devtools } from "@ai-sdk/google/middleware";

const model = google("gemini-2.5-flash", {
  middleware: devtools(),
});
```

---

## 4. Shared Packages

### 4.1 Database (`@scanPe/db`)

Database layer using **Prisma ORM** with **PostgreSQL** hosted on Neon.

#### Configuration

- **ORM**: Prisma 6.x
- **Adapter**: `@prisma/adapter-neon` for serverless compatibility
- **Provider**: Neon PostgreSQL
- **Client Location**: `prisma/generated/client`

#### Database Schema

```prisma
// Core authentication tables
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified Boolean
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]
}

model Session {
  id        String   @id
  userId    String
  expiresAt DateTime
  user      User     @relation(fields: [userId], references: [id])
}

model Account {
  id           String  @id
  userId       String
  accountId    String
  providerId   String
  accessToken  String?
  refreshToken String?
  user         User    @relation(fields: [userId], references: [id])
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
}
```

### 4.2 Authentication (`@scanPe/auth`)

Centralized **Better-Auth** configuration shared across apps.

#### Configuration Details

```typescript
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [expo()], // Expo plugin for mobile
  emailAndPassword: {
    enabled: true,   // Email/password auth enabled
  },
  trustedOrigins: [
    "exp://",                    // Expo development
    "com.scanpe.app",            // Production bundle ID
    "http://localhost:3000",     // Local server
  ],
});
```

### 4.3 Environment (`@scanPe/env`)

Type-safe environment variable validation using **@t3-oss/env-core** with **Zod**.

#### Server Environment Variables

```typescript
export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string().url(),
    CORS_ORIGIN: z.string().url(),
    NODE_ENV: z.enum(["development", "production"]),
  },
  runtimeEnv: process.env,
});
```

#### Native Environment Variables

```typescript
export const nativeEnv = createEnv({
  clientPrefix: "EXPO_PUBLIC_",
  client: {
    EXPO_PUBLIC_SERVER_URL: z.string().url(),
  },
  runtimeEnv: process.env,
});
```

### 4.4 Config (`@scanPe/config`)

Shared **TypeScript** configuration for consistent compiler options across the monorepo.

---

## 5. Key Features

### 5.1 Authentication Flow

1. **Sign Up**: User submits email/password via SignUp component
2. **Session Creation**: Better-Auth creates secure session
3. **Token Storage**: `expo-secure-store` saves auth token securely
4. **Session Management**: `authClient.useSession()` hook for reactive updates
5. **Sign Out**: Clears session and secure storage

```mermaid
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   SignUp    │────▶│ Better-Auth │────▶│   Session   │
│   Form      │     │   Server    │     │   Created   │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                        ┌──────┴──────┐
                                        │ Secure Store│
                                        │   Token     │
                                        └─────────────┘
```

### 5.2 AI Chat

Real-time chat interface with streaming responses from Google Gemini.

**Features:**
- Streaming message responses
- Message history with user/assistant roles
- Auto-scrolling chat interface
- Error handling and retry logic

```typescript
// Message structure
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
```

### 5.3 Theming

Automatic light/dark mode detection with system preference sync.

```typescript
// NAV_THEME constants
const NAV_THEME = {
  light: {
    background: '#ffffff',
    text: '#000000',
    // ... other colors
  },
  dark: {
    background: '#000000',
    text: '#ffffff',
    // ... other colors
  },
};
```

---

## 6. Development Workflow

### Package Management

- **Manager**: Bun (fast, efficient, built-in monorepo support)
- **Workspaces**: Configured in root `package.json`
- **Catalog**: Shared dependency versions via `catalog:` protocol

### Task Runner

Turborebo configuration for parallel execution and caching:

```json
{
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    }
  }
}
```

### Code Quality

| Tool | Purpose | Configuration |
|------|---------|---------------|
| **Biome** | Linting & Formatting | `biome.json` |
| **Husky** | Git hooks | `.husky/` |
| **lint-staged** | Pre-commit linting | `package.json` |

### Database Commands

```bash
# Push schema changes to database
bun run db:push

# Generate Prisma client
bun run db:generate

# Run migrations
bun run db:migrate

# Open Prisma Studio
bun run db:studio
```

---

## 7. Configuration Files

### Turborepo (`turbo.json`)

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### Biome (`biome.json`)

```json
{
  "$schema": "https://biomejs.dev/schemas/1.5.0/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab"
  }
}
```

### Package Catalog

Shared dependency versions in root `package.json`:

```json
{
  "workspaces": {
    "packages": ["apps/*", "packages/*"],
    "catalog": {
      "typescript": "^5.0.0",
      "react": "^18.2.0",
      "react-native": "~0.73.0"
    }
  }
}
```

---

## 8. File Structure Tree

```
scanPe/
├── .husky/                          # Git hooks
│   └── pre-commit                   # Pre-commit hook script
├── apps/
│   ├── native/                      # React Native mobile app
│   │   ├── app/                     # File-based routing (expo-router)
│   │   │   ├── (tabs)/              # Tab navigator group
│   │   │   │   ├── _layout.tsx      # Tabs layout configuration
│   │   │   │   ├── one.tsx          # Tab One screen
│   │   │   │   └── two.tsx          # Tab Two screen
│   │   │   ├── _layout.tsx          # Root layout with Drawer
│   │   │   ├── ai.tsx               # AI Chat screen
│   │   │   ├── index.tsx            # Home screen (auth UI)
│   │   │   └── modal.tsx            # Modal screen
│   │   ├── components/              # React components
│   │   │   ├── Container.tsx        # Layout wrapper
│   │   │   ├── HeaderButton.tsx     # Navigation header button
│   │   │   ├── SignIn.tsx           # Sign in form
│   │   │   ├── SignUp.tsx           # Sign up form
│   │   │   └── TabBarIcon.tsx       # Tab bar icon component
│   │   ├── constants/               # App constants
│   │   │   └── NAV_THEME.ts         # Navigation theme colors
│   │   ├── lib/                     # Utility libraries
│   │   │   └── auth-client.ts       # Better-Auth client setup
│   │   ├── assets/                  # Static assets
│   │   ├── package.json             # App dependencies
│   │   └── tsconfig.json            # TypeScript config
│   └── server/                      # Express.js backend
│       ├── src/
│       │   ├── index.ts             # Server entry point
│       │   └── lib/
│       │       └── auth.ts          # Auth configuration
│       ├── package.json             # Server dependencies
│       └── tsconfig.json            # TypeScript config
├── packages/
│   ├── auth/                        # Better-Auth configuration
│   │   ├── src/
│   │   │   └── index.ts             # Auth setup
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── config/                      # Shared TypeScript config
│   │   └── tsconfig/
│   │       ├── base.json
│   │       ├── react-native.json
│   │       └── node.json
│   ├── db/                          # Prisma database package
│   │   ├── prisma/
│   │   │   ├── generated/           # Generated Prisma client
│   │   │   └── schema.prisma        # Database schema
│   │   ├── src/
│   │   │   └── client.ts            # Prisma client export
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── env/                         # Environment validation
│       ├── src/
│       │   ├── native.ts            # Native app env schema
│       │   └── server.ts            # Server env schema
│       ├── package.json
│       └── tsconfig.json
├── .gitignore                       # Git ignore rules
├── biome.json                       # Biome linter/formatter config
├── package.json                     # Root package + workspaces
├── README.md                        # Project readme
├── turbo.json                       # Turborepo configuration
└── CONTEXT.md                       # This documentation file
```

---

## Quick Start

```bash
# Install dependencies
bun install

# Set up environment variables
cp apps/server/.env.example apps/server/.env
cp apps/native/.env.example apps/native/.env

# Generate database client
bun run db:generate

# Start development servers
bun run dev
```

---
