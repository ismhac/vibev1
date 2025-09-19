### **Project Brief (Draft)**

*   **Project Name:** Company Introduction and Lead Generation Website (Temporary Name)
*   **Brand:** FPT Software
*   **Main Objective:**
    *   Introduce information about the company, its industries, and products.
    *   Create a channel to collect potential customer information via a registration form.
    *   Interact with users through announcements and newsletters.
*   **Target Audience:** All visitors to the website.
*   **UI/UX Requirements:**
    *   **Color Palette:** Primary color is white, secondary color is orange.
    *   **Typography:** Soft and easy to read.

---
### **Detailed Structure and Features**

#### **Common Components (Navbar & Footer)**
*   **Navbar:**
    *   Includes: FPT Logo, Home, About, Industries, Announcements, Contact.
    *   The active page must be highlighted.
    *   Features a language switch icon (Vietnamese/English) that works without a page reload. Static content (titles, buttons) will change with the language.
*   **Footer:**
    *   **Contact us:** Use placeholder contact information.
    *   **About us:** Display a short, professional introduction to FPT Software.
    *   **Statistics:** Display real-time statistics (online users, visits).

#### **Homepage**
*   **Banner:** A "Register Now" button with a smooth scroll effect to the subscription form section.
*   **Subscription Form:**
    *   Fields: Name, company, email, phone, message, and checkboxes for industries.
    *   The list of industries in the checkboxes is dynamically managed from the Admin page.
    *   After submission, the system displays a notification and sends an email to the user. Data does not need to be saved to a database at this stage.
*   **Industries Section:**
    *   Displayed as cards, with a maximum of 3 cards per row on desktop.
    *   On mobile, displays 1 card per row.
    *   Includes navigation arrows if there are more than 3 industries.
*   **Announcements Section:**
    *   A "Read More" link navigates to the detailed announcement page.

#### **Main Pages (About, Industries, Announcements, Contact)**
*   Use a simple, clean layout to display content.

#### **Admin Page**
*   **Access:** Requires a login process.
*   **User Management:**
    *   Two roles: "Admin" and "Editor".
*   **Announcement Management:**
    *   Each announcement includes the following fields: Title, Category, Summary, Content, Images, and allows for text file attachments.
