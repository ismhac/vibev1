# Product Requirements Document: Corporate Website

## 1. Introduction

### 1.1. Project Overview
This project aims to build a professional website for FPT Software. The website will serve as an official information portal, introducing the company, its industries, and key products. Concurrently, it will act as a crucial marketing tool to capture leads and enhance user engagement through newsletters and announcements.

### 1.2. Problem Statement
FPT Software may currently lack a centralized, modern website to comprehensively showcase its capabilities and products to a global audience of clients and partners. The process for capturing potential customer information is fragmented, and there is no dedicated platform to proactively deliver the latest news and announcements to interested parties.

### 1.3. Goals & Objectives
1.  **Build Brand Image:** Launch an official website with a modern, professional design that reflects the stature of FPT Software.
2.  **Provide Information:** Become a reliable source of information about the company, its industries, and products for customers, partners, and the public.
3.  **Lead Generation:** Implement a registration form to capture contact information from potential customers for business development purposes.
4.  **Enhance Engagement:** Create a proactive communication channel with users through regularly updated announcements and newsletters.

## 2. Target Audience
This product targets a broad audience, including but not limited to:
*   **Potential Customers:** Businesses or individuals seeking technology solutions who want to learn about FPT Software.
*   **Partners:** Companies and organizations interested in business collaborations.
*   **Potential Candidates:** Individuals interested in career opportunities at the company.
*   **The Public:** Anyone wishing to find official information about FPT Software.

Therefore, the website must have a user-friendly, professional interface and easily accessible content for all audience segments.

## 3. Functional Requirements

### 3.1. User Story 1: Site Navigation
**As a user, I want to easily navigate the website from any page, so that I can quickly find the information I need.**

**Acceptance Criteria:**
1.  **Navbar:**
    *   The navbar must always be visible at the top of all public-facing pages.
    *   It must contain the FPT Software logo and links for: Home, About, Industries, Announcements, and Contact.
    *   The menu item for the currently active page must be highlighted.
2.  **Footer:**
    *   The footer must always be visible at the bottom of all public-facing pages.
    *   It must contain three columns: "Contact us" (with placeholder info), "About us" (a brief company intro), and "Statistics" (a real-time counter).

### 3.2. User Story 2: Homepage Interaction
**As a user, I want to get an overview of the company and easily register for information from the homepage, so that I can quickly understand what the company does and stay updated.**

**Acceptance Criteria:**
1.  **Banner:** Clicking the "Register Now" button on the banner smoothly scrolls the page down to the Subscription Form section.
2.  **Subscription Form:**
    *   Upon successful submission, the system must display a success message and send a confirmation email to the user.
    *   The list of industries in the form's checkboxes must be dynamically populated from the Admin panel.
3.  **Industries Section:**
    *   Displays industries as cards (max 3 per row on desktop, 1 per row on mobile).
    *   Navigation arrows must be present if there are more than 3 industries.
4.  **Announcements Section:**
    *   Displays the 5 most recent announcements (with pagination).
    *   Clicking on an announcement navigates the user to its detailed page.

### 3.3. User Story 3: Content Viewing
**As a user, I want to view detailed information on dedicated pages, so that I can understand more about the company and its services.**

**Acceptance Criteria:**
1.  **General Layout:** The About, Industries, Announcements, and Contact pages must have a simple, clean, and readable layout.
2.  **Industries Page:** It must display a list of all industries with pagination. Clicking on an industry leads to its detail page.
3.  **Announcements Page:** It must display a list of all announcements with pagination. Clicking on an announcement leads to its detail page, including the full content, images, and any attachments.
4.  **About & Contact Pages:** They must display the relevant information about the company and its contact details.

### 3.4. User Story 4: Content Management (Admin)
**As an admin or editor, I want to securely log in and manage the website's content, so that I can keep the information updated and manage user access.**

**Acceptance Criteria:**
1.  **Login:** The Admin page must be secured by a login process.
2.  **User Management (Admin only):** Admins can create, view, edit, delete, and assign roles ("Admin", "Editor") to users.
3.  **Announcement Management (Admin and Editor):** Users with these roles can create, edit, and delete announcements, including fields for Title, Category, Summary, Content, Images, and file attachments.
4.  **Industry Management (Admin and Editor):** Users with these roles can create, edit, and delete industries.

### 3.5. User Story 5: Multilingual Support
**As a user, I want to be able to switch the website's language between Vietnamese and English, so that I can read the content in my preferred language.**

**Acceptance Criteria:**
1.  **Switcher:** A language switcher icon (e.g., a flag) must be present in the navbar.
2.  **Instant Change:** Clicking the icon must instantly change the language of static UI components (menus, titles, buttons) without a page reload.
3.  **Scope:** This functionality applies to the static interface. Dynamically generated content (e.g., announcement posts) is not required to be translated in this version.

## 4. Non-Functional Requirements

### 4.1. UI/UX
*   The UI must adhere to FPT Software's brand colors (white and orange).
*   The font must be soft and readable.
*   Content page layouts must be simple, clean, and consistent.

### 4.2. Performance
*   The website must be optimized for fast page load speeds.
*   Animations (e.g., scrolling) must be smooth.

### 4.3. Security
*   The Admin page and its related APIs must be protected and require authentication/authorization.

### 4.4. Compatibility
*   The website must render correctly on modern browsers (Chrome, Firefox, Safari, Edge) and devices (desktop, mobile).

## 5. Out of Scope
To ensure a focused and timely initial release, the following features will not be implemented in the first version:
1.  **Form Data Storage:** Data from the subscription form will be sent via email but not stored in a database.
2.  **Dynamic Content Translation:** The multilingual feature applies only to the static UI. User-generated content (like announcements) will not be automatically translated.
3.  **Advanced SEO:** Advanced Search Engine Optimization techniques will be considered for future versions.

## 6. Success Metrics
The success of the initial release will be measured by the following criteria:
1.  **On-time Delivery:** The website is launched with all features defined in this PRD.
2.  **Lead Generation:** The number of successful submissions through the homepage subscription form.
3.  **User Engagement:**
    *   Daily/monthly site traffic (visits).
    *   Pageviews for industry and announcement detail pages.
4.  **User Feedback:** Collection of user feedback (if any) for future improvements.
