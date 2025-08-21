# Requirements

Based on your refined requirements and research findings, here are the comprehensive functional and non-functional requirements:

### Functional Requirements

**FR1:** The system shall accept Japanese textbook PDF files via drag-and-drop or file selection interface

**FR2:** The system shall extract Japanese text from PDF pages using **Tesseract.js with Japanese language pack ('jpn')** - a free, client-side OCR solution that supports Japanese characters effectively

**FR3:** The system shall provide a manual text correction interface allowing users to edit and refine OCR-extracted content

**FR4:** The system shall integrate **OpenAI API** to analyze extracted text and identify meaningful vocabulary and phrases for flashcard generation

**FR5:** The system shall allow users to specify page numbers or page ranges for targeted AI analysis and flashcard generation, providing fine-grained control over content processing

**FR6:** The system shall implement a **PDF viewer with text highlighting capabilities** using **React PDF** ([docs.react-pdf.dev](https://docs.react-pdf.dev/)) that allows users to:
- Highlight text selections in real-time
- Right-click highlighted text for instant translation
- Add highlighted content to vocabulary/phrase banks
- Generate Anki cards directly from highlighted text

**FR7:** The system shall provide **live text translation** functionality using translation APIs (Google Translate API or similar)

**FR8:** The system shall maintain separate **vocabulary and phrase banks** where users can:
- Store extracted words and phrases
- Add personal notes and definitions
- Organize content by difficulty level or topic

**FR9:** The system shall convert processed content into **Anki flashcard format** (.apkg files) with customizable front/back layouts

**FR10:** The system shall provide **user authentication and authorization** using **Clerk** for secure sign-up, sign-in, and session management

**FR11:** The system shall include a **user dashboard** displaying:
- Uploaded documents library
- Generated Anki card collections
- Vocabulary and phrase bank statistics
- Learning progress tracking

### Non-Functional Requirements

**NFR1:** **Technology Stack:**
- **Frontend:** Next.js with **shadcn/ui** components for minimal, clean, and aesthetic design
- **UI Library:** shadcn/ui for professional, accessible components with minimal distraction
- **Database:** **Supabase** (chosen over Neon DB for its comprehensive feature set including authentication, real-time subscriptions, file storage, and built-in APIs)
- **Authentication:** Clerk for seamless user management
- **OCR Processing:** Tesseract.js for cost-effective, client-side text extraction
- **PDF Viewing:** React PDF with built-in highlighting, annotation, and text selection features

**NFR2:** **Performance:** The system shall process PDF pages and generate flashcards within 10 seconds for documents up to 50 pages

**NFR3:** **Scalability:** The system shall support up to 1,000 concurrent users with response times under 3 seconds

**NFR4:** **Usability:** The interface shall be intuitive with minimal learning curve, focusing on distraction-free learning experience

**NFR5:** **Cost Efficiency:** The system shall minimize operational costs by using free OCR (Tesseract.js) and cost-effective cloud services

**NFR6:** **Data Security:** All user data, documents, and learning progress shall be encrypted and securely stored in Supabase

**NFR7:** **Cross-Platform Compatibility:** The web application shall work seamlessly across desktop, tablet, and mobile devices

### Key Technology Decisions Based on Research:

1. **OCR Solution:** Tesseract.js over Google Vision API
   - **Why:** Free, no usage limits, runs client-side, excellent Japanese language support
   - **Trade-off:** Slightly lower accuracy than Google OCR, but acceptable for learning purposes

2. **Database:** Supabase over Neon DB
   - **Why:** More comprehensive feature set, includes authentication, real-time features, file storage
   - **Benefits:** Single platform for database, auth, and file storage needs

3. **PDF Viewer:** React PDF ([docs.react-pdf.dev](https://docs.react-pdf.dev/)) with native highlighting and annotation support
   - **Why:** Advanced React-native PDF viewer built on PDF.js with extensive customization options
   - **Key Features:** Built-in highlighting, text selection, annotation layers, responsive design, customizable toolbar
   - **Benefits:** Perfect for Next.js, supports text highlighting out-of-the-box, mobile-optimized, theme customization
   - **Alternative:** wojtekmaj/react-pdf (simpler but requires custom highlighting implementation)

4. **UI Framework:** shadcn/ui with Next.js
   - **Why:** Modern, accessible, customizable components that create minimal, distraction-free interfaces
   - **Benefits:** Professional appearance, excellent developer experience, TypeScript support

---
