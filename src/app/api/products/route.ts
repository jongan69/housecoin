// route.ts

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
) {
    try {
        console.log(`Fetching products`);
        const url = `https://sakysysfksculqobozxi.supabase.co/rest/v1/public_products_with_categories?select=*&collection_id=eq.2f3c661f-db62-49f8-a740-3dac1fc57713`;
        console.log(`Fetching products from: ${url}`);
        
        const response = await fetch(url, { 
            headers: {
                apikey: process.env.HOUSECOIN_STORE_APIKEY!
            },
            cache: 'no-store',
            next: { revalidate: 0 }
        });
        
        if (!response.ok) {
            console.error(`Housecoin Store API error: ${response.status}`);
            throw new Error(`Housecoin Store API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Housecoin Store API response:', data);

        if (!data) {
            console.error('Products data not found in response');
            throw new Error('Products data not found');
        }
        
        const result = { 
            products: data
        };
        
        console.log('Products data processed:', result);
        return Response.json(result);
    } catch (error: unknown) {
        console.error(`Error in products API: ${error}`);
        return Response.json({ 
            error: error instanceof Error ? error.message : 'Failed to load products data',
            products: []
        });
    }
}