
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/data";
import { placeholderImages } from "@/lib/placeholder-images";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductGrid } from "@/app/products/product-grid";

export default async function KashmiriShawlLandingPage() {
  const landingProducts = await getProducts("Kashmiri Shawl");

  return (
    <div className="flex flex-col">
      <section id="products" className="py-12 md:py-20 lg:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline inline-flex items-center gap-2">
              <Sparkles className="text-primary"/>
              Authentic Kashmiri Shawls
              <Sparkles className="text-primary"/>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the warmth and artistry of handwoven Kashmiri shawls.
            </p>
          </div>
          <ProductGrid products={landingProducts} />
        </div>
      </section>
    </div>
  );
}
