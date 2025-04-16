# 08: Implementation Plan - Calculator Page with Inline Login Form

## 1. Goal

Create a single page at the `/calculator` route.

- **Initial View:** When accessed by an unauthenticated user, the page displays only a login form (username/password).
- **Authentication:** The form submits credentials to a serverless function which validates them against credentials stored securely in environment variables.
- **Authenticated View:** Upon successful login, the login form is hidden/removed, and the actual calculator content/interface is displayed on the _same_ `/calculator` page.
- **Session Management:** The authenticated state persists across page loads but automatically expires after approximately 24 hours.
- **Security:** Authentication logic resides server-side; credentials are not exposed client-side.

## 2. Core Approach: Client-Side Conditional Rendering

1.  The static HTML for `/calculator` will contain the structure for _both_ the login form and the calculator application.
2.  Client-side JavaScript will run on page load to check the user's authentication status via an API call.
3.  Based on the authentication status, the JavaScript will toggle the visibility of the login form and the calculator content.
4.  Logging in will involve an API call that validates credentials and sets a time-limited authentication token (JWT) in an `HttpOnly` cookie.

## 3. Components Required

- **`/calculator` Page:**
  - HTML structure containing elements for the login form (`id="login-form"`) and the calculator (`id="calculator-app"`). Initially, the calculator is hidden (e.g., via CSS `display: none;`).
  - Client-side JavaScript (`/js/calculator-auth.js` or similar) to handle the logic.
- **Serverless Function: `/api/login`**
  - Accepts POST requests with `username` and `password`.
  - Compares credentials against environment variables (`INTERNAL_USER`, `INTERNAL_PASS`).
  - If valid, generates a JWT with a 24-hour expiry and sets it in a secure `HttpOnly` cookie.
  - Returns success/failure status.
- **Serverless Function: `/api/check-auth`**
  - Accepts GET requests.
  - Checks for the presence and validity (signature, expiry) of the JWT cookie.
  - Returns `{ isAuthenticated: true }` or `{ isAuthenticated: false }`.
- **(Optional) Serverless Function: `/api/logout`**
  - Clears the authentication cookie.
- **Environment Variables:**
  - `INTERNAL_USER`: The required username.
  - `INTERNAL_PASS`: The required password (store the actual password here, as we need to compare).
  - `JWT_SECRET`: A strong, unique secret key for signing the JWT.

## 4. Implementation Steps

1.  **Setup Environment Variables:**
    - In your hosting provider (Netlify, Vercel, etc.), set `INTERNAL_USER`, `INTERNAL_PASS`, and a strong `JWT_SECRET`.
2.  **Create the `/calculator` Page HTML:**

    - ```html
      <!DOCTYPE html>
      <html>
        <head>
          <title>Calculator Access</title>
          <link rel="stylesheet" href="/styles/main.css" />
          <!-- Assuming a main CSS file -->
          <style>
            #calculator-app {
              display: none;
            } /* Hide calculator initially */
            /* Add specific styles for login form if needed */
          </style>
        </head>
        <body>
          <header><!-- Add site header if applicable --></header>
          <main>
            <h1>Internal Calculator</h1>

            {/* Login Form Container */}
            <div id="login-form">
              <h2>Login Required</h2>
              <form id="auth-form">
                <div>
                  <label for="username">Username:</label>
                  <input type="text" id="username" name="username" required />
                </div>
                <div>
                  <label for="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                  />
                </div>
                <button type="submit">Login</button>
                <p id="login-error" style="color: red; display: none;"></p>
              </form>
            </div>

            {/* Calculator Application Container */}
            <div id="calculator-app">
              <h2>Calculator</h2>
              {/* ==== YOUR ACTUAL CALCULATOR INTERFACE/CONTENT GOES HERE ====
              */}
              <p>Welcome! Here is the calculator...</p>
              {/*
              ================================================================
              */} {/* Add a discrete logout button if desired */}
              <button
                id="logout-button"
                style="display: none; margin-top: 20px;"
              >
                Logout
              </button>
            </div>
          </main>
          <footer><!-- Add site footer if applicable --></footer>

          <script src="/js/calculator-auth.js"></script>
        </body>
      </html>
      ```

