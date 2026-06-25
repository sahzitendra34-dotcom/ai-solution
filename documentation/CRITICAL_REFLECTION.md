# Critical Reflection
## Project: AI-Solutions Hub — Full-Stack Web Application
### Module: Client-Driven Software Development (Final Year Capstone)

---

## 1. Brief History of the Project

The AI-Solutions Hub project originated as a response to a client-driven brief requiring a professional, corporate-level web platform for a fictitious AI consultancy based in Sunderland, Tyne and Wear, United Kingdom. The client’s requirements specified a split public-private portal: a responsive, visually appealing front-end presentation website detailing services, case studies, blogs, and testimonials; a lead capture mechanism through a contact intake form; an interactive AI-powered virtual assistant; and a protected administration control panel where leads could be searched, filtered, and analyzed.

My initial expectation of the project was that it would be a standard marketing site with a basic form and a login screen. However, as the planning phase evolved and I drafted the [SRS.md](file:///c:/Users/bikas/OneDrive/Desktop/Ai_Soulation/documentation/SRS.md), I recognized that building a truly robust, production-ready system meant confronting several architectural challenges. Over the course of the project, the system evolved from a conceptual outline into a fully realized full-stack application. It features a decoupled architecture composed of a React single-page application (SPA) built with Vite and styled via Bootstrap, communicating with a Node.js and Express.js REST API server, backed by a dual-mode database repository that handles data persistence dynamically.

The project progressed through five key phases:
1. **Requirements Gathering & Scope Definition**: Writing the Software Requirements Specification ([SRS.md](file:///c:/Users/bikas/OneDrive/Desktop/Ai_Soulation/documentation/SRS.md)), mapping out user stories, and establishing functional boundaries.
2. **System Modeling**: Translating requirements into UML diagrams (Use Cases, Class structures, Sequence diagrams) and designing the database schema (documented in [DESIGN_DIAGRAMS.md](file:///c:/Users/bikas/OneDrive/Desktop/Ai_Soulation/documentation/DESIGN_DIAGRAMS.md)).
3. **Iterative Development**: Implementing the frontend views, the backend Express API routes, JWT authentication middleware, and the OpenAI chatbot services in sprints.
4. **Testing and Verification**: Writing automated endpoint tests and verifying system constraints using Jest and Supertest, alongside manual validation matrices.
5. **Documentation & Synthesis**: Consolidating architectural details in the [SYSTEM_DESIGN_DOCUMENTATION.md](file:///c:/Users/bikas/OneDrive/Desktop/Ai_Soulation/documentation/SYSTEM_DESIGN_DOCUMENTATION.md), writing deployment guidelines, and compiling this critical reflection.

---

## 2. Challenges Faced and How I Addressed Them

### 2.1 Decoupled Client-Server Configuration and CORS Middleware
One of the first technical challenges I encountered was managing a decoupled architecture during development. Having the React client run on a Vite dev server (port 5173) and the backend API run on Express (port 5000) introduced immediate Cross-Origin Resource Sharing (CORS) blocks. 

Early on, I struggled with request routing because the frontend was attempting to call local paths, resulting in `404` errors, or failing because the backend rejected cross-origin calls. I resolved this by configuration on both sides:
* On the backend, I integrated the `cors` middleware package to explicitly define allowed request origins, methods, and headers.
* On the frontend, I configured the Vite server proxy within the client configuration to forward api calls to the Express server during development, eliminating hardcoded host names and easing deployment path resolution.

This experience taught me the value of setting up clear networking boundaries and environmental configuration early. In future projects, I will establish proxy routes and cross-origin security policies on day one to prevent authentication tokens and requests from being blocked by browser-level origin checks.

### 2.2 MongoDB Connectivity Constraints and the Repository Pattern Fallover
A significant operational challenge was ensuring the system remained functional across different grading and deployment environments. In a student or university laboratory environment, developers and evaluators cannot guarantee that a local MongoDB daemon is running, nor do they always have reliable access to external cloud databases like MongoDB Atlas due to proxy and firewall restrictions.

To prevent connection failures from crashing the application at launch, I designed a custom database access layer implementing a Repository Pattern wrapper, located in [db_models.js](file:///c:/Users/bikas/OneDrive/Desktop/Ai_Soulation/server/models/db_models.js). 
* At startup, the server tries to establish a connection to MongoDB (configured via environment variables in `db.js`) with a short connection timeout parameter (`serverSelectionTimeoutMS: 2000`).
* If MongoDB is reachable, the repository layer routes all database queries (finds, updates, deletions, and creations) directly to standard Mongoose schemas.
* If the connection fails or if the application is instructed to run locally, the repository seamlessly switches to a local filesystem JSON store fallback ([local_db.json](file:///c:/Users/bikas/OneDrive/Desktop/Ai_Soulation/server/config/local_db.json)), reading and writing record lists via file system operations.

> [!TIP]
> By decoupling the database controllers from the database implementation using a unified repository interface, I ensured the app was resilient to network issues. The application could run and save data immediately on any evaluator's computer with a simple `npm run dev` command, without requiring them to set up or seed a database.

### 2.3 JWT Authentication and Client State Persistence
Securing the administrator dashboard was another critical area. I decided to implement stateless authorization using JSON Web Tokens (JWT) through the `jsonwebtoken` library and hash administrator passwords using `bcryptjs` before storage, as seen in [auth.js](file:///c:/Users/bikas/OneDrive/Desktop/Ai_Soulation/server/routes/auth.js). 

However, implementing JWTs in a pure React SPA presented state-handling challenges. When a user logged in, the server returned a signed JWT which was stored in the browser's `localStorage` and sent inside the `Authorization` headers of subsequent requests. The problem occurred when browser page refreshes wiped the React app's login state, briefly locking the admin out of the dashboard until the token was re-read and validated. 

I resolved this by implementing an authentication verification endpoint (`/api/auth/verify`) that runs at app mount. The React client checks for a token in `localStorage`, and if found, requests a validation check from the Express backend to restore the user session seamlessly. This approach balanced secure validation with user experience, though it highlighted that client-side token management requires careful lifecycle hooks.

### 2.4 OpenAI API Key Constraints and local NLP Fallback for the Chatbot
The client brief required an interactive chatbot assistant that could answer questions about the consultancy. I initially planned to run this entirely on OpenAI's GPT API. However, in a university project context, relying on a paid API key introduces major constraints: keys can expire, exceed usage quotas, or get leaked if pushed to shared repositories, and they require active internet connectivity.

To address this, I built a dual-mode chatbot router in [chatbot.js](file:///c:/Users/bikas/OneDrive/Desktop/Ai_Soulation/server/routes/chatbot.js). 
* The system checks if `process.env.OPENAI_API_KEY` is present.
* If the key is available, the route queries OpenAI's `gpt-3.5-turbo` model, using a system prompt that anchors the AI's persona as an assistant for the Sunderland-based consultancy.
* If the key is absent or the API request fails (due to network or credit limits), the chatbot falls back to a custom local keyword-matching NLP engine (`getLocalResponse`).

I spent significant effort mapping out standard user queries (e.g. asking about location, services, rapid prototyping prices, and contact details) to structured response paths. This design ensured that the chatbot remained highly responsive and contextually accurate, even when operating fully offline or without API credits.

---

## 3. Adaptations to Methods and Approaches

During the system development, I had to adapt several engineering methodologies to fit project constraints.

**From Waterfall to Agile Prototyping**: My initial plan followed a structured Waterfall model: finalize all requirements, complete all design diagrams, write the database models, and then build the UI. In practice, this was too rigid. As I implemented the database fallback pattern, I realized that my database schemas needed to support both MongoDB queries and JSON array operations. This necessitated modifying my data models iteratively. I transitioned to a lighter, sprint-based approach, developing a vertical slice of a feature (frontend components, Express routes, and database models) in a single cycle.

**UML Diagram Alignment**: In [DESIGN_DIAGRAMS.md](file:///c:/Users/bikas/OneDrive/Desktop/Ai_Soulation/documentation/DESIGN_DIAGRAMS.md), the UML Class Diagram defines controllers, services, and models separately. In the final Express code, rather than using distinct controller classes, I co-located query logic within Express route handlers to keep the codebase compact and easier to maintain. I kept the conceptual UML diagrams as structural reference points to represent the logical separation of concerns, even if the runtime files utilized functional routing closures rather than object-oriented class instances.

---

## 4. What Went Well

Several aspects of the project went particularly well:

* **Robust Database Resilience**: The custom Repository Pattern failover functioned perfectly. I could switch from MongoDB to the local JSON database dynamically without changing a single line of business logic in my controllers.
* **Modern, Dynamic UI Styling**: Using React-Bootstrap as a foundation allowed me to lay out grids rapidly. I then wrote custom CSS overrides in [index.css](file:///c:/Users/bikas/OneDrive/Desktop/Ai_Soulation/client/src/index.css) to build a polished, modern dark theme with subtle hover animations, glassmorphism card designs, and focus states, avoiding the generic look of basic Bootstrap sites.
* **Express-Validator input sanitization**: Using server-side validation in [Contact.jsx](file:///c:/Users/bikas/OneDrive/Desktop/Ai_Soulation/client/src/pages/Contact.jsx) input fields and backend routes ensured that email addresses and phone numbers were properly formatted, and messages were sanitized before db writes, mitigating NoSQL injection and XSS vulnerabilities.
* **Automated API Testing**: Having a suite of automated unit/integration tests running via Jest and Supertest in `server/tests` gave me confidence that changes to the auth routes or inquiry creation wouldn't introduce regressions.

---

## 5. What I Would Do Differently

If I were starting this project again, I would adjust my approach in three ways:

* **First, Cookie-Based Authentication**: Storing JWTs in `localStorage` makes the application vulnerable to Cross-Site Scripting (XSS) token extraction. If I were redoing the project, I would configure the Express server to set the JWT in an HTTP-only, secure, same-site cookie, ensuring client-side scripts cannot access it.
* **Second, Client-Side E2E Testing**: While backend API testing was thoroughly automated using Jest and Supertest, frontend UI validation remained largely manual. Writing automated end-to-end tests using a framework like Playwright or Cypress would have let me verify page transitions, form validations, and dashboard charts automatically.
* **Third, Fuzzy-Matching for Chatbot NLP Fallback**: The current local chatbot fallback relies on simple substring lookups (e.g. `msg.includes('sunderland')`). If a user inputs a typo (e.g., "Sunderlnd"), the check fails. Using a lightweight fuzzy-matching library like `fuse.js` or a basic stemming parser would make the local fallback chatbot significantly more intelligent.

---

## 6. Knowledge and Skills Progression

Developing this project has helped expand my software engineering skills:

* **Full-Stack Architectural Design**: I moved from writing simple React interfaces to structuring a complete, decoupled client-server architecture. I gained a deep understanding of request-response lifecycles, HTTP headers, middleware routing, and the separation of concerns.
* **Resilient Data Engineering**: Designing the database fallback layer taught me how to write abstract repository interfaces. I learned how to handle asynchronous DB calls cleanly and model data records in both NoSQL document structures and flat JSON models.
* **Security & Defensive Coding**: Implementing JWT authentication, salting passwords with `bcryptjs`, and configuring secure Express headers using `helmet` shifted my focus toward building secure applications by default.
* **Technical Communication**: Writing the [SRS.md](file:///c:/Users/bikas/OneDrive/Desktop/Ai_Soulation/documentation/SRS.md) and design specifications showed me that thorough documentation is not just a university assignment chore, but a crucial tool for organizing complex software systems.

---

## 7. Employability and Professional Development

The experience of executing this project is directly applicable to graduate and junior software engineering roles. 

In technical interviews, I can now discuss concrete design trade-offs rather than theoretical concepts. I can explain why I selected a decoupled MERN architecture, how I handled security vulnerabilities, and how I structured the custom repository pattern to build system resilience. This demonstrates architectural thinking and technical maturity.

Moreover, working under the constraints of a client-driven brief mirrors the realities of professional agency and enterprise software engineering. Having to implement fallback systems for expensive AI models and build fail-safes for database connections shows that I design software for real-world reliability, budget limits, and deployment environment constraints. 

Finally, the project reinforced professional software practices, such as writing clean documentation, managing environments via variables, and verifying endpoints with automated testing. These habits allow me to integrate into professional engineering teams and contribute to production codebases from day one.

---

## 8. Conclusion

The AI-Solutions Hub project was a challenging capstone project that pushed me to think as an architect, rather than just a developer. By navigating stack integration challenges, designing database fallbacks, and managing strict security requirements under academic deadlines, I built a highly resilient, functional full-stack system. The compromises and adaptations made along the way were deliberate and educational, and I leave the project with a much clearer understanding of how to build production-grade web applications.
