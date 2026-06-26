# SYSTEM DESIGN DOCUMENTATION

## 1. Overview of Application Design, Development, and Architecture

### 1.1 Architecture
The AI-Solutions platform follows a modern, decoupled **Client-Server Architecture** utilizing the **MERN** stack (MongoDB, Express.js, React, Node.js). 
- **Frontend (Client):** Built with React.js. It features a component-based architecture allowing for reusable UI elements (e.g., Chatbot widget, Contact Form, Admin Dashboard). 
- **Backend (Server):** An Express.js REST API running on Node.js. It handles routing, middleware validation (using `express-validator`), and business logic (e.g., Chatbot Service, Authentication, Inquiry Management).
- **Database:** MongoDB is used as a NoSQL database to store dynamic content like Contact Inquiries, Admin credentials, Events, and Testimonials. Mongoose acts as the ODM (Object Data Modeling) layer.
- **AI Integration:** A dedicated `ChatbotService` processes user messages. It can route requests to an external AI NLP model or fall back to local NLP logic if offline.

### 1.2 Design Principles
- **Clean Architecture:** The backend separates concerns into Models, Controllers, and Services, ensuring scalable and maintainable code.
- **Responsive Web Design (RWD):** The user interface is fully responsive, ensuring accessibility across desktop, tablet, and mobile devices.
- **Secure Authentication:** The Admin panel is secured with JWT (JSON Web Tokens) and password hashing to protect sensitive site data.

### 1.3 Development Methodology
The development followed an iterative approach. We began with requirements gathering (Use Cases), moved to system modeling (ERDs and UML Class Diagrams), designed the UI prototypes (Wireframes), and finally implemented the code in sprints, testing the API endpoints and frontend components concurrently.

---

## 2. Prototype: Flow Diagrams and Wireframes

To ensure the final product met the client's needs, we developed comprehensive flow diagrams and wireframes before writing code. 

### 2.1 Contact Form Submission Flow
This diagram illustrates the step-by-step logic, validation, and database storage process when a user interacts with the contact form.

```mermaid
flowchart TD
    Start([User visits Contact Page]) --> FillForm[Fill out Contact Details]
    FillForm --> Submit{Click Submit}
    Submit --> ClientVal[Client-side Validation]
    
    ClientVal -- Invalid --> ShowErrors[Show Visual Error Tooltips]
    ShowErrors --> FillForm
    
    ClientVal -- Valid --> APICall[POST /api/inquiries (JSON)]
    APICall --> ServerVal[Server-side Validation & Sanitization]
    
    ServerVal -- Invalid --> Return400[Return 400 Bad Request]
    Return400 --> ShowServerErrors[Render Validation Error Banner]
    ShowServerErrors --> FillForm
    
    ServerVal -- Valid --> SaveDB[Save to Database]
    SaveDB --> Return201[Return 201 Created]
    Return201 --> ShowSuccess[Display Success Toast Notification]
    ShowSuccess --> End([End Process])
```

> **Note:** Additional detailed UML diagrams, Use Cases, and Entity Relationship Diagrams can be found in the [DESIGN_DIAGRAMS.md](./DESIGN_DIAGRAMS.md) file.

### 2.2 UI Wireframes
*The wireframes mapped out the core layout templates for the public-facing pages and the private admin dashboard.*

**Desktop Home Layout Concept:**
```text
+-------------------------------------------------------------------------+
| [AI-Solutions Logo]                  Home  About  Services  Blog  Admin |
+-------------------------------------------------------------------------+
|                         HERO: AI-Powered Digital DX                     |
|                [ Sunderland's Leading Tech Innovation Partner ]         |
|                                [ Get Started ]                          |
+-------------------------------------------------------------------------+
|  [Feature Card 1]           [Feature Card 2]           [Feature Card 3] |
+-------------------------------------------------------------------------+
```

---

## 3. Final System Demonstration

### 3.1 Final System Images

*(Replace the placeholders below with high-quality screenshots of your final application before submission)*

1. **Homepage & AI Hero Section**
   > `![Homepage Screenshot](./path/to/home-screenshot.png)`

2. **Interactive Chatbot Widget**
   > `![Chatbot Screenshot](./path/to/chatbot-screenshot.png)`

3. **Contact Inquiry Form (Validation active)**
   > `![Contact Form Screenshot](./path/to/contact-form-screenshot.png)`

4. **Admin Dashboard Analytics & Management**
   > `![Admin Dashboard Screenshot](./path/to/admin-dashboard-screenshot.png)`

### 3.2 Screencast Demonstration

A full video demonstration of the AI-Solutions platform, showcasing the user workflow, contact submission, AI chat interaction, and admin capabilities has been recorded.

> **Submission Note:** As per requirements, the video demonstration screencast is submitted using a **different link in Canvas**.
