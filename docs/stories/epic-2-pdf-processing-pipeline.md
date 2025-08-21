# Epic 2: PDF Processing Pipeline
**Duration:** Days 2-3 of Hackathon  
**Goal:** Implement complete PDF upload, OCR processing, and text correction workflow

## Epic Overview
Build the core PDF processing functionality that allows users to upload Japanese textbook PDFs, extract text using OCR, and provide manual correction capabilities. This epic establishes the foundation for all subsequent vocabulary and card generation features.

## Success Criteria
- ✅ PDF upload functionality working with validation
- ✅ OCR processing extracting Japanese text accurately
- ✅ Manual correction interface functional
- ✅ Text extraction results stored in database
- ✅ Progress tracking and error handling implemented

---

## Story 2.1: PDF Upload and Validation
**Priority:** Critical  
**Estimate:** 3 hours  
**Assignee:** Developer Agent

### User Story
```
As a Japanese language learner,
I want to upload my Japanese textbook PDF files easily,
So that I can digitize my study materials for efficient processing.
```

### Acceptance Criteria
- [ ] Drag and drop PDF upload interface
- [ ] File browser selection option
- [ ] PDF file type validation
- [ ] File size validation (max 50MB)
- [ ] Upload progress indicator
- [ ] Preview of first page after upload
- [ ] File stored in Supabase Storage
- [ ] Document record created in database

### Technical Implementation
```typescript
// components/pdf-upload.tsx
'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText, AlertCircle } from 'lucide-react'

export function PDFUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Validate file
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file')
      return
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      setError('File size must be less than 50MB')
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Upload to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`
      const { data, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file, {
          onUploadProgress: (progress) => {
            setProgress((progress.loaded / progress.total) * 100)
          }
        })

      if (uploadError) throw uploadError

      // Create document record
      const { data: document, error: dbError } = await supabase
        .from('documents')
        .insert({
          title: file.name.replace('.pdf', ''),
          filename: file.name,
          file_path: data.path,
          file_size: file.size,
          total_pages: 0, // Will be updated after processing
          processing_status: 'uploaded'
        })
        .select()
        .single()

      if (dbError) throw dbError

      // Trigger OCR processing
      await fetch('/api/documents/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: document.id })
      })

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: uploading
  })

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400'}
        `}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="space-y-4">
            <div className="animate-spin mx-auto w-8 h-8">
              <Upload className="w-full h-full text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Uploading...</p>
              <Progress value={progress} className="mt-2" />
              <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}%</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <FileText className="mx-auto w-12 h-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? 'Drop your PDF here' : 'Upload Japanese PDF'}
              </p>
              <p className="text-sm text-gray-500">
                Drag and drop or click to select
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Max file size: 50MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
```

### API Implementation
```typescript
// app/api/documents/process/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAuth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { documentId } = await request.json()

    // Get document
    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', userId)
      .single()

    if (error || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Update status to processing
    await supabase
      .from('documents')
      .update({ processing_status: 'ocr_processing' })
      .eq('id', documentId)

    // Trigger background OCR processing
    // This would typically be a queue job in production
    processDocumentOCR(documentId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Process document error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function processDocumentOCR(documentId: string) {
  // Background OCR processing implementation
  // Will be implemented in Story 2.2
}
```

---

## Story 2.2: OCR Text Extraction Engine
**Priority:** Critical  
**Estimate:** 4 hours  
**Assignee:** Developer Agent

### User Story
```
As a language learner,
I want the system to automatically extract Japanese text from my PDF pages,
So that I can work with the textual content digitally.
```

### Acceptance Criteria
- [ ] Tesseract.js configured with Japanese language pack
- [ ] PDF pages converted to images for OCR processing
- [ ] OCR processing with progress tracking
- [ ] Extracted text stored with confidence scores
- [ ] Bounding box data captured for text positioning
- [ ] Error handling for OCR failures
- [ ] Processing status updates in real-time

