## ADDED Requirements

### Requirement: Theme configuration file
The system SHALL read theme and site configuration from a theme.config.json file.

#### Scenario: Load config on page load
- **WHEN** the gallery page loads
- **THEN** theme.config.json is fetched and applied

#### Scenario: Fallback to defaults
- **WHEN** theme.config.json is missing or invalid
- **THEN** default configuration values are used

### Requirement: Site info configuration
The system SHALL allow customization of site title, logo, and navigation via config.

#### Scenario: Custom site title
- **WHEN** site.title is defined in config
- **THEN** the page title and header display the custom title

#### Scenario: Custom logo
- **WHEN** site.logo is defined in config
- **THEN** the custom logo image displays in the header

#### Scenario: Custom navigation links
- **WHEN** navigation.links is defined in config
- **THEN** the navigation menu uses the custom links

### Requirement: Color theme configuration
The system SHALL allow customization of color scheme via CSS variables defined in config.

#### Scenario: Apply custom colors
- **WHEN** theme.colors is defined in config
- **THEN** CSS variables are set with the custom color values

#### Scenario: Custom primary color
- **WHEN** theme.colors.primary is defined
- **THEN** all primary UI elements use the custom color

#### Scenario: Custom accent color
- **WHEN** theme.colors.accent is defined
- **THEN** all accent UI elements (buttons, links) use the custom color

### Requirement: Font configuration
The system SHALL allow customization of heading and body fonts via config.

#### Scenario: Custom heading font
- **WHEN** theme.fonts.heading is defined
- **THEN** all headings use the specified font family

#### Scenario: Custom body font
- **WHEN** theme.fonts.body is defined
- **THEN** all body text uses the specified font family
