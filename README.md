MindGuard — Mental Health Early Warning System
> A proactive mental health monitoring platform that tracks emotional fluctuations, sleep hygiene, and physiological symptoms to identify potential mental health declines **before** they reach crisis levels.
---
📌 Table of Contents
About the Project
Features
Tech Stack
Screenshots
Getting Started
Environment Variables
Database Setup
Project Structure
Future Improvements
Author
---
📖 About the Project
Traditional mental health care is reactive — it happens only after a crisis. MindGuard shifts this paradigm by providing a continuous monitoring environment for patients and their clinicians.
The system evaluates every mood/symptom entry against pre-defined clinical safety parameters and automatically triggers alerts when a downward trend is detected, enabling timely intervention.
---
✨ Features
👤 Patient Module
Mood Tracker — Daily check-in with 1–10 sliders for mood, energy, sleep, and anxiety
Symptom Reporting — Searchable, categorised symptom cards (Emotional, Physical, Behavioral, Cognitive)
Private Journal — Secure qualitative data entry for thoughts that sliders can't capture
🩺 Clinician Module
Patient Oversight — Dashboard showing all assigned patients with Status Colors (🟢 Green / 🟡 Yellow / 🔴 Red)
Alert Management — Centralised hub to view, triage, and resolve triggered alerts
⚠️ Early Warning Engine
Trigger	Condition
Severity Alert	Mood score ≤ 3 or Anxiety score ≥ 8
Persistent Decline	7-day mood average drops > 30% vs previous week
High-Intensity Symptom	Level 5 severity for Social Isolation or Panic Attacks
---
🛠️ Tech Stack
Layer	Technology
Frontend	React 18 + TypeScript
Routing	React Router v7
Styling	Tailwind CSS
Backend / DB	Supabase (PostgreSQL)
Auth	Supabase Auth (JWT)
Icons	Lucide React
Build Tool	Vite
---
🚀 Getting Started
Prerequisites
Node.js v18+
npm or yarn
A Supabase account
Installation
```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/mindguard.git
cd mindguard

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your Supabase URL and Anon Key in .env

# 4. Start the development server
npm run dev
```
The app will run at `http://localhost:5173`
---
🔐 Environment Variables
Create a `.env` file in the project root (never commit this file):
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
You can find these values in your Supabase project under Settings → API.
---
🗄️ Database Setup
The SQL migration files are located in `/supabase/migrations/`. Run them in order in the Supabase SQL Editor:
`20260423165646_mental_health_schema_v1.sql` — Core schema (tables & relationships)
`20260423165704_mental_health_rls_policies.sql` — Row Level Security policies
`20260423165720_mental_health_seed_and_trigger.sql` — Seed data & triggers
---
📁 Project Structure
```
mindguard/
├── src/
│   ├── components/        # Reusable UI components
│   │   └── Layout.tsx
│   ├── context/           # React context providers
│   │   └── AuthContext.tsx
│   ├── lib/               # Supabase client & types
│   │   ├── supabase.ts
│   │   └── database.types.ts
│   ├── pages/             # App pages / routes
│   │   ├── Dashboard.tsx
│   │   ├── MoodTracker.tsx
│   │   ├── SymptomsPage.tsx
│   │   ├── AlertsPage.tsx
│   │   ├── JournalPage.tsx
│   │   ├── ReportsPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── AuthPage.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase/
│   └── migrations/        # SQL migration files
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
└── vite.config.ts
```
---
🔮 Future Improvements
[ ] AI Sentiment Analysis — NLP to detect "Cry for Help" patterns in journal entries
[ ] Wearable Integration — Pull HRV and sleep data from IoT devices (replacing manual entry)
[ ] Mobile Push Notifications — Check-in reminders during typical low-mood hours
[ ] Telehealth Integration — Launch video consultations directly from an active alert
---
👩‍💻 Author
Sanghamitra Sahoo
---
> *MindGuard serves as a vital bridge between technology and therapy — empowering patients to take control of their journey and enabling clinicians to provide more timely, effective care.*
