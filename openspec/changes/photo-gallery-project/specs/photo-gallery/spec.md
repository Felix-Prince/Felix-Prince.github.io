## ADDED Requirements

### Requirement: Photo grid display
The system SHALL display photos in a responsive grid layout with adaptive column counts based on viewport size.

#### Scenario: Desktop viewport
- **WHEN** viewport width is 1024px or greater
- **THEN** photos display in a 3-column grid

#### Scenario: Tablet viewport
- **WHEN** viewport width is between 768px and 1023px
- **THEN** photos display in a 2-column grid

#### Scenario: Mobile viewport
- **WHEN** viewport width is less than 768px
- **THEN** photos display in a 1-column layout

### Requirement: Timeline view
The system SHALL provide an alternative timeline view that displays photos sorted chronologically with date markers.

#### Scenario: Switch to timeline view
- **WHEN** user clicks the "Timeline" view toggle
- **THEN** photos reorder to show chronological sequence with date section headers

#### Scenario: Switch back to grid view
- **WHEN** user clicks the "Grid" view toggle
- **THEN** photos return to the grid layout

### Requirement: Lightbox viewer
The system SHALL open photos in a fullscreen lightbox viewer when clicked.

#### Scenario: Open lightbox
- **WHEN** user clicks on a photo thumbnail
- **THEN** the photo opens in a fullscreen lightbox overlay

#### Scenario: Navigate photos in lightbox
- **WHEN** lightbox is open and user clicks next/previous buttons or uses arrow keys
- **THEN** the next/previous photo in the current sequence displays

#### Scenario: Close lightbox
- **WHEN** user clicks the close button, presses ESC key, or clicks outside the image
- **THEN** lightbox closes and returns to the gallery view

#### Scenario: Display photo info in lightbox
- **WHEN** photo is viewed in lightbox
- **THEN** photo title, tags, date, and camera settings (if available) are displayed

### Requirement: Lazy loading
The system SHALL lazy load images as they enter the viewport to optimize performance.

#### Scenario: Image loads on scroll
- **WHEN** user scrolls and a photo placeholder enters the viewport
- **THEN** the actual photo image loads and displays

### Requirement: Photo metadata display
The system SHALL display photo metadata including title, date, and optionally camera settings.

#### Scenario: Hover shows metadata
- **WHEN** user hovers over a photo thumbnail in grid view
- **THEN** photo title and date overlay on the image

#### Scenario: Photo page shows full metadata
- **WHEN** photo is viewed in lightbox
- **THEN** all available metadata (title, description, tags, date, camera, settings) is visible
