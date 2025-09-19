# Epic 2: Public Content Pages & Multilingual Support

> This document is a granulated shard from the main "Product Requirements Document" and focuses on the User Stories for Epic 2. It builds upon the foundation completed in Epic 1.

## 1. Epic Goal

This epic aims to build the main content-displaying pages for end-users and implement the multilingual functionality for the UI. The backend will provide the necessary APIs with mocked data, allowing the frontend to build the UI completely. Upon completion, the website will have a full suite of public information pages, and users will be able to switch the display language.

## 2. Stories within this Epic

### BACKEND FLOW

#### Story 2.1 (Backend): Implement Industries API

*   **Goal/User Story:** As a Developer, I want to build the API endpoints for "Industries" to provide data to the frontend.
*   **Requirements:**
    *   Create an `Industry` module, controller, service, and entity in the NestJS project.
    *   Implement a `GET /api/v1/industries` endpoint to return a paginated list of industries.
    *   Implement a `GET /api/v1/industries/:id` endpoint to return the details of a single industry.
    *   **Key Note:** As there is no real data yet, these endpoints must return mocked data that is consistent with the data model defined in `architecture.md`.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** Calling `GET /api/v1/industries` returns a 200 status code and an array of mock industry objects.
    *   **AC2:** Calling `GET /api/v1/industries/:id` with a valid ID returns a 200 status code and a single mock industry object.

#### Story 2.2 (Backend): Implement Announcements API

*   **Goal/User Story:** As a Developer, I want to build the API endpoints for "Announcements" to provide data to the frontend.
*   **Requirements:**
    *   Create an `Announcement` module, controller, service, and entity in the NestJS project.
    *   Implement a `GET /api/v1/announcements` endpoint to return a paginated list of announcements (defaulting to the 5 most recent).
    *   Implement a `GET /api/v1/announcements/:id` endpoint to return the details of a single announcement.
    *   **Key Note:** These endpoints must also return mocked data with a consistent structure.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** Calling `GET /api/v1/announcements` returns a 200 status code and an array of mock announcement objects.
    *   **AC2:** Calling `GET /api/v1/announcements/:id` with a valid ID returns a 200 status code and a single mock announcement object.

### FRONTEND FLOW

#### Story 2.3 (Frontend): Implement Multilingual Support

*   **Goal/User Story:** As a User, I want to be able to switch the website's language between Vietnamese and English to read content in my preferred language.
*   **Requirements:**
    *   Install and configure the `@ngx-translate` library as per the guidelines in `frontend-architecture.md` (Section 8).
    *   Create `en.json` and `vi.json` files in `assets/i18n/` to hold static text strings (e.g., Navbar menu items, Footer titles).
    *   Add an icon (e.g., a flag) to the `NavbarComponent` to allow users to switch the language.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** A language switcher icon is visible on the Navbar.
    *   **AC2:** Clicking the icon instantly changes the language of static UI components (menus, titles, buttons) without a page reload.

#### Story 2.4 (Frontend): Implement Static Content Pages (About & Contact)

*   **Goal/User Story:** As a User, I want to view the "About" and "Contact" pages to understand more about the company.
*   **Requirements:**
    *   Utilize the placeholder components created in Epic 1 for `About` and `Contact`.
    *   Add simple placeholder text and images to these pages as described in the `prd.md`.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** Navigating to the `/about` route displays the About page with its content.
    *   **AC2:** Navigating to the `/contact` route displays the Contact page with its content.

#### Story 2.5 (Frontend): Implement Industries Page & Detail View

*   **Dependency:** Story 2.1 (Backend)
*   **Goal/User Story:** As a User, I want to browse the list of industries and view the details of each one.
*   **Requirements:**
    *   Create an `IndustriesModule` and necessary components (e.g., `IndustryListComponent`, `IndustryDetailComponent`).
    *   The list page (`/industries`) will call the `GET /api/v1/industries` API to display industries as cards.
    *   Implement pagination on the list page.
    *   Clicking an industry navigates to the detail page (`/industries/:id`).
    *   The detail page will call the `GET /api/v1/industries/:id` API to display the full information.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** The `/industries` page successfully displays a list of industries from the API (mocked data).
    *   **AC2:** Pagination works correctly.
    *   **AC3:** Clicking on an industry navigates to the correct detail URL and displays the corresponding data.

#### Story 2.6 (Frontend): Implement Announcements Page & Detail View

*   **Dependency:** Story 2.2 (Backend)
*   **Goal/User Story:** As a User, I want to read the latest announcements and view their detailed content.
*   **Requirements:**
    *   Create an `AnnouncementsModule` and necessary components.
    *   The list page (`/announcements`) will call the `GET /api/v1/announcements` API to display a list of announcements.
    *   Implement pagination.
    *   Clicking an announcement navigates to the detail page (`/announcements/:id`).
    *   The detail page will call `GET /api/v1/announcements/:id` to display the title, content, images, and attachments.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** The `/announcements` page successfully displays a list of announcements from the API (mocked data).
    *   **AC2:** Pagination works correctly.
    *   **AC3:** Clicking on an announcement navigates to the correct detail URL and displays the corresponding data.