3.  **Create the `/api/login` Serverless Function (Node.js Example):**
    - Use Node.js (or your preferred runtime).
    - Install necessary libraries (e.g., `jsonwebtoken`, `cookie`).
    - **Logic:**
      - Check if `req.method === 'POST'`. Handle other methods appropriately (e.g., 405 Method Not Allowed).
      - Parse `username` and `password` from the request body (ensure body parsing middleware is used if needed by the platform).
      - Compare `username` === `process.env.INTERNAL_USER` and `password` === `process.env.INTERNAL_PASS` (Use a timing-safe comparison if possible, though less critical for internal tool).
      - **If Match:**
        - Generate JWT payload: `{ user: username, role: 'internal_team', iat: Math.floor(Date.now() / 1000) }` (iat = issued at).
        - Sign JWT using `process.env.JWT_SECRET` with `{ expiresIn: '24h' }`.
        - Set the cookie using the `cookie` library:
          ```javascript
          const cookie = require('cookie');
          res.setHeader(
            'Set-Cookie',
            cookie.serialize('auth_token', signedJwt, {
              httpOnly: true, // Prevent client-side JS access
              secure: process.env.NODE_ENV !== 'development', // Use Secure flag in production (HTTPS)
              sameSite: 'lax', // Protect against CSRF
              maxAge: 24 * 60 * 60, // 24 hours in seconds
              path: '/', // Accessible site-wide
            })
          );
          ```
        - Send response: `res.status(200).json({ success: true });`
      - **If No Match:**
        - Send response: `res.status(401).json({ success: false, message: 'Invalid credentials' });`
      - Include robust error handling (try/catch blocks).
4.  **Create the `/api/check-auth` Serverless Function (Node.js Example):**
    - Install `jsonwebtoken`, `cookie`.
    - **Logic:**
      - Check if `req.method === 'GET'`. Handle others.
      - Parse cookies from `req.headers.cookie` using the `cookie` library.
      - Get the `auth_token` cookie value.
      - If no token, return `res.status(200).json({ isAuthenticated: false });`.
      - Verify the token using `jsonwebtoken.verify(token, process.env.JWT_SECRET)`. Use a try/catch block.
      - If verification succeeds (no error thrown), return `res.status(200).json({ isAuthenticated: true });`.
      - If verification fails (error caught: expired, invalid signature, etc.), return `res.status(200).json({ isAuthenticated: false });`.
5.  **Create the Client-Side JavaScript (`/js/calculator-auth.js`):**

    - ```javascript
      document.addEventListener('DOMContentLoaded', () => {
        // Ensure DOM is ready
        const loginFormDiv = document.getElementById('login-form');
        const calculatorAppDiv = document.getElementById('calculator-app');
        const authForm = document.getElementById('auth-form');
        const loginError = document.getElementById('login-error');
        const logoutButton = document.getElementById('logout-button');

        // Ensure elements exist before proceeding
        if (!loginFormDiv || !calculatorAppDiv || !authForm || !loginError) {
          console.error('Required auth elements not found in the DOM.');
          return;
        }

        // Function to toggle UI visibility
        function showCalculator(show) {
          if (show) {
            loginFormDiv.style.display = 'none';
            calculatorAppDiv.style.display = 'block';
            if (logoutButton) logoutButton.style.display = 'inline-block'; // Show logout if exists
          } else {
            loginFormDiv.style.display = 'block';
            calculatorAppDiv.style.display = 'none';
            if (logoutButton) logoutButton.style.display = 'none'; // Hide logout
            // Clear password field on failed login or logout for better UX
            const passwordInput = document.getElementById('password');
            if (passwordInput) passwordInput.value = '';
          }
        }

        // 1. Check authentication status on page load
        async function checkAuthStatus() {
          try {
            const response = await fetch('/api/check-auth');
            // Check if response is ok AND content-type is application/json
            if (!response.ok) {
              throw new Error(
                `Auth check failed with status: ${response.status}`
              );
            }
            const data = await response.json();
            showCalculator(data.isAuthenticated);
          } catch (error) {
            console.error('Error checking auth:', error);
            showCalculator(false); // Default to showing login on error
          }
        }

        // 2. Handle login form submission
        authForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          loginError.style.display = 'none'; // Hide previous errors
          const submitButton = authForm.querySelector('button[type="submit"]');
          submitButton.disabled = true; // Disable button during request
          submitButton.textContent = 'Logging in...';

          const username = event.target.username.value;
          const password = event.target.password.value;

          try {
            const response = await fetch('/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password }),
            });

            // Check if response is ok AND content-type is application/json before parsing
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({})); // Attempt to parse error msg
              throw new Error(
                errorData.message ||
                  `Login failed with status: ${response.status}`
              );
            }

            const data = await response.json();

            if (data.success) {
              showCalculator(true); // Login successful, show calculator
            } else {
              // This case might not be reached if !response.ok is handled above
              throw new Error(data.message || 'Login failed.');
            }
          } catch (error) {
            console.error('Login error:', error);
            loginError.textContent =
              error.message || 'An error occurred during login.';
            loginError.style.display = 'block';
            showCalculator(false);
          } finally {
            submitButton.disabled = false; // Re-enable button
            submitButton.textContent = 'Login';
          }
        });

        // 3. (Optional) Handle Logout
        if (logoutButton) {
          logoutButton.addEventListener('click', async () => {
            logoutButton.disabled = true;
            logoutButton.textContent = 'Logging out...';
            try {
              // Option 1: Call an API endpoint to explicitly clear the cookie server-side
              const response = await fetch('/api/logout', { method: 'POST' });
              if (!response.ok) {
                throw new Error('Logout API call failed');
              }
              // UI update happens after successful API call
              showCalculator(false);
              // Optional: Reload to ensure clean state
              // window.location.reload();

              // Option 2 (Simpler, relies on checkAuth on next load):
              // Just update UI immediately. Cookie will expire or check-auth will fail next time.
              // showCalculator(false);
            } catch (error) {
              console.error('Logout error:', error);
              alert('Logout failed. Please try again.'); // Inform user
            } finally {
              logoutButton.disabled = false;
              logoutButton.textContent = 'Logout';
            }
          });
        }

        // Run the initial auth check when the script loads
        checkAuthStatus();
      });
      ```

