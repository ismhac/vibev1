# Epic 4: Admin Portal & Content Management

> This document is a granulated shard from the main "Product Requirements Document" and focuses on the User Stories for Epic 4. This epic builds the administrative area for managing the website's dynamic content.

## 1. Epic Goal

This epic aims to build a secure admin area, allowing users with appropriate roles (Admin, Editor) to log in and manage all dynamic content of the website, including Users, Industries, and Announcements. This epic will also upgrade the existing APIs to interact with a real database instead of mocked data.

## 2. Stories within this Epic

### STAGE 1: DATABASE & AUTHENTICATION FOUNDATION (BACKEND)

#### Story 4.1 (Technical Setup): Initialize Database Container with Docker

*   **Goal/User Story:** As a Developer, I want to define and run the database service using Docker Compose, to have a stable and isolated database environment for the backend application to connect to.
*   **Requirements:**
    *   Create or update the `docker-compose.yml` file in the project root.
    *   Define a service for `mysql`, using the official MySQL image.
    *   Configure necessary environment variables (e.g., `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`).
    *   Set up a Docker volume to ensure persistent storage for the database data.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** The `docker-compose.yml` file contains a valid `mysql` service definition.
    *   **AC2:** Running `docker-compose up -d` successfully starts the MySQL container.
    *   **AC3:** Data in the database persists after the container is stopped and restarted.

#### Story 4.2 (Backend): Implement Data Models & Seeding for User/Role

*   **Dependency:** Story 4.1
*   **Goal/User Story:** As a Developer, I want to define and seed the initial data for Users and Roles, so that the system has a default admin account from the very beginning.
*   **Requirements:**
    *   Create `User` and `Role` entities in TypeORM.
    *   Set up a "seeding" mechanism to automatically add "Admin" and "Editor" roles and a default admin account (with securely configured credentials) to the database when the application starts.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** `users` and `roles` tables are created in the database.
    *   **AC2:** After application startup, the `roles` table contains "Admin" and "Editor", and the `users` table contains at least one account with the "Admin" role.

#### Story 4.3 (Backend): Implement User Authentication API (Login)

*   **Dependency:** Story 4.2
*   **Goal/User Story:** As a Developer, I want to build a login API so that users can authenticate and receive an access token.
*   **Requirements:**
    *   Create a `POST /api/v1/auth/login` endpoint.
    *   This endpoint receives a `username` and `password`, matching them against the DB.
    *   If authentication is successful, return a valid JSON Web Token (JWT).
*   **Acceptance Criteria (ACs):**
    *   **AC1:** Sending correct credentials to the endpoint returns a 200 status code and a JWT.
    *   **AC2:** Sending incorrect credentials returns a 401 (Unauthorized) status code.

#### Story 4.4 (Backend): Implement API Authorization Mechanism (Guards)

*   **Goal/User Story:** As a Developer, I want to create protection mechanisms so that only valid users can access protected APIs.
*   **Requirements:**
    *   Create a `JwtAuthGuard` to validate the JWT in the request header.
    *   Create a `RolesGuard` to check the user's role (`Admin`, `Editor`).
*   **Acceptance Criteria (ACs):**
    *   **AC1:** An API protected by `JwtAuthGuard` returns a 401 error if the token is missing or invalid.
    *   **AC2:** An API protected by `RolesGuard('Admin')` returns a 403 (Forbidden) error if the user has a role other than "Admin".

#### Story 4.5 (Backend): Implement User Management API (Admin only)

*   **Goal/User Story:** As an Admin, I want to have APIs to manage other user accounts.
*   **Requirements:**
    *   Build CRUD endpoints (`GET`, `POST`, `PUT`, `DELETE`) for the `/api/v1/users` resource.
    *   All these endpoints must be protected by both `JwtAuthGuard` and `RolesGuard('Admin')`.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** Only users with the "Admin" role can successfully access these endpoints.
    *   **AC2:** The functions for creating, listing, viewing, updating, and deleting users work correctly.

### STAGE 2: UPGRADE CONTENT APIS (BACKEND)

