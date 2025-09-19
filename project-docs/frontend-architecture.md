# Frontend Architecture Document

## 1. Introduction

### 1.1. Purpose of the Document
This document details the technical architecture of the Frontend (Angular) application for the FPT Software website project. It provides guidance on project structure, state management, component strategy, routing, backend communication, internationalization, styling, testing, and deployment. The purpose is to ensure the Frontend development team has a clear, consistent roadmap to build a robust, maintainable, and scalable application.

### 1.2. Frontend Architectural Goals
The Frontend architecture will be designed to achieve the following goals:
1.  **User Experience:** Ensure a smooth, responsive, and consistent interface across all devices and browsers.
2.  **Maintainability:** Code must be modular, readable, understandable, and easy to modify and extend.
3.  **Performance:** Optimize initial page load times, minimize resource usage, and ensure smooth animations.
4.  **Scalability:** The architecture must allow for easy addition of new features and pages without affecting existing parts.
5.  **Consistency:** Strictly adhere to defined UI/UX design rules and coding standards.
6.  **Testability:** Components and services must be designed to facilitate easy unit and end-to-end testing.

## 2. Frontend Architecture Overview

### 2.1. High-level Frontend Architecture Diagram
The Frontend architecture will be organized following Angular's component-based model, with clear data flow and centralized state management.
1.  **User Browser:** Where the Angular application is loaded and runs.
2.  **Angular Application:** The main application, containing all modules, components, and services.
3.  **Components (UI Elements):** Responsible for displaying the user interface and interacting directly with the user.
4.  **Services (Logic Services):** Contain business logic, communicate with the Backend API, and provide data to Components or the NgRx Store.
5.  **NgRx Store (State Management):** Manages the global application state, where Components and Services can read/write data consistently.
6.  **Backend API:** Provides data and handles business logic from the server side.

Here is a diagram illustrating the high-level Frontend architecture:

```mermaid
graph TD
    A[User Browser] --> B{Angular Application};
    B --> C[Components (UI Elements)];
    B --> D[Services (Logic Services)];
    B --> E[NgRx Store (State Management)];
    D --> F[Backend API];
    E --> D;
    C --> E;
```

### 2.2. Key Angular Application Components
The Angular application is built from the following basic components:
1.  **Modules:** Main building blocks for organizing code by function. Each module can declare components, services, directives, pipes, and can import/export other modules.
2.  **Components:** Reusable UI blocks, each comprising a template (HTML), a stylesheet (SCSS), and a TypeScript class containing logic. We will apply the Presentational/Container Components strategy.
3.  **Services:** Classes containing business logic, handling data, and communicating with the backend API. Provided via Dependency Injection.
4.  **Directives:** Allow adding behavior or modifying the DOM of HTML elements.
5.  **Pipes:** Allow transforming data for display in templates.

## 3. Project Structure

### 3.1. Detailed Folder Structure
The folder structure will follow Angular best practices, organized feature-based for easy management and scalability:

```
src/
├── app/
│   ├── core/             # Core services, guards, interceptors, core modules (e.g., AuthService, ErrorHandlerService)
│   ├── shared/           # Shared components, directives, pipes, shared modules (e.g., HeaderComponent, FooterComponent, SharedModule)
│   │   └── components/   # Small, reusable components (e.g., ButtonComponent, CardComponent)
│   ├── features/         # Main application feature modules
│   │   ├── auth/         # Authentication module (login, register, forgot-password)
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── auth.module.ts
│   │   ├── home/         # Home page module
│   │   ├── about/        # About page module
│   │   ├── industries/   # Industries module (list, detail)
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── store/    # NgRx store for industries
│   │   │   └── industries.module.ts
│   │   ├── announcements/# Announcements module (list, detail)
│   │   ├── contact/      # Contact page module
│   │   └── admin/        # Admin page module (users, announcements, industries)
│   │       ├── components/
│   │       ├── services/
│   │       ├── store/    # NgRx store for admin
│   │       └── admin.module.ts
│   ├── app-routing.module.ts # Defines main application routes
│   └── app.module.ts     # Root application module
├── assets/               # Images, icons, fonts, other static files
├── environments/         # Environment configurations (development, production)
├── styles/               # Global SCSS files (e.g., variables, mixins, base styles)
└── main.ts               # Application entry point
```

