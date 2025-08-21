# Technical Architecture and System Design

### High-Level Architecture Overview

The system follows a **modern JAMstack architecture** with client-side processing for OCR and server-side APIs for AI integration, optimizing for both performance and cost efficiency.

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client Side   │    │   Server Side    │    │  External APIs  │
│                 │    │                  │    │                 │
│ • Next.js App   │◄──►│ • Next.js API    │◄──►│ • OpenAI API    │
│ • shadcn/ui     │    │   Routes         │    │ • Translation   │
│ • Tesseract.js  │    │ • Supabase SDK   │    │   APIs          │
│ • React PDF     │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┼──────────────────────────────┐
                                 ▼                              ▼
                    ┌──────────────────┐            ┌─────────────────┐
                    │    Supabase      │            │     Clerk       │
                    │                  │            │                 │
                    │ • PostgreSQL DB  │            │ • Authentication│
                    │ • File Storage   │            │ • User Mgmt     │
                    │ • Real-time APIs │            │ • Session Mgmt  │
                    └──────────────────┘            └─────────────────┘
```

### Frontend Architecture (Next.js + shadcn/ui)

**Component Structure:**
```
src/
├── app/                          # Next.js 13+ App Router
│   ├── (auth)/                   # Auth routes group
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── dashboard/                # Protected dashboard routes
│   │   ├── documents/
│   │   ├── vocabulary/
│   │   └── cards/
│   ├── reader/                   # PDF reader interface
│   │   └── [documentId]/
│   ├── api/                      # API routes
│   │   ├── ocr/
│   │   ├── ai-analysis/
│   │   └── cards/
│   └── globals.css               # Global styles + Tailwind
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── sidebar.tsx
│   │   └── ...
│   ├── pdf-viewer/               # PDF viewing components
│   │   ├── pdf-canvas.tsx
│   │   ├── highlight-layer.tsx
│   │   └── context-menu.tsx
│   ├── ocr/                      # OCR processing components
│   │   ├── ocr-worker.tsx
│   │   └── text-correction.tsx
│   └── dashboard/                # Dashboard components
│       ├── document-grid.tsx
│       ├── vocab-bank.tsx
│       └── stats-cards.tsx
├── lib/
│   ├── utils.ts                  # shadcn/ui utilities
│   ├── supabase.ts               # Supabase client
│   ├── ocr-engine.ts             # Tesseract.js wrapper
│   └── anki-generator.ts         # Anki file generation
└── hooks/
    ├── use-pdf-viewer.ts         # PDF viewer state management
    ├── use-vocabulary.ts         # Vocabulary bank operations
    └── use-highlights.ts         # Text highlighting logic
```

### Backend Architecture (Next.js API Routes + Supabase)

**API Route Structure:**
```
/api/
├── auth/                         # Clerk webhook endpoints
│   └── webhook/
├── documents/                    # Document management
│   ├── upload/                   # File upload handling
│   ├── [id]/                     # Document CRUD operations
│   └── process/                  # OCR processing trigger
├── ai/                          # AI integration endpoints
│   ├── analyze-text/             # OpenAI text analysis
│   ├── generate-cards/           # AI-powered card creation
│   └── translate/                # Translation services
├── vocabulary/                   # Vocabulary bank operations
│   ├── add/                      # Add vocabulary items
│   ├── bulk-import/              # Bulk vocabulary operations
│   └── export/                   # Export vocabulary data
└── cards/                        # Anki card operations
    ├── generate/                 # Manual card creation
    ├── bulk-generate/            # Batch card generation
    └── export/                   # .apkg file generation
```

### Database Schema (Supabase PostgreSQL)

```sql
-- Users (handled by Clerk, referenced by external_id)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    total_pages INTEGER NOT NULL,
    processing_status TEXT DEFAULT 'pending',
    ocr_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- OCR Results (per page)
CREATE TABLE ocr_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    extracted_text TEXT,
    confidence_score DECIMAL(3,2),
    bounding_boxes JSONB,
    processed_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(document_id, page_number)
);

-- User Highlights
CREATE TABLE highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    selected_text TEXT NOT NULL,
    bounding_box JSONB NOT NULL,
    highlight_color TEXT DEFAULT 'yellow',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Vocabulary Bank
