const URL = process.env.NEXT_PUBLIC_API_URL!;

export async function fetchProducts() {
    try {
        const response = await fetch(`${URL}/api/products`);
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}