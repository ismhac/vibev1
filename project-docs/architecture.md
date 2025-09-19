# System Architecture Document

## 1. Introduction

### 1.1. Purpose of the Document
This document aims to describe the detailed technical architecture for the FPT Software website project. It serves as the single source of truth for the development team, encompassing technology decisions, system structure, component design, and coding standards. The objective is to ensure all team members adhere to a consistent technical direction, creating a high-quality, maintainable, and scalable product.

### 1.2. Architectural Goals
The system's architecture will be designed to meet the following key objectives, based on the defined non-functional requirements:
1.  **Maintainability:** Code must be clearly organized, modular, and adhere to coding standards for easy modification and feature addition in the future.
2.  **Performance:** The system must be optimized for fast page load times and a smooth user experience, especially with animations and dynamic data loading.
3.  **Security:** The Admin area and sensitive data APIs must be strictly protected through authentication and authorization.
4.  **Scalability:** The architecture must allow for future expansion, such as adding new content types or integrating with other systems.
5.  **Compatibility:** The user interface must function well across popular browsers and mobile devices.

## 2. System Overview

### 2.1. High-level Diagram
The system will be built with a decoupled client-server architecture, comprising three main components:
1.  **Frontend (Web App):** A Single Page Application (SPA) running in the user's browser. Responsible for displaying the entire user interface and interactive experience.
2.  **Backend (API Server):** An application server responsible for handling business logic, user authentication, and providing data to the Frontend via APIs.
3.  **Database:** Stores all system data such as user information, posts, industries, etc.

Here is a diagram illustrating this architecture:

```mermaid
graph TD
    A[User] --> B{Frontend (Web App)};
    B --> C{Backend (API Server)};
    C --> D[(Database)];
```

## 3. Technology Stack

### 3.1. Frontend
Based on the requirements for a highly interactive SPA and the specified use of `ng-zorro`, the following technologies are proposed for the Frontend:
1.  **Main Framework:** **Angular**
    *   **Reason:** A powerful, full-featured framework from Google, ideal for enterprise-scale applications. It fully supports `ng-zorro`, a project requirement.
2.  **Language:** **TypeScript**
    *   **Reason:** The default and standard language for Angular, enhancing code safety and maintainability.
3.  **Asynchronous Operations:** **RxJS**
    *   **Reason:** A core library of Angular, essential for handling asynchronous data streams and events.
4.  **UI Library:** **NG-ZORRO**
    *   **Reason:** Adheres to project technical requirements. An enterprise-class UI component library that accelerates development and ensures a professional interface.
5.  **Styling:** **SCSS**
    *   **Reason:** A powerful CSS preprocessor for writing structured, maintainable, and reusable styles.
6.  **State Management:** **NgRx**
    *   **Reason:** Implements the Redux pattern for Angular, providing a consistent and predictable way to manage complex application state.
7.  **Code Quality:** **ESLint & Prettier**
    *   **Reason:** ESLint for code analysis and Prettier for automatic formatting ensure consistent, clean, and error-free code.
8.  **Unit Testing:** **Jasmine & Karma**
    *   **Reason:** The built-in testing tools for Angular, used for writing robust unit tests.

### 3.2. Backend
The Backend will use NestJS for high synchronization with the Angular frontend architecture.
1.  **Framework:** **NestJS**
    *   **Reason:** A modern Node.js framework built with TypeScript. Its architecture (Modules, Providers, Controllers) is similar to Angular, promoting consistency and productivity across the full stack.
2.  **Language:** **TypeScript**
    *   **Reason:** The primary language supported by NestJS.
3.  **Authentication:** **NestJS Passport and JWT Modules**
    *   **Reason:** NestJS provides dedicated modules (`@nestjs/passport`, `@nestjs/jwt`) for seamless and secure integration of Passport.js and JWT, which is the standard approach in the NestJS ecosystem.

### 3.3. Database
For structured, relational data, MySQL will be used.
1.  **Database Management System:** **MySQL**
    *   **Reason:** As per user requirement. MySQL is one of the most popular and reliable open-source relational databases, fully compatible with our chosen backend stack.
2.  **ORM (Object-Relational Mapper):** **TypeORM**
    *   **Reason:** The leading ORM for TypeScript-based backends (NestJS) to interact with relational databases like MySQL, enhancing code safety and developer productivity.

### 3.4. Third-party Services
1.  **Email Service:** **SendGrid** (or similar SMTP service like Mailgun, AWS SES)
    *   **Reason:** Provides a robust and reliable API for sending confirmation emails to users after form submission.
2.  **Real-time Statistics:** **Socket.IO**
    *   **Reason:** To meet the requirement for a real-time statistics counter in the Footer, Socket.IO is a popular WebSocket library enabling bidirectional communication between client and server.

## 4. Frontend Design

### 4.1. Folder Structure
The folder structure will follow Angular best practices, organized feature-based for easy management and scalability:

