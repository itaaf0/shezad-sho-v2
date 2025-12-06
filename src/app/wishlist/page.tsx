
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/use-auth";
import { useWishlist } from "@/hooks/use-wishlist";
import { getProduct, type Product } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/app/products/product-grid";
import { HeartCrack } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated, isAuthLoaded } = useAuth();
  const { wishlist, isWishlistLoaded } = useWishlist();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoaded && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isAuthLoaded, router]);

  useEffect(() => {
    async function fetchWishlistProducts() {
      if (isWishlistLoaded) {
        setIsLoading(true);
        const productPromises = wishlist.map(id => getProduct(id));
        const products = (await Promise.all(productPromises)).filter(p => p !== undefined) as Product[];
        setWishlistProducts(products);
        setIsLoading(false);
      }
    }
    fetchWishlistProducts();
  }, [wishlist, isWishlistLoaded]);

  if (isLoading || !isAuthLoaded) {
    return (
        <div className="container py-12 md:py-16">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
                    My Wishlist
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Your saved items for later.
                </p>
            </header>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[400px] w-full" />)}
            </div>
        </div>
    );
  }
  
  if (!isAuthenticated) return null;

  return (
    <div className="container py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
          My Wishlist
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Your saved items for later.
        </p>
      </header>
      
      {wishlistProducts.length > 0 ? (
        <ProductGrid products={wishlistProducts} />
      ) : (
        <div className="text-center py-16 border-dashed border-2 rounded-lg">
            <HeartCrack className="h-20 w-20 mx-auto text-muted-foreground" />
            <h2 className="mt-6 text-2xl font-semibold">Your Wishlist is Empty</h2>
            <p className="mt-2 text-muted-foreground">
                You haven't added any items to your wishlist yet.
            </p>
            <Button asChild className="mt-6">
                <Link href="/products">Start Browsing</Link>
            </Button>
        </div>
      )}
    </div>
  );
}
