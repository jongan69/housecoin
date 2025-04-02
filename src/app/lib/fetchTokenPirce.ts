const URL = process.env.NEXT_PUBLIC_API_URL!;
const OUTPUT_MINT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

export async function getTokenPrice() {
    try {
      console.log('Fetching token price...');
      const response = await fetch(`${URL}/api/price`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          outputMint: OUTPUT_MINT
        }),
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.error) {
        console.error('API error:', data.error);
        throw new Error(data.error);
      }
      console.log('Price data received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching price:', error);
      return { price: 0, uiFormatted: '$0.000', confidenceLevel: 'low' };
    }
  }