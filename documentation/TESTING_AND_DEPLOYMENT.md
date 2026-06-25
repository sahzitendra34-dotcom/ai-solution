# Security, Testing, and Deployment Specification
## Project: AI-Solutions

---

## 1. Security Features

Security is incorporated into the architecture of the AI-Solutions application to defend against standard vulnerabilities.

### 1.1 Cross-Site Scripting (XSS) Prevention
* **Frontend sanitization**: React automatically escapes strings rendered in JSX, preventing simple reflection attacks.
* **Backend sanitization**:
  - We use `express-validator` to sanitize user inputs.
  - The inquiry message is run through a trimmer and custom sanitization checks to strip out `<script>` or other dangerous markup.

### 1.2 SQL and NoSQL Injection (SQLi / NoSQLi) Mitigation
* Since the primary database is MongoDB, standard SQL injections are not possible. However, NoSQL queries can be vulnerable to operator injections (e.g. passing objects like `{"$gt": ""}` in queries).
* **Prevention strategy**:
  - We use structured Mongoose models with strict schema definitions, ensuring any incoming request parameters are typecast to standard schemas before running db methods.
  - User-controlled inputs are handled as explicit literals, rather than passing raw request objects directly into db filters.

### 1.3 Secure Authentication and Authorization
* Admin endpoints are protected via **JSON Web Tokens (JWT)**.
* Passwords stored in the database are hashed with a salt value using `bcryptjs` (strength: 10 rounds).
* JWT payloads contain only non-sensitive tokens (admin id and username) and have an expiration time of 24 hours.

### 1.4 Hardening and Transport Security
* **Helmet.js**: Sets HTTP headers such as `X-Content-Type-Options`, `X-Frame-Options` (prevents clickjacking), and Content Security Policy (CSP) configurations.
* **CORS Policy**: Configured to restrict external client origins, allowing only white-listed locations to consume the APIs.
* **Rate Limiter**: Configured for public inquiry endpoints to prevent Denial of Service (DoS) and brute force attacks.

---

## 2. Testing Plan

To ensure system reliability, the following test structure will be employed.

### 2.1 Automated API Tests (Jest & Supertest)
The test suite in `server/tests/api.test.js` covers:
* **Authentication Suite**: Verify login success with valid credentials and failure with invalid ones. Confirm protected endpoints block requests missing a JWT.
* **Validation Suite**: Submit empty forms, invalid emails, and invalid phone numbers to the Contact Inquiry API to verify they are rejected with appropriate error lists.
* **Inquiry Creation**: Verify successful inquiry creation and insertion into the database.

### 2.2 Manual Verification Checklist
* **Test Case TC-01: User Form Submission**
  - Navigate to the Contact Us page.
  - Enter valid data. Click "Submit".
  - Expected: success toast displays, fields clear.
* **Test Case TC-02: Admin Analytics Integration**
  - Navigate to `/admin`.
  - Log in with default credentials `admin` / `admin123`.
  - Expected: redirected to dashboard, Recharts renders, and the newly submitted inquiry is visible.
* **Test Case TC-03: Chatbot Conversational Response**
  - Open the chatbot bubble. Click the quick chip "What services do you offer?".
  - Expected: Chatbot replies with service description immediately.

---

## 3. Deployment Plan

The AI-Solutions platform can be deployed in a client-server hosting setup.

### 3.1 Backend Deployment (e.g., Render, Heroku)
1. **Prepare Environment Variables**: Configure MongoDB connection URL, JWT secret key, and OpenAI API key on the host panel.
2. **Build Configuration**:
   - Install dependencies: `npm install`.
   - Start Command: `node server.js`.

### 3.2 Frontend Deployment (e.g., Vercel, Netlify)
1. **Configure API URL**: Set `VITE_API_URL` to point to the deployed Backend server.
2. **Build Step**: Run `npm run build` which runs Vite compiler, outputting optimized bundles to the `dist/` directory.
3. **Static Hosting**: Deploy the output `dist/` folder directly to a CDN.
