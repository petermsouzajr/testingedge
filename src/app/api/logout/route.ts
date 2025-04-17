import { NextResponse } from 'next/server';
import * as cookie from 'cookie'; // Use namespace import

export async function POST(/* _request: Request */) {
  console.log('API /api/logout called');

  try {
    // Prepare cookie serialization options to clear the cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax' as const, // Explicitly type as 'lax'
      maxAge: -1, // Expire the cookie immediately
      path: '/', // Must match the path of the original cookie
    };

    // Serialize the cookie with expiration in the past
    const serializedCookie = cookie.serialize('auth_token', '', cookieOptions);

    // Create response and set the clearing cookie header
    const response = NextResponse.json({
      success: true,
      message: 'Logged out',
    });
    response.headers.set('Set-Cookie', serializedCookie);

    console.log('Logout successful, clearing cookie.');
    return response;
  } catch (error) {
    console.error('Error in /api/logout:', error);
    // Even on server error, attempt to clear cookie from client if possible
    // by sending the header, but report server error.
    const message = 'An internal server error occurred during logout.';
    const errorResponse = NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
    // Try setting the clearing cookie even on error
    errorResponse.headers.set(
      'Set-Cookie',
      cookie.serialize('auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax' as const, // Explicitly type as 'lax'
        maxAge: -1,
        path: '/',
      })
    );
    return errorResponse;
  }
}

// Handle other methods like GET if necessary, typically 405
export async function GET() {
  return NextResponse.json(
    { message: 'Method Not Allowed, use POST for logout' },
    { status: 405 }
  );
}
