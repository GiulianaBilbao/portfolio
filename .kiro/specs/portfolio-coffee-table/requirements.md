# Requirements Document

## Introduction

The Portfolio Coffee Table is the personal portfolio website of Giuliana C. Bilbao. It presents her work through a distinctive visual metaphor: a coffee table displaying a grid of magazine/book covers. Each book represents a theme in her work, framed as a "system of the body" narrative. Visitors browse the covers on a scrollable landing page, hover to lift a book for emphasis, and click a book to open an editorial-style, page-flippable portfolio containing projects, images, and metadata.

The five books (Sectors) are: **Sensing** (biosignals, imaging, neural recording), **Modeling** (physiological machine learning), **Movement** (biomechanics and rehabilitation), **Reasoning** (agentic and applied data science), and **Delivery** (regulated software and product translation). The Sector set remains configurable so titles and groupings can be adjusted without restructuring the site.

The aesthetic goal is a clean, minimal "Apple-style" typographic treatment on the cover and a black-and-white editorial magazine spread (with binder rings and portfolio metadata) inside each book. The experience must work across desktop (mouse hover) and touch devices, animate smoothly, and remain accessible.

## Glossary

- **System**: The Portfolio Coffee Table website as a whole, including its client-side application.
- **Landing_Page**: The scrollable cover screen presenting the owner name and the coffee table grid of book covers.
- **Coffee_Table**: The visual container that arranges book covers in a grid layout.
- **Book**: An interactive element representing a single discipline/sector, displayed as a magazine/book cover on the Landing_Page and openable into a portfolio.
- **Book_Cover**: The visual front face of a Book shown in the Coffee_Table grid.
- **Portfolio_View**: The opened state of a Book showing flippable editorial pages.
- **Page**: A single flippable spread within a Portfolio_View containing portfolio content.
- **Project_Entry**: A unit of portfolio content within a Page, including images, title, and descriptive text.
- **Metadata_Block**: The portfolio metadata region within a Portfolio_View displaying location, date, and contact information.
- **Name_Treatment**: The typographic display of the owner's name on the Landing_Page.
- **Hover**: A pointer-over interaction available on devices with a fine pointer (e.g., mouse).
- **Touch_Device**: A device whose primary input is touch and which does not support Hover.
- **Sector**: A theme represented by a Book. The five finalized Sectors are Sensing, Modeling, Movement, Reasoning, and Delivery.
- **Owner**: Giuliana C. Bilbao, whose name is shown as the Name_Treatment on the Landing_Page.

## Requirements

### Requirement 1: Landing Page and Name Treatment

**User Story:** As a visitor, I want to see the owner's name and a coffee table of book covers when I arrive, so that I understand whose portfolio this is and how to explore it.

#### Acceptance Criteria

1. WHEN the Landing_Page finishes loading, THE System SHALL display the text "Giuliana C. Bilbao" as the Name_Treatment anchored to the top-left corner of the Landing_Page viewport.
2. WHEN the Landing_Page finishes loading, THE System SHALL display the Coffee_Table containing one Book_Cover for each configured Sector arranged in a grid layout, defaulting to the five Sectors Sensing, Modeling, Movement, Reasoning, and Delivery.
3. WHILE the top of the Landing_Page is within the viewport, THE System SHALL keep the Name_Treatment visible in the top-left corner.
4. THE System SHALL render each Book_Cover with a title and cover styling that uniquely identifies the Sector the Book represents, such that no two Book_Cover elements share the same title.
5. WHERE the Sector configuration defines zero sectors, THE System SHALL display the Landing_Page with the Name_Treatment and an empty Coffee_Table without error.

### Requirement 2: Scrolling Behavior

**User Story:** As a visitor, I want to scroll the landing page, so that I can view all book covers when they do not fit within a single viewport.

#### Acceptance Criteria

