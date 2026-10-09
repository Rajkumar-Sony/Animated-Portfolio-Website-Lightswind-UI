# Findings & Decisions

## Requirements
- In mobile and tablet views, reduce the height of the project cards shown in the attached screenshot.
- Organize cards in sequence with the latest project on top.
- Replace the existing card images with generated device mockup images for each project individually.
- App/project name must be visible in the mockup visual.
- Follow-up request: add more space between the hero introduction area and the profile card shown in the screenshot.
- Follow-up request: use `ThreeDRotatingCarousel` from `@/components/lightswind-pro/3d-rotating-carousel` for the new personal projects section.
- Follow-up request: apply the image-1 pill/circular-arrow animation style to the `View Work` and `Send Message` buttons.
- Follow-up request: remove the small icon card next to the `Projects I Built` heading.
- Follow-up request: add a `WorldMap` from `@/components/lightswind/world-map` in the contact section empty area, showing India to Japan.
- Follow-up request: match the provided `WorldMap` usage snippet, including `pulse`, `markerColor`, `enableTooltips`, and a 480px rounded bordered wrapper.
- Follow-up request: use the Lightswind UI Library source for `world-map`.
- Follow-up clarification: the map must only show India to Japan.
- Follow-up clarification: only the India and Japan area should be visible; unnecessary world-map landmass dots should be removed.
- Follow-up request: use an appropriate original country-border map and remove the map card.
- Follow-up request: remove extra top/bottom spacing around the contact map.
- Follow-up correction: the contact map still showed extra top/bottom whitespace; the country outlines themselves need a tighter projection fit, not only a shorter wrapper.
- Follow-up request: add the provided thin animated shimmer/grid line directly below the hero name on `http://localhost:3000/`.
- Follow-up correction: make the animation exactly match the `localhost:3000` reference DOM and canvas behavior for `#hero-brand-sparkles`, with support for both themes.
- Follow-up request: change the map origin from generic India to Bihar, keep the Japan endpoint at Osaka, and show the map only on desktop/laptop layouts.

## Research Findings
- The screenshot shows a tall image-backed project card with technology chips, title, description, and a circular arrow action. The target is responsive height/order, not a redesign.
- The repository already has many modified files before this task; edits should remain narrowly scoped.
- `src/components/sections/Projects.tsx` renders the project cards; `src/data/portfolio.ts` provides the project list.
- The project data already states and appears to use newest-first order, with ongoing Cast Me work first and SEARCH WRITE second.
- Current card height is `aspect-[4/3]` on small screens and `md:h-80`; current bento columns/spans begin at `md`, so tablet is not a simple latest-first stack.
- `src/components/sections/Hero.tsx` owns the two-column hero layout; `src/components/sections/IdCard.tsx` owns the profile card internals.
- The requested `3d-rotating-carousel` file did not exist yet under `src/components/lightswind-pro`; it needs to be added locally.
- `src/lib/buttonStyles.ts` controls the shared primary button shell; `src/components/sections/Hero.tsx` and `src/components/sections/Contact.tsx` render the two requested buttons.
- `src/components/sections/BuiltProjects.tsx` passed `CodeXml` to `SectionHeading`, which produced the icon card shown in the screenshot.
- No `src/components/lightswind/world-map` file existed before this request.
- `npx lightswind@latest list` includes `world-map`; the public GitHub `master` registry query did not expose that entry, but the Lightswind CLI installed it from the registry CDN.
- The Lightswind CLI-installed `world-map.tsx` originally defaulted to multiple global markers and route arcs; the user wants this instance/defaults scoped to India to Japan only.
- The Lightswind world-map source still rendered the full world dotted landmass matrix after markers/arcs were scoped; the projection and land-dot filtering need to focus on only India and Japan.
- The contact map card shell came from the wrapper classes (`rounded-2xl`, border, and background) rather than the map component itself.
- The extra vertical whitespace came from the 420px map block plus SVG projection padding.
- After the wrapper was reduced, the remaining extra vertical whitespace came from broad India/Japan latitude bounds and internal SVG padding.
- `src/components/sections/Hero.tsx` renders the `Hi, I'm` and gradient `profile.name` spans; the requested animation belongs immediately after the name span and before the tagline.
- The exact reference lives in `/Users/pb0595/Documents/Codex/2026-10-09/cl/CompanyFolio/src/components/HeroBrandUnderline.tsx` and uses `SparklesCore` from `src/components/ui/sparkles.tsx`.
- The reference `SparklesCore` uses `@tsparticles/react`, `@tsparticles/engine`, and `@tsparticles/slim` to render a generated canvas with `data-generated="true"` inside `#hero-brand-sparkles`.
- The contact map defaults can represent Bihar with coordinates near Bihar's center while preserving the existing Osaka endpoint.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Use existing card patterns | The change should preserve the visual language and reduce dimensions only on mobile/tablet breakpoints. |
| Change breakpoints in `Projects.tsx` | Moving bento spans from `md` to `lg` keeps mobile and tablet sequential while preserving desktop composition. |
| Keep generated text limited to app names | User wants app names in the visuals; limiting text to the title improves chances of clean generation. |
| Adjust hero grid spacing, not IdCard content | The screenshot issue is layout breathing room between sections; changing the hero grid keeps the card design stable. |
| Add reusable animated button content | A small shared component keeps the circular-arrow animation consistent across link and submit button without changing secondary buttons. |
| Use the Lightswind CLI-installed source component | The user asked to use the Lightswind UI Library; copying source into `src/components/lightswind` matches the library's source-first workflow. |
| Customize `DEFAULT_MARKERS` and `DEFAULT_ARCS` to India/Japan only | Keeps the requested snippet simple while preventing unrelated global map routes from rendering. |
| Crop the world-map projection and land dots to India/Japan | Removes unnecessary global map context while preserving the requested India-to-Japan route. |
| Render SVG country outlines for India and Japan | Country-border paths are more map-like and remove the dotted placeholder look. |
| Reduce map block to 260px and projection vertical padding to 4% | Removes top/bottom whitespace while keeping the route readable. |
| Tighten India/Japan projection bounds and reduce projection padding to 1% vertical | Makes the original country-border outlines fill the available map area more cleanly. |
| Replace the CSS approximation with the reference `SparklesCore` canvas | The user clarified they want the same generated canvas animation as `localhost:3000`, not a lookalike CSS accent. |
| Keep the reference indigo/sky gradient while using transparent backgrounds | The reference colors remain visible on light and dark themes without changing the hero background. |
| Hide the contact map below `lg` | The user wants the map only on desktop and laptop, so mobile/tablet should not display it. |

## Issues Encountered
| Issue | Resolution |
|-------|------------|

## Resources
-
