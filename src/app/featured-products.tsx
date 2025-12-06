
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Product } from "@/lib/data";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { ShoppingCart, Heart } from "lucide-react";
import { placeholderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {products.map((product) => (
        <FeaturedProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function FeaturedProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const [showSizeSelect, setShowSizeSelect] = useState(false);
  const productImage = placeholderImages.find(p => p.id === product.image);

  const isInWishlist = wishlist.includes(product.id);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
  }

  const handleAddToCartClick = () => {
    if (product.sizes && product.sizes.length > 0) {
      setShowSizeSelect(true);
    } else {
      addToCart(product, 1);
    }
  };

  const handleSizeSelect = (size: string) => {
    addToCart(product, 1, size);
    setShowSizeSelect(false);
  };
  
  if (!productImage) return null;

  return (
    <Card className="overflow-hidden group flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <Link href={`/products/${product.id}`} className="block aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={productImage.imageUrl}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={productImage.imageHint}
          />
        </Link>
        <Button 
          size="icon" 
          variant="secondary" 
          className="absolute top-2 right-2 h-8 w-8 rounded-full z-10"
          onClick={() => toggleWishlist(product.id)}
        >
          <Heart className={cn("h-4 w-4", isInWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
        </Button>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline leading-tight">
          <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">{product.name} - {product.colorName}</Link>
        </CardTitle>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col items-stretch gap-2">
         <p className="text-xl font-semibold text-primary mb-2">
            {formatPrice(product.price)} BDT
        </p>

        {showSizeSelect ? (
          <Select onValueChange={handleSizeSelect}>
            <SelectTrigger className="w-full animate-shake">
              <SelectValue placeholder="Select a size" />
            </SelectTrigger>
            <SelectContent>
              {product.sizes.map(size => (
                <SelectItem key={size} value={size}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
            <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild size="sm" className="w-full">
                    <Link href={`/products/${product.id}`}>Order Now</Link>
                </Button>
                <Button size="sm" variant="default" className="w-full" onClick={handleAddToCartClick}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                </Button>
            </div>
        )}
      </CardFooter>
    </Card>
  );
}
