# FedSignal Next.js Application

A Next.js application with Firebase integration for the FedSignal government funding intelligence platform built for HBCUs.

## Features

- **Authentication**: Firebase Authentication with email/password and institutional domain detection
- **Dashboard**: KPI tracking, opportunity feed, strategic alerts
- **Opportunities**: Live opportunity feed from SAM.gov, Grants.gov, SBIR.gov
- **Scoreboard**: HBCU federal funding comparisons and rankings
- **Directory**: HBCU/MSI network with filtering and search
- **AI Tools**: Proposal Pal, RFI Creator, Content Studio
- **CRM**: Contact management for primes, agencies, and partners
- **Reports**: Board reports, win/loss tracking, grant tracking

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI primitives
- **State**: Zustand for client state, React Query for server state
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Storage**: Firebase Storage
- **Charts**: Recharts

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Dashboard (Command Center)
│   ├── opportunities/     # Opportunity Feed
│   ├── scoreboard/        # HBCU Scoreboard
│   ├── directory/         # HBCU Network
│   ├── crm/               # CRM & Contacts
│   └── ...
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── Sidebar.tsx        # Main navigation
│   ├── Topbar.tsx         # Header bar
│   └── ...
├── lib/
│   ├── firebase.ts        # Firebase config
│   ├── schema.ts          # Firestore types
│   └── utils.ts           # Utility functions
└── hooks/                 # Custom React hooks
```

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Add your web app and copy the config to environment variables
5. Deploy security rules from `firestore.rules`

## Deployment

The app can be deployed to:
- **Vercel** (recommended for Next.js)
- **Firebase Hosting**
- **Netlify**

```bash
# Build for production
npm run build
```

## License

Private - All rights reserved.
