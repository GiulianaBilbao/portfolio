# Implementation Plan: Portfolio Coffee Table

## Overview

This plan builds the Portfolio Coffee Table site incrementally in React + TypeScript (Vite) with CSS Modules, the Web Animations API wrapped by an `AnimationController`, and a small finite-state machine. It follows a test-driven, bottom-up order: scaffold the project, build and property-test the pure domain layer, add platform adapters, then compose view components, and finally wire everything together with responsive, accessibility, and animation-performance concerns. Each of the 12 correctness properties from the design gets exactly one fast-check property-based test (100+ iterations, tagged `Feature: portfolio-coffee-table, Property N`). Requirements are referenced by their sub-clause numbers for traceability.

## Tasks

- [ ] 1. Scaffold project and shared types
  - [-] 1.1 Initialize Vite React + TypeScript project and testing tooling
    - Create the Vite React + TS project structure (`src/`, `index.html`, `vite.config.ts`, `tsconfig.json`)
    - Add and configure Vitest, React Testing Library, jsdom, and fast-check
    - Add npm scripts for `test` (single run via `vitest --run`) and `build`
    - Set up CSS Modules support and a global CSS custom-properties stylesheet stub
    - _Requirements: 7.1_

  - [~] 1.2 Define core data-model and interface types
    - Create `src/domain/types.ts` with `Sector`, `SectorConfig`, `PortfolioContent`, `ProjectEntry`, `ProjectImage`, `MetadataContent`, `Page`
    - Create `src/domain/interfaces.ts` with `ConfigParseResult`, `PageNavState`, `NavIntent`, `NavOutcome`, `AnimationEnv`, `AnimationMode`, `LiftState`, `LiftEvent`, `ViewState`, `AppState`, `AppEvent`
    - Declare platform-adapter interfaces `HoverCapability`, `ReducedMotion`, `FrameRateSampler`, `ImageLoader`
    - _Requirements: 7.1, 6.2, 6.3_

- [ ] 2. Implement and property-test the pure domain layer
  - [~] 2.1 Implement `parseSectorConfig` with validation rules
    - Validate that input is an object with a `sectors` array of length 0–12
    - Enforce non-empty `id`, `title`, `coverStyleId`, `altText`; unique titles; well-formed projects (non-empty title/description, ≥1 image with non-empty `alt`)
    - Return `ok: true` with parsed sectors for valid input (including zero sectors); return `ok: false, sectors: []` with error messages for malformed input
    - _Requirements: 7.1, 7.2, 7.4, 1.2, 1.4, 1.5_

  - [ ]* 2.2 Write property test for valid configuration parsing/rendering data
    - **Property 1: Valid configuration renders covers faithfully**
    - **Validates: Requirements 1.2, 1.4, 7.1, 7.2, 10.1, 10.5**
    - Arbitrary: valid configs with 0–12 sectors and unique titles; assert `ok: true`, N sectors preserved in order, non-empty titles/altText, unique titles

  - [ ]* 2.3 Write property test for malformed/unavailable configuration
    - **Property 2: Malformed or unavailable configuration degrades gracefully**
    - **Validates: Requirements 1.5, 7.4**
    - Arbitrary: non-objects, missing/non-array `sectors`, >12 sectors, empty required fields, duplicate titles, malformed projects; assert `ok: false`, `sectors: []`, no throw

  - [~] 2.4 Implement `selectColumnCount` layout selector
    - Return 1 for width < 640, 2 for 640 ≤ width < 1024, and ≥3 for width ≥ 1024
    - _Requirements: 8.1, 8.2, 8.3_

  - [ ]* 2.5 Write property test for responsive column selection
    - **Property 7: Responsive column selection matches viewport tier**
    - **Validates: Requirements 8.1, 8.2, 8.3**
    - Arbitrary: viewport widths spanning all tiers and boundaries (639/640/1023/1024)

  - [~] 2.6 Implement `navigate` page-navigation function
    - Increment/decrement `currentIndex` within `[0, totalPages)`; set `atBoundary` on first/last edges without changing index
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ]* 2.7 Write property test for page navigation bounds and boundaries
    - **Property 8: Page navigation stays in range with correct boundaries**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6**
    - Arbitrary: `PageNavState` with `totalPages ≥ 1`, valid `currentIndex`, and both intents

  - [~] 2.8 Implement `paginate` function
    - Distribute projects across pages of `projectsPerPage`, preserving order; empty list yields exactly one `isEmptyState` page; `totalPages = pages.length` (min 1)
    - _Requirements: 5.1, 6.1, 7.3_

  - [ ]* 2.9 Write property test for pagination conservation and ordering
    - **Property 9: Pagination conserves and orders project content**
    - **Validates: Requirements 6.1, 7.3**
    - Arbitrary: project lists including empty; assert concatenation equals input in order; empty → single empty-state page

  - [~] 2.10 Implement `decideAnimationMode` decision function
    - Return `immediate` when `animationAvailable === false`, `reducedMotion === true`, or `degraded === true`; otherwise `animated`
    - _Requirements: 4.3, 9.3, 9.4_

  - [ ]* 2.11 Write property test for animation-mode fallback
    - **Property 11: Animation mode falls back deterministically**
    - **Validates: Requirements 4.3, 9.3, 9.4**
    - Arbitrary: all `AnimationEnv` boolean combinations

