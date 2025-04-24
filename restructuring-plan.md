# Restructuring Plan for HeartCheck AI

## Overview

The codebase needs to be organized into two separate products:

1. **Dating Bestie** - Features for relationship analysis
2. **Therapist Bestie** - Features for mental health and self-reflection

## Current Structure Issues

- Files are scattered across multiple directories
- Some duplicate files exist (ConversationAnalyzer appears in both src/components and src/features/bestie/components)
- Main components and pages are mixed without clear organization
- Partial restructuring has started but is incomplete

## New Structure

```
src/
├── common/                  # Shared components and utilities
│   ├── components/          # Common UI components
│   │   ├── ui/              # UI primitives (shadcn)
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   ├── LayoutSwitcher.tsx
│   │   ├── ModeToggle.tsx
│   │   ├── Sparkles.tsx
│   │   └── FeatureCard.tsx
│   ├── layouts/             # Shared layouts
│   ├── hooks/               # Shared custom hooks
│   └── lib/                 # Shared utilities and services
│       ├── api.ts
│       ├── openai.ts
│       ├── supabase.ts
│       ├── appMode.ts
│       └── utils.ts
├── features/
│   ├── auth/                # Authentication features
│   │   ├── components/
│   │   └── pages/
│   │       └── Auth.tsx
│   ├── bestie/              # Dating Bestie product
│   │   ├── components/
│   │   │   ├── ConversationAnalyzer.tsx
│   │   │   ├── IntentDetector.tsx
│   │   │   ├── PatternRecognizer.tsx
│   │   │   └── TarotReader.tsx
│   │   └── pages/
│   │       ├── Analyze.tsx
│   │       ├── DecodeVibe.tsx
│   │       ├── IntentDetectorPage.tsx
│   │       ├── PatternRecognizer.tsx
│   │       └── TarotMode.tsx
│   ├── therapist/           # Therapist Bestie product
│   │   ├── components/
│   │   │   ├── MoodCheck.tsx
│   │   │   └── Journal.tsx
│   │   └── pages/
│   │       ├── MoodCheckPage.tsx
│   │       └── JournalPage.tsx
│   ├── profile/             # User profile features
│   │   ├── components/
│   │   └── pages/
│   │       ├── AvatarGenerator.tsx
│   │       └── Quiz.tsx
│   └── home/                # Home and landing pages
│       ├── components/
│       └── pages/
│           └── Index.tsx
└── App.tsx                  # Main app component with routing
```

## Migration Steps

1. Create necessary directories
2. Move components to appropriate locations
3. Update imports in all files
4. Remove duplicate files
5. Test functionality after migration

## Additional Improvements

1. Standardize component interfaces
2. Add barrel exports (index.ts) in directories
3. Improve routing structure
4. Ensure proper sharing of common functionality
