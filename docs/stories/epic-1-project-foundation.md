# Epic 1: Project Foundation & Setup
**Duration:** Days 1-2 of Hackathon  
**Goal:** Establish complete development foundation with all infrastructure and dependencies ready for feature development

## Epic Overview
Create the technical foundation for the PDF-to-Anki Japanese Learning Tool, including project initialization, external service setup, database configuration, and basic infrastructure required for subsequent development phases.

## Success Criteria
- ✅ Next.js 14 project fully initialized and deployable
- ✅ All external APIs configured and accessible
- ✅ Database schema created and tested
- ✅ Development environment fully functional
- ✅ Testing framework operational
- ✅ CI/CD pipeline established

---

## Story 1.1: Next.js Project Initialization
**Priority:** Critical  
**Estimate:** 2 hours  
**Assignee:** Developer Agent

### User Story
```
As a developer,
I want a fully configured Next.js 14 project with TypeScript and all core dependencies,
So that I can begin feature development immediately.
```

### Acceptance Criteria
- [ ] Next.js 14 project created with App Router
- [ ] TypeScript configured with strict mode
- [ ] Tailwind CSS installed and configured
- [ ] shadcn/ui components initialized
- [ ] ESLint and Prettier configured
- [ ] Basic folder structure created (components/, lib/, types/, hooks/)
- [ ] Development server runs without errors
- [ ] Initial commit pushed to repository

### Technical Implementation
```bash
# Project Creation
npx create-next-app@latest langfull-hackathon --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Core Dependencies
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react
npm install zustand react-query @tanstack/react-query

# Development Dependencies  
npm install -D @types/node @types/react @types/react-dom
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom
npm install -D playwright @playwright/test

# shadcn/ui initialization
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input label card dialog progress
```

### Definition of Done
- Project builds successfully (`npm run build`)
- Development server starts (`npm run dev`)
- Linting passes (`npm run lint`)
- Basic component renders correctly
- Repository initialized with proper .gitignore

---

## Story 1.2: External API Account Setup
**Priority:** Critical  
**Estimate:** 1 hour  
**Assignee:** User (Human-only task)

### User Story
```
As a project owner,
I want all required external service accounts created and configured,
So that the development team can integrate with necessary APIs.
```

### Acceptance Criteria
- [ ] Google Cloud Platform account created
- [ ] Google Vision API enabled and API key generated
- [ ] OpenAI account created and API key generated
- [ ] Clerk account created and application configured
- [ ] Vercel account connected to GitHub repository
- [ ] All API keys securely documented

### Required Actions (User Tasks)
1. **Google Cloud Setup**
   - Create Google Cloud account at console.cloud.google.com
   - Create new project: "PDF-Anki-Tool"
   - Enable Vision API in API Library
   - Create service account key (JSON format)
   - Download credentials file

2. **OpenAI Setup**
   - Create account at platform.openai.com
   - Add payment method (required for API access)
   - Generate API key with GPT-4 access
   - Set usage limits ($50 monthly cap recommended)

3. **Clerk Setup**
   - Create account at clerk.com
   - Create new application: "PDF Anki Tool"
   - Configure sign-in methods (Email, Google, GitHub)
   - Copy publishable key and secret key

4. **Vercel Setup**
   - Create account at vercel.com
   - Connect GitHub repository
   - Configure automatic deployments

### Deliverables
- Document with all API keys and configuration details
- Google Cloud credentials JSON file
- Clerk application configuration screenshot
- Vercel deployment URL

---

## Story 1.3: Database Setup and Schema Creation
**Priority:** Critical  
**Estimate:** 3 hours  
**Assignee:** Developer Agent

### User Story
```
As a developer,
I want a fully configured database with all required tables and relationships,
So that I can implement data persistence features.
```

### Acceptance Criteria
- [ ] Supabase project created and configured
- [ ] Database schema implemented with all tables
- [ ] Row Level Security (RLS) policies configured
- [ ] Database connection tested from Next.js
- [ ] Seed data created for development
- [ ] Database migrations working

### Technical Implementation
```sql
-- Users table (synced with Clerk)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    display_name TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    total_pages INTEGER NOT NULL,
    processing_status TEXT DEFAULT 'uploaded',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- OCR Results table
CREATE TABLE ocr_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    extracted_text TEXT,
    confidence_score DECIMAL(3,2),
    bounding_boxes JSONB,
    ocr_engine TEXT DEFAULT 'tesseract',
    processed_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(document_id, page_number)
);

-- Vocabulary Items table
CREATE TABLE vocabulary_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    original_text TEXT NOT NULL,
    reading TEXT,
    meaning TEXT NOT NULL,
    part_of_speech TEXT,
    difficulty_level INTEGER DEFAULT 1,
    context_sentence TEXT,
    source_document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    last_reviewed TIMESTAMP
);

-- Anki Cards table
CREATE TABLE anki_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    front_text TEXT NOT NULL,
    back_text TEXT NOT NULL,
    card_type TEXT DEFAULT 'vocabulary',
    tags TEXT[] DEFAULT '{}',
    difficulty INTEGER DEFAULT 1,
    source_type TEXT,
    source_id UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    exported_at TIMESTAMP
);
```

### Environment Configuration
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```

---

## Story 1.4: Environment Configuration and Security
**Priority:** Critical  
**Estimate:** 1 hour  
**Assignee:** Developer Agent

### User Story
```
As a developer,
I want all environment variables and secrets properly configured,
So that external integrations work securely in all environments.
```

### Acceptance Criteria
- [ ] .env.local file created with all required variables
- [ ] .env.example file created for documentation
- [ ] Vercel environment variables configured
- [ ] Environment validation implemented
- [ ] Secrets properly secured

### Environment Variables Required
```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

OPENAI_API_KEY=sk-...
GOOGLE_CLOUD_CREDENTIALS={"type":"service_account"...}

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Security Implementation
```typescript
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  OPENAI_API_KEY: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
})

export const env = envSchema.parse(process.env)
```

---

## Story 1.5: Testing Framework Setup
**Priority:** High  
**Estimate:** 2 hours  
**Assignee:** Developer Agent

### User Story
```
As a developer,
I want a complete testing framework configured,
So that I can ensure code quality throughout development.
```

### Acceptance Criteria
- [ ] Vitest configured for unit testing
- [ ] React Testing Library configured
- [ ] Playwright configured for E2E testing
- [ ] Test utilities created
- [ ] Sample tests passing
- [ ] CI pipeline includes testing

### Configuration Files
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './src/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

---

## Story 1.6: CI/CD Pipeline Setup
**Priority:** High  
**Estimate:** 1 hour  
**Assignee:** Developer Agent

### User Story
```
As a developer,
I want automated testing and deployment configured,
So that code quality is maintained and deployments are reliable.
```

### Acceptance Criteria
- [ ] GitHub Actions workflow created
- [ ] Automated testing on pull requests
- [ ] Automated deployment to Vercel
- [ ] Environment variables configured in CI
- [ ] Build and test passing

### GitHub Actions Configuration
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run type checking
      run: npm run type-check
    
    - name: Run unit tests
      run: npm run test
    
    - name: Build project
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## Epic 1 Completion Checklist
- [ ] All stories completed and tested
- [ ] Development environment fully functional
- [ ] External APIs accessible and tested
- [ ] Database schema created and populated
- [ ] Testing framework operational
- [ ] CI/CD pipeline working
- [ ] Documentation updated
- [ ] Ready for Epic 2 development

**Epic 1 Duration:** 8 hours (Day 1 of hackathon)  
**Dependencies:** User completion of API account setup (Story 1.2)  
**Blockers:** None - this is the foundation epic
