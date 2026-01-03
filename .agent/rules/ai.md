---
trigger: always_on
---

# Code Developer Guide - Morning Reader (凡人晨读)

## 1. Project Overview & Mission
**Project Name:** Morning Reader (凡人晨读)
**Version:** v2.3 (Project Sage)
**Mission:** A social learning application combining mindfulness, gamification, and AI to help users cultivate daily reading habits (based on "The 7 Habits of Highly Effective People").
**Core Philosophy:** "From Dependence to Independence, then to Interdependence."

## 2. Tech Stack & Environment

### Frontend Core
- **Framework:** React 18 (Vite)
- **Language:** TypeScript
- **Routing:** React Router DOM v6 (`HashRouter` used for compatibility)
- **State Management:** React Context API (`AuthContext`, `GamificationContext`, `ToastContext`) + Custom Hooks (`useLocalStorage`).

### UI/UX
- **Styling:** Tailwind CSS (v3.x).
- **Icons:** Google Material Symbols Outlined (via custom `Icon` component wrapper).
- **Theme:** Supports Light/Dark mode. Primary color: Sage Green (`#6B8E8E`).
- **Layout:** Responsive design using a centered container (`max-w-4xl`) on desktop to mimic a mobile-app experience.

### Backend & Services
- **BaaS:** Supabase (Auth, Database).
- **AI:** Google GenAI SDK (`@google/genai`). **Model:** `gemini-2.5-flash`.

### Environment Variables
Required keys in `process.env` (or Vite env):
- `VITE_SUPABASE_URL`: Supabase Project URL.
- `VITE_SUPABASE_ANON_KEY`: Supabase Public Key.
- `API_KEY`: Google Gemini API Key.

## 3. Architecture & Project Structure

- **`src/` (Root)**
  - **`pages/`**: Route components. Note: Desktop layout often uses a 2-column Grid, while Mobile is single column.
  - **`components/`**: Reusable UI blocks (`BottomNav`, `Icon`, `CalendarModal`).
  - **`contexts/`**: Global state logic.
  - **`hooks/`**: `useLocalStorage` (persistence), `useHaptics` (UX).
  - **`types.ts`**: TypeScript interfaces. **Source of Truth for Data Models.**
  - **`data/`**: Static content (Courses, Mock Data).
  - **`lib/`**: External service initialization (`supabase.ts`).

## 4. Coding Guidelines & Conventions

### 4.1 General Rules
- **Functional Components:** Always use React Functional Components with Hooks.
- **Strict Typing:** Avoid `any`. Use interfaces defined in `types.ts`.
- **Navigation:** Use `useNavigate` for transitions.
- **Optimistic UI:** Update local state immediately before waiting for async backend operations to ensure snappiness.

### 4.2 Styling (Tailwind)
- **Colors:** Use semantic names defined in `tailwind.config` (e.g., `text-primary`, `bg-background-light`).
- **Responsiveness:** Do NOT assume mobile-only. Use `md:` prefixes to handle tablet/desktop layouts (e.g., `md:grid md:grid-cols-2`).
- **Container:** The main app wrapper in `App.tsx` handles the central positioning. Do not use `w-screen` on page content; use `w-full`.

### 4.3 AI SDK Usage (@google/genai)
**CRITICAL:** We use the specific `@google/genai` SDK.
- **Import:** `import { GoogleGenAI } from "@google/genai";`
- **Init:** `const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });`
- **Model:** Use `gemini-2.5-flash` for text/chat tasks.
- **Do NOT** use deprecated `GoogleGenerativeAI` or `getGenerativeModel`.

### 4.4 Supabase Usage
- Import the singleton client: `import { supabase } from '../lib/supabase';`
- Auth state is managed in `AuthContext`. Do not fetch user session manually in pages unless necessary; use `useAuth()`.

## 5. Development Commands

- **Install Dependencies:** `npm install`
- **Start Dev Server:** `npm run dev`
- **Build for Production:** `npm run build`

## 6. Key Features Implementation Details

### Gamification
- Managed via `GamificationContext`.
- **XP/Coins:** Stored in `localStorage` first, synced to DB.
- **Logic:** `level = floor(sqrt(xp / 100)) + 1`.

### Partner System
- Uses a "Relationship Tree" metaphor.
- Interactions: Water (daily), Postcard (async message), Nudge.
- Data stored in `relationships` and `relation_logs` tables in Supabase.

### Course System
- Content is stored in `data/courseData.ts`.
- Structure: `Chapter` -> `Lesson` -> `Points`.
- Progress tracking: Array of `lessonId` strings in `localStorage` (`mr_learning_progress`).

## 7. Aesthetic & Design Language
- **Keywords:** Zen, Mindfulness, Growth, Clean.
- **Visuals:** Glassmorphism (`backdrop-blur`), Soft Shadows, Rounded Corners (`rounded-3xl`), Organic shapes.
- **Animation:** Use `animate-fade-in` and `animate-fade-in-up` for smooth page transitions.

---
*Use this guide to maintain consistency when adding new features or refactoring.*