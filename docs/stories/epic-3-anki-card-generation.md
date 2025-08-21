# Epic 3: Anki Card Generation & Export
**Duration:** Days 3-4 of Hackathon  
**Goal:** Implement vocabulary extraction and Anki flashcard generation with export functionality

## Epic Overview
Transform processed OCR text into meaningful vocabulary items and generate high-quality Anki flashcards. This epic includes manual card creation, basic vocabulary extraction, and .apkg file generation for seamless integration with existing Anki workflows.

## Success Criteria
- ✅ Manual Anki card creation from corrected text
- ✅ Basic vocabulary extraction algorithms working
- ✅ Multiple card templates (vocabulary, reading, context)
- ✅ .apkg file generation and download functional
- ✅ Card preview and editing capabilities
- ✅ Anki import compatibility verified

---

## Story 3.1: Manual Card Creation Interface
**Priority:** Critical  
**Estimate:** 3 hours  
**Assignee:** Developer Agent

### User Story
```
As a learner with specific needs,
I want to manually create Anki cards from highlighted text,
So that I can customize my flashcards exactly as needed.
```

### Acceptance Criteria
- [ ] Card creation form with front/back editing
- [ ] Multiple card templates available
- [ ] Tag system for organization
- [ ] Difficulty rating assignment
- [ ] Card preview functionality
- [ ] Save to personal collection
- [ ] Edit existing cards

