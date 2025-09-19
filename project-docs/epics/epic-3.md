# Epic 3: Homepage & User Engagement

> This document is a granulated shard from the main "Product Requirements Document" and focuses on the User Stories for Epic 3. It builds upon the foundations completed in Epic 1 and Epic 2.

## 1. Epic Goal

This epic focuses on building the complete homepage, which serves as the "face" of the website. It will aggregate information from other sections (Industries, Announcements) and provide key interaction points to engage users and generate leads, specifically through the subscription form.

## 2. Stories within this Epic

### BACKEND FLOW

#### Story 3.1 (Backend): Implement Subscription API

*   **Goal/User Story:** As a Developer, I want to create an API endpoint to handle subscription form submissions, so that potential customer information can be sent via email.
*   **Requirements:**
    *   Create a `Subscription` module, controller, and service in the NestJS project.
    *   Implement a `POST /api/v1/subscriptions` endpoint to receive form data (name, company, email, phone, industries of interest, message).
    *   The endpoint must validate the incoming data (e.g., email must be a valid format).
    *   Integrate an email sending service (e.g., SendGrid) to:
        1.  Send an email containing the form information to a pre-configured admin email address.
        2.  Send an automatic confirmation email to the user who submitted the form.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** Sending a `POST` request to `/api/v1/subscriptions` with valid data returns a 201 (Created) status code.
    *   **AC2:** Sending a request with invalid data (e.g., missing email) returns a 400 (Bad Request) status code.
    *   **AC3:** After a successful submission, two emails (one for admin, one for the user) are dispatched.

### FRONTEND FLOW

#### Story 3.2 (Frontend): Implement Homepage Layout & Banner

*   **Goal/User Story:** As a User, I want to see an engaging banner at the top of the homepage to get a strong first impression.
*   **Requirements:**
    *   Utilize the placeholder component for `Home` created in Epic 1.
    *   Implement the UI for the Banner section as per the `prd.md`, including the image, title, and "Register Now" button.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** Navigating to the `/` route displays the homepage component with the Banner section.
    *   **AC2:** The banner is well-designed and responsive across devices.

#### Story 3.3 (Frontend): Implement Homepage Industries Section

*   **Dependency:** API from Story 2.1 (Backend)
*   **Goal/User Story:** As a User, I want to see a few featured industries on the homepage to quickly understand the company's fields of activity.
*   **Requirements:**
    *   Create a component for the Industries display section.
    *   This component will call the `GET /api/v1/industries` API to get the list of industries.
    *   Display the industries as cards, with a maximum of 3 cards per row on desktop.
    *   If there are more than 3 industries, navigation arrows (left/right) must be present to view others.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** The Industries section correctly displays the list of industries fetched from the API.
    *   **AC2:** The layout correctly shows 3 cards/row on desktop and 1 card/row on mobile.
    *   **AC3:** The navigation arrows work correctly when there are many industries.

#### Story 3.4 (Frontend): Implement Homepage Announcements Section

*   **Dependency:** API from Story 2.2 (Backend) and detail routes from Story 2.6 (Frontend)
*   **Goal/User Story:** As a User, I want to see the latest news on the homepage to stay updated.
*   **Requirements:**
    *   Create a component for the Announcements display section.
    *   This component will call the `GET /api/v1/announcements` API to get the 5 most recent announcements.
    *   Display the list of announcements with a pagination button.
    *   Each announcement must be a link that navigates to its detail page.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** The Announcements section correctly displays the 5 latest news items from the API.
    *   **AC2:** Clicking on an announcement navigates the user to the correct detail page for that announcement.

#### Story 3.5 (Frontend): Implement Homepage Subscription Form

*   **Dependency:** Story 3.1 (Backend), Story 3.2 (Frontend), API from Story 2.1 (Backend)
*   **Goal/User Story:** As a User, I want to easily subscribe to receive information from the homepage.
*   **Requirements:**
    *   Create a component for the Subscription Form.
    *   The list of "Industries" checkboxes in the form must be dynamically loaded from the `GET /api/v1/industries` API.
    *   Implement smooth scrolling: clicking the "Register Now" button on the Banner should scroll the page down to this form section.
    *   When the user submits the form, call the `POST /api/v1/subscriptions` API and display a success message.
*   **Acceptance Criteria (ACs):**
    *   **AC1:** Clicking the "Register Now" button on the Banner scrolls the page to the correct form position.
    *   **AC2:** The list of industries in the form is displayed correctly.
    *   **AC3:** After filling out and successfully submitting the form, a success message is displayed to the user.