```
src/
├── app/
│   ├── core/             # Core modules (authentication, error handling, services)
│   ├── shared/           # Shared modules (components, directives, pipes, NG-ZORRO components)
│   ├── features/         # Main application feature modules
│   │   ├── auth/         # Authentication module (login, register)
│   │   ├── home/         # Home page module
│   │   ├── about/        # About page module
│   │   ├── industries/   # Industries module (list, detail)
│   │   ├── announcements/# Announcements module (list, detail)
│   │   ├── contact/      # Contact page module
│   │   └── admin/        # Admin page module (users, announcements, industries)
│   ├── app-routing.module.ts
│   └── app.module.ts
├── assets/               # Images, icons, fonts
├── environments/         # Environment configurations (dev, prod)
├── styles/               # Global SCSS files (e.g., variables, mixins)
└── main.ts
```

### 4.2. State Management
To manage complex application state consistently and predictably, **NgRx** (a Redux-pattern library for Angular) will be used.
1.  **Store:** Global application state container.
2.  **Actions:** Events describing what happened in the application.
3.  **Reducers:** Pure functions that take current state and an action, returning a new state.
4.  **Effects:** Handle side effects like API calls, dispatching new actions upon completion.
5.  **Selectors:** Functions to efficiently extract parts of the state from the Store.

### 4.3. Component Strategy
Components will be categorized into two main types for reusability and maintainability:
1.  **Presentational Components (Dumb Components):** Focus solely on UI display, receiving data via `@Input()` and emitting events via `@Output()`.
2.  **Container Components (Smart Components):** Manage business logic, state, and interact with services or NgRx Store, passing data to presentational components.

## 5. Backend Design

### 5.1. API Design (RESTful)
The Backend API will adhere to RESTful principles, including API versioning:
1.  **API Versioning:** Via URL path (e.g., `/api/v1/users`).
2.  **URL Structure:** Plural nouns for resources (e.g., `/api/v1/users`).
3.  **HTTP Methods:** Standard methods (GET, POST, PUT, PATCH, DELETE).
4.  **HTTP Status Codes:** Standard codes (200 OK, 201 Created, 400 Bad Request, etc.).
5.  **Data Format:** JSON for requests and responses.
6.  **Pagination:** Supported via query parameters (e.g., `/api/v1/announcements?page=1&limit=10`).

### 5.2. Data Models
The following main data models (entities) will be defined in the MySQL database:
1.  **User:** `id`, `username`, `password`, `email`, `role`, `createdAt`, `updatedAt`.
2.  **Role:** `id`, `name`.
3.  **Industry:** `id`, `name`, `description`, `image`, `createdAt`, `updatedAt`.
4.  **Announcement:** `id`, `title`, `category`, `summary`, `content`, `images`, `attachments`, `authorId`, `publishedAt`, `createdAt`, `updatedAt`.
5.  **Subscription:** `id`, `name`, `company`, `email`, `phone`, `industriesOfInterest`, `message`, `createdAt`.

## 6. Coding Standards

### 6.1. Naming Conventions
*   **Frontend (Angular/TypeScript):**
    *   Classes/Interfaces/Types: `PascalCase`.
    *   Variables/Functions/Methods: `camelCase`.
    *   Constants: `SCREAMING_SNAKE_CASE`.
    *   Files: `kebab-case`.
    *   Components: `kebab-case` for selector, `PascalCase` for class.
    *   Modules: `PascalCase`.
*   **Backend (NestJS/TypeScript):**
    *   Classes/Interfaces/Types: `PascalCase`.
    *   Variables/Functions/Methods: `camelCase`.
    *   Constants: `SCREAMING_SNAKE_CASE`.
    *   Files: `kebab-case`.
    *   Database Tables: `snake_case` (plural).
    *   Database Columns: `snake_case`.

### 6.2. Code Formatting
*   **Tool:** **Prettier** will be used for automatic code formatting to ensure consistency.
*   **Integration:** Integrated into IDEs and potentially CI/CD pipelines.

### 6.3. General Principles
1.  **DRY (Don't Repeat Yourself):** Avoid code duplication.
2.  **KISS (Keep It Simple, Stupid):** Favor simple, understandable solutions.
3.  **Single Responsibility Principle (SRP):** Each class/module/function should have one clear responsibility.
4.  **Code Review:** All code must undergo review before merging to the main branch.

### 6.4. Commenting Guidelines
1.  **Comment WHY, not WHAT:** Explain reasoning or design decisions.
2.  **Keep comments concise and clear.**
3.  **Update comments:** Ensure comments are current with code changes.
4.  **Use JSDoc/TSDoc:** For important functions, classes, interfaces to describe purpose, parameters, and return values.

## 7. Deployment & Operations

### 7.1. Hosting Plan
The application will be deployed using Docker and Docker Compose on a Linux server.
1.  **Frontend (Angular App):** Docker image containing the static files and a lightweight web server (e.g., Nginx).
2.  **Backend (NestJS API):** Docker image for the NestJS application.
3.  **Database (MySQL):** Official MySQL Docker image.
4.  **Orchestration:** Docker Compose will define and run multi-container applications (Frontend, Backend, Database) on a single Linux server.

### 7.2. Build and Deploy Process
1.  **Build Docker Images:** For both Frontend and Backend applications.
2.  **Configure Docker Compose:** Create `docker-compose.yml` to define services, networks, and volumes, including environment variables.
3.  **Deploy to Server:** Copy `Dockerfile`s and `docker-compose.yml` to the Linux server. Use `docker-compose up -d --build` to build images and start services.
4.  **Application Updates:** Update code, rebuild images, and re-run `docker-compose up -d --build`.