- [~] 3. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Implement and property-test the stateful reducers
  - [~] 4.1 Implement `liftReducer` single-lift reducer
    - `pointerEnter` sets `liftedId` to the entered id (latest wins) only when hover-capable; `pointerLeave` clears when leaving the lifted cover; `suspend` clears; non-hover devices never lift
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 2.2_

  - [ ]* 4.2 Write property test for single-lift invariant
    - **Property 3: At most one cover is lifted (single-lift invariant)**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 2.2**
    - Arbitrary: sequences of pointerEnter/pointerLeave/suspend events with varying hover capability

  - [~] 4.3 Implement `appTransition` finite-state machine
    - States `Landing`, `Opening`, `Portfolio`, `Flipping`, `Closing`; accept transitions only from stable states; ignore activations during transient states and `requestOpen` while in `Portfolio`; track `openSectorId` and `originCoverId`
    - _Requirements: 4.1, 4.5, 4.6, 5.7, 9.5, 10.9_

  - [ ]* 4.4 Write property test for re-entrancy invariant
    - **Property 4: At most one portfolio open and transient states ignore activations**
    - **Validates: Requirements 4.6, 5.7, 9.5**
    - Arbitrary: sequences of application events; assert at most one open portfolio and ignored activations in transient/Portfolio-open states

  - [ ]* 4.5 Write property test for open/close target state
    - **Property 5: Open and close reach the correct target state**
    - **Validates: Requirements 4.1, 4.5**
    - Arbitrary: sector ids; assert open→`Portfolio` with matching `openSectorId`, close→`Landing` with `openSectorId === null`

  - [ ]* 4.6 Write property test for focus round-trip
    - **Property 6: Close returns focus to the originating cover**
    - **Validates: Requirements 10.9**
    - Arbitrary: open→browse→close cycles; assert `originCoverId` is preserved and equals the restore target on close

- [~] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement platform adapters
  - [~] 6.1 Implement hover, reduced-motion, and viewport/resize adapters
    - `HoverCapability.supportsHover()` via `matchMedia('(hover: hover) and (pointer: fine)')`
    - `ReducedMotion.prefersReducedMotion()` via `matchMedia('(prefers-reduced-motion: reduce)')`
    - Viewport width reader and resize observer that reports width changes
    - _Requirements: 3.5, 3.6, 9.3, 8.4_

  - [ ]* 6.2 Write unit tests for hover/reduced-motion/viewport adapters
    - Test hover-capable-with-touch enables hover (3.6); reduced-motion detection; resize reporting
    - _Requirements: 3.5, 3.6, 9.3_

  - [~] 6.3 Implement scroll observer and frame-rate sampler
    - Scroll observer emits `suspend` on scroll and a restore signal after 150ms of quiet (debounced)
    - `FrameRateSampler.sample(cb)` measures fps via `requestAnimationFrame` and returns a stop function
    - _Requirements: 2.2, 2.3, 9.2, 9.4_

  - [ ]* 6.4 Write unit tests for scroll debounce and sampler
    - Use fake timers to assert restore fires at 150ms quiet and not before (2.3)
    - _Requirements: 2.2, 2.3_

  - [~] 6.5 Implement `ImageLoader` with timeout and error handling
    - Resolve `'loaded'` on success; resolve `'failed'` on error or after a 10s timeout
    - _Requirements: 6.7_

