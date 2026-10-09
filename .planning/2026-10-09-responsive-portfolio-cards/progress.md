# Progress Log

## Session: 2026-10-09

### Current Status
- **Phase:** 9 - CourseVault Built Project Card
- **Started:** 2026-10-09

### Actions Taken
- Created an isolated planning session for the responsive card update.
- Reviewed the attached screenshot and recorded requirements.
- Checked `git diff --stat`; the worktree has broad pre-existing changes, so implementation will be scoped carefully.
- Located project cards in `src/components/sections/Projects.tsx` and project data in `src/data/portfolio.ts`.
- Decided to keep the data order intact and make the layout stack sequentially below `lg`.
- Updated `src/components/sections/Projects.tsx` so card spans/grid start at `lg`, leaving mobile/tablet as a latest-first stack.
- Replaced mobile/tablet aspect-driven project card height with fixed responsive heights: `h-72 sm:h-80 md:h-72 lg:h-80`.
- Ran browser measurements at 390x844 and 820x1180: cards are 288px tall at both widths and ordered Cast Me!, SEARCH WRITE, Anti-Social Forces Screening, Healthcare IT Tracking System.
- New request: replace stock project photos with generated device mockup images, one unique image per project.
- Follow-up clarification: the app/project name must be mentioned in the mockup image.
- Generated final named device mockups for Cast Me!, SEARCH WRITE, Anti-Social Forces Screening, and Healthcare IT Tracking System.
- Copied selected final PNGs into `src/assets/projects/`.
- Updated `src/data/portfolio.ts` to import the generated assets and replace the previous remote Pexels project images.
- Browser verification confirmed all four cards use `device-mockup` assets and retain 288px mobile-height card rendering.
- Follow-up screenshot request: add more space between the hero intro content and the profile card.
- Recorded that `src/components/sections/Hero.tsx` is the right scope for the spacing change.
- Follow-up wording request: changed the Projects section heading from "Selected Works" to "Projects I Built" in `src/components/sections/Projects.tsx`.
- Correction: restored existing professional projects heading to "Selected Works" and added a new `BuiltProjects` section titled "Projects I Built".
- Added `src/components/lightswind-pro/3d-rotating-carousel.tsx` with named export `ThreeDRotatingCarousel`.
- Replaced the `BuiltProjects` placeholder card with `ThreeDRotatingCarousel` seeded with editable draft personal-project items.
- Verified in browser at `#built-projects`; the section renders and the Next control changes the active carousel card.
- Mobile/tablet follow-up check found the new carousel active card was clipped off the left edge because Tailwind's `-translate-x-1/2` utility and the inline carousel transform both applied horizontal centering.
- Removed the duplicate translate utility and kept the active card at neutral depth while side cards retain 3D depth.
- Rechecked the carousel at 390x844 and 820x1180: active cards fit inside the viewport, no horizontal overflow is present, and the Next control changes the active project.
- New request: use `/Users/pb0595/Documents/Projects/CourseVault` as the first built-project carousel card, generate a CourseVault device mockup, and keep the other cards blank/placeholder with Coming soon.
- Inspected the CourseVault README: native desktop app for owned Udemy course downloads, local library organization, watch progress, search, storage, and encrypted vault.
- Generated a CourseVault-specific device mockup with the built-in image generation tool and copied it into `src/assets/projects/coursevault-device-mockup.png`.
- Updated `BuiltProjects` so CourseVault is the real front card with the generated image, repository link, and Electron/React/TypeScript tags.
- Updated the carousel to support stable item IDs and a blank Coming soon visual for image-less placeholder cards.
- Disabled auto-rotation for the built-project carousel so CourseVault stays in front by default while the other cards remain Coming soon placeholders.
- Browser fresh-load verification confirmed CourseVault is active by default at 1440x1000, 390x844, and 820x1180 with no horizontal overflow.
- New request: apply the same stacked scroll animation used by Academic Background to the displayed project-card section shown in the screenshot.
- Updated `src/components/sections/Projects.tsx` to render professional project cards through the shared `ScrollStack` component while preserving mockup images, tags, title, summary, circular arrow, and case-study modal opening.
- Verified the project ScrollStack at 390x844 and 820x1180: first card is `Cast Me!`, card height is 360px, no horizontal overflow, and the visual stack shows the same scroll-to-explore behavior as Academic Background.
- Verified clicking the `Cast Me!` stacked project opens the case-study dialog with title `Cast Me!`.
- Updated `src/components/sections/Hero.tsx` to use a wider hero container, larger responsive grid gaps, and additional desktop left padding on the card column.
- Attempted to start Vite on the default dev port; port 8080 was already in use, so verification used port 4175.
- Browser verification at the default viewport measured a 237px gap from the hero title to the card.
- Browser verification at a screenshot-like 1952x1271 viewport measured a 226px title-to-card gap and a 219px intro-column-to-card gap.
- Saved a verification screenshot at `.planning/2026-10-09-responsive-portfolio-cards/hero-spacing-verification.png`.
- Reset the temporary browser viewport override after verification.
- Follow-up request: apply the image-1 circular-arrow button animation to image-2 `View Work` and image-3 `Send Message`.
- Added `src/components/ui/AnimatedArrowButtonContent.tsx` for shared label plus circular icon-puck animation.
- Updated shared primary button styles in `src/lib/buttonStyles.ts` to support the animated content.
- Updated `src/components/sections/Hero.tsx` and `src/components/sections/Contact.tsx` to use the animated content for the requested buttons.
- Follow-up correction: restored the animated primary button height to the previous 44px footprint by removing added vertical padding and reducing the icon puck to 32px.
- Follow-up request: removed the `CodeXml` icon card from the `Projects I Built` section heading in `src/components/sections/BuiltProjects.tsx`.
- Follow-up request: added a local `WorldMap` component at `src/components/lightswind/world-map.tsx` with `DEFAULT_MARKERS` and `DEFAULT_ARCS` for India to Japan.
- Wired the map into the left side of `src/components/sections/Contact.tsx` below the email/location rows, matching the empty area in the screenshot.
- Follow-up snippet request: expanded `WorldMap` props to support `pulse`, `markerColor`, and `enableTooltips`, and wrapped it in the requested 480px rounded bordered container.
- Browser verification confirmed the requested contact map snippet renders with a 480px wrapper, India/Japan tooltip titles, blue markers, pulse circles, and one India-to-Japan route.
- Saved a contact map verification screenshot at `.planning/2026-10-09-responsive-portfolio-cards/contact-world-map-snippet.png`.
- Follow-up request: replaced the hand-built map with the Lightswind CLI-installed `world-map` component source from `npx lightswind@latest add world-map`.
- Kept the component source at `src/components/lightswind/world-map.tsx`, fixed its import to the repo's `@/lib/cn`, and customized `DEFAULT_MARKERS`/`DEFAULT_ARCS` to only India and Osaka/Japan with one route.
- Follow-up clarification: verified the contact map is only India to Japan, with two marker centers, one route animation, and the 480px wrapper.
- Saved the Lightswind map verification screenshot at `.planning/2026-10-09-responsive-portfolio-cards/contact-india-japan-only-lightswind-map.png`.
- Follow-up request: cropped the Lightswind map projection to the India-Japan region and filtered the landmass dots to only India/Japan clusters.
- Browser verification confirmed the focused map renders 17 regional land dots, two marker centers, one route path, one route particle, and the 480px wrapper.
- Saved the focused region-only map screenshot at `.planning/2026-10-09-responsive-portfolio-cards/contact-india-japan-region-only-map.png`.
- Follow-up request: replaced the dotted region map with SVG country-border outlines for India and Japan and removed the rounded bordered map card shell.
- Follow-up request: tightened the contact map block from 420px to 260px and reduced projection vertical padding from 12% to 4%.
- Browser verification confirmed the map block is 260px tall, starts 16px below the contact rows, has transparent background, 0px border width, four country outline paths, two marker centers, and one route.
- Saved the compact map spacing screenshot at `.planning/2026-10-09-responsive-portfolio-cards/contact-map-compact-spacing.png`.
- Follow-up correction: tightened the India/Japan projection bounds and reduced internal map padding further so the country-border outlines fit the slot without extra top/bottom whitespace.
- Browser verification at a 1952x1000 desktop viewport confirmed the map block is 427x213px, the country outlines occupy 204px height, and only about 5px remains above and below the outlines.
- Saved the fitted desktop contact-map screenshot at `.planning/2026-10-09-responsive-portfolio-cards/contact-map-desktop-fitted.png`.
- Follow-up screenshot request: moved the built-project `View project` link into the same footer row as the technology badges, aligned to the right.
- Tightened the built-project card footer spacing and type at the smallest mobile breakpoint so the badges and `View project` can remain on one line.
- Further reduced only the base mobile footer badge/link spacing after a 390px browser measurement showed the first compact pass still wrapped.