### Technical Implementation
```typescript
// components/card-creator.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Save, Eye, X } from 'lucide-react'

interface CardCreatorProps {
  selectedText?: string
  documentId?: string
  onClose?: () => void
}

type CardType = 'vocabulary' | 'reading' | 'meaning' | 'context' | 'reverse'

interface CardTemplate {
  type: CardType
  name: string
  description: string
  frontTemplate: string
  backTemplate: string
}

const cardTemplates: CardTemplate[] = [
  {
    type: 'vocabulary',
    name: 'Vocabulary Card',
    description: 'Japanese word → English meaning + reading',
    frontTemplate: '{{Japanese}}',
    backTemplate: '{{Reading}}<br/>{{Meaning}}<br/><small>{{Context}}</small>'
  },
  {
    type: 'reading',
    name: 'Reading Card',
    description: 'Kanji → Hiragana reading',
    frontTemplate: '{{Japanese}}',
    backTemplate: '{{Reading}}'
  },
  {
    type: 'meaning',
    name: 'Meaning Card',
    description: 'Japanese → English meaning only',
    frontTemplate: '{{Japanese}}',
    backTemplate: '{{Meaning}}'
  },
  {
    type: 'context',
    name: 'Context Card',
    description: 'Sentence with missing word',
    frontTemplate: '{{Context_with_blank}}',
    backTemplate: '{{Japanese}} - {{Meaning}}'
  },
  {
    type: 'reverse',
    name: 'Reverse Card',
    description: 'English → Japanese',
    frontTemplate: '{{Meaning}}',
    backTemplate: '{{Japanese}}<br/>{{Reading}}'
  }
]

export function CardCreator({ selectedText = '', documentId, onClose }: CardCreatorProps) {
  const [cardType, setCardType] = useState<CardType>('vocabulary')
  const [japanese, setJapanese] = useState(selectedText)
  const [reading, setReading] = useState('')
  const [meaning, setMeaning] = useState('')
  const [context, setContext] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const currentTemplate = cardTemplates.find(t => t.type === cardType)!

  const generateCardContent = (template: string) => {
    return template
      .replace('{{Japanese}}', japanese)
      .replace('{{Reading}}', reading)
      .replace('{{Meaning}}', meaning)
      .replace('{{Context}}', context)
      .replace('{{Context_with_blank}}', context.replace(japanese, '___'))
  }

  const frontContent = generateCardContent(currentTemplate.frontTemplate)
  const backContent = generateCardContent(currentTemplate.backTemplate)

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const saveCard = async () => {
    if (!japanese.trim() || !meaning.trim()) {
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase
        .from('anki_cards')
        .insert({
          front_text: frontContent,
          back_text: backContent,
          card_type: cardType,
          tags: tags,
          difficulty: difficulty,
          source_type: 'manual',
          source_id: documentId || null,
          created_at: new Date().toISOString()
        })

      if (error) throw error

      // Reset form
      setJapanese('')
      setReading('')
      setMeaning('')
      setContext('')
      setTags([])
      setDifficulty(1)
      
      if (onClose) onClose()

    } catch (error) {
      console.error('Failed to save card:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Create Anki Card</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Preview'}
              </Button>
              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create Card</TabsTrigger>
              <TabsTrigger value="preview" disabled={!showPreview}>Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="space-y-6">
              {/* Card Template Selection */}
              <div>
                <Label htmlFor="template">Card Template</Label>
                <Select value={cardType} onValueChange={(value: CardType) => setCardType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cardTemplates.map((template) => (
                      <SelectItem key={template.type} value={template.type}>
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-gray-500">{template.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Card Content Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="japanese">Japanese Text *</Label>
                  <Input
                    id="japanese"
                    value={japanese}
                    onChange={(e) => setJapanese(e.target.value)}
                    placeholder="漢字、ひらがな、カタカナ"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="reading">Reading (Furigana)</Label>
                  <Input
                    id="reading"
                    value={reading}
                    onChange={(e) => setReading(e.target.value)}
                    placeholder="かんじ"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="meaning">English Meaning *</Label>
                <Input
                  id="meaning"
                  value={meaning}
                  onChange={(e) => setMeaning(e.target.value)}
                  placeholder="English translation or definition"
                  required
                />
              </div>

              <div>
                <Label htmlFor="context">Context Sentence</Label>
                <Textarea
                  id="context"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Example sentence using this word"
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  rows={3}
                />
              </div>

              {/* Tags */}
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={difficulty.toString()} onValueChange={(value) => setDifficulty(parseInt(value) as 1 | 2 | 3 | 4 | 5)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Easy</SelectItem>
                    <SelectItem value="2">2 - Basic</SelectItem>
                    <SelectItem value="3">3 - Medium</SelectItem>
                    <SelectItem value="4">4 - Hard</SelectItem>
                    <SelectItem value="5">5 - Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowPreview(true)}>
                  Preview Card
                </Button>
                <Button 
                  onClick={saveCard} 
                  disabled={saving || !japanese.trim() || !meaning.trim()}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Card'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">Card Preview</h3>
                </div>
                
                {/* Front Side */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center text-blue-600">Front</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="text-center text-xl p-4 min-h-[100px] flex items-center justify-center"
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      dangerouslySetInnerHTML={{ __html: frontContent }}
                    />
                  </CardContent>
                </Card>

                {/* Back Side */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center text-green-600">Back</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="text-center text-lg p-4 min-h-[100px] flex flex-col items-center justify-center"
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      dangerouslySetInnerHTML={{ __html: backContent }}
                    />
                  </CardContent>
                </Card>

                {/* Card Info */}
                <div className="flex justify-center gap-4 text-sm text-gray-600">
                  <span>Type: {currentTemplate.name}</span>
                  <span>Difficulty: {difficulty}</span>
                  {tags.length > 0 && <span>Tags: {tags.join(', ')}</span>}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## Story 3.2: Basic Vocabulary Extraction
**Priority:** Critical  
**Estimate:** 4 hours  
**Assignee:** Developer Agent

### User Story
```
As an efficient learner,
I want the system to automatically identify vocabulary words from processed text,
So that I can quickly create cards without manual text selection.
```

### Acceptance Criteria
- [ ] Japanese text segmentation working
- [ ] Word frequency analysis
- [ ] Basic part-of-speech detection
- [ ] Difficulty estimation algorithm
- [ ] Vocabulary suggestion interface
- [ ] User approval/rejection workflow
- [ ] Batch card generation from approved words

### Technical Implementation
```typescript
// lib/vocabulary-extractor.ts
import { supabase } from './supabase'

