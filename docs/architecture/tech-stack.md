# Tech Stack

This is the **DEFINITIVE technology selection** for the entire project. This table serves as the single source of truth - all development must use these exact versions and technologies.

### Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Frontend Language | TypeScript | 5.3+ | Type-safe frontend development | Eliminates runtime errors, improves developer experience, enables shared types between frontend/backend |
| Frontend Framework | Next.js | 14.x | Full-stack React framework | App Router for optimal performance, built-in API routes, excellent Vercel integration, SSR/SSG capabilities |
| UI Component Library | shadcn/ui | Latest | Accessible, customizable components | Modern design system, built-in accessibility, minimal bundle size, perfect for distraction-free learning UI |
| State Management | Zustand | 4.4+ | Lightweight state management | Simpler than Redux, TypeScript-first, perfect for medium-complexity apps, easy testing |
| Backend Language | TypeScript | 5.3+ | Type-safe backend development | Shared types with frontend, consistent development experience, excellent tooling |
| Backend Framework | Next.js API Routes | 14.x | Serverless API endpoints | Seamless integration with frontend, automatic deployment, cost-effective serverless scaling |
| API Style | REST API | - | HTTP-based API communication | Simple, well-understood, easy debugging, perfect for CRUD operations and file uploads |
| Database | Supabase PostgreSQL | Latest | Managed PostgreSQL database | Built-in auth, real-time subscriptions, file storage, cost-effective, excellent developer experience |
| Cache | Supabase Edge Cache | Built-in | Query result caching | Automatic caching, reduces database load, improves response times globally |
| File Storage | Supabase Storage | Built-in | PDF document storage | Integrated with database, automatic CDN, security rules, cost-effective |
| Authentication | Clerk | Latest | User authentication & management | Superior developer experience, social logins, session management, security compliance |
| Frontend Testing | Vitest + React Testing Library | Latest | Unit and integration testing | Fast execution, Jest-compatible, excellent React component testing |
| Backend Testing | Vitest | Latest | API endpoint testing | Consistent testing framework across stack, TypeScript support, fast execution |
| E2E Testing | Playwright | Latest | End-to-end browser testing | Reliable cross-browser testing, excellent debugging tools, CI/CD integration |
| Build Tool | Next.js Built-in | 14.x | Webpack-based building | Optimized for React, automatic code splitting, built-in optimizations |
| Bundler | Turbopack (Next.js) | Built-in | Fast development bundling | Rust-based bundler, extremely fast hot reload, Next.js optimized |
| IaC Tool | Vercel CLI | Latest | Infrastructure as code | Simple deployment configuration, environment management, preview deployments |
| CI/CD | GitHub Actions | - | Continuous integration/deployment | Free for open source, excellent GitHub integration, robust workflow capabilities |
| Monitoring | Vercel Analytics + Sentry | Latest | Performance and error monitoring | Built-in performance monitoring, comprehensive error tracking, user experience insights |
| Logging | Vercel Logs + Console | Built-in | Application logging | Serverless-optimized logging, real-time log streaming, integrated with deployment |
| CSS Framework | Tailwind CSS | 3.4+ | Utility-first CSS framework | Rapid development, small bundle size, excellent with shadcn/ui, consistent design system |

### Additional Specialized Technologies

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| OCR Engine | Tesseract.js | 5.0+ | Client-side Japanese OCR | Free, no usage limits, Japanese language support, runs in browser, cost-effective |
| PDF Viewer | React PDF | 7.5+ | PDF rendering with highlighting | Advanced React-native PDF viewer, built-in highlighting, annotation support, mobile-optimized |
| AI Integration | OpenAI API | GPT-4 | Vocabulary analysis and extraction | Best-in-class language understanding, excellent Japanese support, reliable API |
| Translation | Google Translate API | v3 | Real-time text translation | High-quality Japanese-English translation, cost-effective, reliable service |
| File Processing | PDF.js | Built-in with React PDF | PDF parsing and rendering | Industry standard, reliable, excellent browser support |

---
