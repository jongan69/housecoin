// route.ts

export async function POST(
    request: Request
) {
    const { outputMint } = await request.json()
    const url = `https://api.jup.ag/price/v2?ids=${outputMint}&showExtraInfo=true`;

    try {
        // console.log(`Retrieving price for token: ${outputMint}`);
        const response = await fetch(url, { cache: 'no-store' })
            .then(res => res.json())
        // console.log(response)

        if (!response.data || !response.data[outputMint]) {
            throw new Error('Token price data not found');
        }

        const tokenData = response.data[outputMint];
        const price = parseFloat(tokenData.price);
        
        return Response.json({ 
            price,
            uiFormatted: `$${price}`,
            confidenceLevel: tokenData.extraInfo?.confidenceLevel,
            lastTraded: {
                buy: tokenData.extraInfo?.lastSwappedPrice?.lastJupiterBuyPrice,
                sell: tokenData.extraInfo?.lastSwappedPrice?.lastJupiterSellPrice
            }
        });
    } catch (error: unknown) {
        console.error(`Error fetching token price data: ${error}`);
        return Response.json({ error: 'Failed to load price data' })
    }
}