export interface VocabularyItem {
  text: string
  reading?: string
  partOfSpeech?: string
  frequency: number
  difficulty: 1 | 2 | 3 | 4 | 5
  context: string[]
  confidence: number
}

export class VocabularyExtractor {
  // Common Japanese particles and function words to filter out
  private readonly commonWords = new Set([
    'は', 'が', 'を', 'に', 'で', 'と', 'から', 'まで', 'より', 'へ',
    'の', 'か', 'も', 'や', 'ね', 'よ', 'な', 'だ', 'である', 'です',
    'ます', 'ました', 'でした', 'ある', 'いる', 'する', 'した', 'して'
  ])

  // Basic kanji difficulty levels based on JLPT
  private readonly kanjiDifficulty: Record<string, number> = {
    // N5 level kanji (easiest)
    '一': 1, '二': 1, '三': 1, '四': 1, '五': 1, '六': 1, '七': 1, '八': 1, '九': 1, '十': 1,
    '人': 1, '日': 1, '本': 1, '中': 1, '大': 1, '小': 1, '上': 1, '下': 1, '左': 1, '右': 1,
    // N4 level kanji
    '会': 2, '社': 2, '学': 2, '生': 2, '先': 2, '年': 2, '月': 2, '今': 2, '時': 2, '間': 2,
    // N3 level kanji (medium)
    '経': 3, '験': 3, '技': 3, '術': 3, '研': 3, '究': 3, '開': 3, '発': 3, '管': 3, '理': 3,
    // N2 level kanji (hard)
    '複': 4, '雑': 4, '困': 4, '難': 4, '解': 4, '決': 4, '効': 4, '果': 4, '影': 4, '響': 4,
    // N1 level kanji (expert)
    '曖': 5, '昧': 5, '憂': 5, '鬱': 5, '頑': 5, '固': 5, '綿': 5, '密': 5, '緻': 5, '密': 5
  }

  async extractVocabulary(text: string, documentId: string): Promise<VocabularyItem[]> {
    // Basic text segmentation (in production, would use proper Japanese tokenizer)
    const words = this.segmentText(text)
    
    // Count word frequencies
    const wordFrequency = this.calculateFrequency(words)
    
    // Filter and score words
    const vocabularyItems: VocabularyItem[] = []
    
    for (const [word, frequency] of wordFrequency) {
      if (this.shouldIncludeWord(word)) {
        const item: VocabularyItem = {
          text: word,
          frequency,
          difficulty: this.estimateDifficulty(word),
          context: this.findContextSentences(word, text),
          confidence: this.calculateConfidence(word, frequency),
          partOfSpeech: this.guessPartOfSpeech(word)
        }
        
        vocabularyItems.push(item)
      }
    }
    
    // Sort by importance (frequency * difficulty * confidence)
    return vocabularyItems.sort((a, b) => {
      const scoreA = a.frequency * a.difficulty * a.confidence
      const scoreB = b.frequency * b.difficulty * b.confidence
      return scoreB - scoreA
    }).slice(0, 50) // Limit to top 50 words
  }

  private segmentText(text: string): string[] {
    // Basic Japanese text segmentation
    // In production, would use proper tokenizer like MeCab or Kuromoji
    const words: string[] = []
    
    // Split by common delimiters
    const sentences = text.split(/[。！？\n]/).filter(s => s.trim())
    
    for (const sentence of sentences) {
      // Extract potential vocabulary words (2-4 characters)
      const matches = sentence.match(/[\u4e00-\u9faf\u3040-\u309f\u30a0-\u30ff]{2,4}/g) || []
      words.push(...matches)
    }
    
    return words
  }

  private calculateFrequency(words: string[]): Map<string, number> {
    const frequency = new Map<string, number>()
    
    for (const word of words) {
      frequency.set(word, (frequency.get(word) || 0) + 1)
    }
    
    return frequency
  }

  private shouldIncludeWord(word: string): boolean {
    // Filter out common words and single characters
    if (word.length < 2 || this.commonWords.has(word)) {
      return false
    }
    
    // Must contain at least one kanji or be a meaningful kana word
    const hasKanji = /[\u4e00-\u9faf]/.test(word)
    const isMeaningfulKana = word.length >= 3 && /^[\u3040-\u309f\u30a0-\u30ff]+$/.test(word)
    
    return hasKanji || isMeaningfulKana
  }

