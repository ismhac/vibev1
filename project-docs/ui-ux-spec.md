# UI/UX Specification

## 1. Design Principles & Style Guide

### 1.1. Color Palette & Usage
*   **Primary White:** `#FFFFFF` - Used for main backgrounds and primary content areas.
*   **Primary Orange (FPT):** `#FF8300` - Used for call-to-action buttons, important links, and highlights.
*   **Primary Text:** `#212529` (Dark Gray) - Used for most text to ensure readability.
*   **Secondary Text:** `#6c757d` (Lighter Gray) - Used for short descriptions and supplementary information.
*   **Subtle Background:** `#f8f9fa` (Very Light Gray) - Used to create soft separation between sections.
*   **Borders:** `#dee2e6` (Light Gray) - Used for input fields and card borders.
*   **Error/Alert:** `#dc3545` (Red) - Used for form validation errors.

**Color Combination Rules:**
*   **On White Background (`#FFFFFF`):** Use Primary Text (`#212529`) for main content, Secondary Text (`#6c757d`) for supplementary text, and Orange (`#FF8300`) for links.
*   **On Orange Background (`#FF8300`):** Use White (`#FFFFFF`) for text to ensure high contrast (e.g., on buttons).
*   **On Subtle Background (`#f8f9fa`):** Use Primary Text (`#212529`).

### 1.2. Typography
*   **Font Family:** "Roboto" (from Google Fonts) will be used across the entire website.
*   **Sizing & Weight Scale:**
    *   **H1:** 36px - Bold (700)
    *   **H2:** 30px - Bold (700)
    *   **H3:** 24px - Bold (700)
    *   **Body:** 16px - Regular (400)
    *   **Small/Caption:** 14px - Regular (400)
    *   **Button Text:** 16px - Medium (500)

### 1.3. Iconography
*   **Icon Library:** "Material Icons" by Google will be used for all icons to ensure consistency and a modern aesthetic. This includes navigation arrows, language switchers, admin panel icons, etc.

## 2. Layout & Grid System

### 2.1. Grid System
*   A 12-column responsive grid system will be applied to all pages to ensure consistent and flexible content alignment.

### 2.2. Breakpoints
*   **Mobile:** < 768px
*   **Tablet:** ≥ 768px to < 1024px
*   **Desktop:** ≥ 1024px

## 3. Component Design

### 3.1. Buttons
*   **Primary Button:** Orange background (`#FF8300`), white text (`#FFFFFF`), slightly rounded corners. Hover state: background darkens slightly.
*   **Secondary Button:** Transparent background, orange border and text. Hover state: background becomes a very light orange.

### 3.2. Forms
*   **Text Input/Text Area:** Light gray border. On focus, the border turns orange. On error, the border turns red.
*   **Checkbox:** Unchecked: gray square border. Checked: orange background with a white checkmark icon.

### 3.3. Cards
*   **General Style:** White background, light gray border, rounded corners. A subtle box-shadow appears on hover.
*   **Industry Card:** Contains an image and a title (H3 style).
*   **Announcement Card:** Contains a title (H3 style), a short description (Body style), and a "Read More" secondary button.

### 3.4. Navbar & Footer
*   **Navbar:** White background with a subtle bottom shadow. Menu item text is dark gray, turning orange on hover or when active.
*   **Footer:** Dark gray background (`#212529`) with white or light gray text for high contrast.

### 3.5. Pagination
*   A series of numbered buttons. The current page button is styled like a Primary Button. Other page buttons are styled like Secondary Buttons. Disabled "Previous/Next" buttons are grayed out.

## 4. Wireframes & Page Descriptions

### 4.1. Homepage
*   **Layout:** A sequence of sections: Navbar, Banner, Subscription Form, Industries, Announcements, Footer.
*   **Banner:** Not full-width, has small horizontal margins and rounded corners. Contains an H1 title and a Primary Button over a background image.
*   **Subscription Form:** Two columns on desktop (text on left, form on right), stacking vertically on mobile.
*   **Industries/Announcements:** Sections are introduced by an H2 title and use the Card and Pagination components as designed.

### 4.2. About Page
*   **Layout:** Page title (H1), followed by a two-column content area (image on left, text on right).

### 4.3. Industries Page
*   **Layout:** Page title (H1), followed by a grid of Industry Cards (e.g., 9 per page), with the Pagination component at the bottom.

### 4.4. Industry Detail Page
*   **Layout:** Breadcrumb navigation, Page title (H1), followed by a two-column content area (large image on left, detailed text on right).

### 4.5. Announcements Page
*   **Layout:** Page title (H1), followed by a single-column vertical list of Announcement Cards, with the Pagination component at the bottom.

### 4.6. Announcement Detail Page
*   **Layout:** Breadcrumb navigation, Article Header (H1 Title, metadata), followed by a single wide column for content (Featured Image, Body text, Attachments).

### 4.7. Contact Page
*   **Layout:** Page title (H1), followed by a two-column content area (contact info on left, contact form on right). The map is excluded.

### 4.8. Admin Page
*   **Layout:** A two-pane interface with a fixed, dark sidebar for navigation on the left, and a main content area on the right.
*   **Content Area:** Displays lists in tables with action buttons (Add, Edit, Delete) and uses standard forms for creating/editing content.
