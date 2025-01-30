import jwt from 'jsonwebtoken';

const JWT_SECRET = 'samurai.61203';

export async function POST(req) {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return new Response(JSON.stringify({ authenticated: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
  }
}
