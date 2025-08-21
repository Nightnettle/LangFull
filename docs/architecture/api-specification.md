# API Specification

Based on our chosen REST API style and the data models defined above, here's the comprehensive API specification that will power the PDF-to-Anki Japanese Learning Tool.

### REST API Overview

**Base URLs:**
- Production: `https://pdf-anki-app.vercel.app/api`
- Development: `http://localhost:3000/api`

**Authentication:** All endpoints use Clerk JWT tokens via Bearer authentication

**Key Endpoint Categories:**
- **Documents**: Upload, manage, and process PDF files
- **OCR**: Client-side and server-side text extraction
- **Highlights**: Interactive PDF text selection and annotation
- **Translation**: Real-time Japanese-English translation
- **Vocabulary**: Personal vocabulary bank management
- **AI Analysis**: OpenAI-powered vocabulary extraction
- **Anki Cards**: Flashcard generation and export
- **Dashboard**: User statistics and activity tracking

### Core API Endpoints

**Document Management:**
- `GET /documents` - List user documents with pagination and filtering
- `POST /documents` - Upload new PDF with multipart form data
- `GET /documents/{id}` - Get document details and processing status
- `PUT /documents/{id}` - Update document metadata and title
- `DELETE /documents/{id}` - Remove document and associated data

**OCR Processing:**
- `POST /documents/{id}/ocr` - Start OCR processing with page range selection
- `GET /documents/{id}/ocr/results` - Retrieve OCR results with confidence scores

**Interactive Features:**
- `GET /documents/{id}/highlights` - Get user highlights for document pages
- `POST /documents/{id}/highlights` - Create new highlight with bounding box data
- `PUT /highlights/{id}` - Update highlight notes and colors
- `POST /translate` - Translate Japanese text with reading information

**Vocabulary Management:**
- `GET /vocabulary` - Search and filter personal vocabulary bank
- `POST /vocabulary` - Add new vocabulary items manually
- `PUT /vocabulary/{id}` - Update vocabulary definitions and notes

**AI Integration:**
- `POST /ai/analyze` - Start AI analysis session with cost estimation
- `GET /ai/sessions/{id}` - Check analysis status and retrieve results

**Anki Export:**
- `GET /cards` - List generated flashcards with filtering options
- `POST /cards` - Create individual Anki cards manually
- `POST /cards/bulk-generate` - Generate multiple cards from AI results
- `POST /cards/export` - Export cards as .apkg files for Anki import

### API Design Highlights

**Cost-Conscious Design:**
- AI analysis provides token usage estimates before processing
- Caching implemented for translation and vocabulary lookups
- Bulk operations reduce API call overhead

**Real-time Experience:**
- Async processing with status polling for long-running operations
- WebSocket integration via Supabase for live updates
- Progressive OCR results as pages are processed

**Type Safety:**
- Complete OpenAPI 3.0 specification with TypeScript schema generation
- Shared types between frontend and backend prevent API contract issues
- Comprehensive error response formats with detailed validation messages

---