  private estimateDifficulty(word: string): 1 | 2 | 3 | 4 | 5 {
    let totalDifficulty = 0
    let kanjiCount = 0
    
    for (const char of word) {
      if (this.kanjiDifficulty[char]) {
        totalDifficulty += this.kanjiDifficulty[char]
        kanjiCount++
      }
    }
    
    if (kanjiCount === 0) {
      // Pure kana words are usually easier
      return word.length <= 3 ? 1 : 2
    }
    
    const averageDifficulty = totalDifficulty / kanjiCount
    
    if (averageDifficulty <= 1.5) return 1
    if (averageDifficulty <= 2.5) return 2
    if (averageDifficulty <= 3.5) return 3
    if (averageDifficulty <= 4.5) return 4
    return 5
  }

  private findContextSentences(word: string, text: string): string[] {
    const sentences = text.split(/[。！？]/).filter(s => s.trim())
    const contexts: string[] = []
    
    for (const sentence of sentences) {
      if (sentence.includes(word) && sentence.trim().length > word.length) {
        contexts.push(sentence.trim())
        if (contexts.length >= 3) break // Limit to 3 context sentences
      }
    }
    
    return contexts
  }

  private calculateConfidence(word: string, frequency: number): number {
    // Higher confidence for words with kanji and reasonable frequency
    let confidence = 0.5
    
    // Boost confidence for words with kanji
    if (/[\u4e00-\u9faf]/.test(word)) {
      confidence += 0.3
    }
    
    // Boost confidence for reasonable frequency (not too rare, not too common)
    if (frequency >= 2 && frequency <= 10) {
      confidence += 0.2
    }
    
    // Boost confidence for reasonable length
    if (word.length >= 2 && word.length <= 4) {
      confidence += 0.1
    }
    
    return Math.min(1.0, confidence)
  }

  private guessPartOfSpeech(word: string): string {
    // Basic part-of-speech guessing based on endings
    // In production, would use proper morphological analyzer
    
    if (word.endsWith('する')) return 'verb'
    if (word.endsWith('い') && word.length > 2) return 'adjective'
    if (word.endsWith('的')) return 'adjective'
    if (word.endsWith('性') || word.endsWith('者') || word.endsWith('物')) return 'noun'
    
    // Default to noun for most vocabulary
    return 'noun'
  }
}
```

### Vocabulary Suggestion Interface
```typescript
// components/vocabulary-suggestions.tsx
'use client'

import { useState, useEffect } from 'react'
import { VocabularyExtractor, VocabularyItem } from '@/lib/vocabulary-extractor'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Sparkles, Check, X, Plus } from 'lucide-react'

interface VocabularySuggestionsProps {
  documentId: string
}