### 3.2. File and Folder Naming Conventions
To ensure consistency and discoverability, the following naming conventions will be adhered to:
1.  **File Names:** `kebab-case` (e.g., `user-list.component.ts`, `auth.service.ts`).
2.  **Folder Names:** `kebab-case` (e.g., `user-management`, `auth-module`).
3.  **Class/Interface/Enum Names:** `PascalCase` (e.g., `UserListComponent`, `AuthService`, `IUser`).
4.  **Component Selectors:** `kebab-case` with `app-` prefix (e.g., `app-user-list`, `app-header`).
5.  **Module Names:** `PascalCase` ending with `Module` (e.g., `AppModule`, `AuthModule`, `SharedModule`).

## 4. State Management

### 4.1. NgRx Overview
NgRx will be used for centralized, consistent, and predictable application state management. It implements the Redux architecture for Angular, separating UI, business logic, and data management.
*   **Benefits:** Unidirectional Data Flow, Consistency, Scalability, Debuggability.

### 4.2. Store Structure and Organization
The NgRx Store will be organized feature-based for manageability and scalability:
1.  **Root State:** The overall application state, combining individual feature states.
2.  **Feature States:** Each main application feature will have a separate state defined within its module.
3.  **Entity Adapters (optional):** For large data collections, `@ngrx/entity` can be used for efficient management.

### 4.3. Data Flow with Actions, Reducers, Effects, Selectors
Data flow in NgRx follows a unidirectional pattern:
1.  **Actions:** Unique events describing what happened (dispatched by Components/Effects).
2.  **Reducers:** Pure functions that take current state and an Action, returning a new state.
3.  **Effects:** Handle side effects (e.g., API calls), listen for Actions, perform tasks, and dispatch new Actions.
4.  **Selectors:** Functions to extract specific data from the Store for Components.
*   **Flow Summary:** `Component/Effect -> Dispatch Action -> Effect (Side Effect) -> Dispatch New Action -> Reducer -> New State -> Selector -> Component`

## 5. Component Strategy

### 5.1. Distinguishing Presentational and Container Components
This strategy optimizes reusability, maintainability, and separation of concerns:
1.  **Presentational Components (Dumb Components):** Focus on UI display, receive data via `@Input()`, emit events via `@Output()`.
2.  **Container Components (Smart Components):** Contain business logic, manage state, interact with services/NgRx Store, and pass data to Presentational Components.

### 5.2. Component Communication Rules
1.  **Parent to Child:** Use `@Input()` to pass data.
2.  **Child to Parent:** Use `@Output()` with `EventEmitter` to emit events.
3.  **Sibling/Complex Communication:** Use NgRx Store (Actions/Selectors) or Services (RxJS Subjects/Observables).
4.  **Avoid Direct References:** Components should not directly reference other components.

## 6. Routing & Navigation

### 6.1. Routing Module Configuration
*   **Root Routing Module (`app-routing.module.ts`):** Uses `RouterModule.forRoot()` for top-level routes and lazy-loaded modules.
*   **Feature Routing Modules:** Each feature module has its own routing module using `RouterModule.forChild()`.
*   **Path Matching:** Uses `pathMatch: 'full'` for exact routes and `pathMatch: 'prefix'` for routes with children.
*   **Wildcard Route:** Handles unmatched URLs (e.g., 404 page).

### 6.2. Lazy Loading Modules
To optimize initial page load performance, modules will be lazy-loaded (loaded only when needed).
*   **Benefits:** Reduces initial bundle size, improves user experience.
*   **Modules to Lazy Load:** `AuthModule`, `AdminModule`, `IndustriesModule`, `AnnouncementsModule`, and other large feature modules.

### 6.3. Guards (Authentication, Authorization)
Angular Guards will protect routes based on user authentication status and roles:
1.  **`AuthGuard`:** Prevents unauthenticated users from accessing protected routes.
2.  **`RoleGuard`:** Prevents authenticated users without sufficient permissions from accessing specific routes.
3.  **Integration:** Guards are attached to routes in the routing module configuration.