### Technical Implementation
```typescript
// lib/ocr-engine.ts
import { createWorker, PSM } from 'tesseract.js'
import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export interface OCRResult {
  text: string
  confidence: number
  words: Array<{
    text: string
    confidence: number
    bbox: {
      x0: number
      y0: number
      x1: number
      y1: number
    }
  }>
}

export class OCREngine {
  private worker: Tesseract.Worker | null = null
  private isInitialized = false

  async initialize(onProgress?: (progress: number) => void) {
    if (this.isInitialized) return

    this.worker = await createWorker('jpn', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text' && onProgress) {
          onProgress(m.progress * 100)
        }
      }
    })

    await this.worker.setParameters({
      tessedit_pageseg_mode: PSM.SPARSE_TEXT,
      preserve_interword_spaces: '1',
    })

    this.isInitialized = true
  }

  async processPage(pdfBuffer: ArrayBuffer, pageNumber: number): Promise<OCRResult> {
    if (!this.worker) {
      throw new Error('OCR worker not initialized')
    }

    try {
      // Convert PDF page to image
      const imageData = await this.pdfPageToImage(pdfBuffer, pageNumber)
      
      // Perform OCR
      const { data } = await this.worker.recognize(imageData)
      
      return {
        text: data.text,
        confidence: data.confidence,
        words: data.words.map(word => ({
          text: word.text,
          confidence: word.confidence,
          bbox: word.bbox
        }))
      }
    } catch (error) {
      console.error(`OCR processing failed for page ${pageNumber}:`, error)
      throw error
    }
  }

  private async pdfPageToImage(pdfBuffer: ArrayBuffer, pageNumber: number): Promise<ImageData> {
    const pdf = await pdfjsLib.getDocument({ data: pdfBuffer }).promise
    const page = await pdf.getPage(pageNumber)
    
    const scale = 2.0 // Higher scale for better OCR accuracy
    const viewport = page.getViewport({ scale })
    
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
    canvas.height = viewport.height
    canvas.width = viewport.width
    
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    }
    
    await page.render(renderContext).promise
    
    return context.getImageData(0, 0, canvas.width, canvas.height)
  }

  async terminate() {
    if (this.worker) {
      await this.worker.terminate()
      this.worker = null
      this.isInitialized = false
    }
  }
}
```

### Background Processing Implementation
```typescript
// lib/document-processor.ts
import { supabase } from './supabase'
import { OCREngine } from './ocr-engine'

export async function processDocumentOCR(documentId: string) {
  const ocrEngine = new OCREngine()
  
  try {
    // Get document from database
    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (error || !document) {
      throw new Error('Document not found')
    }

    // Download PDF from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(document.file_path)

    if (downloadError) {
      throw new Error('Failed to download document')
    }

    const pdfBuffer = await fileData.arrayBuffer()
    
    // Initialize OCR engine
    await ocrEngine.initialize((progress) => {
      // Update progress in database
      supabase
        .from('documents')
        .update({ 
          processing_status: `ocr_processing_${Math.round(progress)}%` 
        })
        .eq('id', documentId)
        .then()
    })

    // Get PDF page count
    const pdf = await pdfjsLib.getDocument({ data: pdfBuffer }).promise
    const totalPages = pdf.numPages

    // Update total pages in database
    await supabase
      .from('documents')
      .update({ total_pages: totalPages })
      .eq('id', documentId)

    // Process each page
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      try {
        const ocrResult = await ocrEngine.processPage(pdfBuffer, pageNum)
        
        // Store OCR results
        await supabase
          .from('ocr_results')
          .insert({
            document_id: documentId,
            page_number: pageNum,
            extracted_text: ocrResult.text,
            confidence_score: ocrResult.confidence,
            bounding_boxes: ocrResult.words,
            ocr_engine: 'tesseract',
            processed_at: new Date().toISOString()
          })

        // Update progress
        const progress = (pageNum / totalPages) * 100
        await supabase
          .from('documents')
          .update({ 
            processing_status: `ocr_processing_${Math.round(progress)}%` 
          })
          .eq('id', documentId)

      } catch (pageError) {
        console.error(`Failed to process page ${pageNum}:`, pageError)
        
        // Store error result
        await supabase
          .from('ocr_results')
          .insert({
            document_id: documentId,
            page_number: pageNum,
            extracted_text: '',
            confidence_score: 0,
            bounding_boxes: [],
            ocr_engine: 'tesseract',
            processed_at: new Date().toISOString()
          })
      }
    }

    // Mark document as OCR completed
    await supabase
      .from('documents')
      .update({ 
        processing_status: 'ocr_completed' 
      })
      .eq('id', documentId)

  } catch (error) {
    console.error('Document processing failed:', error)
    
    // Mark document as failed
    await supabase
      .from('documents')
      .update({ 
        processing_status: 'failed' 
      })
      .eq('id', documentId)
  } finally {
    await ocrEngine.terminate()
  }
}
```

---

