## ADDED Requirements

### Requirement: Photo data structure
The system SHALL store photo data in a JSON format that supports multiple tags per photo.

#### Scenario: Photo with multiple tags
- **WHEN** a photo entry exists in photos.json with tags array
- **THEN** all tags in the array are associated with the photo

#### Scenario: Photo metadata structure
- **WHEN** parsing photos.json
- **THEN** each photo MUST include id, title, url, tags, and date fields

### Requirement: Tag-based filtering
The system SHALL allow filtering photos by selecting one or more tags.

#### Scenario: Select single tag filter
- **WHEN** user clicks on a tag in the tag list
- **THEN** only photos with that tag are displayed

#### Scenario: Select multiple tag filters
- **WHEN** user selects multiple tags
- **THEN** photos matching ANY of the selected tags are displayed

#### Scenario: Clear tag filter
- **WHEN** user clicks the "Clear All" or deselects all tags
- **THEN** all photos are displayed again

### Requirement: Tag cloud display
The system SHALL display a tag cloud showing all available tags with photo counts.

#### Scenario: Tag shows photo count
- **WHEN** tag cloud is displayed
- **THEN** each tag shows the number of photos with that tag in parentheses

#### Scenario: Tags sorted by usage
- **WHEN** tag cloud is displayed
- **THEN** tags are sorted by photo count (most frequent first)

### Requirement: Photo appears in multiple tag categories
The system SHALL display a photo in all tag categories it belongs to.

#### Scenario: Photo with multiple tags in filter results
- **WHEN** a photo has tags ["street", "portrait", "black-and-white"]
- **THEN** the photo appears in results when filtering by "street", "portrait", OR "black-and-white"
