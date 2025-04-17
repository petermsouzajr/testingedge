import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'; // Import JWT library
import * as cookie from 'cookie'; // Correct: Use namespace import
import crypto from 'crypto'; // For timing-safe comparison

// Function for timing-safe comparison
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function POST(request: Request) {
  console.log('API /api/login called');

  try {
    // 1. Parse username/password from request body
    let username, password;
    try {
      const body = await request.json();
      username = body.username;
      password = body.password;
      if (typeof username !== 'string' || typeof password !== 'string') {
        throw new Error('Username and password must be strings');
      }
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { success: false, message: 'Invalid request format.' },
        { status: 400 }
      );
    }

    console.log('Received credentials for user:', username);

    // 2. Retrieve INTERNAL_USER and INTERNAL_PASS from process.env
    const internalUser = process.env.INTERNAL_USER;
    const internalPass = process.env.INTERNAL_PASS;
    const jwtSecret = process.env.JWT_SECRET;

    // 3. Basic validation (ensure env vars are set)
    if (!internalUser || !internalPass || !jwtSecret) {
      console.error(
        'Missing required environment variables (INTERNAL_USER, INTERNAL_PASS, JWT_SECRET)'
      );
      return NextResponse.json(
        { success: false, message: 'Server configuration error.' },
        { status: 500 }
      );
    }

    // 4. Implement timing-safe credential comparison
    const isUsernameValid = timingSafeEqual(username, internalUser);
    const isPasswordValid = timingSafeEqual(password, internalPass);

    if (isUsernameValid && isPasswordValid) {
      console.log('Credentials valid for user:', username);

      // 5. Generate JWT
      const tokenPayload = {
        user: username,
        role: 'internal_team', // Example role
        iat: Math.floor(Date.now() / 1000), // Issued at timestamp
      };
      const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: '24h' });

      // 6. Serialize HttpOnly cookie
      const serializedCookie = cookie.serialize('auth_token', token, {
        httpOnly: true, // Crucial: Prevent client-side JS access
        secure: process.env.NODE_ENV !== 'development', // Use Secure flag in production (HTTPS only)
        sameSite: 'lax', // Good balance of security and usability
        maxAge: 24 * 60 * 60, // 24 hours in seconds
        path: '/', // Accessible site-wide
      });

      // 7. Create response and set cookie header
      const response = NextResponse.json({ success: true });
      response.headers.set('Set-Cookie', serializedCookie);

      console.log('Login successful, JWT cookie set for user:', username);
      return response;
    } else {
      console.log('Invalid credentials attempted for user:', username);
      // Generic message for security
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error in /api/login:', error);
    const message = 'An internal server error occurred.'; // Avoid leaking details
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// Handle other methods (optional, good practice)
export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
// Add handlers for PUT, DELETE, PATCH etc. if needed, returning 405
