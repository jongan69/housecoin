// app/products/page.tsx (or wherever your route is)
import { fetchProducts } from "../lib/fetchProducts";
import ProductClientGrid from "./ProductClientGrid";

export default async function ProductsPage() {
  const products = await fetchProducts(); // runs only once on server

  return <ProductClientGrid products={products} />;
}
