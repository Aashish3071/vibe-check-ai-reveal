# Import Path Fixes for Restructured Codebase

After restructuring the codebase into a more organized structure, several import paths needed to be updated. These are the fixes that were made:

## Common Components

1. Fixed import paths in `src/common/components/Header.tsx`:

   - Updated UI component imports from `@/components/ui/*` to `@/common/components/ui/*`
   - Updated auth hook imports from `@/lib/auth` to `@/common/lib/auth`
   - Updated theme hooks from `../hooks/use-theme` to `@/common/hooks/use-theme`

2. Fixed import paths in `src/common/components/ModeToggle.tsx`:

   - Updated UI component imports from `@/components/ui/*` to `@/common/components/ui/*`
   - Updated appMode imports from `@/lib/appMode` to `@/common/lib/appMode`

3. Fixed imports in all UI components in `src/common/components/ui/`:

   - Updated utility imports from `@/lib/utils` to `@/common/lib/utils`
   - Updated component imports from `@/components/ui/*` to `@/common/components/ui/*`

4. Fixed import paths in `src/common/components/FeatureCard.tsx`:
   - Updated UI component imports from `@/components/ui/*` to `@/common/components/ui/*`

## Feature Components and Pages

1. Fixed imports in all feature components and pages:

   - Updated UI component imports from `@/components/ui/*` to `@/common/components/ui/*`
   - Updated common component imports (Header, Navigation, Sparkles) to new paths
   - Updated feature component imports to their new locations:
     - `@/components/ConversationAnalyzer` → `@/features/bestie/components/ConversationAnalyzer`
     - `@/components/IntentDetector` → `@/features/bestie/components/IntentDetector`
     - `@/components/PatternRecognizer` → `@/features/bestie/components/PatternRecognizer`
     - `@/components/therapist/MoodCheck` → `@/features/therapist/components/MoodCheck`

2. Fixed imports for library utilities:
   - Updated API imports from `@/lib/api` to `@/common/lib/api`
   - Updated auth imports from `@/lib/auth` to `@/common/lib/auth`
   - Updated appMode imports from `@/lib/appMode` to `@/common/lib/appMode`

## Main App Updates

1. Fixed imports in `src/App.tsx`:
   - Updated auth hook imports to use the correct structure
   - Adjusted the usage of `useIsAuthenticated` to handle the object it returns
   - Restructured imports to use the new feature structure

## Environment Setup

1. Copied necessary files to their new locations:
   - Moved `use-theme.tsx` to `src/common/hooks/`
   - Copied `auth.tsx` to `src/common/lib/`

This completes the restructuring process. The codebase is now organized with separated concerns and cleaner imports.
