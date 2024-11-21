import { query } from "@/app/lib/db";


export async function GET(){
    try{
        const products = await query('SELECT * FROM products');
        return new Response(JSON.stringify(products.rows) , {status:200});
    } catch(error){
        console.error("Ошибка получения товара:", error);
        return new Response('Ошибка получения товара', {status:500});
    }
}