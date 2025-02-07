import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ message: 'Token is missing' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.split(' ')[1]; // Extract token

    const decoded = jwt.verify(token, SECRET_KEY as string);

    return new Response(JSON.stringify({ user: decoded }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    let errorMessage = 'Invalid token';
    if (error instanceof Error) {
      errorMessage =
        error.name === 'TokenExpiredError'
          ? 'Token has expired'
          : 'Invalid token';
    }
    return new Response(
      JSON.stringify({
        message: errorMessage,
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
