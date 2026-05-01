## ADDED Requirements

### Requirement: Search by keyword
The system SHALL allow searching photos by keyword in title, description, and tags.

#### Scenario: Search matches title
- **WHEN** user enters a search term that matches a photo's title
- **THEN** the matching photo appears in search results

#### Scenario: Search matches description
- **WHEN** user enters a search term that matches a photo's description
- **THEN** the matching photo appears in search results

#### Scenario: Search matches tags
- **WHEN** user enters a search term that matches any of a photo's tags
- **THEN** the matching photo appears in search results

#### Scenario: Case-insensitive search
- **WHEN** user searches with mixed case
- **THEN** matching is performed case-insensitively

### Requirement: Filter by date range
The system SHALL allow filtering photos by date range.

#### Scenario: Filter by start date
- **WHEN** user selects a start date
- **THEN** only photos on or after the start date are displayed

#### Scenario: Filter by end date
- **WHEN** user selects an end date
- **THEN** only photos on or before the end date are displayed

#### Scenario: Filter by date range
- **WHEN** user selects both start and end dates
- **THEN** only photos within the date range are displayed

### Requirement: Combine search and filters
The system SHALL allow combining keyword search with tag filters and date range filters.

#### Scenario: Search within tagged photos
- **WHEN** user selects a tag filter AND enters a search term
- **THEN** results are photos that match BOTH the tag filter AND the search term

#### Scenario: Search within date range
- **WHEN** user sets a date range AND enters a search term
- **THEN** results are photos that match BOTH the date range AND the search term

#### Scenario: Search with tags and date range
- **WHEN** user selects tags AND sets date range AND enters search term
- **THEN** results match ALL applied criteria

### Requirement: Clear search and filters
The system SHALL provide a way to clear all search and filter criteria.

#### Scenario: Clear search term
- **WHEN** user clicks the clear button in the search field
- **THEN** the search term is cleared

#### Scenario: Reset all filters
- **WHEN** user clicks "Reset All" button
- **THEN** all filters (tags, date range) and search term are cleared, showing all photos

### Requirement: Show result count
The system SHALL display the number of photos matching current search/filter criteria.

#### Scenario: Display result count
- **WHEN** search or filter is applied
- **THEN** the number of matching photos is displayed (e.g., "24 photos")

#### Scenario: No results message
- **WHEN** no photos match the search/filter criteria
- **THEN** a "No photos found" message is displayed
