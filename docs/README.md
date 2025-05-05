# Vibe Check AI Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Getting Started](#getting-started)
3. [Architecture](#architecture)
4. [Features](#features)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Security](#security)
8. [Performance](#performance)

## Project Overview

Vibe Check AI is a mental health and wellness application that provides users with tools for self-reflection, mood tracking, and emotional support. The application uses AI to analyze user input and provide personalized insights and recommendations.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/vibe-check-ai.git
cd vibe-check-ai
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your Supabase and OpenAI credentials.

4. Start the development server

```bash
npm run dev
```

## Architecture

### Tech Stack

- Frontend: React, TypeScript, Vite
- State Management: React Query
- Styling: Tailwind CSS
- Authentication: Supabase Auth
- Database: Supabase PostgreSQL
- AI: OpenAI API
- Testing: Vitest, React Testing Library

### Project Structure

```
src/
├── common/           # Shared utilities and components
├── features/         # Feature-specific code
│   ├── auth/        # Authentication
│   ├── quiz/        # Quiz functionality
│   ├── therapist/   # Therapist features
│   └── user/        # User management
├── lib/             # Third-party integrations
└── test-utils.tsx   # Testing utilities
```

## Features

### Authentication

- Email/password authentication
- Social authentication (Google, GitHub)
- Password reset functionality
- Session management

### Quiz System

- Dynamic quiz generation
- Progress tracking
- Results analysis
- Personalized recommendations

### Therapist Features

- Mood tracking
- Journaling
- Pattern recognition
- Grounding exercises
- Self-coaching tools

### User Management

- Profile customization
- Preferences management
- Data export
- Privacy controls

## Testing

### Running Tests

```bash
npm test        # Run all tests
npm test:watch  # Run tests in watch mode
npm test:coverage # Run tests with coverage report
```

### Test Structure

- Unit tests for components and utilities
- Integration tests for feature workflows
- E2E tests for critical user journeys

## Deployment

### Production Build

```bash
npm run build
```

### Deployment Steps

1. Build the application
2. Deploy to hosting platform (e.g., Vercel, Netlify)
3. Set up environment variables
4. Configure custom domain
5. Enable SSL

## Security

### Authentication

- JWT-based authentication
- Secure password hashing
- Session management
- Rate limiting

### Data Protection

- Row Level Security (RLS)
- Data encryption
- Secure API endpoints
- Input validation

### Best Practices

- Regular security audits
- Dependency updates
- Secure headers
- CORS configuration

## Performance

### Optimization Techniques

- Code splitting
- Lazy loading
- Image optimization
- Caching strategies

### Monitoring

- Performance metrics
- Error tracking
- User analytics
- Resource usage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