#### Story 4.6 (Backend): Upgrade Industries API (CRUD with Real DB)

*   **Goal/User Story:** As a Developer, I want to upgrade the `Industries` API to read and write real data from the database.
*   **Requirements:**
    *   Modify the `GET` endpoints in the `Industries` module to query data from the DB instead of returning mock data.
    *   Implement `POST`, `PUT`, `DELETE` endpoints to create, update, and delete industries.
    *   Protect the CUD (Create, Update, Delete) endpoints with `JwtAuthGuard` and `RolesGuard('Admin', 'Editor')`.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** The `GET /api/v1/industries` API returns real data from the DB.
    *   **AC2:** Only Admins and Editors can successfully create, edit, and delete industries.

#### Story 4.7 (Backend): Upgrade Announcements API (CRUD with Real DB)

*   **Goal/User Story:** As a Developer, I want to upgrade the `Announcements` API to work with real data and support file uploads.
*   **Requirements:**
    *   Modify the `GET` endpoints in the `Announcements` module to work with the real DB.
    *   Implement `POST`, `PUT`, `DELETE` endpoints.
    *   Integrate file upload handling for images and attachments.
    *   Protect the CUD endpoints with `JwtAuthGuard` and `RolesGuard('Admin', 'Editor')`.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** The `GET /api/v1/announcements` API returns real data from the DB.
    *   **AC2:** Only Admins and Editors can create, edit, and delete announcements.
    *   **AC3:** Files can be successfully uploaded when creating/editing an announcement.

### STAGE 3: BUILD ADMIN UI (FRONTEND)

#### Story 4.8 (Frontend): Implement Login Page & Auth Flow

*   **Goal/User Story:** As an Admin/Editor, I want to log into the system to access the admin area.
*   **Requirements:**
    *   Create an `AuthModule` and a `/login` page.
    *   The login form will call the `POST /api/v1/auth/login` API.
    *   Securely store the received JWT and attach it automatically to subsequent requests using an `HttpInterceptor`.
    *   Create a frontend `AuthGuard` to protect admin routes.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** A successful login redirects the user to the admin dashboard.
    *   **AC2:** Attempting to access an admin page without being logged in redirects to the login page.

#### Story 4.9 (Frontend): Implement General Admin Layout

*   **Goal/User Story:** As an Admin/Editor, I want a clear navigation layout for the admin area.
*   **Requirements:**
    *   Create a separate layout for the `/admin` area with a persistent navigation sidebar.
    *   The sidebar should contain links to: User Management, Industry Management, Announcement Management.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** After login, the admin interface is displayed with a navigation sidebar.
    *   **AC2:** The sidebar shows the correct links.

#### Story 4.10 (Frontend): Implement User Management UI

*   **Goal/User Story:** As an Admin, I want to manage user accounts through a user interface.
*   **Requirements:**
    *   Build a UI to display a list of users with buttons to add, edit, and delete.
    *   Create a form to add/edit a user, including role assignment.
    *   Interact with the APIs from Story 4.5.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** The table correctly displays the list of users.
    *   **AC2:** The add, edit, and delete functionalities work through the UI.

#### Story 4.11 (Frontend): Implement Industry Management UI

*   **Goal/User Story:** As an Admin/Editor, I want to manage industries through a user interface.
*   **Requirements:**
    *   Build a UI to display, add, edit, and delete industries.
    *   Interact with the upgraded APIs from Story 4.6.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** The CRUD functionalities for industries work completely through the UI.

#### Story 4.12 (Frontend): Implement Announcement Management UI

*   **Goal/User Story:** As an Admin/Editor, I want to manage announcements through a user interface.
*   **Requirements:**
    *   Build a UI to display, add, edit, and delete announcements.
    *   Integrate a rich text editor for the content field.
    *   Integrate file upload functionality for images and attachments.
    *   Interact with the upgraded APIs from Story 4.7.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** The CRUD functionalities for announcements work completely through the UI.
    *   **AC2:** Files can be successfully uploaded via the form.