### Test Results
| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| `npm run build` | Production build succeeds | Succeeded; Vite emitted the usual chunk-size warning | Pass |
| `npm run lint` | ESLint succeeds | Succeeded with no output | Pass |
| Browser mobile measurement 390x844 | Cards are shorter and latest-first | 288px cards, order starts Cast Me! then SEARCH WRITE | Pass |
| Browser tablet measurement 820x1180 | Cards are shorter and latest-first | 288px cards, one-column latest-first stack | Pass |
| `npm run build` after mockup replacement | Production build succeeds with local generated assets | Succeeded; existing Vite chunk-size warning remains | Pass |
| `npm run lint` after mockup replacement | ESLint succeeds | Succeeded with no output | Pass |
| Browser project-card asset check | Four project cards render generated mockups | All image `src` values include `device-mockup`; card heights measured at 288px | Pass |
| `npm run lint` after hero spacing change | ESLint succeeds | Succeeded with no output | Pass |
| `npm run build` after hero spacing change | Production build succeeds | Succeeded; existing Vite chunk-size warning remains | Pass |
| Browser hero spacing at 1952x1271 | More breathing room between intro and card | 226px title-to-card gap; 219px intro-column-to-card gap | Pass |
| `npm run lint` after carousel addition | ESLint succeeds | Succeeded with no output | Pass |
| `npm run build` after carousel addition | Production build succeeds | Succeeded; existing Vite chunk-size warning remains | Pass |
| Browser carousel interaction | Next project control changes active card | Active card changed after click | Pass |
| Browser carousel mobile check 390x844 | Active card fits viewport and interaction works | Active card 45-348px, no horizontal overflow, Next changed active project | Pass |
| Browser carousel tablet check 820x1180 | Active card fits viewport and interaction works | Active card 186-634px, no horizontal overflow, Next changed active project | Pass |
| `npm run lint` after animated button height fix | ESLint succeeds | Succeeded with no output | Pass |
| `npm run build` after animated button height fix | Production build succeeds | Succeeded; existing Vite chunk-size warning remains | Pass |
| Browser animated button height check | Buttons keep previous 44px height | View Work 44px, Send Message 44px; icon puck 32px | Pass |
| `npm run lint` after CourseVault card | ESLint succeeds | Succeeded with no output | Pass |
| `npm run build` after CourseVault card | Production build succeeds | Succeeded; existing Vite chunk-size warning remains | Pass |
| Browser CourseVault desktop fresh load | CourseVault is active and image loads | Active CourseVault card, image `coursevault-device-mockup`, no horizontal overflow | Pass |
| Browser CourseVault mobile fresh load 390x844 | CourseVault is active and fits viewport | Active CourseVault card 43-347px, no horizontal overflow | Pass |
| Browser CourseVault tablet fresh load 820x1180 | CourseVault is active and fits viewport | Active CourseVault card 186-634px, no horizontal overflow | Pass |
| `npm run lint` after built-projects icon removal | ESLint succeeds | Succeeded with no output | Pass |
| `npm run build` after built-projects icon removal | Production build succeeds | Succeeded; existing Vite chunk-size warning remains | Pass |
| Browser built-projects heading check | Icon card removed | Heading text is "Projects I Built"; heading contains 0 icons/icon-card elements | Pass |
| `npm run lint` after contact world map | ESLint succeeds | Succeeded with no output | Pass |
| `npm run build` after contact world map | Production build succeeds | Succeeded; existing Vite chunk-size warning remains | Pass |
| Browser contact map check | Map appears in left contact area with India-to-Japan route | Map present with 2 markers and 1 route path | Pass |
| Browser contact map desktop placement 1174x716 | Map fills the blank left area and does not overlap form | Map rendered at 427x288 on left; form remained on right | Pass |
| Browser contact map snippet check | Requested wrapper and map props render | Wrapper height 480px; 2 blue markers; 2 pulse circles; 1 route path; tooltips include India and Japan | Pass |
| `npm run lint` after Lightswind world map | ESLint succeeds | Succeeded with no output | Pass |
| `npm run build` after Lightswind world map | Production build succeeds | Succeeded; existing Vite chunk-size warning remains | Pass |
| Browser Lightswind map India-to-Japan-only check | Map renders only India/Japan with one route | One route, two marker centers, 480px wrapper, accessible label present | Pass |
| `npm run lint` after focused India/Japan map crop | ESLint succeeds | Succeeded with no output | Pass |
| `npm run build` after focused India/Japan map crop | Production build succeeds | Succeeded; existing Vite chunk-size warning remains | Pass |
| Browser focused India/Japan map check | Only India/Japan area is visible | 17 regional land dots, two marker centers, one route path, one route particle, 480px wrapper | Pass |
| `npm run lint` after country-border map and spacing | ESLint succeeds | Succeeded with no output | Pass |
| `npm run build` after country-border map and spacing | Production build succeeds | Succeeded; existing Vite chunk-size warning remains | Pass |
| Browser compact country-border map check | Map card removed and top/bottom space reduced | 260px map block, 16px top gap, transparent background, 0px border, four country outline paths | Pass |
| `npm run lint` after fitted map bounds | ESLint succeeds | Succeeded with no output | Pass |
| `npm run build` after fitted map bounds | Production build succeeds | Succeeded; existing Vite chunk-size warning remains | Pass |
| Browser fitted map spacing check at 1952x1000 | Extra top/bottom whitespace is removed | 427x213px map block; country outline gaps are 5px top and 5px bottom; two markers and one route remain | Pass |
| `npm run lint` after footer alignment | ESLint succeeds | Succeeded with no output | Pass |
| `npm run build` after footer alignment | Production build succeeds | Succeeded; existing Vite chunk-size warning remains | Pass |
| Browser built-project footer check at 390x844 | `View project` stays on the badge row and aligned right | Same-line true, right gap 0px, no horizontal overflow | Pass |
| `npm run lint` after project ScrollStack animation | ESLint succeeds | Succeeded with no output | Pass |
| `npm run build` after project ScrollStack animation | Production build succeeds | Succeeded; existing Vite chunk-size warning remains | Pass |
| Browser project ScrollStack mobile 390x844 | Project cards use Academic-style stack and fit viewport | First card `Cast Me!`, 360px high, no horizontal overflow, scroll hint visible | Pass |
| Browser project ScrollStack tablet 820x1180 | Project cards use Academic-style stack and fit viewport | First card `Cast Me!`, 360px high, no horizontal overflow, next stacked card visible | Pass |
| Browser project ScrollStack modal click | Stacked project opens case-study dialog | Clicking `Cast Me!` opened dialog titled `Cast Me!` | Pass |

