import { query } from "@/app/lib/db";

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const category = url.searchParams.get('category');
        const searchQuery = url.searchParams.get('query'); // Получаем поисковый запрос

        // Строим запрос к базе данных
        let productsQuery = 'SELECT * FROM products';
        const params = [];

        if (category) {
            if (category === 'Вино') {
                productsQuery += " WHERE category LIKE $1";
                params.push('Вино%'); // Используем шаблон для поиска
            } else {
                productsQuery += " WHERE category = $1";
                params.push(category);
            }   
        }

        // Добавляем фильтрацию по запросу поиска, если он есть
        if (searchQuery) {
            if (params.length > 0) {
                productsQuery += ' AND name ILIKE $' + (params.length + 1); // Ищем по имени товара, игнорируя регистр
            } else {
                productsQuery += ' WHERE name ILIKE $1';
            }
            params.push(`%${searchQuery}%`); // Поиск с подстановкой (частичное совпадение)
        }

        // Запрос к базе данных с фильтрацией
        const products = await query(productsQuery, params);

        return new Response(JSON.stringify(products.rows), { status: 200 });
    } catch (error) {
        console.error("Ошибка получения товара:", error);
        return new Response('Ошибка получения товара', { status: 500 });
    }
}
