import { ShineBorder } from "@/components/magicui/shine-border"
import { BorderTrail } from "@/components/ui/border-trail"
import { Button } from "@/components/ui/button"
import { ClickSpark } from "@/components/ui/click-spark"
import { TextEffect } from "@/components/ui/text-effect"

export default function Home() {
  return (
    <div className="min-h-screen w-full relative bg-[#020617]">
      {/* Emerald Depths Background with Top Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle 500px at 50% 300px, rgba(16,185,129,0.35), transparent)`,
        }}
      />
      
      {/* Your Content/Components */}
      <ClickSpark className="min-h-screen relative z-10">
      {/* Navigation Header */}
      <header className="w-full bg-card/30 backdrop-blur-sm border-b border-border/20">
        <div className="px-4 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-2xl font-bold text-primary">
            LangFull
          </div>
          <div className="flex items-center gap-4">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Learn Now
            </Button>
            <Button variant="ghost" className="text-muted-foreground">
              Login
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <TextEffect 
            preset="fade-in-blur" 
            speedReveal={1.1} 
            speedSegment={0.3}
            as="h1"
            className="text-5xl md:text-6xl font-bold mb-6 text-foreground leading-tight"
          >
            Transform textbooks into interactive language learning experiences
          </TextEffect>
          <TextEffect 
            preset="fade-in-blur" 
            speedReveal={0.8} 
            speedSegment={0.4}
            delay={0.3}
            as="p"
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            Language Learning with textbooks. Upload your documents, extract vocabulary with AI-powered OCR, and generate Anki flashcards for effective spaced repetition learning.
          </TextEffect>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg">
            Get Started
          </Button>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* PDF Upload */}
            <div className="relative bg-card rounded-lg p-8 text-center shadow-sm border border-border overflow-hidden">
              {/* <BorderTrail 
                className="bg-primary/30"
                size={40}
                transition={{ duration: 8, ease: "linear", repeat: Infinity }}
              /> */}
              <ShineBorder shineColor={["#064e3b", "#10b981", "#a7f3d0"]} />
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">PDF Upload</h3>
              <p className="text-muted-foreground">
                Upload your PDF documents and start learning languages interactively.
              </p>
            </div>

            {/* OCR Processing */}
            <div className="relative bg-card rounded-lg p-8 text-center shadow-sm border border-border overflow-hidden">
              {/* <BorderTrail 
                className="bg-secondary/30"
                size={40}
                transition={{ duration: 10, ease: "linear", repeat: Infinity }}
              /> */}
              <ShineBorder shineColor={["#064e3b", "#10b981", "#a7f3d0"]} />
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">OCR Processing</h3>
              <p className="text-muted-foreground">
                Extract text from your PDFs using advanced OCR technology.
              </p>
            </div>

            {/* Vocabulary Bank */}
            <div className="relative bg-card rounded-lg p-8 text-center shadow-sm border border-border overflow-hidden">
              {/* <BorderTrail 
                className="bg-accent/40"
                size={40}
                transition={{ duration: 12, ease: "linear", repeat: Infinity }}
              /> */}
              <ShineBorder shineColor={["#064e3b", "#10b981", "#a7f3d0"]} />
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Vocabulary Bank</h3>
              <p className="text-muted-foreground">
                Build your personal vocabulary bank with AI-powered translations.
              </p>
            </div>

            {/* Anki Cards */}
            <div className="relative bg-card rounded-lg p-8 text-center shadow-sm border border-border overflow-hidden">
              {/* <BorderTrail 
                className="bg-primary/20"
                size={40}
                transition={{ duration: 6, ease: "linear", repeat: Infinity }}
              /> */}
              <ShineBorder shineColor={["#064e3b", "#10b981", "#a7f3d0"]} />
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Anki Cards</h3>
              <p className="text-muted-foreground">
                Generate Anki flashcards for spaced repetition learning.
              </p>
            </div>
          </div>
        </div>
      </main>
      </ClickSpark>
    </div>
  )
}
