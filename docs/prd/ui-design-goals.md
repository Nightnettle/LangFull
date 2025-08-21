# UI Design Goals

Based on your emphasis on creating a **minimal, clean, and aesthetic interface** that minimizes distractions during learning, here are the core UI design principles:

### Primary Design Philosophy
**"Distraction-Free Learning First"** - Every interface element should either directly support the learning process or be elegantly hidden until needed.

### Core Design Goals

**DG1: Minimal Visual Hierarchy**
- Clean, spacious layouts with generous white space
- Maximum of 2-3 primary actions visible per screen
- Essential functions prominently displayed, secondary functions accessible via contextual menus
- Consistent use of shadcn/ui components for professional, cohesive appearance

**DG2: Focus-Driven Interface**
- **Reading Mode:** PDF viewer occupies 70-80% of screen real estate during document interaction
- **Distraction Elimination:** No unnecessary animations, pop-ups, or visual noise during study sessions
- **Context-Sensitive Tools:** Highlighting, translation, and card creation tools appear only when text is selected

**DG3: Intuitive Interaction Patterns**
- **Right-click context menus** for highlighted text with clear options: "Translate," "Add to Vocab Bank," "Create Anki Card"
- **Progressive disclosure:** Advanced features hidden behind clean, accessible icons
- **Keyboard shortcuts** for power users (Ctrl+H for highlight, Ctrl+T for translate)

**DG4: Responsive Learning Environment**
- **Adaptive layout:** Seamlessly transitions between desktop (dual-pane: PDF + tools) and mobile (stacked layout)
- **Touch-friendly:** Minimum 44px touch targets for mobile highlighting and selection
- **Cross-device consistency:** Identical functionality across all screen sizes

**DG5: Visual Learning Support**
- **Smart highlighting system:** Different colors for vocabulary (blue), phrases (green), completed items (gray)
- **Progress indicators:** Subtle visual cues showing learning progress without being distracting
- **Typography hierarchy:** Clear distinction between Japanese text, romanization, and translations

### Component Design Standards (shadcn/ui Implementation)

**Navigation & Layout:**
- **Sidebar:** Collapsible navigation using shadcn/ui Sidebar component
- **Header:** Minimal top bar with user avatar, settings, and document title
- **Main Content:** Clean PDF viewer with floating action toolbar

**Interactive Elements:**
- **Buttons:** Primary (CTA blue), Secondary (outline), Destructive (red) following shadcn/ui design tokens
- **Forms:** Clean input fields with proper validation states
- **Modals:** Centered dialogs for settings, card creation, and bulk operations

**Data Display:**
- **Dashboard Cards:** Clean metric cards showing learning statistics
- **Lists:** Organized vocabulary/phrase banks with search and filter capabilities
- **Tables:** Document library with sortable columns and quick actions

### Accessibility & Usability Goals

**AG1: Universal Access**
- WCAG 2.1 AA compliance through shadcn/ui's built-in accessibility features
- Proper color contrast ratios (4.5:1 minimum)
- Screen reader compatibility for all interactive elements

**AG2: Learning-Optimized UX**
- **Cognitive Load Reduction:** No more than 7±2 items visible in any menu or list
- **Error Prevention:** Clear confirmation dialogs for destructive actions
- **Immediate Feedback:** Visual confirmation for all user actions (highlight, save, delete)

**AG3: Performance-Conscious Design**
- **Fast Loading:** Skeleton screens using shadcn/ui Skeleton component during content loading
- **Smooth Interactions:** Maximum 200ms response time for UI feedback
- **Efficient Rendering:** Virtualized lists for large vocabulary banks

### Color Palette & Visual Identity

**Primary Colors (following shadcn/ui design tokens):**
- **Primary:** Blue (#3B82F6) - CTA buttons, active states, progress indicators
- **Secondary:** Gray (#6B7280) - Secondary text, borders, inactive elements  
- **Success:** Green (#10B981) - Completed items, success states
- **Warning:** Amber (#F59E0B) - Attention-needed items
- **Error:** Red (#EF4444) - Error states, destructive actions

**Background & Surfaces:**
- **Background:** Clean white (#FFFFFF) / Dark mode (#0F172A)
- **Surface:** Subtle gray (#F8FAFC) / Dark surface (#1E293B)
- **Borders:** Light gray (#E2E8F0) / Dark borders (#334155)

### Mobile-First Responsive Strategy

**Mobile (320-768px):**
- Single-column layout with stacked components
- Bottom navigation for primary actions
- Swipe gestures for page navigation
- Collapsible sections to maximize content area

**Tablet (768-1024px):**
- Two-column layout: PDF viewer + sidebar
- Touch-optimized highlighting tools
- Contextual floating action buttons

**Desktop (1024px+):**
- Three-column layout: Navigation + PDF + Tools panel
- Keyboard shortcuts prominently displayed
- Hover states for enhanced interactivity

---
