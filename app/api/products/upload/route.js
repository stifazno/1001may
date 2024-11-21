import * as XLSX from 'xlsx';
import { query } from '../../../lib/db';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');
  
  if (!file) {
    return new Response('No file uploaded', { status: 400 });
  }
  
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  // Логируем данные для отладки
  console.log('Data extracted from Excel:', data);
  
  // Маппинг данных для записи в базу
  const mappedData = data.map((product) => ({
    category: product['Категория'],  // Извлекаем категорию
    name: product['Название'],          // Извлекаем название
    volume: product['Объем'],      // Извлекаем объём
    unit: product['Единица измерения'] || 'cl',  // Если 'init' пустое, задаём 'cl' по умолчанию
    price: product['Розничная цена'],        // Извлекаем цену
  }));
  
  console.log('Mapped Data:', mappedData);  // Логируем преобразованные данные
  
  try {
    for (const product of mappedData) {
      const { category, name, volume, unit, price } = product;

      // Проверка на пустые или неверные значения
      if (!category || !name || !volume || !price || isNaN(price)) {
        console.log(`Skipping invalid product: ${category}, ${name}, ${volume}, ${unit}, ${price}`);
        continue;  // Пропускаем товар, если есть пустое или неверное значение
      }

      // Проверка, существует ли товар в базе данных
      const existingProduct = await query(
        'SELECT * FROM products WHERE category = $1 AND name = $2 AND volume = $3 AND unit = $4',
        [category, name, volume, unit]
      );

      if (existingProduct.rowCount > 0) {
        console.log(`Product already exists: ${category}, ${name}, ${volume}, ${unit}`);
        continue;  // Пропускаем товар, если он уже существует
      }

      console.log(`Inserting product: ${category}, ${name}, ${volume}, ${unit}, ${price}`);

      // Вставляем данные в базу
      await query(
        'INSERT INTO products (category, name, volume, unit, price) VALUES ($1, $2, $3, $4, $5)',
        [category, name, volume, unit, price]
      );
    }
    
    return new Response('Товары успешно добавлены', { status: 200 });
  } catch (error) {
    console.error('Ошибка при добавлении продуктов:', error);
    return new Response('Ошибка при добавлении продуктов', { status: 500 });
  }
}
