# HeartCheck AI Backend Implementation Plan

This document outlines the comprehensive backend implementation plan for HeartCheck AI using Supabase and GPT-4o integration.

## 1. Supabase Setup

### 1.1 Project Initialization

- Create a new Supabase project
- Set up environment variables in the frontend application
- Configure CORS policies for production and development environments

### 1.2 Authentication System

- Implement email/password authentication
- Add social login options (Google, Apple)
- Set up password reset and email verification flows
- Create protected API routes using RLS (Row Level Security)
- Implement JWT token handling and refresh mechanisms

## 2. Database Schema

### 2.1 Core Tables

#### Users Table

```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  preferences JSONB DEFAULT '{}'::jsonb,
  persona_type TEXT,
  streak_count INTEGER DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE
);
```

#### Conversations Table

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  conversation_text TEXT NOT NULL,
  analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_favorite BOOLEAN DEFAULT false,
  tags TEXT[]
);
```

#### Journal Entries Table

```sql
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  mood_score INTEGER,
  ai_insights JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  tags TEXT[]
);
```

#### Tarot Readings Table

```sql
CREATE TABLE tarot_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question TEXT,
  cards JSONB NOT NULL,
  interpretation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_favorite BOOLEAN DEFAULT false
);
```

#### Mood Entries Table

```sql
CREATE TABLE mood_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mood_score INTEGER NOT NULL,
  factors TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  date DATE NOT NULL
);
```

### 2.2 Relationship Tables

#### Patterns Table

```sql
CREATE TABLE patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pattern_type TEXT NOT NULL,
  description TEXT NOT NULL,
  first_detected TIMESTAMP WITH TIME ZONE DEFAULT now(),
  frequency INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  insights JSONB
);
```

### 2.3 Row Level Security Policies

- Implement RLS policies for all tables to ensure users can only access their own data
- Create service roles for admin functions
- Set up data validation using PostgreSQL triggers

## 3. Storage Configuration

### 3.1 User Uploads

- Create secure buckets for user profile pictures
- Set up avatar image processing and optimization
- Configure appropriate access policies

### 3.2 Backup Strategy

- Implement regular database backups
- Create data export functionality for users

## 4. AI Integration (GPT-4o)

### 4.1 API Service

- Create serverless functions to handle AI requests
- Implement rate limiting and usage tracking
- Set up proper error handling and fallback mechanisms

### 4.2 Conversation Analysis Endpoints

- `/api/analyze/conversation` - For Conversation Analyzer feature
- `/api/analyze/intent` - For Intent Detector feature
- `/api/analyze/pattern` - For Pattern Recognizer feature
- `/api/analyze/journal` - For Journal insights

### 4.3 Prompt Engineering

- Design and optimize prompts for each feature
- Implement prompt templates with variable insertion
- Create system message configurations for consistent AI personality
- Develop fallback prompts for handling edge cases

### 4.4 Response Handling

- Implement JSON response parsing
- Create retry logic for API failures
- Cache common responses to reduce API costs

## 5. Real-time Features

### 5.1 Supabase Realtime

- Configure Supabase realtime subscriptions for journal and conversation updates
- Implement optimistic UI updates with fallback
- Set up presence indicators for future social features

### 5.2 Notifications

- Create a notifications table and schema
- Implement push notification service
- Design daily check-in reminders

## 6. Analytics and Monitoring

### 6.1 User Analytics

- Set up anonymous usage tracking
- Create dashboard for monitoring system health
- Implement error logging and alerting

### 6.2 Performance Monitoring

- Configure response time tracking
- Implement database query optimization
- Set up API usage monitoring

## 7. Security Measures

### 7.1 Data Encryption

- Implement client-side encryption for sensitive conversation data
- Set up secure key management
- Configure HTTPS for all API endpoints

### 7.2 Data Retention

- Implement data retention policies
- Create automated data purging for inactive accounts
- Design GDPR-compliant data deletion workflows

## 8. Deployment Strategy

### 8.1 CI/CD Pipeline

- Set up GitHub Actions for automated testing and deployment
- Create staging and production environments
- Implement database migration strategies

### 8.2 Infrastructure

- Configure hosting environment
- Set up CDN for static assets
- Implement caching strategies

## 9. Cost Optimization

### 9.1 Supabase Resources

- Monitor database size and optimize queries
- Implement connection pooling
- Set up usage alerts

### 9.2 AI API Usage

- Track token usage by feature
- Implement caching for common AI responses
- Set up rate limiting to prevent abuse

## 10. Implementation Timeline

### Phase 1: Foundation (Weeks 1-2)

- Supabase project setup
- Core database schema implementation
- Basic authentication flows

### Phase 2: Core Features (Weeks 3-4)

- AI integration for conversation analysis
- Journal and mood tracking functionality
- Basic user profiles

### Phase 3: Advanced Features (Weeks 5-6)

- Tarot reading implementation
- Pattern recognition system
- Advanced security measures

### Phase 4: Optimization & Launch (Weeks 7-8)

- Performance optimization
- Final security audit
- Production deployment

## 11. Testing Strategy

### 11.1 Automated Testing

- Unit tests for API endpoints
- Integration tests for AI responses
- End-to-end tests for critical user flows

### 11.2 User Testing

- Beta testing program
- A/B testing for key features
- Feedback collection mechanism