## 7. Backend Communication

### 7.1. Using HttpClient
The Frontend will communicate with the Backend API using Angular's `HttpClient`.
*   **HttpClient Module:** Standard Angular module for HTTP requests, integrated with RxJS.
*   **Services:** API requests are encapsulated in services (e.g., `AuthService`), which inject `HttpClient` and provide methods for components to call APIs.

### 7.2. Centralized API Error Handling
A centralized error handling mechanism will be implemented using `HttpInterceptor`.
*   **`ErrorInterceptor`:** Catches HTTP errors (e.g., 401, 404, 500).
*   **Handling:** Displays user-friendly error messages (e.g., using NG-ZORRO's notification service), redirects on 401, and logs errors.

### 7.3. Interceptors (Other Uses)
Beyond error handling, `HttpInterceptor` will be used for:
1.  **Adding Authentication Tokens:** An `AuthInterceptor` will automatically add JWT to the header of every HTTP request.
2.  **Displaying Loading State:** Can be used to show/hide a global loading indicator.

## 8. Internationalization (i18n)

### 8.1. Configuring @ngx-translate
The `@ngx-translate` library will be used for no-reload multilingual functionality (Vietnamese and English).
*   **Setup:** `TranslateModule` configured in `AppModule` to load translation files via `HttpClient`.
*   **Usage:** `| translate` pipe or `[translate]` directive in templates; `TranslateService` in components for language switching and string retrieval.
*   **Default Language:** Configured (e.g., Vietnamese).

### 8.2. Managing Translation Files
Translation strings will be stored in separate JSON files within `assets/i18n/` (e.g., `en.json`, `vi.json`).
*   **Content:** Organized in key-value pairs, potentially nested.
*   **Update Process:** New strings are added to corresponding JSON files.

## 9. Styling and UI Components

### 9.1. SCSS Usage (variables, mixins, theming)
SCSS will be used for styling, leveraging its features for organization and maintainability:
1.  **Variables:** For colors, font sizes, spacing.
2.  **Mixins:** For reusable CSS blocks.
3.  **Nesting:** For structured CSS.
4.  **File Organization:** SCSS files organized by module/component.
5.  **Theming:** SCSS variables facilitate easy theme changes.

### 9.2. NG-ZORRO Integration (customization, theming)
NG-ZORRO will be customized to match FPT Software's design:
1.  **Theme Customization:** Map NG-ZORRO's Less variables to our SCSS variables.
2.  **Override Styles:** Override default NG-ZORRO styles with SCSS when needed.
3.  **Component Usage:** Prioritize NG-ZORRO components; create custom components only when necessary.

## 10. Testing

### 10.1. Unit Testing Strategy (Jasmine, Karma)
Unit testing will be implemented for Frontend quality assurance:
1.  **Tools:** Jasmine (BDD framework) and Karma (test runner).
2.  **Scope:** Components, Services, Pipes, Directives.
3.  **Principles:** Each code unit should have at least one unit test; tests must be independent, fast, and reliable.

### 10.2. End-to-End Testing (Cypress)
E2E testing will verify full user flows:
1.  **Tool:** **Cypress**.
2.  **Scope:** Important user flows (e.g., login, registration, contact form submission, viewing industry/announcement lists/details).
3.  **Principles:** Tests should simulate real user behavior and focus on critical scenarios.

## 11. Deployment

### 11.1. Production Build Process
The Angular CLI will be used for optimized production builds:
1.  **Build Command:** `ng build --configuration=production`.
2.  **Optimizations:** AOT Compilation, Tree Shaking, Minification, Uglification, Bundling, Lazy Loading.
3.  **Result:** Optimized static files in `dist/` ready for serving by a web server (e.g., Nginx in Docker).

### 11.2. Dockerfile Configuration for Frontend
A multi-stage Dockerfile will be used to containerize the Frontend application:
```dockerfile
# Stage 1: Build Angular application
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=production

# Stage 2: Serve application with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/<your-project-name> /usr/share/nginx/html
# Nginx configuration to handle SPA routing (e.g., redirect all to index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
*   **Explanation:** Multi-stage build for smaller image. Nginx serves static files. `nginx.conf` handles Angular routing.