### Phase 12 Log
- Follow-up clarification: apply the Academic Background-style project animation only when the project cards display sequentially with one card per row.
- Confirmed `src/components/sections/Projects.tsx` renders `ScrollStack` only below `lg` and restores the desktop grid at `lg` and wider.
- `npm run lint` after the conditional project stack correction succeeded.
- `npm run build` initially failed because `src/components/lightswind/world-map.tsx` imported non-existent `@/lib/utils`.
- Updated `src/components/lightswind/world-map.tsx` to import the existing `@/lib/cn` helper.
- `npm run lint` after the import fix succeeded.
- `npm run build` after the import fix succeeded; Vite still emits the existing large chunk warning.
- Browser QA at 390x844 confirmed the project stack wrapper `lg:hidden` is displayed, desktop grid wrapper is hidden, only one project card is visible in the row, no horizontal overflow, and no framework overlay text.
- Browser QA at 820x1180 confirmed the project stack wrapper `lg:hidden` is displayed, desktop grid wrapper is hidden, visible rows each contain one project card, no horizontal overflow, and no framework overlay text.
- Browser QA at 1200x900 confirmed the stack wrapper is hidden, the desktop grid wrapper is displayed, rows contain two project cards, and no horizontal overflow.
- Browser interaction QA confirmed clicking the mobile stacked `Cast Me!` card opens the case-study dialog titled `Cast Me!`.
- Marked Phase 12 complete in `task_plan.md`.