CREATE TABLE vocabulary_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    original_text TEXT NOT NULL,
    reading TEXT,
    meaning TEXT,
    part_of_speech TEXT,
    difficulty_level INTEGER DEFAULT 1,
    context_sentence TEXT,
    source_document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    last_reviewed TIMESTAMP
);

-- Anki Cards
CREATE TABLE anki_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    front_text TEXT NOT NULL,
    back_text TEXT NOT NULL,
    tags TEXT[],
    difficulty INTEGER DEFAULT 1,
    source_type TEXT, -- 'manual', 'ai_generated', 'highlight'
    source_id UUID, -- references vocabulary_items or highlights
    created_at TIMESTAMP DEFAULT NOW(),
    exported_at TIMESTAMP
);

-- AI Analysis Sessions
CREATE TABLE ai_analysis_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    page_range TEXT NOT NULL, -- e.g., "1-5" or "all"
    analysis_type TEXT NOT NULL, -- 'vocabulary', 'phrases', 'comprehensive'
    token_usage INTEGER,
    results JSONB,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);
```

### Client-Side Processing Architecture

**OCR Processing (Tesseract.js):**
```typescript
// lib/ocr-engine.ts
import { createWorker } from 'tesseract.js';

export class OCREngine {
  private worker: Tesseract.Worker | null = null;
  
  async initialize() {
    this.worker = await createWorker('jpn', 1, {
      logger: m => this.onProgress(m)
    });
  }
  
  async processPage(imageData: ImageData): Promise<OCRResult> {
    const { data } = await this.worker.recognize(imageData);
    return {
      text: data.text,
      confidence: data.confidence,
      words: data.words.map(word => ({
        text: word.text,
        bbox: word.bbox,
        confidence: word.confidence
      }))
    };
  }
}
```

**PDF Viewer with Highlighting:**
```typescript
// components/pdf-viewer/pdf-canvas.tsx
import { pdfjs } from 'react-pdf';

export function PDFCanvas({ 
  documentId, 
  pageNumber, 
  onTextSelect,
  highlights 
}) {
  const [selectionState, setSelectionState] = useState(null);
  
  const handleMouseUp = useCallback((event) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const boundingBox = range.getBoundingClientRect();
      
      onTextSelect({
        text: selection.toString(),
        boundingBox: {
          x: boundingBox.x,
          y: boundingBox.y,
          width: boundingBox.width,
          height: boundingBox.height
        }
      });
    }
  }, [onTextSelect]);
  
  return (
    <div 
      className="pdf-canvas-container"
      onMouseUp={handleMouseUp}
    >
      {/* PDF rendering and highlight overlay */}
    </div>
  );
}
```

### AI Integration Architecture

**OpenAI Integration:**
```typescript
// api/ai/analyze-text.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeJapaneseText(
  text: string, 
  analysisType: 'vocabulary' | 'phrases' | 'comprehensive'
) {
  const prompt = `
    Analyze this Japanese text for ${analysisType}.
    Extract key vocabulary with readings, meanings, and difficulty levels.
    Return structured JSON format.
    
    Text: ${text}
  `;
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });
  
  return JSON.parse(response.choices[0].message.content);
}
```

### Security and Performance Considerations

**Security Measures:**
- **Authentication:** Clerk handles all user authentication and session management
- **Authorization:** Row Level Security (RLS) policies in Supabase ensure users only access their data
- **File Upload:** Secure file upload with type validation and size limits
- **API Protection:** Rate limiting and input validation on all API endpoints

**Performance Optimizations:**
- **Client-side OCR:** Reduces server costs and provides immediate feedback
- **Incremental processing:** OCR processes pages individually for better UX
- **Caching:** Supabase caching for frequently accessed vocabulary data
- **Lazy loading:** PDF pages and vocabulary items load on demand
- **Virtual scrolling:** For large vocabulary banks and document lists

**Scalability Considerations:**
- **Stateless API design:** Enables horizontal scaling
- **Database indexing:** Optimized queries for user data access
- **File storage:** Supabase Storage handles file scaling automatically
- **CDN integration:** Static assets served via Vercel's global CDN

---