export function VocabularySuggestions({ documentId }: VocabularySuggestionsProps) {
  const [suggestions, setSuggestions] = useState<VocabularyItem[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [processing, setProcessing] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    extractVocabulary()
  }, [documentId])

  const extractVocabulary = async () => {
    setProcessing(true)
    try {
      // Get all OCR results for the document
      const { data: ocrResults, error } = await supabase
        .from('ocr_results')
        .select('extracted_text, corrected_text')
        .eq('document_id', documentId)

      if (error) throw error

      // Combine all text
      const allText = ocrResults
        .map(result => result.corrected_text || result.extracted_text)
        .join('\n')

      // Extract vocabulary
      const extractor = new VocabularyExtractor()
      const items = await extractor.extractVocabulary(allText, documentId)
      
      setSuggestions(items)
    } catch (error) {
      console.error('Failed to extract vocabulary:', error)
    } finally {
      setProcessing(false)
    }
  }

  const toggleSelection = (word: string) => {
    const newSelection = new Set(selectedItems)
    if (newSelection.has(word)) {
      newSelection.delete(word)
    } else {
      newSelection.add(word)
    }
    setSelectedItems(newSelection)
  }

  const selectAll = () => {
    setSelectedItems(new Set(suggestions.map(item => item.text)))
  }

  const clearSelection = () => {
    setSelectedItems(new Set())
  }

  const generateCards = async () => {
    if (selectedItems.size === 0) return

    setGenerating(true)
    try {
      const selectedSuggestions = suggestions.filter(item => 
        selectedItems.has(item.text)
      )

      // Create vocabulary items and cards
      for (const suggestion of selectedSuggestions) {
        // Create vocabulary item
        const { data: vocabItem, error: vocabError } = await supabase
          .from('vocabulary_items')
          .insert({
            original_text: suggestion.text,
            reading: suggestion.reading || '',
            meaning: '', // Will need translation
            part_of_speech: suggestion.partOfSpeech,
            difficulty_level: suggestion.difficulty,
            context_sentence: suggestion.context[0] || '',
            source_document_id: documentId,
            tags: ['auto-generated']
          })
          .select()
          .single()

        if (vocabError) {
          console.error('Failed to create vocabulary item:', vocabError)
          continue
        }

        // Create Anki card
        await supabase
          .from('anki_cards')
          .insert({
            front_text: suggestion.text,
            back_text: `${suggestion.reading || ''}<br/>[Translation needed]<br/><small>${suggestion.context[0] || ''}</small>`,
            card_type: 'vocabulary',
            tags: ['auto-generated', `difficulty-${suggestion.difficulty}`],
            difficulty: suggestion.difficulty,
            source_type: 'vocabulary_item',
            source_id: vocabItem.id
          })
      }

      // Clear selections
      setSelectedItems(new Set())
      
    } catch (error) {
      console.error('Failed to generate cards:', error)
    } finally {
      setGenerating(false)
    }
  }

  const getDifficultyColor = (level: number) => {
    const colors = ['green', 'blue', 'yellow', 'orange', 'red']
    return colors[level - 1] || 'gray'
  }

  if (processing) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Sparkles className="w-8 h-8 mx-auto mb-4 animate-pulse text-blue-500" />
            <p className="text-lg font-medium">Extracting vocabulary...</p>
            <p className="text-sm text-gray-600 mt-2">Analyzing Japanese text for learning opportunities</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            Vocabulary Suggestions ({suggestions.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={selectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={clearSelection}>
              Clear
            </Button>
            <Button 
              onClick={generateCards}
              disabled={selectedItems.size === 0 || generating}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Generate Cards ({selectedItems.size})
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 max-h-96 overflow-y-auto">
          {suggestions.map((item, index) => (
            <div
              key={`${item.text}-${index}`}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                selectedItems.has(item.text) ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
              }`}
            >
              <Checkbox
                checked={selectedItems.has(item.text)}
                onCheckedChange={() => toggleSelection(item.text)}
              />
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span 
                    className="font-medium text-lg"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    {item.text}
                  </span>
                  {item.reading && (
                    <span 
                      className="text-sm text-gray-600"
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      ({item.reading})
                    </span>
                  )}
                  <Badge variant="outline" className={`text-${getDifficultyColor(item.difficulty)}-600`}>
                    Level {item.difficulty}
                  </Badge>
                  {item.partOfSpeech && (
                    <Badge variant="secondary" className="text-xs">
                      {item.partOfSpeech}
                    </Badge>
                  )}
                </div>
                
                {item.context.length > 0 && (
                  <p 
                    className="text-sm text-gray-600 truncate"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    {item.context[0]}
                  </p>
                )}
                
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">
                    Frequency: {item.frequency}
                  </span>
                  <span className="text-xs text-gray-500">
                    Confidence: {Math.round(item.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {suggestions.length === 0 && !processing && (
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No vocabulary suggestions found.</p>
            <p className="text-sm">Make sure your document has been processed.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

---

## Story 3.3: Anki Export System
**Priority:** Critical  
**Estimate:** 4 hours  
**Assignee:** Developer Agent

### User Story
```
As an Anki user,
I want to export my generated cards as .apkg files,
So that I can import them into my existing Anki collection.
```

### Acceptance Criteria
- [ ] .apkg file generation working
- [ ] Multiple export formats (individual cards, bulk export)
- [ ] Deck metadata configuration
- [ ] File download functionality
- [ ] Anki import compatibility verified
- [ ] Export history tracking

### Technical Implementation
```typescript
// lib/anki-exporter.ts
import JSZip from 'jszip'
import { supabase } from './supabase'

export interface AnkiCard {
  id: string
  front_text: string
  back_text: string
  card_type: string
  tags: string[]
  difficulty: number
  created_at: string
}

export interface AnkiDeck {
  name: string
  description: string
  cards: AnkiCard[]
}

export class AnkiExporter {
  async exportDeck(deckName: string, cardIds: string[]): Promise<Blob> {
    // Get cards from database
    const { data: cards, error } = await supabase
      .from('anki_cards')
      .select('*')
      .in('id', cardIds)

    if (error) throw error

    // Generate Anki package
    return this.generateApkgFile(deckName, cards || [])
  }

  private async generateApkgFile(deckName: string, cards: AnkiCard[]): Promise<Blob> {
    const zip = new JSZip()
    
    // Generate collection data
    const collection = this.generateCollection()
    const db = this.generateDatabase(deckName, cards)
    
    // Add files to zip
    zip.file('collection.anki2', db)
    zip.file('media', '{}') // Empty media file for basic export
    
    // Generate zip file
    return await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    })
  }

  private generateCollection(): string {
    // Anki collection metadata
    const collection = {
      id: Date.now(),
      crt: Math.floor(Date.now() / 1000),
      mod: Math.floor(Date.now() / 1000),
      scm: Math.floor(Date.now() / 1000),
      ver: 11,
      dty: 0,
      usn: 0,
      ls: 0,
      conf: {
        nextPos: 1,
        estTimes: true,
        activeDecks: [1],
        sortType: "noteFld",
        timeLim: 0,
        sortBackwards: false,
        addToCur: true,
        curDeck: 1,
        newBury: true,
        newSpread: 0,
        dueCounts: true,
        curModel: Date.now(),
        collapseTime: 1200
      },
      models: this.generateModels(),
      decks: this.generateDecks(),
      dconf: this.generateDeckConfig(),
      tags: {}
    }
    
    return JSON.stringify(collection)
  }

  private generateDatabase(deckName: string, cards: AnkiCard[]): ArrayBuffer {
    // This is a simplified version. In production, would use proper SQLite generation
    // For now, we'll create a basic SQLite database structure
    
    const sqlite = this.createSQLiteDatabase()
    
    // Insert deck
    const deckId = Date.now()
    sqlite.exec(`INSERT INTO col VALUES (
      ${deckId}, 
      ${Math.floor(Date.now() / 1000)}, 
      ${Math.floor(Date.now() / 1000)}, 
      ${Math.floor(Date.now() / 1000)}, 
      11, 0, 0, 0, 
      '${JSON.stringify(this.generateCollection())}'
    )`)
    
    // Insert notes and cards
    cards.forEach((card, index) => {
      const noteId = Date.now() + index
      const cardId = noteId + 1000000
      
      // Insert note
      sqlite.exec(`INSERT INTO notes VALUES (
        ${noteId},
        '${this.generateGuid()}',
        ${Date.now()},
        ${Math.floor(Date.now() / 1000)},
        -1,
        '${card.tags.join(' ')}',
        '${this.escapeSQL(card.front_text)}',
        '${this.escapeSQL(card.back_text)}',
        '',
        0,
        ''
      )`)
      
      // Insert card
      sqlite.exec(`INSERT INTO cards VALUES (
        ${cardId},
        ${noteId},
        ${deckId},
        0,
        ${Math.floor(Date.now() / 1000)},
        -1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        ''
      )`)
    })
    
    return sqlite.export()
  }

  private createSQLiteDatabase(): any {
    // This would use sql.js or similar SQLite library
    // Simplified implementation for demonstration
    const SQL = require('sql.js')
    const db = new SQL.Database()
    
    // Create Anki database schema
    db.exec(`
      CREATE TABLE col (
        id integer primary key,
        crt integer not null,
        mod integer not null,
        scm integer not null,
        ver integer not null,
        dty integer not null,
        usn integer not null,
        ls integer not null,
        conf text not null
      );
      
      CREATE TABLE notes (
        id integer primary key,
        guid text not null,
        mid integer not null,
        mod integer not null,
        usn integer not null,
        tags text not null,
        flds text not null,
        sfld text not null,
        csum integer not null,
        flags integer not null,
        data text not null
      );
      
      CREATE TABLE cards (
        id integer primary key,
        nid integer not null,
        did integer not null,
        ord integer not null,
        mod integer not null,
        usn integer not null,
        type integer not null,
        queue integer not null,
        due integer not null,
        ivl integer not null,
        factor integer not null,
        reps integer not null,
        lapses integer not null,
        left integer not null,
        odue integer not null,
        odid integer not null,
        flags integer not null,
        data text not null
      );
    `)
    
    return db
  }

  private generateModels(): Record<string, any> {
    const modelId = Date.now()
    return {
      [modelId]: {
        id: modelId,
        name: "Japanese Vocabulary",
        type: 0,
        mod: Math.floor(Date.now() / 1000),
        usn: 0,
        sortf: 0,
        did: 1,
        tmpls: [
          {
            name: "Card 1",
            ord: 0,
            qfmt: "{{Front}}",
            afmt: "{{FrontSide}}<hr id=answer>{{Back}}",
            bqfmt: "",
            bafmt: "",
            did: null,
            bfont: "",
            bsize: 0
          }
        ],
        flds: [
          {
            name: "Front",
            ord: 0,
            sticky: false,
            rtl: false,
            font: "Arial",
            size: 20,
            media: []
          },
          {
            name: "Back",
            ord: 1,
            sticky: false,
            rtl: false,
            font: "Arial",
            size: 20,
            media: []
          }
        ],
        css: ".card { font-family: 'Noto Sans JP', arial; font-size: 20px; text-align: center; color: black; background-color: white; }"
      }
    }
  }

  private generateDecks(): Record<string, any> {
    return {
      "1": {
        id: 1,
        name: "Default",
        extendRev: 50,
        usn: 0,
        collapsed: false,
        newToday: [0, 0],
        revToday: [0, 0],
        lrnToday: [0, 0],
        timeToday: [0, 0],
        conf: 1,
        desc: "",
        dyn: 0,
        extendNew: 10
      }
    }
  }

  private generateDeckConfig(): Record<string, any> {
    return {
      "1": {
        id: 1,
        name: "Default",
        replayq: true,
        lapse: {
          delays: [10],
          mult: 0,
          minInt: 1,
          leechFails: 8,
          leechAction: 0
        },
        rev: {
          perDay: 100,
          ease4: 1.3,
          fuzz: 0.05,
          minSpace: 1,
          ivlFct: 1,
          maxIvl: 36500,
          bury: true,
          hardFactor: 1.2
        },
        timer: 0,
        maxTaken: 60,
        usn: 0,
        new: {
          delays: [1, 10],
          ints: [1, 4, 7],
          initialFactor: 2500,
          separate: true,
          perDay: 20,
          bury: true,
          order: 1
        },
        mod: 0,
        autoplay: true
      }
    }
  }

  private generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  private escapeSQL(text: string): string {
    return text.replace(/'/g, "''")
  }
}
```

### Export Interface Component
```typescript
// components/anki-export.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { AnkiExporter } from '@/lib/anki-exporter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Download, Package, FileText } from 'lucide-react'

interface AnkiCard {
  id: string
  front_text: string
  back_text: string
  card_type: string
  tags: string[]
  difficulty: number
  created_at: string
}

export function AnkiExport() {
  const [cards, setCards] = useState<AnkiCard[]>([])
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set())
  const [deckName, setDeckName] = useState('Japanese Vocabulary')
  const [exporting, setExporting] = useState(false)
  const [exportHistory, setExportHistory] = useState<any[]>([])

  useEffect(() => {
    loadCards()
    loadExportHistory()
  }, [])

  const loadCards = async () => {
    try {
      const { data, error } = await supabase
        .from('anki_cards')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCards(data || [])
    } catch (error) {
      console.error('Failed to load cards:', error)
    }
  }

  const loadExportHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('anki_exports')
        .select('*')
        .order('exported_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setExportHistory(data || [])
    } catch (error) {
      console.error('Failed to load export history:', error)
    }
  }

  const toggleCardSelection = (cardId: string) => {
    const newSelection = new Set(selectedCards)
    if (newSelection.has(cardId)) {
      newSelection.delete(cardId)
    } else {
      newSelection.add(cardId)
    }
    setSelectedCards(newSelection)
  }

  const selectAll = () => {
    setSelectedCards(new Set(cards.map(card => card.id)))
  }

  const clearSelection = () => {
    setSelectedCards(new Set())
  }

  const exportDeck = async () => {
    if (selectedCards.size === 0) return

    setExporting(true)
    try {
      const exporter = new AnkiExporter()
      const apkgBlob = await exporter.exportDeck(deckName, Array.from(selectedCards))
      
      // Create download link
      const url = URL.createObjectURL(apkgBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${deckName.replace(/[^a-zA-Z0-9]/g, '_')}.apkg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Record export in database
      await supabase
        .from('anki_exports')
        .insert({
          filename: `${deckName}.apkg`,
          card_ids: Array.from(selectedCards),
          export_format: '.apkg',
          exported_at: new Date().toISOString()
        })

      // Update export timestamps for cards
      await supabase
        .from('anki_cards')
        .update({ exported_at: new Date().toISOString() })
        .in('id', Array.from(selectedCards))

      // Refresh data
      loadCards()
      loadExportHistory()
      setSelectedCards(new Set())

    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Export Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Export Anki Deck
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="deckName">Deck Name</Label>
              <Input
                id="deckName"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                placeholder="Enter deck name..."
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAll}>
                  Select All ({cards.length})
                </Button>
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Clear Selection
                </Button>
              </div>

              <Button
                onClick={exportDeck}
                disabled={selectedCards.size === 0 || exporting}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {exporting ? 'Exporting...' : `Export ${selectedCards.size} Cards`}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Cards to Export</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                  selectedCards.has(card.id) ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                }`}
              >
                <Checkbox
                  checked={selectedCards.has(card.id)}
                  onCheckedChange={() => toggleCardSelection(card.id)}
                  className="mt-1"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{card.card_type}</Badge>
                    <Badge variant="secondary">Level {card.difficulty}</Badge>
                    {card.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">Front:</p>
                      <div 
                        className="p-2 bg-gray-50 rounded text-center"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        dangerouslySetInnerHTML={{ __html: card.front_text }}
                      />
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Back:</p>
                      <div 
                        className="p-2 bg-gray-50 rounded text-center"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        dangerouslySetInnerHTML={{ __html: card.back_text }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {cards.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No cards available for export.</p>
                <p className="text-sm">Create some cards first to export them.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Export History */}
      {exportHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Exports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {exportHistory.map((export_record) => (
                <div key={export_record.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{export_record.filename}</p>
                    <p className="text-sm text-gray-600">
                      {export_record.card_ids.length} cards • {new Date(export_record.exported_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">{export_record.export_format}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

---

## Epic 3 Completion Checklist
- [ ] Manual card creation interface functional with templates
- [ ] Basic vocabulary extraction working with Japanese text
- [ ] Anki .apkg export system generating compatible files
- [ ] Card preview and editing capabilities implemented
- [ ] Tag system and difficulty ratings working
- [ ] Export history tracking functional
- [ ] Integration with Anki verified through testing

**Epic 3 Duration:** 11 hours (Days 3-4 of hackathon)  
**Dependencies:** Epic 2 completion (OCR text available)  
**Next Epic:** Epic 4 - Demo Preparation & Polish