- [ ] 7. Implement AnimationController
  - [~] 7.1 Build AnimationController over WAAPI
    - Query `decideAnimationMode(env)` before each transition; apply immediate target state within 50ms when `immediate`
    - Cap animated durations at ≤600ms; sample fps and set `env.degraded = true` on sustained <30fps; emit completion exactly once; reject new plays while active
    - _Requirements: 4.2, 4.3, 9.1, 9.3, 9.4, 9.5_

  - [ ]* 7.2 Write unit tests for AnimationController budgets and fallback
    - Fake timers: animated open completes within budget (4.2); immediate mode within 50ms; degraded flag set after sub-30fps; durations configured ≤600ms (9.1)
    - _Requirements: 4.2, 4.3, 9.1, 9.4_

- [~] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Implement landing view components
  - [~] 9.1 Implement NameTreatment component
    - Render "Giuliana C. Bilbao" fixed to the top-left of the landing viewport with ≥4.5:1 contrast styling
    - _Requirements: 1.1, 1.3, 10.7_

  - [ ]* 9.2 Write unit tests for NameTreatment
    - Assert text content and top-left anchoring; contrast computed from palette ≥4.5:1
    - _Requirements: 1.1, 1.3, 10.7_

  - [~] 9.3 Implement BookCover component
    - Focusable/activatable cover with title, cover styling, lift transform, visible focus indicator, non-empty text alternative; emits `onActivate(sectorId)` on click/tap and Enter/Space
    - _Requirements: 1.4, 3.1, 3.2, 10.1, 10.2, 10.3, 10.5_

  - [ ]* 9.4 Write unit tests for BookCover interactions
    - Enter/Space activation opens (10.2); focus indicator distinct and ≥3:1 (10.3); non-empty alt (10.5)
    - _Requirements: 10.2, 10.3, 10.5_

  - [~] 9.5 Implement CoffeeTable component
    - CSS Grid container rendering one BookCover per configured Sector in order; column count driven by `selectColumnCount`; render empty state for zero sectors
    - _Requirements: 1.2, 1.5, 7.2, 8.1, 8.2, 8.3_

  - [ ]* 9.6 Write unit tests for CoffeeTable rendering
    - N covers in config order; zero-sector empty table; unique titles
    - _Requirements: 1.2, 1.5, 7.2_

  - [~] 9.7 Implement LandingPage scroll container
    - Vertical scroll container hosting NameTreatment and CoffeeTable; wire scroll observer to `liftReducer` `suspend`/restore to suspend cover interactivity while scrolling
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 8.5_

  - [ ]* 9.8 Write unit tests for LandingPage scroll behavior
    - Vertical scroll enabled; small content needs no scroll (2.1, 2.4); interactivity suspended during scroll and restored after quiet (2.2, 2.3)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 10. Implement portfolio view components
  - [~] 10.1 Implement ImageWithPlaceholder component
    - Use `ImageLoader`; on timeout/error swap in a placeholder occupying identical width/height footprint from intrinsic dimensions
    - _Requirements: 6.7_

  - [ ]* 10.2 Write property test for image placeholder footprint
    - **Property 12: Failed image load preserves layout footprint**
    - **Validates: Requirements 6.7**
    - Arbitrary: image intrinsic width/height pairs; assert placeholder occupies identical footprint on failure

  - [~] 10.3 Implement ProjectEntry and MetadataBlock components
    - ProjectEntry renders title, description, and ≥1 image via ImageWithPlaceholder with non-empty alt; MetadataBlock renders location and date, includes contact only when provided
    - _Requirements: 6.2, 6.3, 6.4, 6.5, 10.6_

  - [ ]* 10.4 Write property test for content render completeness
    - **Property 10: Portfolio content renders completely**
    - **Validates: Requirements 6.2, 6.3, 6.4, 6.5, 10.6**
    - Arbitrary: valid ProjectEntry and MetadataContent (with/without contact); assert title/description/image alt present and contact presence matches input

  - [~] 10.5 Implement PageSpread, BinderRings, PageIndicator, PageControls, ReturnControl
    - PageSpread renders projects for the current page or empty-state message; BinderRings/editorial chrome; PageIndicator shows `(current, total)`; PageControls (next/prev) and ReturnControl keyboard-focusable and Enter/Space-activatable, present in every page state
    - _Requirements: 4.4, 5.1, 5.6, 6.1, 6.6, 7.3, 10.4_

  - [ ]* 10.6 Write unit tests for portfolio chrome and controls
    - Return control present in every page state (4.4); controls focusable and Enter/Space-activatable (10.4); indicator reflects current/total (5.6); editorial styling and BinderRings render (6.6); empty-state page message (7.3)
    - _Requirements: 4.4, 5.6, 6.6, 7.3, 10.4_

  - [~] 10.7 Implement PortfolioView composition with focus management
    - Compose BinderRings, current PageSpread, PageIndicator, PageControls, ReturnControl, MetadataBlock; drive pages via `paginate`; move focus into the view on open and back to the origin cover on close; wire `navigate` and boundary cue
    - _Requirements: 4.4, 5.1, 5.4, 5.5, 5.6, 6.1, 6.3, 10.4, 10.8, 10.9_

  - [ ]* 10.8 Write unit tests for PortfolioView focus and navigation
    - Focus moves into view on open (10.8); boundary cue at first/last page without index change (5.4, 5.5); first page shown on open (5.1)
    - _Requirements: 5.1, 5.4, 5.5, 10.8_