### Phase 12 Test Results
| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| `npm run lint` after conditional project stack correction | ESLint succeeds | Succeeded with no output | Pass |
| `npm run build` after conditional project stack correction | Production build succeeds | Succeeded; existing Vite chunk-size warning remains | Pass |
| Browser conditional stack mobile 390x844 | Stack animation applies only to one-card row | `lg:hidden` stack displayed, desktop grid hidden, one visible project row, no horizontal overflow | Pass |
| Browser conditional stack tablet 820x1180 | Stack animation applies only to one-card rows | `lg:hidden` stack displayed, desktop grid hidden, visible rows have one card each, no horizontal overflow | Pass |
| Browser conditional stack desktop 1200x900 | Desktop multi-card rows do not use stack animation | Stack hidden, grid displayed, rows contain two cards, no horizontal overflow | Pass |
| Browser conditional stack modal click | Stacked card opens case-study modal | Clicking mobile `Cast Me!` opened dialog titled `Cast Me!` | Pass |

### Phase 14 Log
- Follow-up request: the opened mobile menu must show all site menus, not only Home, About, Education, Career, and Projects.
- Inspected `src/components/layout/Header.tsx` and `src/data/portfolio.ts`; the mobile drawer currently maps `headerNav`, which contains only five items.
- Added Phase 14 to `task_plan.md` for the complete mobile menu change.
- Added `mobileNav` in `src/data/portfolio.ts` with Home, About, What I Do, Projects, Projects I Built, Career, Education, FAQ, and Contact.
- Updated `src/components/layout/Header.tsx` so the mobile drawer maps `mobileNav` while the desktop header keeps `headerNav`.
- `npm run lint` after the complete mobile menu change succeeded.
- `npm run build` after the complete mobile menu change succeeded; Vite still emits the existing large chunk warning.
- Browser QA at 390x844 confirmed the mobile menu opens with 9 visible links: Home, About, What I Do, Projects, Projects I Built, Career, Education, FAQ, and Contact.
- Browser QA confirmed the complete mobile menu has no horizontal overflow, no framework overlay text, and all links fit within the 844px viewport.
- Saved mobile menu screenshot evidence at `/tmp/mobile-menu-all-items.png`.
- Marked Phase 14 complete in `task_plan.md`.

