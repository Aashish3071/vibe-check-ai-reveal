# ❤️ HeartCheck AI

![HeartCheck AI Preview](/public/preview.png)

> A mobile-first app for Gen-Z to analyze romantic conversations and emotional well-being with AI insights.

HeartCheck AI is a vibrant, mobile-first app designed for Gen-Z that decodes relationship dynamics and emotional patterns using advanced AI. The app features a dual-mode interface, switching between "Dating Bestie" and "Therapist Bestie" to address both romantic and personal emotional needs.

## ✨ Key Features

### 💘 Dating Bestie Mode

- **Conversation Analyzer**: Decode the emotional subtext in your conversations
- **Intent Detector**: Determine if someone's genuinely interested or just playing games
- **Pattern Recognizer**: Identify recurring relationship patterns to break toxic cycles
- **Tarot Mode**: Get mystical insights about your romantic situation
- **Love Journal**: Track your emotional growth and relationship history

### 🧠 Therapist Bestie Mode

- **Mood Check-in**: Daily reflection on your emotional state to build self-awareness
- **Self-Coaching**: Get gentle guidance for emotional challenges you're facing
- **Pattern Tracker**: Identify emotional and behavioral patterns to support growth
- **Prompted Journal**: Guided journaling for self-discovery and emotional processing
- **Timeline View**: Visualize your emotional journey over time with AI-powered insights

### 🌟 Core Experience

- Personalized AI avatar based on your quiz results and emotional style
- Seamless toggle between Dating and Therapist modes
- User authentication and profile management
- Beautiful, Gen-Z focused UI with animations and playful elements
- Secure cloud storage for conversations and journal entries

## 🔧 Tech Stack

### Frontend

- React with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Zustand for state management
- React Router for navigation
- Shadcn UI components

### Backend

- Supabase for database, authentication, and storage
  - PostgreSQL database with Row Level Security
  - Email/password and social authentication
  - Real-time subscriptions for updates
  - Secure file storage for user avatars
- GPT-4o Integration
  - Custom prompt engineering for relationship analysis
  - Intent detection and pattern recognition
  - Personalized emotional insights
  - Secure API handling with rate limiting
- Serverless Functions
  - Optimized AI request handling
  - User data synchronization
  - Analytics and notification services

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials to .env.local

# Run development server
npm run dev
```

Visit `http://localhost:8080` in your browser.

## 💾 Database Schema

The application uses Supabase with the following core tables:

- `users` - User profiles and preferences
- `conversations` - Analyzed conversations
- `journal_entries` - User journal entries
- `tarot_readings` - Saved tarot card readings
- `mood_entries` - Daily mood check-in data
- `patterns` - Detected behavioral and emotional patterns

## 🔒 Privacy and Security

- All conversation data is encrypted
- Users own their data and can delete it at any time
- No conversation data is used to train AI models
- Strict adherence to data protection regulations
- Row Level Security ensures users can only access their own data

## 🤖 AI Implementation

HeartCheck AI leverages OpenAI's GPT-4o for advanced conversation analysis:

- Custom prompt engineering for relationship-specific insights
- JSON-structured responses for consistent UI rendering
- Context-aware analysis based on conversation history
- Personalized recommendations based on user patterns
- Emotional intelligence training for sensitive topics

## 📱 Deployment

The application is deployed using:

- Vercel for frontend hosting and serverless functions
- Supabase for database and authentication services
- Automated CI/CD pipeline for continuous delivery
- Performance monitoring and error tracking

## 👩‍💻 Contributing

This project is in active development. Feel free to open issues or submit pull requests.

## 📄 License

MIT
