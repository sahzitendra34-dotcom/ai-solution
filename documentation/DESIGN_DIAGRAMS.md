# System Design & Diagrams
## Project: AI-Solutions

This document outlines the UML diagrams, Database design, and User Interface wireframe details for the AI-Solutions platform.

---

## 1. Use Case Diagram

The use case diagram illustrates how a public user and an administrator interact with the system.

```mermaid
left-to-right direction
actor "Public Visitor" as User
actor "System Administrator" as Admin

rectangle "AI-Solutions System" {
  usecase "Browse Pages (Home, About, Services, etc.)" as UC1
  usecase "Submit Contact Inquiry" as UC2
  usecase "Chat with AI Assistant" as UC3
  usecase "Submit Customer Testimonial" as UC4
  usecase "Login to Admin Panel" as UC5
  usecase "View Analytics Dashboard" as UC6
  usecase "Search / Filter Inquiries" as UC7
  usecase "Delete Inquiry" as UC8
}

User --> UC1
User --> UC2
User --> UC3
User --> UC4

Admin --> UC5
Admin --> UC6
Admin --> UC7
Admin --> UC8
```

---

## 2. Entity Relationship Diagram (ERD)

This entity relationship diagram shows the 6 relational schemas mapped onto MongoDB collections.

```mermaid
erDiagram
    ADMIN {
        ObjectId id PK
        string username
        string passwordHash
        date createdAt
    }
    INQUIRY {
        ObjectId id PK
        string fullName
        string email
        string phone
        string companyName
        string country
        string jobTitle
        string jobDetails
        date createdAt
    }
    TESTIMONIAL {
        ObjectId id PK
        string name
        string company
        int rating
        string feedback
        boolean approved
        date createdAt
    }
    BLOG {
        ObjectId id PK
        string title
        string summary
        string content
        string author
        string image
        string tags
        date createdAt
    }
    EVENT {
        ObjectId id PK
        string title
        string description
        string location
        date date
        string image
        int capacity
        date createdAt
    }
    GALLERY {
        ObjectId id PK
        string title
        string imageUrl
        string category
        date date
    }
```

---

## 3. UML Class Diagram

This class diagram represents the clean architecture split of models, controllers, and services in the backend.

```mermaid
classDiagram
    class Database {
        +connect() void
        -fallbackToLocalJSON() void
    }

    class Inquiry {
        +ObjectId id
        +string fullName
        +string email
        +string phone
        +string companyName
        +string country
        +string jobTitle
        +string jobDetails
        +date createdAt
        +save() Promise
        +find() Array
        +findByIdAndDelete() Promise
    }

    class Admin {
        +ObjectId id
        +string username
        +string passwordHash
        +verifyPassword(pw) boolean
    }

    class Testimonial {
        +ObjectId id
        +string name
        +string company
        +int rating
        +string feedback
        +boolean approved
    }

    class ChatbotService {
        +getAIResponse(message, history) Promise
        -localNLPFallback(message) string
    }

    class InquiryController {
        +submitInquiry(req, res) void
        +getInquiries(req, res) void
        +deleteInquiry(req, res) void
    }

    class AuthController {
        +login(req, res) void
        +verifyToken(req, res, next) void
    }

    InquiryController --> Inquiry : Uses
    InquiryController --> Database : Reads/Writes
    AuthController --> Admin : Validates
    ChatbotService <.. InquiryController : (Optional integration)
```

---

## 4. UML Sequence Diagram: Contact Inquiry Submission

Shows the client-server interaction when a visitor submits a contact form, including validation and storage.

```mermaid
sequenceDiagram
    autonumber
    actor Visitor as Public Visitor
    participant Client as React Client (Contact Form)
    participant Server as Express Server (API)
    participant Validator as Middleware (express-validator)
    participant DB as MongoDB / JSON DB

    Visitor->>Client: Fills details & clicks Submit
    Client->>Client: Validates fields client-side (Email/Phone format)
    alt Client validation fails
        Client-->>Visitor: Show visual error tooltips
    else Client validation passes
        Client->>Server: POST /api/inquiries (JSON payload)
        Server->>Validator: Sanitize and Validate payload
        alt Validation fails (XSS detected or email invalid)
            Validator-->>Server: Array of errors
            Server-->>Client: 400 Bad Request (Error details)
            Client-->>Visitor: Render validation error banner
        else Validation Success
            Server->>DB: Inquiry.save()
            DB-->>Server: Acknowledge insert (document saved)
            Server-->>Client: 201 Created (Success JSON)
            Client-->>Visitor: Display modern Toast "Thank you! We will contact you soon."
        end
    end
```

