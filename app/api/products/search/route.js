import { query } from '@/app/lib/db';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get('search');
    
    if (!searchTerm) {
      return new Response('Search term is required', { status: 400 });
    }

    const result = await query(
      'SELECT * FROM products WHERE name ILIKE $1', 
      [`%${searchTerm}%`]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: 'No products found' }), { status: 404 });
    }

    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error('Error executing search query:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
