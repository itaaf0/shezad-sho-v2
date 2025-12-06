
import { getProducts } from "@/lib/data";
import { ProductGrid } from "./product-grid";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
          Our Collection
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse our carefully selected products designed to bring a sense of calm and beauty to your space.
        </p>
      </header>

      <ProductGrid products={products} />
    </div>
  );
}
