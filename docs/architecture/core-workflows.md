# Core Workflows

These sequence diagrams illustrate the critical user journeys and system interactions that define the PDF-to-Anki Japanese Learning Tool's core functionality.

### Workflow 1: Document Upload and Initial Processing

```mermaid
sequenceDiagram
    participant User
    participant Frontend as Next.js Frontend
    participant API as API Routes
    participant Supabase as Supabase Storage/DB
    participant OCR as OCR Engine
    participant Realtime as Real-time Updates

    User->>Frontend: Upload PDF file
    Frontend->>Frontend: Validate file (type, size)
    Frontend->>API: POST /documents (multipart)
    API->>Supabase: Store file in Storage
    API->>Supabase: Create document record
    API->>User: Return document ID & status
    
    Note over API,OCR: Async Processing Begins
    API->>OCR: Start page extraction
    OCR->>OCR: Extract pages as images
    OCR->>Frontend: Update processing status
    Frontend->>Realtime: Subscribe to document updates
    
    loop For each page
        OCR->>OCR: Run Tesseract.js OCR
        OCR->>API: Send OCR results
        API->>Supabase: Store OCR results
        API->>Realtime: Broadcast progress update
        Realtime->>Frontend: Update UI progress
    end
    
    API->>Supabase: Update document status to 'completed'
    API->>Realtime: Broadcast completion
    Realtime->>Frontend: Show completion notification
    Frontend->>User: Document ready for analysis
```

### Workflow 2: Interactive PDF Reading with Highlighting and Translation

```mermaid
sequenceDiagram
    participant User
    participant PDFViewer as PDF Viewer
    participant HighlightMgr as Highlight Manager
    participant API as API Routes
    participant TranslateAPI as Google Translate
    participant Supabase as Supabase DB

    User->>PDFViewer: Select text in PDF
    PDFViewer->>HighlightMgr: Create highlight with bounding box
    HighlightMgr->>API: POST /documents/{id}/highlights
    API->>Supabase: Store highlight data
    API->>HighlightMgr: Return highlight ID
    
    User->>HighlightMgr: Right-click highlight
    HighlightMgr->>User: Show context menu
    User->>HighlightMgr: Select "Translate"
    
    HighlightMgr->>API: POST /translate
    API->>TranslateAPI: Request translation
    TranslateAPI->>API: Return translation + reading
    API->>HighlightMgr: Return translation result
    
    HighlightMgr->>PDFViewer: Display translation popup
    User->>HighlightMgr: "Add to Vocabulary Bank"
    HighlightMgr->>API: POST /vocabulary
    API->>Supabase: Store vocabulary item
    API->>HighlightMgr: Confirm addition
    
    HighlightMgr->>User: Show success notification
```

### Workflow 3: AI-Powered Vocabulary Analysis

```mermaid
sequenceDiagram
    participant User
    participant AIInterface as AI Analysis UI
    participant API as API Routes
    participant OpenAI as OpenAI API
    participant Supabase as Supabase DB
    participant Realtime as Real-time Updates

    User->>AIInterface: Configure analysis (pages, type, depth)
    AIInterface->>API: POST /ai/analyze
    API->>API: Estimate token usage & cost
    API->>AIInterface: Return cost estimate
    
    AIInterface->>User: Show cost confirmation
    User->>AIInterface: Confirm analysis
    AIInterface->>API: Confirm analysis request
    
    API->>Supabase: Create AI analysis session
    API->>Supabase: Retrieve OCR text for pages
    API->>OpenAI: Send vocabulary analysis request
    API->>Realtime: Broadcast "processing" status
    
    Note over OpenAI: AI Processing (30-60 seconds)
    OpenAI->>API: Return structured vocabulary data
    API->>API: Parse and validate results
    API->>Supabase: Store analysis results
    API->>Supabase: Update token usage
    
    API->>Realtime: Broadcast "completed" status
    Realtime->>AIInterface: Update UI with results
    AIInterface->>User: Display vocabulary suggestions
    
    User->>AIInterface: Review and select items
    AIInterface->>API: POST /vocabulary (bulk)
    API->>Supabase: Store selected vocabulary
    API->>AIInterface: Confirm additions
    
    AIInterface->>User: Show completion summary
```

