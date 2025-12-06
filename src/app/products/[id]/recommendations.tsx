
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getPersonalizedRecommendations } from "@/ai/flows/personalized-product-recommendations";
import { getProduct, type Product } from "@/lib/data";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { placeholderImages } from "@/lib/placeholder-images";

export function Recommendations({ productId }: { productId: string }) {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
  }

  useEffect(() => {
    async function fetchRecommendations() {
      setLoading(true);
      try {
        // Mocked input for the AI model
        const recommendationsInput = {
          viewingHistory: ["prod_2", "prod_5", productId],
          purchaseHistory: ["prod_4"],
          currentTrends: "minimalist home decor, sustainable materials",
          customerInterest: "wellness and relaxation",
          popularity: "high",
          inventoryStatus: "in stock",
          seasonalSalesData: "spring cleaning sale",
        };

        const { recommendedProducts: recommendedIds } = await getPersonalizedRecommendations(recommendationsInput);
        
        // Filter out the current product and fetch product details
        const productPromises = recommendedIds
          .filter(id => id !== productId)
          .slice(0, 4) // Limit to 4 recommendations
          .map(id => getProduct(id));

        const products = (await Promise.all(productPromises)).filter((p): p is Product => p !== undefined);
        setRecommendedProducts(products);

      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        // If the AI service fails, we'll just show no recommendations.
        setRecommendedProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [productId]);

  if (loading) {
    return <RecommendationsSkeleton />;
  }

  if (recommendedProducts.length === 0) {
    return null; // Don't show the section if there are no recommendations
  }

  return (
    <div className="container py-12 md:py-20">
      <h2 className="text-3xl font-bold text-center tracking-tight sm:text-4xl font-headline mb-10">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {recommendedProducts.map((product) => {
          const productImage = placeholderImages.find(p => p.id === product.image);
          return (
            <Card key={product.id} className="overflow-hidden group flex flex-col">
              <CardHeader className="p-0">
                <Link href={`/products/${product.id}`} className="block aspect-square overflow-hidden bg-muted">
                  {productImage && (
                    <Image
                      src={productImage.imageUrl}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={productImage.imageHint}
                    />
                  )}
                </Link>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <h3 className="text-lg font-headline leading-tight">
                  <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">{product.name}</Link>
                </h3>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <p className="text-lg font-semibold text-primary">
                  {formatPrice(product.price)} BDT
                </p>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function RecommendationsSkeleton() {
    return (
        <div className="container py-12 md:py-20">
            <h2 className="text-3xl font-bold text-center tracking-tight sm:text-4xl font-headline mb-10">
                You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="p-0">
                            <Skeleton className="w-full h-auto aspect-square" />
                        </CardHeader>
                        <CardContent className="p-4">
                            <Skeleton className="h-5 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                            <Skeleton className="h-6 w-1/4" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