1. WHERE the total height of the Coffee_Table content is greater than the viewport height, THE Landing_Page SHALL allow vertical scrolling to reveal the remaining Book_Cover elements.
2. WHILE the Landing_Page scroll position is changing, THE System SHALL suspend Book_Cover click activation and Book_Cover Hover lift to prevent accidental selection.
3. WHEN the Landing_Page scroll position has remained unchanged for at least 150 milliseconds, THE System SHALL restore Book_Cover interactivity for Hover and click actions.
4. WHERE the total height of the Coffee_Table content is less than or equal to the viewport height, THE Landing_Page SHALL display all Book_Cover elements without requiring scrolling.

### Requirement 3: Hover Lift Interaction

**User Story:** As a visitor using a mouse, I want a book to lift when I hover over it, so that I get clear feedback about which book I am about to select.

#### Acceptance Criteria

1. WHEN the pointer enters the bounds of a Book_Cover on a device that supports Hover, THE System SHALL animate that Book_Cover into a lifted state in which the Book_Cover is displaced upward from its resting position by a fixed nonzero offset, completing the animation within the animation time limit defined in Requirement 9.
2. WHEN the pointer leaves the bounds of a lifted Book_Cover, THE System SHALL animate that Book_Cover back to its resting state in which the upward displacement offset is zero.
3. WHILE a Book_Cover is in the lifted state, THE System SHALL keep all other Book_Cover elements in their resting state with an upward displacement offset of zero.
4. WHEN the pointer moves directly from a lifted Book_Cover into the bounds of a different Book_Cover on a device that supports Hover, THE System SHALL return the previously lifted Book_Cover to its resting state and animate the newly entered Book_Cover into the lifted state.
5. WHERE the visitor's device does not support Hover, THE System SHALL present Book_Cover elements in their resting state and rely on tap to select.
6. WHERE the visitor's device supports Hover, THE System SHALL enable the Book_Cover lift interaction regardless of whether the device also supports touch input.

### Requirement 4: Opening a Book

**User Story:** As a visitor, I want to click or tap a book to open it, so that I can view the portfolio content for that sector.

#### Acceptance Criteria

1. WHEN a visitor completes a click or tap whose press and release both occur within the bounds of the same Book_Cover, THE System SHALL open the corresponding Portfolio_View for that Book within 600 milliseconds of the activation.
2. WHEN the System opens a Portfolio_View, THE System SHALL animate the transition from the Book_Cover to the Portfolio_View and complete the transition within 600 milliseconds.
3. IF the animation system is unavailable or disabled, THEN THE System SHALL open the Portfolio_View using an immediate transition that reaches the fully open Portfolio_View state within 100 milliseconds and without an intermediate animated transition.
4. WHILE a Portfolio_View is open, THE System SHALL display a return control that is keyboard-focusable and keyboard-activatable, remains present and activatable in every Page state of that Portfolio_View, and returns the visitor to the Landing_Page.
5. WHEN the visitor activates the return control, THE System SHALL close the Portfolio_View and display the Landing_Page with the Coffee_Table within 600 milliseconds of the activation.
6. IF a visitor completes a click or tap on a Book_Cover WHILE a Portfolio_View is already open, THEN THE System SHALL keep the currently open Portfolio_View displayed and SHALL NOT open a second Portfolio_View.

### Requirement 5: Page-Flip Navigation

**User Story:** As a visitor, I want to flip through the pages of an opened book, so that I can browse the portfolio content sequentially.

#### Acceptance Criteria

1. WHEN a Portfolio_View containing one or more Pages is open, THE System SHALL display the first Page of the Portfolio_View.
2. WHEN the visitor activates the next-page control AND a next Page exists AND no page-flip transition is in progress, THE System SHALL animate a page-flip transition and display the next Page.
3. WHEN the visitor activates the previous-page control AND a previous Page exists AND no page-flip transition is in progress, THE System SHALL animate a page-flip transition and display the previous Page.
4. IF the currently displayed Page is the last Page and the visitor activates the next-page control, THEN THE System SHALL keep the last Page displayed and present a boundary visual cue lasting no longer than 600 milliseconds without changing the Page.
5. IF the currently displayed Page is the first Page and the visitor activates the previous-page control, THEN THE System SHALL keep the first Page displayed and present a boundary visual cue lasting no longer than 600 milliseconds without changing the Page.
6. WHEN the displayed Page changes, THE System SHALL update an indicator showing the current Page number and the total number of Pages within the Portfolio_View.
7. IF the visitor activates the next-page or previous-page control WHILE a page-flip transition is in progress, THEN THE System SHALL ignore the activation and complete the in-progress transition without changing the target Page.