6.  **(Optional) Create `/api/logout` Serverless Function:**
    - Check `req.method === 'POST'`.
    - Use the `cookie` library to set the `auth_token` cookie with `Max-Age=0` or an expiry date in the past.
      ```javascript
      const cookie = require('cookie');
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('auth_token', '', {
          // Empty value
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'lax',
          maxAge: 0, // Expire immediately
          path: '/',
        })
      );
      res.status(200).json({ success: true, message: 'Logged out' });
      ```
    - Return success.

## 5. JWT and Cookie Details

- **JWT Payload:** Keep it minimal. Include `iat` (issued at) and rely on the `expiresIn` option during signing for the `exp` (expiration) claim. You could add a `role` if needed for future expansion.
- **Cookie Settings:**
  - `HttpOnly`: **Crucial** for security. Prevents client-side JS from accessing the cookie, mitigating XSS attacks stealing the token.
  - `Secure`: **Crucial** for production. Ensures the cookie is only sent over HTTPS.
  - `SameSite=Lax`: Good default. Protects against most CSRF attacks. Provides a reasonable balance.
  - `Max-Age` or `Expires`: Set to 24 hours (in seconds for `Max-Age`). The browser will automatically stop sending the cookie after this time.
  - `Path=/`: Makes the cookie available for API calls from anywhere on your site.

## 6. Security Considerations

- **HTTPS:** Essential for protecting credentials during login and securing the cookie.
- **Environment Variables:** Use your hosting provider's secure environment variable storage. Never commit secrets to Git.
- **Input Validation:** Sanitize/validate input in your serverless functions (e.g., check username/password format if desired, although basic check is length).
- **Rate Limiting:** Strongly consider adding rate limiting to `/api/login` to prevent brute-force attacks against the single username/password. Hosting platforms or API gateways often provide options for this.
- **Password Storage:** You are storing the _actual_ password in the environment variable for direct comparison. This is less ideal than storing a hash but necessary for this specific requirement. Ensure the environment variable storage mechanism is highly secure. **Do not log the password.**
- **Error Handling:** Avoid leaking sensitive information in error messages sent back to the client.
- **CSRF:** `SameSite=Lax` provides good protection, but for critical actions _within_ the calculator, consider standard CSRF token patterns if needed.

## 7. Pros of this Approach

- **Single URL:** Users only need to know the `/calculator` URL.
- **Clear User Experience:** Shows login when needed, calculator when logged in.
- **Server-Side Authentication:** Credentials are validated securely on the backend.
- **Standard Session Management:** Uses JWT in HttpOnly cookies, a common and reasonably secure pattern.
- **Automatic Expiration:** Session naturally expires after 24 hours.

## 8. Cons of this Approach

- **Client-Side UI Flicker:** There will likely be a brief moment on page load where neither the form nor the calculator is correctly displayed while the `/api/check-auth` call completes. You could mitigate this with loading indicators or initial CSS states.
- **Relies on JavaScript:** Users must have JavaScript enabled.
- **Shared Credentials:** Uses a single username/password shared among the team. Less secure and less auditable than individual accounts.
- **Password in Env Var:** Requires storing the actual password, not a hash, relying entirely on the security of the environment variable system.