## Story 2.3: Manual Text Correction Interface
**Priority:** Critical  
**Estimate:** 4 hours  
**Assignee:** Developer Agent

### User Story
```
As a language learner,
I want to manually correct OCR errors in extracted text,
So that I can ensure accuracy before creating vocabulary cards.
```

### Acceptance Criteria
- [ ] Side-by-side view of PDF and extracted text
- [ ] Editable text areas for corrections
- [ ] Page-by-page navigation
- [ ] Save and restore functionality
- [ ] Japanese text input support
- [ ] Confidence score indicators
- [ ] Undo/redo functionality

### Technical Implementation
```typescript
// components/text-correction-interface.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Save, Undo, Redo } from 'lucide-react'

interface OCRResult {
  id: string
  page_number: number
  extracted_text: string
  confidence_score: number
  corrected_text?: string
}

interface TextCorrectionProps {
  documentId: string
}

export function TextCorrectionInterface({ documentId }: TextCorrectionProps) {
  const [ocrResults, setOcrResults] = useState<OCRResult[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [correctedText, setCorrectedText] = useState('')
  const [originalText, setOriginalText] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadOCRResults()
  }, [documentId])

  useEffect(() => {
    if (ocrResults.length > 0) {
      const currentResult = ocrResults.find(r => r.page_number === currentPage)
      if (currentResult) {
        setOriginalText(currentResult.extracted_text)
        setCorrectedText(currentResult.corrected_text || currentResult.extracted_text)
        setConfidence(currentResult.confidence_score)
        
        // Initialize history
        const initialText = currentResult.corrected_text || currentResult.extracted_text
        setHistory([initialText])
        setHistoryIndex(0)
      }
    }
  }, [currentPage, ocrResults])

  const loadOCRResults = async () => {
    try {
      const { data, error } = await supabase
        .from('ocr_results')
        .select('*')
        .eq('document_id', documentId)
        .order('page_number')

      if (error) throw error
      setOcrResults(data || [])
    } catch (error) {
      console.error('Failed to load OCR results:', error)
    }
  }

  const handleTextChange = (newText: string) => {
    setCorrectedText(newText)
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newText)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setCorrectedText(history[historyIndex - 1])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setCorrectedText(history[historyIndex + 1])
    }
  }

  const saveCorrections = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('ocr_results')
        .update({ 
          corrected_text: correctedText,
          updated_at: new Date().toISOString()
        })
        .eq('document_id', documentId)
        .eq('page_number', currentPage)

      if (error) throw error

      // Update local state
      setOcrResults(prev => prev.map(result => 
        result.page_number === currentPage 
          ? { ...result, corrected_text: correctedText }
          : result
      ))

    } catch (error) {
      console.error('Failed to save corrections:', error)
    } finally {
      setSaving(false)
    }
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const totalPages = ocrResults.length
  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  return (
    <div className="flex h-screen">
      {/* PDF Viewer Side */}
      <div className="w-1/2 border-r">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Original PDF - Page {currentPage}</span>
              <Badge className={getConfidenceColor(confidence)}>
                {confidence.toFixed(1)}% confidence
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full overflow-auto">
            {/* PDF viewer would be implemented here */}
            <div className="bg-gray-100 h-full flex items-center justify-center">
              <p className="text-gray-500">PDF Viewer (Page {currentPage})</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Text Correction Side */}
      <div className="w-1/2 flex flex-col">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Text Correction</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUndo}
                  disabled={!canUndo}
                >
                  <Undo className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRedo}
                  disabled={!canRedo}
                >
                  <Redo className="w-4 h-4" />
                </Button>
                <Button
                  onClick={saveCorrections}
                  disabled={saving}
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {/* Original Text (Read-only) */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Original OCR Text:
              </label>
              <Textarea
                value={originalText}
                readOnly
                className="bg-gray-50 text-sm"
                rows={6}
              />
            </div>

            {/* Corrected Text (Editable) */}
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Corrected Text:
              </label>
              <Textarea
                value={correctedText}
                onChange={(e) => handleTextChange(e.target.value)}
                className="h-full text-sm"
                placeholder="Edit the text here..."
                style={{ 
                  fontFamily: 'Noto Sans JP, sans-serif',
                  imeMode: 'active' // Enable IME for Japanese input
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Navigation Controls */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## Story 2.4: Progress Tracking and Error Handling
**Priority:** High  
**Estimate:** 2 hours  
**Assignee:** Developer Agent

### User Story
```
As a user,
I want to see the progress of document processing and understand any errors,
So that I know the status of my uploads and can take appropriate action.
```

### Acceptance Criteria
- [ ] Real-time progress updates during OCR processing
- [ ] Error notifications with actionable messages
- [ ] Processing status indicators
- [ ] Retry functionality for failed operations
- [ ] Processing history and logs

### Technical Implementation
```typescript
// components/processing-status.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react'