### Requirement 6: Portfolio Content and Metadata

**User Story:** As a visitor, I want each book to contain projects, images, and metadata, so that I can learn about the owner's work in that sector.

#### Acceptance Criteria

1. WHEN a Portfolio_View is opened, THE System SHALL display at least one Project_Entry distributed across the Pages of that Portfolio_View.
2. WHEN the System displays a Project_Entry, THE System SHALL render that Project_Entry with a title, descriptive text, and at least one associated image.
3. WHEN a Portfolio_View is opened, THE System SHALL display a Metadata_Block within that Portfolio_View containing a location value and a date value.
4. WHERE contact information is provided for a Portfolio_View, THE System SHALL display the contact information within the Metadata_Block.
5. WHERE contact information is not provided for a Portfolio_View, THE System SHALL display the Metadata_Block without a contact information entry.
6. WHEN a Portfolio_View is opened, THE System SHALL render its content using the editorial black-and-white spread styling, including binder-ring visual elements.
7. IF a Project_Entry image does not complete loading within 10 seconds or reports a load error, THEN THE System SHALL replace the missing image with a placeholder of the same layout footprint and retain the position and size of all surrounding Project_Entry content.

### Requirement 7: Sector Configuration

**User Story:** As the portfolio owner, I want the set of sectors and their books to be configurable, so that I can change the grouping without rebuilding the site structure.

#### Acceptance Criteria

1. THE System SHALL derive the set of Book elements from a configuration source in which each entry defines a Sector title, a cover styling identifier, and an ordered collection of Portfolio_View content.
2. WHEN the Sector configuration defines N sectors where N is between 1 and 12 inclusive, THE System SHALL render exactly N Book_Cover elements in the Coffee_Table in the order defined by the configuration.
3. WHERE a Sector configuration entry omits Portfolio_View content, THE System SHALL display the corresponding Portfolio_View with an empty-state message indicating that content is not yet available.
4. IF the configuration source is unavailable or malformed, THEN THE System SHALL display the Landing_Page without any Book_Cover elements and SHALL NOT fail to render the Name_Treatment.

### Requirement 8: Responsiveness Across Devices

**User Story:** As a visitor on any device, I want the layout to adapt to my screen, so that I can browse comfortably on desktop, tablet, or phone.

#### Acceptance Criteria

1. WHERE the viewport width is greater than or equal to 1024 CSS pixels, THE System SHALL arrange Book_Cover elements in a grid of at least 3 columns with all Book_Cover elements fully within the viewport width.
2. WHERE the viewport width is greater than or equal to 640 CSS pixels and less than 1024 CSS pixels, THE System SHALL arrange Book_Cover elements in a grid of exactly 2 columns with all Book_Cover elements fully within the viewport width.
3. WHERE the viewport width is less than 640 CSS pixels, THE System SHALL arrange Book_Cover elements in a grid of exactly 1 column with all Book_Cover elements fully within the viewport width.
4. WHEN a viewport resize causes the viewport width to cross a breakpoint boundary of 640 or 1024 CSS pixels, THE System SHALL re-arrange the Coffee_Table to the column count for the new tier within 500 milliseconds.
5. THE System SHALL render Landing_Page and Portfolio_View content such that the horizontal scroll extent does not exceed the viewport width.

### Requirement 9: Animation Performance

**User Story:** As a visitor, I want animations to feel smooth, so that the experience feels polished rather than sluggish.

#### Acceptance Criteria

