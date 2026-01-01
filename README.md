# Costanza Spinelli - Personal Trainer Workout Plan Builder

MVP application for creating and managing personalized workout plans with PDF export functionality.

## Features

- **Exercise Library Management** - CRUD operations for exercises with muscle groups, equipment, and default parameters
- **Workout Plan Builder** - Excel-like interface for creating structured workout plans
- **PDF Export** - Professional PDF generation with automatic download
- **Public Website** - Landing pages (Home, Chi Sono, Servizi, Contatti)
- **Contact Form** - Lead capture with JSON storage
- **No Authentication** - Single admin user (MVP scope)

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **UI**: TailwindCSS + shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **PDF**: @react-pdf/renderer
- **State**: Local state + Server Actions
- **Persistence**: JSON files (no database required for MVP)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Initialize Seed Data

```bash
npm run seed
```

This creates the `/data` directory with:

- `exercises.json` - 15 pre-populated exercises
- `plans.json` - Empty array for workout plans
- `leads.json` - Empty array for contact submissions

### 3. Add Media Files (Importante!)

Il sito ha placeholder per immagini che vanno sostituite. Vedi `/public/MEDIA_GUIDE.md` per dettagli completi.

**Immagini necessarie**:

- `/public/hero-bg.jpg` - Sfondo hero section (1920x1080px)
- `/public/costanza-profile.jpg` - Foto professionale (800x800px)

**Immagini stock temporanee** (da Unsplash):

```bash
# Hero background
curl -o public/hero-bg.jpg "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"

# Profile placeholder
curl -o public/costanza-profile.jpg "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80"
```

### 4. Personalizza Contatti

Aggiorna i tuoi contatti reali in:

- `/app/contatti/page.tsx` - Email, WhatsApp, Instagram
- `/components/navigation.tsx` - Link social

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Data Storage

All data is stored in JSON files under `/data`:

- **`/data/exercises.json`** - Exercise library
- **`/data/plans.json`** - Workout plans
- **`/data/leads.json`** - Contact form submissions
- **`/data/exports/`** - Generated PDF files (created automatically)

**Note**: The `/data` directory is gitignored. Run `npm run seed` after cloning.

## Usage Guide

### Creating a Workout Plan

1. Navigate to **Admin → Schede** (`/admin/schede`)
2. Click **"Nuova Scheda"**
3. Fill in plan metadata:
   - Title, Client Name (required)
   - Goal, Equipment, Duration, Frequency
   - Optional: Start Date, Notes, Contraindications
4. Click **"Aggiungi Sessione"** to add training days
5. For each session:
   - Name the session (e.g., "Giorno A - Upper Body")
   - Add exercises to sections (Warmup/Main/Cooldown)
   - Fill in sets, reps, load, rest, RPE, RIR, tempo, notes
6. Click **"Salva"**

### Exercise Library

- Navigate to **Admin → Esercizi** (`/admin/esercizi`)
- Add/Edit/Delete exercises
- Each exercise includes:
  - Name, Muscle Group, Category, Equipment
  - Default Rest (seconds), Default Tempo
  - Optional Video URL

### Exporting PDF

1. Go to **Admin → Schede**
2. Click **"PDF"** on any workout plan card
3. PDF automatically downloads with filename: `{Title}_{ClientName}.pdf`
4. PDF includes:
   - Plan metadata (client, goal, duration, frequency)
   - All sessions with structured exercise tables
   - Professional formatting for printing

### Managing Plans

- **Edit**: Click "Modifica" on a plan card
- **Duplicate**: Click "Duplica" to create a copy
- **Delete**: Click "Elimina" (with confirmation)

## Project Structure

```
/app
  /actions          # Server actions (exercises, plans, contact, pdf)
  /admin
    /esercizi       # Exercise library page
    /schede         # Workout plans list
      /[id]         # Edit plan page
      /new          # Create new plan page
  /chi-sono         # About page
  /servizi          # Services page
  /contatti         # Contact page
  layout.tsx        # Root layout with navigation
  page.tsx          # Homepage

/components
  /admin            # Admin-only components
    exercise-library.tsx
    exercise-form.tsx
    plans-list.tsx
    plan-builder.tsx
    plan-meta-form.tsx
    session-editor.tsx
    exercise-table.tsx
    exercise-library-panel.tsx
  /ui               # shadcn/ui components
  navigation.tsx
  contact-form.tsx

/lib
  types.ts          # TypeScript types + Zod schemas
  data.ts           # JSON file persistence utilities
  seed-data.ts      # Initial exercise data
  pdf-generator.tsx # PDF document generation
  utils.ts          # Utility functions

/data               # JSON data storage (gitignored)
  exercises.json
  plans.json
  leads.json
  /exports          # Generated PDFs
```

## Information Architecture

### Workout Plan Model

```typescript
{
  id, title, clientName,
  goal: "hypertrophy" | "strength" | "endurance" | "general" | "weight_loss" | "mobility",
  durationWeeks, frequencyDaysPerWeek,
  equipment: "gym" | "home" | "both",
  startDate?, notes?, contraindications?,
  sessions: [
    {
      id, name,
      sections: [
        {
          type: "warmup" | "main" | "cooldown",
          exercises: [
            {
              exerciseName, sets, reps?, timeSeconds?,
              loadKg?, rpe?, rir?, restSeconds, tempo?, notes?
            }
          ]
        }
      ]
    }
  ]
}
```

## Build & Deploy

```bash
npm run build
npm start
```

The app is statically generated where possible and uses server-side rendering for dynamic data.

## Development Notes

- **No Authentication**: This is an MVP for a single admin user
- **JSON Storage**: Simple and reliable for MVP; can migrate to database later
- **PDF Generation**: Server-side using @react-pdf/renderer
- **Type Safety**: Full TypeScript + Zod validation
- **Form Handling**: React Hook Form for performance
- **UI Components**: shadcn/ui for consistent design

## Future Enhancements (Post-MVP)

- Database migration (PostgreSQL/SQLite)
- User authentication & multi-tenant support
- Client portal for viewing assigned plans
- Exercise video uploads
- Progress tracking & analytics
- Mobile app
- Nutrition planning integration

## License

Private project - All rights reserved