### Workflow 4: Anki Card Generation and Export

```mermaid
sequenceDiagram
    participant User
    participant CardGen as Card Generator
    participant API as API Routes
    participant Supabase as Supabase DB
    participant AnkiExport as Anki Export Service

    User->>CardGen: Select vocabulary items
    CardGen->>User: Choose card types (vocabulary, reading, context)
    User->>CardGen: Configure card templates
    CardGen->>API: POST /cards/bulk-generate
    
    API->>Supabase: Retrieve vocabulary items
    loop For each vocabulary item
        API->>API: Generate cards based on templates
        API->>Supabase: Store generated cards
    end
    
    API->>CardGen: Return generated cards summary
    CardGen->>User: Show card preview
    
    User->>CardGen: "Export to Anki"
    CardGen->>API: POST /cards/export
    API->>Supabase: Retrieve selected cards
    API->>AnkiExport: Generate .apkg file
    
    AnkiExport->>AnkiExport: Create Anki deck structure
    AnkiExport->>AnkiExport: Add cards with media
    AnkiExport->>AnkiExport: Package as .apkg
    
    AnkiExport->>API: Return file buffer
    API->>CardGen: Stream .apkg file
    CardGen->>User: Download .apkg file
    
    API->>Supabase: Update export timestamps
    CardGen->>User: Show export success
```

### Workflow 5: Error Handling and Fallback Processing

```mermaid
sequenceDiagram
    participant User
    participant Frontend as Frontend
    participant API as API Routes
    participant TesseractOCR as Tesseract.js
    participant GoogleOCR as Google Vision API
    participant ErrorHandler as Error Handler

    User->>Frontend: Upload complex PDF (manga/handwritten)
    Frontend->>API: POST /documents
    API->>TesseractOCR: Start OCR processing
    
    TesseractOCR->>TesseractOCR: Process page
    TesseractOCR->>API: Return low confidence result (<70%)
    
    API->>ErrorHandler: Evaluate OCR quality
    ErrorHandler->>API: Trigger fallback processing
    API->>User: Request approval for Google Vision OCR
    
    alt User approves enhanced OCR
        User->>API: Approve enhanced processing
        API->>GoogleOCR: Send page for processing
        GoogleOCR->>API: Return high-quality OCR
        API->>Frontend: Update with improved results
    else User declines
        API->>Frontend: Provide manual correction interface
        Frontend->>User: Show OCR text for editing
        User->>Frontend: Manually correct text
        Frontend->>API: Submit corrected text
    end
    
    API->>Frontend: Processing completed
    Frontend->>User: Document ready for analysis
    
    Note over ErrorHandler: All errors logged for analysis
```

### Workflow Performance and Error Handling Patterns

**Async Processing Patterns:**
- Long-running operations (OCR, AI analysis) use job queues with status polling
- Real-time updates provide immediate feedback without blocking UI
- Progressive loading shows partial results as they become available
- Background processing continues even if user navigates away

**Error Recovery Strategies:**
- Automatic retry with exponential backoff for transient failures
- Graceful degradation when external services are unavailable
- User-friendly error messages with actionable next steps
- Comprehensive error logging for debugging and monitoring

**Performance Optimizations:**
- Parallel processing for multi-page documents
- Caching at multiple layers (browser, CDN, database)
- Optimistic updates for immediate UI feedback
- Lazy loading for large vocabulary banks and document collections

**Security Considerations:**
- All API calls authenticated with Clerk JWT tokens
- Row-level security ensures users only access their data
- File uploads validated for type, size, and content safety
- External API keys secured in environment variables with rotation

---

**Document Status:** In Progress - Sections 1-8 Complete  
**Next Sections:** Database Schema  
**Stakeholders:** Development Team, Product Owner, Japanese Language Learning Community

---

*This architecture document provides a comprehensive foundation for developing the PDF-to-Anki Japanese Learning Tool from hackathon concept to production application. The stakeholder analysis and risk assessment ensure alignment with user needs while maintaining technical excellence.*
