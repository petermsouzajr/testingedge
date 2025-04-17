import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie'; // Correct: Use namespace import

export async function GET(request: Request) {
  console.log('API /api/check-auth called');

  try {
    // 1. Manually parse cookies from the request header
    const cookieHeader = request.headers.get('cookie');
    const cookies = cookie.parse(cookieHeader || ''); // Parse header string
    const token = cookies.auth_token; // Get the specific cookie value

    if (!token) {
      console.log('Auth check: No auth_token cookie found.');
      return NextResponse.json({ isAuthenticated: false });
    }

    const jwtSecret = process.env.JWT_SECRET;

    // 2. Validate JWT_SECRET environment variable
    if (!jwtSecret) {
      console.error('Missing JWT_SECRET environment variable for auth check.');
      return NextResponse.json({ isAuthenticated: false });
    }

    // 3. Verify the JWT
    try {
      jwt.verify(token, jwtSecret);
      console.log('Auth check: Valid JWT found.');
      return NextResponse.json({ isAuthenticated: true });
    } catch (error) {
      if (
        error instanceof jwt.JsonWebTokenError ||
        error instanceof jwt.TokenExpiredError
      ) {
        console.log(`Auth check: JWT verification failed - ${error.message}`);
      } else {
        console.error(
          'Auth check: Unexpected error during JWT verification:',
          error
        );
      }
      return NextResponse.json({ isAuthenticated: false });
    }
  } catch (error) {
    console.error('Error in /api/check-auth:', error);
    return NextResponse.json({ isAuthenticated: false });
  }
}

// Handle other methods (optional, good practice)
export async function POST() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
// Add handlers for PUT, DELETE, PATCH etc. if needed, returning 405