1. WHEN the System animates a Book_Cover lift, page-flip, or open/close transition, THE System SHALL complete the animation within 600 milliseconds.
2. WHILE animating a Book_Cover lift, page-flip, or open/close transition, THE System SHALL render the animation at a sustained rate of at least 60 frames per second.
3. WHERE the visitor's system indicates a reduced-motion preference, THE System SHALL replace animated transitions with immediate state changes that reach the target state within 50 milliseconds, regardless of other timing constraints.
4. IF the measured animation frame rate falls below 30 frames per second during any Book_Cover lift, page-flip, or open/close transition, THEN THE System SHALL replace subsequent animated transitions with immediate state changes that reach the target state within 50 milliseconds.
5. WHILE an open, close, or page-flip transition is in progress, THE System SHALL ignore additional open, close, or page-flip activations until the in-progress transition completes.

### Requirement 10: Accessibility

**User Story:** As a visitor who uses assistive technology or a keyboard, I want to navigate the portfolio without a mouse, so that I can access all content.

#### Acceptance Criteria

1. THE System SHALL include every Book_Cover in the keyboard focus order so that each Book_Cover can receive focus through sequential keyboard navigation.
2. WHEN a Book_Cover has keyboard focus AND the visitor presses the Enter key or the Space key, THE System SHALL open the corresponding Portfolio_View for that Book.
3. WHEN a Book_Cover receives keyboard focus, THE System SHALL display a focus indicator on that Book_Cover that is visually distinct from its unfocused state and maintains a contrast ratio of at least 3:1 against the adjacent colors of the Book_Cover in its unfocused state.
4. THE System SHALL make the next-page control, the previous-page control, and the return-to-Landing_Page control within a Portfolio_View reachable through the keyboard focus order and activatable using the Enter key or the Space key.
5. WHEN a Book_Cover is rendered, THE System SHALL provide a non-empty text alternative for that Book_Cover that identifies the Sector it represents.
6. WHEN a Project_Entry image is rendered, THE System SHALL provide a non-empty text alternative for that image that conveys the same information the image presents to a sighted visitor.
7. THE System SHALL maintain a contrast ratio of at least 4.5:1 between the Name_Treatment text and its background.
8. WHEN the System opens a Portfolio_View, THE System SHALL move keyboard focus into the Portfolio_View.
9. WHEN the System closes a Portfolio_View and displays the Landing_Page, THE System SHALL move keyboard focus to the Book_Cover that corresponds to the closed Portfolio_View.

## Sector Structure

The Sector grouping is finalized as five Books using a verb/gerund title style and a "systems of the body" narrative framing. Each Book maps to real project areas from the owner's background. Because the Sector set is configurable (Requirement 7), titles and mappings can still be adjusted without restructuring the site.

1. **Sensing** — biosignals, imaging, and neural recording.
   - Losonczy Lab: voltage-imaging GUI, spike/burst analysis, calcium dynamics (linked to publication)
   - Neural Circuits Lab: optogenetics, fiber photometry, neural activity tracking

2. **Modeling** — physiological machine learning.
   - J&J ML Engineer: biometric time-series (PyTorch), sleep/activity modeling
   - Computer vision for robotic surgery

3. **Movement** — biomechanics and rehabilitation.
   - Musculoskeletal Biomechanics Lab: cartilage mechanical testing, MATLAB surface analysis, 3D-printed fixtures
   - Robotic & Rehabilitation Lab: kinematic modeling, VR rehabilitation games for cerebral palsy

4. **Reasoning** — agentic and applied data science.
   - J&J Patient Data Science: shipment-delay prediction, medication-reorder prediction
   - AI-assisted feature validation; agentic / LLM-oriented projects
   - Additional not-yet-listed materials to be added

5. **Delivery** — regulated software and product translation.
   - J&J Technical Product Analyst (TLDP): GxP validation, release readiness, cross-functional delivery

## Open Questions

- **Final cover wording and per-book styling:** Verb/gerund titles are chosen; exact display wording and each Book_Cover's visual treatment (color, icon/motif) will be finalized during design.
- **Additional projects:** The owner has further materials not yet on LinkedIn, primarily targeting the Reasoning book. Specific Project_Entry content will be supplied during design/implementation.
