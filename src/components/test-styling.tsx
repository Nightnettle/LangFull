export function TestStyling() {
  return (
    <div className="p-4 bg-card border border-border rounded-lg">
      <h2 className="text-xl font-bold text-foreground mb-2">Styling Test</h2>
      <p className="text-muted-foreground">
        This component tests if our Tailwind CSS styling is working correctly.
      </p>
      <div className="mt-4 flex gap-2">
        <div className="w-4 h-4 bg-primary rounded"></div>
        <div className="w-4 h-4 bg-secondary rounded"></div>
        <div className="w-4 h-4 bg-accent rounded"></div>
      </div>
    </div>
  )
}
