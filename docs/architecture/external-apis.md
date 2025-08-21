# External APIs

The PDF-to-Anki Japanese Learning Tool integrates with several external APIs to provide AI-powered vocabulary extraction, translation services, and enhanced OCR capabilities.

### OpenAI API Integration

**Purpose:** AI-powered Japanese vocabulary and phrase extraction with contextual understanding and difficulty assessment

**Documentation:** https://platform.openai.com/docs/api-reference  
**Base URL:** https://api.openai.com/v1  
**Authentication:** Bearer token authentication with API key  
**Rate Limits:** 10,000 requests per minute (Tier 4), 30,000 tokens per minute

**Key Endpoints Used:**
- `POST /chat/completions` - GPT-4 chat completions for vocabulary analysis
- `GET /models` - Available model information and capabilities
- `GET /usage` - Token usage tracking for cost monitoring

**Cost Management Strategy:**
- Token usage estimation before processing with user confirmation
- Response caching for similar text segments (24-hour TTL)
- Prompt optimization to minimize token consumption
- User-configurable analysis depth settings (vocabulary, phrases, comprehensive)
- Monthly usage caps with proactive user notifications

**Integration Notes:** Implements exponential backoff for rate limiting, structured JSON responses for consistent parsing, and comprehensive error handling with fallback to cached results when available.

### Google Translate API Integration

**Purpose:** Real-time Japanese-English translation with contextual understanding for vocabulary learning

**Documentation:** https://cloud.google.com/translate/docs/reference/rest  
**Base URL:** https://translation.googleapis.com/language/translate/v2  
**Authentication:** Google Cloud service account credentials  
**Rate Limits:** 1,000 requests per 100 seconds per user

**Key Endpoints Used:**
- `POST /translate` - Text translation with automatic language detection
- `GET /languages` - Supported language pairs and capabilities
- `GET /detect` - Language detection for mixed Japanese-English content

**Integration Notes:** Includes Redis caching for frequently translated terms, batch processing for multiple vocabulary items, and integration with Japanese reading extraction for complete language learning context.

### Google Cloud Vision API (OCR Fallback)

**Purpose:** Server-side OCR processing for complex PDF layouts when client-side Tesseract.js confidence falls below threshold

**Documentation:** https://cloud.google.com/vision/docs/reference/rest  
**Base URL:** https://vision.googleapis.com/v1  
**Authentication:** Google Cloud service account credentials  
**Rate Limits:** 1,800 requests per minute

**Key Endpoints Used:**
- `POST /images:annotate` - Text detection and OCR with Japanese language optimization
- `POST /files:annotate` - Batch processing for multi-page documents

**Integration Notes:** Automatically triggered when Tesseract.js confidence < 70%, includes cost estimation with user approval, and provides superior accuracy for complex layouts like manga or handwritten text.

### Clerk Authentication API

**Purpose:** Comprehensive user authentication, session management, and profile synchronization

**Documentation:** https://clerk.com/docs/reference  
**Base URL:** https://api.clerk.com/v1  
**Authentication:** Clerk secret key for server-side operations  
**Rate Limits:** 10,000 requests per minute per application

**Key Integration Points:**
- Webhook endpoints for user lifecycle events (create, update, delete)
- JWT token validation middleware for API security
- User metadata synchronization with Supabase user profiles
- Social login provider management (Google, GitHub, Apple)

**Integration Notes:** Implements secure webhook validation, automatic user profile creation in Supabase, and seamless session management across client and server components.

### Supabase Real-time API

**Purpose:** Live updates for document processing status, collaborative features, and real-time UI synchronization

**Documentation:** https://supabase.com/docs/guides/realtime  
**Base URL:** wss://[project-ref].supabase.co/realtime/v1  
**Authentication:** JWT token from Supabase Auth  
**Connection Limits:** 500 concurrent connections per project

**Key Real-time Channels:**
- Document processing status updates
- OCR progress notifications
- Vocabulary bank synchronization
- Anki card generation status
- User activity and collaboration features

**Integration Notes:** Implements connection pooling, automatic reconnection with exponential backoff, and efficient subscription management to minimize connection overhead.

### External API Security and Resilience

**Security Measures:**
- API keys stored in environment variables with automatic rotation
- Request signing and validation for webhook endpoints
- Rate limiting and abuse detection across all external services
- Comprehensive audit logging for all external API interactions

**Resilience Patterns:**
- Circuit breaker pattern for service unavailability
- Exponential backoff with jitter for transient failures
- Graceful degradation when external services are down
- Comprehensive health checks and service status monitoring

**Cost Control:**
- Real-time usage tracking with budget alerts
- Automatic service throttling when approaching limits
- Cost attribution by user and feature for optimization
- Monthly usage reports and cost optimization recommendations

---
