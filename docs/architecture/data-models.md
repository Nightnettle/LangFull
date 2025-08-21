# Data Models

Based on the PRD requirements, these are the core business entities that will drive both frontend interfaces and backend storage. These TypeScript interfaces will be shared between client and server to ensure type safety across the entire application.

### User

**Purpose:** Represents authenticated users of the application, managed by Clerk but referenced in our database for relationships and user-specific data.

**Key Attributes:**
- id: string (UUID) - Internal database identifier
- clerkUserId: string - Clerk's external user identifier for authentication
- email: string - User's email address
- displayName: string - User's preferred display name
- preferences: UserPreferences - User's learning preferences and settings
- createdAt: Date - Account creation timestamp
- lastActiveAt: Date - Last activity for analytics

#### TypeScript Interface
```typescript
interface User {
  id: string;
  clerkUserId: string;
  email: string;
  displayName?: string;
  preferences: UserPreferences;
  createdAt: Date;
  lastActiveAt: Date;
}

interface UserPreferences {
  defaultDifficultyLevel: 1 | 2 | 3 | 4 | 5;
  preferredTranslationLanguage: 'en' | 'es' | 'fr' | 'de';
  autoGenerateCards: boolean;
  ocrQualityThreshold: number; // 0-100
  aiAnalysisMode: 'vocabulary' | 'phrases' | 'comprehensive';
}
```

