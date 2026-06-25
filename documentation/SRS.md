# System Requirements Specification (SRS)
## Project: AI-Solutions Web-Based Corporate Platform & Admin Dashboard

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the AI-Solutions Web-Based Platform. It describes the scope, functional requirements, non-functional requirements, database design, and architecture for the public company website, the integrated AI chatbot assistant, and the password-protected administrative dashboard.

### 1.2 Scope
The system is built for **AI-Solutions**, a fictitious startup based in Sunderland, United Kingdom. AI-Solutions leverages Artificial Intelligence (AI) to improve the digital employee experience, proactively resolve workplace IT issues, accelerate design and engineering workflows, and offer affordable virtual assistant & prototyping services.

This system consists of:
1. **Public Corporate Website**: 9 distinct pages showcasing services, testimonials, blogs, gallery, events, portfolio, and an inquiry form.
2. **AI Virtual Assistant (Chatbot)**: Floating chat component available on all pages to answer FAQs and capture prototyping leads.
3. **Secure Admin Dashboard**: Restricted administration area for viewing, searching, filtering, and deleting inquiries, with graphical analytics representing trends and demographics.
4. **Data Management Layer**: A MongoDB database configuration that includes a seamless JSON database fallback for zero-dependency local testing.

### 1.3 Intended Audience
This document is prepared for academic evaluators, university project supervisors, full-stack engineers, database administrators, and QA specialists involved in reviewing this final-year capstone project.

---

## 2. Overall Description

### 2.1 Product Perspective
The AI-Solutions platform operates as a modern client-server architecture. The frontend is built as a single-page application (SPA) using React.js, structured with custom CSS3 stylesheets and Bootstrap for a premium responsive layout. The backend is an Express/Node.js REST API communicating with MongoDB using Mongoose.

```
+-------------------------------------------------------------+
|                       React Frontend                        |
|   (Public Website, AI Chatbot Interface, Admin Dashboard)   |
+------------------------------+------------------------------+
                               | HTTPS Requests / JWT Auth
                               v
+-------------------------------------------------------------+
|                    Node.js + Express API                    |
|   (Auth, Chatbot Agent, Inquiry Manager, Content Routers)   |
+------------------------------+------------------------------+
                               | Mongoose / Local DB Driver
                               v
+-------------------------------------------------------------+
|                 MongoDB (Fallback: JSON DB)                 |
|   (Admins, Inquiries, Testimonials, Blogs, Events, Gallery)  |
+-------------------------------------------------------------+
```

### 2.2 User Classes and Characteristics
* **Public Visitors / Potential Clients**: View services, browse corporate content, interact with the AI assistant, and submit project/inquiry requests.
* **System Administrator (Admin)**: Full access to the protected admin dashboard, views statistics, searches/filters submissions, reviews and deletes customer inquiries.

---

## 3. Functional Requirements

### 3.1 Public Website Pages (FR-01)
* **Home Page**: Introduces AI-Solutions, features a professional hero section with a clear value proposition, and lists core pillars of digital employee experience enhancement.
* **About Us Page**: Chronicles the company’s vision, mission, core values, and profiles the Sunderland-based leadership team.
* **Services Page**: Detailed lists of AI software solutions, IT diagnostic tools, and cost-effective prototyping services.
* **Portfolio Page**: Showcases case studies of past engineering and digital innovations.
* **Customer Testimonials**: Displays reviews, comments, and star ratings, with a customer form to submit new testimonials.
* **Blog Page**: Educational articles explaining AI trends, workplace productivity, and technical prototypes.
* **Gallery Page**: Event photographs, community workshops, and corporate gatherings in Sunderland.
* **Events Page**: Details of upcoming tech talks, webinar schedules, and interactive booking options.
* **Contact Us Form**: A validation-locked contact intake form.

### 3.2 Contact Inquiry Validation & Security (FR-02)
* The form collects: *Full Name, Email, Phone, Company, Country, Job Title, and Job Details*.
* **Validation Rules**:
  - All fields are required except Company/Job Title (which are optional but recommended).
  - Email must match regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
  - Phone number must match a international/national format.
* **Security Controls**:
  - Sanitize input fields against Cross-Site Scripting (XSS) to strip script tags.
  - Mitigate SQL Injection (SQLi) and NoSQL Injection using parameterized Mongoose queries and query validation.

### 3.3 AI Virtual Assistant (FR-03)
* A persistent chat widget in the lower right corner of all web pages.
* Opens a conversation window showing:
  - Quick-start chips (e.g. "What services do you offer?", "Tell me about rapid prototyping").
  - Automated replies powered by OpenAI's API (using GPT).
  - A robust local rule-based/keyword NLP fallback when no OpenAI key is configured.
* Visual indicators: Typing indicator animation, structured message bubbles, scroll-to-bottom.

### 3.4 Protected Admin Dashboard (FR-04)
* **Security Checkpoint**: Login screen using bcrypt password-hashing and JSON Web Token (JWT) storage.
* **Dashboard KPI Cards**:
  - Total inquiries count.
  - Active testimonials count.
  - Upcoming events count.
* **Data Visualization**:
  - Inquiry volume monthly trend line graph.
  - Country-wise distribution bar or pie chart.
  - Inquiry status/type breakdown.
* **Data Grid**:
  - View list of submissions.
  - Search by Name, Email, or Company.
  - Filter by Country or Date range.
  - Interactive "View Detail" modal displaying project requirements.
  - Secure "Delete Inquiry" action with warning modal.

---

## 4. Non-Functional Requirements (NFR)

* **Performance & Speed (NFR-01)**: Pages should load within 2 seconds. Optimized builds via Vite and asset lazy loading.
* **Responsiveness (NFR-02)**: Grid layouts adjust fluidly across mobile (up to 480px), tablet (481px to 1024px), and desktop screen sizes.
* **Accessibility (NFR-03)**: Compliant with WCAG 2.1 Level AA guidelines. High contrast ratios, aria-labels for buttons, semantic elements.
* **Data Security & Encryption (NFR-04)**: Sensitive data in transit encrypted via SSL/TLS. Admin passwords hashed using `bcrypt` (10 rounds). Protected routes secured via JWT.
* **Robustness & Portability (NFR-05)**: The backend should gracefully boot even if local MongoDB is unavailable, switching automatically to local storage and warning the administrator.
