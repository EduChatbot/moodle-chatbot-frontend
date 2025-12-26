# Moodle Learning Assistant - Frontend

An AI-powered learning assistant for Moodle, featuring interactive chat, quiz generation, and personalized learning progress tracking.

## Features

- **AI Chat Assistant**: Ask questions about course materials and get intelligent responses
- **Quiz Generation**: Create custom quizzes from course materials using AI
- **Learning Analytics**: Track your progress with detailed statistics and recommendations
- **Dark/Light Theme**: Comfortable viewing in any lighting condition
- **Animated UI**: Modern interface with customizable animations

## Prerequisites

- Node.js 20+ and npm
- Backend API running (see backend repository)
- Moodle instance with the Learning Assistant plugin installed

## Environment Setup

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Replace `http://localhost:8000` with your backend API URL.

## Installation

Install dependencies:

```bash
npm install
```

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Production Build

Build the application:

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── chat/              # Chat interface
│   ├── quiz/              # Quiz center and quiz taking
│   ├── dashboard/         # Learning analytics dashboard
│   └── courses/           # Course browser
├── components/            # React components
│   ├── ChatWindow.js      # Main chat component
│   ├── QuizList.js        # Quiz management
│   ├── Dashboard.js       # Analytics dashboard
│   └── ...                # UI components
└── contexts/              # React contexts
    ├── MoodleContext.tsx  # Moodle authentication
    ├── ThemeContext.tsx   # Theme management
    └── AnimationContext.tsx # Animation preferences
```

## Integration with Moodle

This frontend integrates with Moodle via parameters:

```
/?token=<MOODLE_TOKEN>&courseId=<COURSE_ID>&courseName=<COURSE_NAME>
```

These parameters are automatically passed from the Moodle plugin.

## Technologies

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS 4** - Utility-first CSS
- **Three.js & GSAP** - 3D graphics and animations
- **React Markdown** - Markdown rendering for AI responses
