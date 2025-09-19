# Operational Guidelines

## 1. Introduction

### 1.1. Purpose
This document is the **mandatory** set of rules and guidelines for the Developer Agent (Dev Agent) working on this project. The objective is to ensure that all code and features are implemented according to the highest standards of quality, consistency, maintainability, and security.

### 1.2. Core Principle
The Dev Agent must operate as a senior software engineer, always prioritizing clear, robust, and testable solutions. Strict adherence to the guidelines in this document is non-negotiable.

## 2. Story Lifecycle
Each assigned User Story will go through the following statuses. The Agent must update the story's status in its corresponding file immediately upon change.

1.  **`Status: Approved`**
    *   **Meaning:** The story has been approved by the Product Owner and is ready for development.
    *   **Agent Action:** This is the starting state. The Agent may only select stories with this status.

2.  **`Status: In-Progress`**
    *   **Meaning:** The Agent has picked up the story and is actively working on its implementation.
    *   **Agent Action:** As soon as work begins, the Agent must update the story's status to `In-Progress`.

3.  **`Status: Review`**
    *   **Meaning:** The Agent has completed all story requirements, including the full Definition of Done (DoD). The code is ready for review by the Product Owner or user.
    *   **Agent Action:** Only after completing 100% of the DoD checklist can the Agent change the story's status to `Review`.

4.  **`Status: Done`**
    *   **Meaning:** The story has been reviewed and accepted by the user/Product Owner.
    *   **Agent Action:** This status will be updated by the user or Product Owner. The Agent does not set this status itself.

## 3. Coding Standards
Code quality is paramount. All written code must be clean, understandable, and consistent.

*   **Absolute Source of Truth:** The Agent **must** adhere 100% to the conventions and standards defined in the architecture documents:
    *   **For Backend:** Refer to **`project-docs/architecture.md` (Section 6: Coding Standards)**. This includes naming conventions (variables, functions, classes, files), code formatting, and general principles (DRY, KISS, SRP).
    *   **For Frontend:** Refer to **`project-docs/frontend-architecture.md` (Section 3.2: File and Folder Naming Conventions & Section 9: Styling and UI Components)**. This includes naming conventions for files, folders, classes, component selectors, and SCSS usage.
*   **Code Quality:** Introducing new linter errors or warnings is strictly forbidden. Code must be formatted with Prettier before completion.
*   **Comments:** Only comment to explain complex logic ("the why"), not to describe what the code is doing ("the what").

## 4. Testing Strategy
Testing is essential to ensure the quality and stability of the product.

*   **Unit Tests are Mandatory:** Every new unit of business logic (e.g., in services, controllers, components) **must** be accompanied by unit tests.
*   **Test Scope:** Unit tests must cover both the happy path and edge cases.
*   **Tooling Source of Truth:** The specific testing tools and frameworks have been decided in the architecture documents. The Agent must adhere to:
    *   **Backend:** Jasmine & Karma (as defined in **`project-docs/architecture.md`**).
    *   **Frontend:** Jasmine & Karma for Unit Tests, and Cypress for E2E Tests (as defined in **`project-docs/frontend-architecture.md` (Section 10: Testing)**).

## 4.1. Unit Testing Requirements
Unit testing is **mandatory** and must be completed before marking any story as 'Review'.

*   **When Unit Tests are Required:**
    *   **All Components:** Every Angular component with business logic must have unit tests
    *   **All Services:** Every service with business logic must have unit tests
    *   **All Controllers:** Every backend controller must have unit tests
    *   **All Business Logic:** Any new business logic, regardless of location, must be tested

*   **Test Coverage Requirements:**
    *   **Happy Path:** Test successful execution of all main functionality
    *   **Edge Cases:** Test error conditions, empty data, invalid inputs
    *   **State Management:** Test component state changes, loading states, error states
    *   **Service Integration:** Test API calls, data transformation, error handling
    *   **User Interactions:** Test click handlers, form submissions, navigation

*   **Test Quality Standards:**
    *   **Mocking:** Use proper mocking for dependencies (services, HTTP calls, etc.)
    *   **Assertions:** Include detailed assertions for all expected behaviors
    *   **Test Data:** Use comprehensive mock data covering all scenarios
    *   **Naming:** Use descriptive test names that explain what is being tested
    *   **Organization:** Group related tests using describe blocks

*   **Test Execution Requirements:**
    *   **All Tests Must Pass:** 100% pass rate is mandatory before story completion
    *   **No Skipped Tests:** All tests must be executable and meaningful
    *   **Performance:** Tests should run quickly and not be flaky
    *   **Documentation:** Test results must be documented in the story file

*   **Critical Rule:** Stories with business logic that lack unit tests will be considered incomplete and cannot be marked as 'Review'. This is a non-negotiable requirement.

## 5. Definition of Done (DoD)
A story is **only considered complete** when the Agent has verified and met all criteria in the `story-dod-checklist.txt` document.

*   **Mandatory Procedure:** Before changing a story's status to `Review`, the Agent must:
    1.  Open the `project-docs/checklists/story-dod-checklist.txt` file.
    2.  Go through every item on the checklist.
    3.  Create a DoD report, confirming the status of each item (Done, N/A).
    4.  This report must be presented to the user when requesting the review.
*   **Integrity:** Bypassing or failing to complete any item in the DoD checklist is considered a critical process failure.

## 6. Story Documentation Requirements
Every completed story must have comprehensive documentation in its story file for future reference and handoff purposes.

*   **Mandatory Documentation:** Before changing a story's status to `Review`, the Agent must update the story file with:
    1.  **Implementation Summary:** Detailed description of what was implemented, including:
        *   Technical implementation details
        *   Key features and functionality
        *   Code structure and architecture decisions
        *   Dependencies added or modified
    2.  **DoD Checklist Report:** Complete checklist with status for each item:
        *   Mark each item as `[x] Done`, `[ ] Not Done`, or `[N/A] Not Applicable`
        *   Provide brief justification for N/A items
        *   Include total completion statistics
    3.  **Notes Section:** Important implementation notes, decisions, and future considerations
*   **Reference Format:** Use the format demonstrated in completed stories (e.g., `3.1.story.md`) as the standard template.
*   **Critical Rule:** This documentation is mandatory and must be completed before story handoff. Missing documentation is considered a process failure.