#### Relationships
- One-to-many with Documents (user owns multiple documents)
- One-to-many with VocabularyItems (user's personal vocabulary bank)
- One-to-many with AnkiCards (user's generated flashcards)
- One-to-many with Highlights (user's PDF highlights)

### Document

**Purpose:** Represents uploaded PDF documents that users want to process for vocabulary extraction and Anki card generation.

**Key Attributes:**
- id: string (UUID) - Unique document identifier
- userId: string - Owner of the document
- title: string - User-assigned document title
- filename: string - Original uploaded filename
- filePath: string - Supabase Storage path
- fileSize: number - File size in bytes for storage management
- totalPages: number - Number of pages for processing progress
- processingStatus: ProcessingStatus - Current processing state
- uploadedAt: Date - Upload timestamp
- lastProcessedAt: Date - Last OCR/AI processing timestamp

#### TypeScript Interface
```typescript
interface Document {
  id: string;
  userId: string;
  title: string;
  filename: string;
  filePath: string;
  fileSize: number;
  totalPages: number;
  processingStatus: ProcessingStatus;
  metadata: DocumentMetadata;
  uploadedAt: Date;
  lastProcessedAt?: Date;
}

type ProcessingStatus = 
  | 'uploaded'
  | 'ocr_processing' 
  | 'ocr_completed'
  | 'ai_processing'
  | 'completed'
  | 'failed';

interface DocumentMetadata {
  language: 'ja' | 'en' | 'mixed';
  documentType: 'textbook' | 'manga' | 'novel' | 'article' | 'other';
  estimatedDifficulty: 1 | 2 | 3 | 4 | 5;
  tags: string[];
}
```

#### Relationships
- Many-to-one with User (document belongs to user)
- One-to-many with OCRResults (document has OCR results per page)
- One-to-many with Highlights (user highlights within document)
- One-to-many with AIAnalysisSessions (AI processing sessions for document)

### OCRResult

**Purpose:** Stores extracted text and metadata from OCR processing of individual PDF pages, supporting both client-side and server-side OCR.

**Key Attributes:**
- id: string (UUID) - Unique OCR result identifier
- documentId: string - Parent document reference
- pageNumber: number - Page within document (1-based)
- extractedText: string - Raw OCR extracted text
- confidence: number - OCR confidence score (0-100)
- boundingBoxes: TextBoundingBox[] - Coordinate data for text positioning
- ocrEngine: string - Which OCR engine was used ('tesseract' | 'google_vision')
- processedAt: Date - When OCR was performed

#### TypeScript Interface
```typescript
interface OCRResult {
  id: string;
  documentId: string;
  pageNumber: number;
  extractedText: string;
  confidence: number;
  boundingBoxes: TextBoundingBox[];
  ocrEngine: 'tesseract' | 'google_vision' | 'manual';
  processedAt: Date;
}

interface TextBoundingBox {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}
```

#### Relationships
- Many-to-one with Document (OCR result belongs to specific document page)
- One-to-many with Highlights (highlights reference OCR text regions)

### Highlight

**Purpose:** Represents user-selected text regions in PDF documents, supporting the interactive reading and vocabulary building workflow.

**Key Attributes:**
- id: string (UUID) - Unique highlight identifier
- userId: string - User who created the highlight
- documentId: string - Document containing the highlight
- pageNumber: number - Page number within document
- selectedText: string - The highlighted text content
- boundingBox: BoundingBox - Coordinate information for rendering
- color: string - Highlight color for categorization
- note: string - User's personal note about the highlight
- createdAt: Date - When highlight was created

#### TypeScript Interface
```typescript
interface Highlight {
  id: string;
  userId: string;
  documentId: string;
  pageNumber: number;
  selectedText: string;
  boundingBox: BoundingBox;
  color: HighlightColor;
  note?: string;
  translation?: Translation;
  createdAt: Date;
}

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

type HighlightColor = 'yellow' | 'blue' | 'green' | 'red' | 'purple';

interface Translation {
  originalText: string;
  translatedText: string;
  reading?: string; // Furigana for Japanese
  partOfSpeech?: string;
  translatedAt: Date;
}
```

#### Relationships
- Many-to-one with User (highlight belongs to user)
- Many-to-one with Document (highlight exists within document)
- One-to-one with VocabularyItem (highlight can be converted to vocabulary)
- One-to-one with AnkiCard (highlight can be converted to flashcard)

### VocabularyItem

**Purpose:** Represents words and phrases in the user's personal vocabulary bank, supporting spaced repetition and learning progress tracking.

**Key Attributes:**
- id: string (UUID) - Unique vocabulary item identifier
- userId: string - Owner of the vocabulary item
- originalText: string - Japanese text (kanji, hiragana, katakana)
- reading: string - Furigana/pronunciation guide
- meaning: string - English translation/definition
- partOfSpeech: string - Grammatical category
- difficultyLevel: number - User-assigned difficulty (1-5)
- contextSentence: string - Example sentence for context
- sourceDocumentId: string - Original document source (optional)
- notes: string - User's personal notes
- createdAt: Date - When added to vocabulary bank
- lastReviewed: Date - Last study session timestamp

#### TypeScript Interface
```typescript
interface VocabularyItem {
  id: string;
  userId: string;
  originalText: string;
  reading?: string;
  meaning: string;
  partOfSpeech?: PartOfSpeech;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  contextSentence?: string;
  sourceDocumentId?: string;
  notes?: string;
  tags: string[];
  studyStats: StudyStats;
  createdAt: Date;
  lastReviewed?: Date;
}

type PartOfSpeech = 
  | 'noun' | 'verb' | 'adjective' | 'adverb' 
  | 'particle' | 'conjunction' | 'interjection' 
  | 'phrase' | 'expression';

interface StudyStats {
  timesReviewed: number;
  correctAnswers: number;
  lastCorrectAnswer?: Date;
  masteryLevel: 'learning' | 'reviewing' | 'mastered';
}
```

#### Relationships
- Many-to-one with User (vocabulary item belongs to user)
- Many-to-one with Document (optional source document)
- One-to-many with AnkiCards (vocabulary can generate multiple card types)
- Many-to-many with Tags (vocabulary items can have multiple tags)

### AnkiCard

**Purpose:** Represents generated flashcards ready for export to Anki, supporting various card templates and user customization.

**Key Attributes:**
- id: string (UUID) - Unique card identifier
- userId: string - Card owner
- frontText: string - Front side content (usually Japanese)
- backText: string - Back side content (usually English + reading)
- cardType: string - Template type for different study approaches
- tags: string[] - Anki tags for organization
- difficulty: number - Difficulty rating (1-5)
- sourceType: string - How the card was created
- sourceId: string - Reference to source (highlight, vocabulary item)
- createdAt: Date - Card creation timestamp
- exportedAt: Date - When card was exported to .apkg file

#### TypeScript Interface
```typescript
interface AnkiCard {
  id: string;
  userId: string;
  frontText: string;
  backText: string;
  cardType: AnkiCardType;
  tags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  sourceType: 'manual' | 'ai_generated' | 'highlight' | 'vocabulary_item';
  sourceId?: string;
  ankiNoteId?: string; // For tracking exported cards
  createdAt: Date;
  exportedAt?: Date;
}

type AnkiCardType = 
  | 'vocabulary' // Japanese → English + Reading
  | 'reading'    // Kanji → Hiragana
  | 'meaning'    // Japanese → English
  | 'context'    // Sentence → Missing word
  | 'reverse';   // English → Japanese

interface AnkiExport {
  id: string;
  userId: string;
  cardIds: string[];
  filename: string;
  exportFormat: '.apkg' | '.csv' | '.json';
  exportedAt: Date;
  downloadCount: number;
}
```

#### Relationships
- Many-to-one with User (card belongs to user)
- Many-to-one with VocabularyItem (optional source vocabulary)
- Many-to-one with Highlight (optional source highlight)
- Many-to-one with AnkiExport (cards grouped in export batches)

### AIAnalysisSession

**Purpose:** Tracks AI-powered vocabulary and phrase extraction sessions, supporting cost monitoring and result caching.

**Key Attributes:**
- id: string (UUID) - Unique session identifier
- userId: string - User who requested analysis
- documentId: string - Target document for analysis
- pageRange: string - Pages analyzed (e.g., "1-5", "all")
- analysisType: string - Type of analysis performed
- prompt: string - AI prompt used for analysis
- tokenUsage: number - OpenAI tokens consumed
- results: AIAnalysisResult - Structured analysis results
- status: string - Processing status
- createdAt: Date - Session start time
- completedAt: Date - Session completion time

#### TypeScript Interface
```typescript
interface AIAnalysisSession {
  id: string;
  userId: string;
  documentId: string;
  pageRange: string;
  analysisType: 'vocabulary' | 'phrases' | 'comprehensive';
  prompt: string;
  tokenUsage: number;
  results?: AIAnalysisResult;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  errorMessage?: string;
  createdAt: Date;
  completedAt?: Date;
}

interface AIAnalysisResult {
  vocabularyItems: AIVocabularyItem[];
  phrases: AIPhraseItem[];
  grammarPoints: AIGrammarPoint[];
  confidence: number;
  processingNotes: string[];
}

interface AIVocabularyItem {
  text: string;
  reading?: string;
  meaning: string;
  partOfSpeech?: string;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  contextSentence?: string;
  confidence: number;
}

interface AIPhraseItem {
  text: string;
  meaning: string;
  usage: string;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  confidence: number;
}

interface AIGrammarPoint {
  pattern: string;
  explanation: string;
  examples: string[];
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
}
```

#### Relationships
- Many-to-one with User (session belongs to user)
- Many-to-one with Document (session analyzes specific document)
- One-to-many with VocabularyItems (results can be converted to vocabulary)
- One-to-many with AnkiCards (results can generate cards)

---