### Phase 16 Log
- Follow-up request: add the provided thin animated shimmer/grid line just below the hero name on `http://localhost:3000/`.
- Inspected `src/components/sections/Hero.tsx`; the hero name is rendered as the gradient `profile.name` span inside the H1.
- Inspected `src/index.css`; existing animation tokens and reduced-motion handling live there.
- Added `HeroNameAccent` inside `src/components/sections/Hero.tsx`, placed immediately after the hero H1 and before the tagline.
- Added `hero-line-sweep` and `hero-particle-drift` animation tokens plus a `hero-name-accent` utility in `src/index.css`.
- Browser verification initially found the accent wrapper collapsed to 0px width because it was inside an auto-sized flex item; added `w-full` to the motion wrapper.
- Visual screenshot review showed the accent was placed correctly but too subtle on the dark hero, so the line/grid colors were brightened toward the blue-violet reference.

### Phase 14 Test Results
| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| `npm run lint` after complete mobile menu | ESLint succeeds | Succeeded with no output | Pass |
| `npm run build` after complete mobile menu | Production build succeeds | Succeeded; existing Vite chunk-size warning remains | Pass |
| Browser mobile menu 390x844 | All site menu links are present and visible | 9 links visible: Home, About, What I Do, Projects, Projects I Built, Career, Education, FAQ, Contact | Pass |
| Browser mobile menu layout 390x844 | Menu fits without overflow or overlay errors | All links visible, no horizontal overflow, no framework overlay text | Pass |

### Errors
| Error | Resolution |
|-------|------------|
| First browser measurement tried to read a null card wrapper | Switched to measuring the closest `.group` card from each title button. |
| Vite default port 8080 was already in use | Started Vite on port 4175 for verification. |
| Browser carousel viewport check found the active card clipped left on mobile/tablet | Removed duplicate centering from `-translate-x-1/2` and reran lint, build, and responsive browser checks. |
| Vite dev server port 4175 was still in use | Started a temporary server on port 4176 for this footer verification. |
| First 390px footer check still wrapped the `View project` link below the badges | Reduced only the base mobile footer badge/link spacing and rechecked at 390px. |
| Browser wrapper lacked keyboard press for closing modal | Closed/reloaded via browser navigation instead and verified dialog state directly. |
| Build failed on generated world-map import `@/lib/utils` | Switched the import to the repo's existing `@/lib/cn` helper. |
| `npm install lightswind@3.2.5` failed on npm peer resolution for `lucide-react` | Kept the Lightswind CLI-copied source component, which compiles locally without adding the package dependency. |

## Phase 18: Exact Hero Brand Sparkles Canvas

### Progress
- Located the exact reference implementation in the CompanyFolio app running on `localhost:3000`.
- Confirmed the reference uses `HeroBrandUnderline` plus `SparklesCore` from `@tsparticles/react`.
- Installed the same tsParticles packages into this portfolio app.
- Updated the plan and findings to reflect the user's clarification that the canvas behavior must match the reference exactly.

## Phase 19: Bihar-to-Osaka Desktop Contact Map

### Progress
- Updated the contact map's default India marker and route origin from generic India center coordinates to Bihar coordinates.
- Kept the destination marker at Osaka, Japan.
- Changed the contact map wrapper to `hidden lg:block` so the map displays only on laptop/desktop layouts and is hidden on mobile/tablet.
