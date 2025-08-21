# LangFull

A modern language learning application that transforms PDFs into interactive learning experiences with AI-powered vocabulary extraction and Anki card generation.

## Features

- 📄 PDF Upload and Processing
- 🔍 OCR Text Extraction
- 📚 AI-Powered Vocabulary Bank
- 🎴 Anki Flashcard Generation
- 🎨 Modern UI with shadcn/ui components
- 🚀 Built with Next.js 15 and TypeScript

## Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Server State**: TanStack Query (React Query)
- **Testing**: Vitest + React Testing Library + Playwright
- **Code Quality**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Nightnettle/LangFull.git
cd langfull
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run unit tests with Vitest
- `npm run test:ui` - Run tests with UI
- `npm run test:run` - Run tests once
- `npm run test:e2e` - Run E2E tests with Playwright
- `npm run test:e2e:ui` - Run E2E tests with UI

## Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── globals.css        # Global styles + Tailwind
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   └── ui/                # shadcn/ui components
├── lib/
│   └── utils.ts           # Utility functions
├── types/                 # TypeScript type definitions
├── hooks/                 # Custom React hooks
├── test/                  # Test setup
└── e2e/                   # E2E tests
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the ISC License.