interface ProcessingStatusProps {
  documentId: string
}

export function ProcessingStatus({ documentId }: ProcessingStatusProps) {
  const [status, setStatus] = useState<string>('uploaded')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [retrying, setRetrying] = useState(false)

  useEffect(() => {
    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`document_${documentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'documents',
          filter: `id=eq.${documentId}`
        },
        (payload) => {
          const newStatus = payload.new.processing_status
          setStatus(newStatus)
          
          // Extract progress from status if it includes percentage
          const progressMatch = newStatus.match(/(\d+)%/)
          if (progressMatch) {
            setProgress(parseInt(progressMatch[1]))
          } else if (newStatus === 'ocr_completed') {
            setProgress(100)
          }
        }
      )
      .subscribe()

    // Load initial status
    loadStatus()

    return () => {
      subscription.unsubscribe()
    }
  }, [documentId])

  const loadStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('processing_status')
        .eq('id', documentId)
        .single()

      if (error) throw error
      
      if (data) {
        setStatus(data.processing_status)
        
        const progressMatch = data.processing_status.match(/(\d+)%/)
        if (progressMatch) {
          setProgress(parseInt(progressMatch[1]))
        } else if (data.processing_status === 'ocr_completed') {
          setProgress(100)
        }
      }
    } catch (err) {
      setError('Failed to load processing status')
    }
  }

  const retryProcessing = async () => {
    setRetrying(true)
    setError(null)
    
    try {
      const response = await fetch('/api/documents/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId })
      })

      if (!response.ok) {
        throw new Error('Failed to retry processing')
      }

      setStatus('ocr_processing')
      setProgress(0)
    } catch (err) {
      setError('Failed to retry processing')
    } finally {
      setRetrying(false)
    }
  }

  const getStatusInfo = (status: string) => {
    if (status === 'uploaded') {
      return {
        icon: <Clock className="w-4 h-4" />,
        color: 'bg-blue-100 text-blue-800',
        message: 'Queued for processing'
      }
    }
    
    if (status.startsWith('ocr_processing')) {
      return {
        icon: <RefreshCw className="w-4 h-4 animate-spin" />,
        color: 'bg-yellow-100 text-yellow-800',
        message: 'Processing document...'
      }
    }
    
    if (status === 'ocr_completed') {
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        color: 'bg-green-100 text-green-800',
        message: 'Processing completed successfully'
      }
    }
    
    if (status === 'failed') {
      return {
        icon: <AlertCircle className="w-4 h-4" />,
        color: 'bg-red-100 text-red-800',
        message: 'Processing failed'
      }
    }
    
    return {
      icon: <Clock className="w-4 h-4" />,
      color: 'bg-gray-100 text-gray-800',
      message: 'Unknown status'
    }
  }

  const statusInfo = getStatusInfo(status)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Processing Status</span>
          <Badge className={statusInfo.color}>
            {statusInfo.icon}
            <span className="ml-2">{status.replace('_', ' ').toUpperCase()}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">{statusInfo.message}</p>
            {status.startsWith('ocr_processing') && (
              <Progress value={progress} className="w-full" />
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retryProcessing}
                  disabled={retrying}
                >
                  {retrying ? 'Retrying...' : 'Retry'}
                </Button>
              </div>
            </div>
          )}

          {status === 'failed' && (
            <Button
              onClick={retryProcessing}
              disabled={retrying}
              className="w-full"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${retrying ? 'animate-spin' : ''}`} />
              {retrying ? 'Retrying...' : 'Retry Processing'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

---

## Epic 2 Completion Checklist
- [ ] PDF upload functionality working with drag-and-drop
- [ ] File validation and storage in Supabase
- [ ] OCR engine processing Japanese text accurately
- [ ] Manual text correction interface functional
- [ ] Progress tracking and error handling implemented
- [ ] All OCR results stored in database with confidence scores
- [ ] Real-time status updates working
- [ ] Integration tests passing

**Epic 2 Duration:** 13 hours (Days 2-3 of hackathon)  
**Dependencies:** Epic 1 completion  
**Next Epic:** Epic 3 - Anki Card Generation
