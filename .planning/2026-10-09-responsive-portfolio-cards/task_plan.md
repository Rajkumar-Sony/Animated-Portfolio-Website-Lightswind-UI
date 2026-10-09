# Task Plan: Responsive Portfolio Cards

## Goal
Reduce project card height on mobile/tablet, order cards with the latest work first, replace stock project photos with generated device mockup images for each project, and add more spacing between the hero intro and profile card.

## Next Step
Implement exact reference `SparklesCore` hero underline and verify both themes.

## Current Phase
Phase 18: Exact Hero Brand Sparkles Canvas

## Phases

### Phase 1: Requirements & Discovery
- [x] Understand user intent
- [x] Identify constraints
- [x] Document in findings.md
- **Status:** complete

### Phase 2: Planning & Structure
- [x] Define approach
- [x] Locate files to edit
- **Status:** complete

### Phase 3: Implementation
- [x] Execute the plan
- [x] Write to files before executing
- **Status:** complete

### Phase 4: Testing & Verification
- [x] Verify requirements met
- [x] Document test results
- **Status:** complete

### Phase 5: Delivery
- [x] Review outputs
- [x] Deliver to user
- **Status:** complete

### Phase 6: Generated Device Mockups
- [x] Generate one device mockup image per project
- [x] Save generated assets into the workspace
- [x] Wire project data to the generated assets
- [x] Verify build and responsive rendering
- **Status:** complete

### Phase 7: Final Delivery
- [x] Summarize changes and verification
- **Status:** complete

### Phase 8: Hero Spacing Follow-up
- [x] Inspect hero layout from screenshot
- [x] Increase spacing between intro content and ID card
- [x] Verify lint, build, and browser spacing
- **Status:** complete

### Phase 9: CourseVault Built Project Card
- [x] Inspect CourseVault project context
- [x] Generate CourseVault device mockup
- [x] Wire CourseVault card and mark other cards Coming soon
- [x] Verify lint, build, and browser rendering
- **Status:** complete

### Phase 10: Built Project Footer Alignment
- [x] Move `View project` into the same footer row as the badges
- [x] Keep mobile row fitting at 390px without horizontal overflow
- [x] Verify lint, build, and browser rendering
- **Status:** complete

### Phase 11: Project ScrollStack Animation
- [x] Reuse the Academic Background stack animation for professional project cards
- [x] Preserve project mockups, tags, title, summary, arrow affordance, and case-study modal
- [x] Verify lint, build, mobile, tablet, and modal click behavior
- **Status:** complete

### Phase 12: Conditional Project Stack Correction
- [x] Scope the ScrollStack animation to one-card-per-row responsive layouts
- [x] Restore the desktop multi-card grid layout
- [x] Verify lint, build, mobile, tablet, and desktop rendering
- **Status:** complete

### Phase 13: Lightswind India-to-Japan World Map
- [x] Install/copy the Lightswind `world-map` source component
- [x] Scope default markers and arcs to India and Osaka/Japan only
- [x] Wire the requested snippet into the contact section
- [x] Verify lint, build, and browser rendering
- **Status:** complete

### Phase 14: Complete Mobile Menu
- [x] Identify the menu data used by the mobile drawer
- [x] Add every visible site section to the mobile drawer
- [x] Verify lint, build, and mobile menu rendering
- **Status:** complete

### Phase 15: Focused India/Japan Map Crop
- [x] Remove unnecessary full-world landmass rendering
- [x] Crop map projection to the India-to-Japan region
- [x] Verify lint, build, and browser rendering
- **Status:** complete

### Phase 16: Hero Name Underline Animation
- [x] Add the reference-style animated line directly below the hero name
- [x] Preserve hero spacing and responsive layout
- [x] Verify lint, build, and browser rendering at `localhost:3000` or active dev port
- **Status:** complete

### Phase 17: Compact Country-Border Contact Map
- [x] Render India and Japan with country-border outlines
- [x] Remove the map card shell
- [x] Reduce extra top and bottom map spacing
- [x] Verify lint, build, and browser spacing
- **Status:** complete

### Phase 18: Exact Hero Brand Sparkles Canvas
- [ ] Inspect the `localhost:3000` reference implementation
- [ ] Port the same canvas-backed sparkle underline below the hero name
- [ ] Preserve light and dark theme visibility
- [ ] Verify lint, build, and browser rendering in both themes
- **Status:** in progress

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Preserve unrelated dirty work | Existing worktree has broad changes; this task should only touch card layout/order and planning files. |
| Use one-column stack below desktop | Mobile/tablet should read sequentially with the latest project first; bento spans should wait until desktop. |
| Use fixed responsive card heights | Replaces mobile aspect-ratio driven height with shorter predictable heights. |
| Generate one asset per project | User asked for individual device mockup images, so each project should get a distinct visual matched to its domain. |
| Include app name in each mockup | User clarified app name must be mentioned in the visual itself. |
| Adjust hero grid spacing only | The follow-up screenshot issue is between hero sections, so the IdCard internals should stay unchanged. |

## Errors Encountered
| Error | Resolution |
|-------|------------|
| Initial browser measurement selected a wrapper without a card child | Retargeted measurement to the card group closest to each project title button. |
| Vite dev server port 8080 already in use | Started the verification server on port 4175 instead. |
