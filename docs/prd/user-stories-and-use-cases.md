# User Stories and Use Cases

### Primary User Persona
**Name:** Kenji (Japanese Language Learner)  
**Profile:** Intermediate Japanese student, studies 1-2 hours daily, uses textbooks and digital materials, prefers efficient study methods, tech-savvy but values simplicity.

### Epic 1: Document Upload and Processing

**US1.1: Upload PDF Document**
```
As a Japanese language learner,
I want to upload my Japanese textbook PDF files easily,
So that I can digitize my study materials for efficient processing.

Acceptance Criteria:
- I can drag and drop PDF files onto the upload area
- I can select PDF files using a file browser
- I receive immediate feedback on upload progress
- I see a preview of the first page after successful upload
- The system validates that the file is a valid PDF format
```

**US1.2: OCR Text Extraction**
```
As a language learner,
I want the system to automatically extract Japanese text from my PDF pages,
So that I can work with the textual content digitally.

Acceptance Criteria:
- OCR processing starts automatically after upload
- I can see a progress indicator during text extraction
- Extracted text is displayed alongside the original PDF
- I can view extraction results page by page
- The system handles mixed Japanese text (hiragana, katakana, kanji)
```

### Epic 2: Interactive PDF Reading Experience

**US2.1: Text Highlighting and Selection**
```
As a learner reading Japanese texts,
I want to highlight words and phrases directly in the PDF viewer,
So that I can mark content for further study without losing context.

Acceptance Criteria:
- I can select text by clicking and dragging
- Selected text is highlighted with a distinct color
- I can right-click highlighted text to access actions
- Multiple highlights are preserved across sessions
- I can remove highlights by clicking on them
```

**US2.2: Instant Translation**
```
As someone learning Japanese,
I want to get instant translations of highlighted text,
So that I can understand unfamiliar words without interrupting my reading flow.

Acceptance Criteria:
- Right-clicking highlighted text shows "Translate" option
- Translation appears in a clean popup overlay
- Translation includes both meaning and reading (furigana)
- I can dismiss the translation with a click or ESC key
- Translation history is saved for reference
```

**US2.3: Vocabulary Bank Management**
```
As a systematic learner,
I want to save interesting words and phrases to my personal vocabulary bank,
So that I can review them later and track my learning progress.

Acceptance Criteria:
- Right-clicking highlighted text shows "Add to Vocab Bank" option
- Words are automatically categorized by type (noun, verb, adjective)
- I can add personal notes to each vocabulary entry
- I can organize words by difficulty level or topic
- I can search and filter my vocabulary bank
```

### Epic 3: AI-Powered Anki Card Generation

**US3.1: Targeted AI Analysis**
```
As an efficient learner,
I want to specify which pages or sections the AI should analyze,
So that I can control token usage and focus on relevant content.

Acceptance Criteria:
- I can select specific page numbers or ranges
- I can choose between "vocabulary focus" or "phrase focus" modes
- I see an estimated token cost before proceeding
- AI analysis shows progress and completion status
- Results are organized by importance/difficulty
```

**US3.2: Smart Anki Card Creation**
```
As an Anki user,
I want the system to automatically create well-formatted flashcards from analyzed content,
So that I can seamlessly integrate new vocabulary into my existing study routine.

Acceptance Criteria:
- Cards have clear Japanese text on the front
- Back includes reading, meaning, and context sentence
- I can preview cards before downloading
- I can edit card content before finalizing
- Cards export as standard .apkg files compatible with Anki
```

**US3.3: Manual Card Creation**
```
As a learner with specific needs,
I want to manually create Anki cards from highlighted text,
So that I can customize my flashcards exactly as needed.

Acceptance Criteria:
- Right-clicking highlighted text shows "Create Anki Card" option
- I can edit front/back content in a clean form
- I can add tags and difficulty ratings
- I can choose from pre-defined card templates
- Cards are immediately added to my collection
```

### Epic 4: User Account and Progress Management

**US4.1: User Authentication**
```
As a returning user,
I want to securely sign in to access my personal study materials,
So that my progress and documents are saved and synchronized.

Acceptance Criteria:
- I can sign up with email or social authentication (Google/GitHub)
- I can sign in quickly with saved credentials
- My session persists across browser sessions
- I can reset my password if forgotten
- Account creation is simple with minimal required fields
```

**US4.2: Personal Dashboard**
```
As a motivated learner,
I want to see my learning progress and manage my study materials,
So that I can track improvement and stay organized.

Acceptance Criteria:
- Dashboard shows uploaded documents with quick access
- I can see my total vocabulary bank size and recent additions
- Anki card statistics are displayed (total created, by topic)
- I can quickly access recent study sessions
- Progress charts show learning trends over time
```

**US4.3: Document Library Management**
```
As someone with multiple textbooks,
I want to organize and manage my uploaded PDF documents,
So that I can easily find and continue studying specific materials.

Acceptance Criteria:
- Documents are displayed in a clean grid/list view
- I can rename documents with meaningful titles
- I can delete documents I no longer need
- I can see upload date and processing status
- I can search documents by title or content
```

### Epic 5: Mobile and Cross-Device Experience

**US5.1: Mobile Reading Experience**
```
As a learner who studies on-the-go,
I want to access my documents and create cards on my mobile device,
So that I can study effectively regardless of location.

Acceptance Criteria:
- PDF viewer is optimized for touch interaction
- Text selection works smoothly with finger gestures
- Interface adapts to portrait/landscape orientations
- All core features are accessible on mobile
- Performance remains smooth on mobile devices
```

### Use Case Scenarios

**Scenario 1: Daily Study Session**
1. Kenji opens his uploaded "Genki II Chapter 15" PDF
2. He reads through the dialogue section, highlighting unfamiliar words
3. He right-clicks highlighted words to get instant translations
4. Interesting phrases are added to his vocabulary bank with personal notes
5. At the end of the session, he generates Anki cards from the day's highlights
6. Cards are downloaded and imported into his existing Anki deck

**Scenario 2: Intensive Chapter Review**
1. Before an exam, Kenji wants to review an entire textbook chapter
2. He selects pages 45-60 for AI analysis with "comprehensive vocabulary" mode
3. The AI identifies 50 key vocabulary items and 20 important phrases
4. Kenji reviews the AI suggestions, removing items he already knows well
5. He bulk-generates 35 Anki cards from the curated list
6. Cards are organized with chapter-specific tags for easy review

**Scenario 3: Mobile Study During Commute**
1. On the train, Kenji opens the app on his phone
2. He continues reading where he left off on his desktop
3. He highlights a few new words using touch gestures
4. Quick translations help him understand the context
5. New vocabulary is automatically synced to his account
6. Later at home, he'll generate cards from his mobile highlights

---