- [~] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Author sector configuration content
  - [~] 12.1 Create the five-sector configuration source
    - Author config for Sensing, Modeling, Movement, Reasoning, Delivery with titles, cover style ids, alt text, project entries, and metadata; validated by `parseSectorConfig`
    - _Requirements: 7.1, 7.2, 1.2_

- [ ] 13. Integrate and wire the application
  - [~] 13.1 Implement App root wiring state machine, adapters, and AnimationController
    - Own `appTransition` state; provide parsed config to the tree; wire HoverCapability, ReducedMotion, viewport/resize, scroll observer, FrameRateSampler; connect AnimationController to open/close/flip; render LandingPage always and PortfolioView when open; ensure NameTreatment always renders even on config failure
    - _Requirements: 4.1, 4.2, 4.3, 4.5, 4.6, 5.7, 7.4, 9.5, 10.8, 10.9_

  - [~] 13.2 Wire responsive re-layout on resize
    - Recompute column count via `selectColumnCount` on resize; re-arrange CoffeeTable within 500ms when crossing 640/1024 boundaries; ensure no horizontal overflow beyond viewport width
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 13.3 Write integration tests for resize and overflow
    - Resize across 640/1024 re-arranges columns within 500ms (8.4); no horizontal overflow on Landing and Portfolio (8.5)
    - _Requirements: 8.4, 8.5_

  - [ ]* 13.4 Write integration test for full open/flip/close focus cycle
    - Open → page-flip → close returns focus to originating cover; only one portfolio open; re-entrant activations ignored during transitions
    - _Requirements: 4.6, 5.7, 9.5, 10.8, 10.9_

- [~] 14. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional test sub-tasks and can be skipped for a faster MVP, but they encode the design's correctness guarantees.
- Each of the 12 correctness properties maps to exactly one property-based test (fast-check, 100+ iterations, tagged `Feature: portfolio-coffee-table, Property N`).
- Property tests are placed immediately after the pure logic they validate to catch errors early.
- Each task references specific requirement sub-clauses for traceability.
- Checkpoints ensure incremental validation before moving to the next layer.
- 60fps sustained animation (9.2) is verified via manual/performance profiling, not automated tests, per the design's Testing Strategy.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["2.1", "2.4", "2.6", "2.8", "2.10", "4.1", "4.3", "6.1", "6.3", "6.5"] },
    { "id": 3, "tasks": ["2.2", "2.3", "2.5", "2.7", "2.9", "2.11", "4.2", "4.4", "4.5", "4.6", "6.2", "6.4", "7.1"] },
    { "id": 4, "tasks": ["7.2", "9.1", "9.3", "9.5", "10.1", "10.3", "10.5", "12.1"] },
    { "id": 5, "tasks": ["9.2", "9.4", "9.6", "9.7", "10.2", "10.4", "10.6", "10.7"] },
    { "id": 6, "tasks": ["9.8", "10.8", "13.1"] },
    { "id": 7, "tasks": ["13.2"] },
    { "id": 8, "tasks": ["13.3", "13.4"] }
  ]
}
```