---

## 4.1 Flowchart: Contact Form Submission Flow

This flowchart reflects the exact logic implemented across the React client [Contact.jsx](file:///c:/Users/bikas/OneDrive/Desktop/Ai_Soulation/client/src/pages/Contact.jsx) and Express backend API endpoint [inquiries.js](file:///c:/Users/bikas/OneDrive/Desktop/Ai_Soulation/server/routes/inquiries.js).

```mermaid
flowchart TD
    A([User navigates to /contact]) --> B[Render Contact Component\nstates: formData, success, errors]

    B --> C[User fills in form fields:\nfullName, email, phone\ncompanyName, country, jobTitle, jobDetails]

    C --> D[User clicks 'Submit Project Specifications']
    D --> E[handleSubmit triggered\nclient-side validateForm running]

    E --> F{Client Validation Passes?}
    F -- No --> G[Set errors state\nRender validation error banner]
    G --> C

    F -- Yes --> H[Set loading state\nPOST /api/inquiries JSON payload]

    H --> I{Express Server receives POST}
    I --> J[validateInquiry Middleware\nexpress-validator runs]

    J --> K{Server Validation Passes?}
    K -- No --> L[Server returns 400 JSON errors\nClient sets errors state]
    L --> G

    K -- Yes --> M[Repository Layer: Inquiry.create\ndb_models.js makeRepo wrapper runs]

    M --> N{MongoDB connected?}
    N -- Yes --> O[Mongoose saves document to MongoDB]
    N -- No --> P[File System saves record to local_db.json fallback]

    O --> Q[Server returns 201 JSON success]
    P --> Q

    Q --> R[Client sets success state\nResets form inputs\nRenders Success Alert Banner]
    R --> S([End Process])

    style A fill:#1e293b,color:#94a3b8,stroke:#334155
    style R fill:#14532d,color:#86efac,stroke:#166534
    style S fill:#1e293b,color:#94a3b8,stroke:#334155
    style G fill:#7f1d1d,color:#fca5a5,stroke:#991b1b
    style L fill:#7f1d1d,color:#fca5a5,stroke:#991b1b
```

---

## 5. Wireframe Layouts

### 5.1 Desktop Layout Template
```
+-------------------------------------------------------------------------+
| [AI-Solutions Logo]                  Home  About  Services  Blog  Admin |
+-------------------------------------------------------------------------+
|                                                                         |
|                         HERO: AI-Powered Digital DX                      |
|                [ Sunderland's Leading Tech Innovation Partner ]         |
|                                [ Get Started ]                          |
|                                                                         |
+-------------------------------------------------------------------------+
|  [Feature Card 1]           [Feature Card 2]           [Feature Card 3] |
|  DX IT Analysis             Rapid Prototyping          Virtual Assistants|
+-------------------------------------------------------------------------+
|                                                           +-----------+ |
|                                                           | Chat Widget| |
| © 2026 AI-Solutions. Sunderland, UK.                      +-----------+ |
+-------------------------------------------------------------------------+
```

### 5.2 Admin Dashboard Layout
```
+-------------------------------------------------------------------------+
| [Admin Control Panel]                                   [Logout Button] |
+-------------------------------------------------------------------------+
|  Sidebar Navigation  |   [Total Inquiries: 24]   [Active Events: 5]     |
|                      +--------------------------------------------------+
|  - Dashboard         |   Monthly Inquiries Graph                        |
|  - Manage Inquiries  |   [   / \                                    ]   |
|  - Manage Content    |   [  /   \______                             ]   |
|                      +--------------------------------------------------+
|                      |   Filter: [Country v] [Search Inquiries...   ]   |
|                      |   - John Doe | US | Tech Lead | [View] [Delete]  |
|                      |   - Jane Smith| UK| PM        | [View] [Delete]  |
+----------------------+--------------------------------------------------+
```
