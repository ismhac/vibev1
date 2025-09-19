# Epic 1: Project Foundation & Core Layout

> This document is a granulated shard from the main "Product Requirements Document" and focuses on the User Stories for Epic 1.

## 1. Epic Goal

This epic aims to establish the complete technical foundation for the project and implement the core, reusable layout components (Navbar and Footer). Completion of this epic will result in a runnable, albeit empty, application skeleton with a consistent header and footer across all primary pages. This foundational work is critical to enable parallel development on subsequent epics.

## 2. Stories within this Epic

### Story 1.1: Technical Setup - Initialize Frontend Project

*   **Goal/User Story:** As a Developer, I want to initialize a new Angular project with all core libraries and configurations set up, so that I have a standardized and ready-to-use foundation for frontend development.
*   **Requirements:**
    *   Create a new Angular application using the Angular CLI.
    *   Integrate the `NG-ZORRO` UI library.
    *   Set up `NgRx` for state management.
    *   Configure `ESLint` and `Prettier` for code quality and consistent formatting.
    *   **The folder structure must strictly adhere to the guidelines in `frontend-architecture.md` (Section 3: Project Structure).**
*   **Acceptance Criteria (ACs):**
    *   **AC1:** A new Angular project is created and can be run locally using the `ng serve` command.
    *   **AC2:** `NG-ZORRO`, `NgRx`, `ESLint`, and `Prettier` are installed and their basic configuration files are present in the project.
    *   **AC3:** The folder structure inside `src/app/` matches the design in the `frontend-architecture.md` document (e.g., `core`, `shared`, `features` folders are created).

### Story 1.2: Technical Setup - Initialize Backend Project

*   **Goal/User Story:** As a Developer, I want to initialize a new NestJS project with all core libraries and the database connection configured, so that I have a standardized and ready-to-use foundation for backend development.
*   **Requirements:**
    *   Create a new NestJS application using the NestJS CLI.
    *   Install and configure `TypeORM` to connect to the MySQL database.
    *   Install the `Passport` and `JWT` modules for future authentication features.
    *   Define initial environment variables for the database connection (`.env` file).
*   **Acceptance Criteria (ACs):**
    *   **AC1:** A new NestJS project is created and can be run locally.
    *   **AC2:** The application successfully connects to the MySQL database on startup.
    *   **AC3:** Core modules for `TypeORM`, `Passport`, and `JWT` are installed.
    *   **AC4:** Database connection parameters are managed via environment variables and are not hardcoded.

### Story 1.3: Implement Shared Navbar Component

*   **Goal/User Story:** As a User, I want to see a consistent navigation bar at the top of every page, so that I can easily navigate the website.
*   **Requirements:**
    *   Create a reusable Navbar component within the `shared` module.
    *   The Navbar must contain the FPT Software logo.
    *   The Navbar must display the following navigation links: Home, About, Industries, Announcements, Contact.
    *   **The component must be implemented following the `frontend-architecture.md` (Section 5: Component Strategy) and adhere to the naming conventions (Section 3.2).**
    *   The Navbar component should be placed in the main `app.component.html` to be displayed on all pages.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** A `NavbarComponent` is created in the `src/app/shared/components/` directory as per the project structure.
    *   **AC2:** When the application runs, the Navbar is always visible and fixed at the top of the viewport.
    *   **AC3:** The Navbar correctly displays the logo and all specified menu links.
    *   **AC4:** The menu item for the currently active page is visually highlighted.

### Story 1.4: Implement Shared Footer Component

*   **Goal/User Story:** As a User, I want to see a consistent footer at the bottom of every page, so that I can find key company information and statistics.
*   **Requirements:**
    *   Create a reusable Footer component within the `shared` module.
    *   The Footer must have three columns: "Contact us", "About us", "Statistics".
    *   The "Statistics" column must include a placeholder for the real-time counter.
    *   **The component must be implemented following the `frontend-architecture.md` (Section 5: Component Strategy) and adhere to the naming conventions (Section 3.2).**
    *   The Footer component should be placed in the main `app.component.html`.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** A `FooterComponent` is created in the `src/app/shared/components/` directory as per the project structure.
    *   **AC2:** When the application runs, the Footer is always visible and fixed at the bottom of the viewport.
    *   **AC3:** The Footer correctly displays the three columns with their respective titles and placeholder content.
    *   **AC4:** The "Statistics" column contains a visible counter (initially can be a static number, e.g., "0").

### Story 1.5: Establish Basic Page Routing Structure

*   **Goal/User Story:** As a Developer, I want to set up the basic application routing system, so that navigation links work and there are placeholder pages for future development.
*   **Requirements:**
    *   Create placeholder components for each main page: Home, About, Industries, Announcements, Contact.
    *   Configure `app-routing.module.ts` to map URL paths (e.g., `/`, `/about`, `/industries`) to their corresponding placeholder components.
    *   **The routing configuration must follow the principles outlined in `frontend-architecture.md` (Section 6: Routing & Navigation).**
    *   Ensure the main `app.component.html` includes the `<router-outlet>` directive to display page content.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** Placeholder components for Home, About, Industries, Announcements, and Contact are created.
    *   **AC2:** `app-routing.module.ts` contains route definitions for all main pages, adhering to the configuration in `frontend-architecture.md`.
    *   **AC3:** Clicking a link in the Navbar navigates the user to the corresponding URL and displays the correct placeholder component's content.
    *   **AC4:** The main application layout in `app.component.html` contains the Navbar, `<router-outlet>`, and Footer, in that order.
