
"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getProduct, type Product } from "@/lib/data";
import { AddToCartButton } from "./add-to-cart-button";
import { placeholderImages } from "@/lib/placeholder-images";
import { Recommendations } from "./recommendations";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { ArrowRight, Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;
      setLoading(true);
      const fetchedProduct = await getProduct(productId);
      if (!fetchedProduct) {
        notFound();
      }
      setProduct(fetchedProduct);
       if (fetchedProduct && fetchedProduct.sizes && fetchedProduct.sizes.length === 0) {
        setSelectedSize("default");
        setShowSizeSelector(false); // No sizes to show
      } else if (fetchedProduct && fetchedProduct.sizes && fetchedProduct.sizes.length > 0) {
        setShowSizeSelector(false); // Hide selector by default if sizes exist
      }
      setLoading(false);
    }
    fetchProduct();
  }, [productId]);

  const triggerShake = () => {
    setShouldShake(true);
    setTimeout(() => setShouldShake(false), 820); // Corresponds to animation duration
  }

  const handleActionClick = (action: 'order' | 'cart') => {
    if (!product || isAdding) return;

    const hasSizes = product.sizes && product.sizes.length > 0;
    
    if (hasSizes && !selectedSize) {
      setShowSizeSelector(true);
      triggerShake();
      return;
    }

    setIsAdding(true);
    const sizeToUse = selectedSize === "default" ? undefined : selectedSize;

    addToCart(product, 1, sizeToUse);
    
    if (action === 'order') {
        router.push('/checkout');
    } else {
        // Re-enable button after a short delay for "Add to cart"
        setTimeout(() => setIsAdding(false), 1000);
    }
  };
  
  if (loading || !product) {
      return (
        <div className="container py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="flex flex-col justify-center space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-6 w-1/3" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-40" />
                <Skeleton className="h-12 w-40" />
              </div>
            </div>
          </div>
        </div>
      )
  }

  const productImage = placeholderImages.find(p => p.id === product.image);
  const hasSizes = product.sizes && product.sizes.length > 0;
  const isInWishlist = wishlist.includes(product.id);
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
  }

  return (
    <>
      <div className="container py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center group">
            {productImage && (
              <Dialog>
                <DialogTrigger asChild>
                  <Image
                    src={productImage.imageUrl}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={productImage.imageHint}
                  />
                </DialogTrigger>
                <DialogContent className="max-w-3xl p-0">
                  <DialogTitle className="sr-only">{product.name}</DialogTitle>
                  <Image
                    src={productImage.imageUrl}
                    alt={product.name}
                    width={1000}
                    height={1000}
                    className="w-full h-auto object-contain rounded-md"
                  />
                </DialogContent>
              </Dialog>
            )}
             <Button 
              size="icon" 
              variant="secondary" 
              className="absolute top-3 right-3 h-10 w-10 rounded-full z-10"
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart className={cn("h-5 w-5", isInWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
            </Button>
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl lg:text-4xl font-bold font-headline">{product.name} - {product.colorName}</h1>
            <p className="text-2xl lg:text-3xl font-semibold text-primary mt-2 mb-4">{formatPrice(product.price)} BDT</p>
            <p className="text-muted-foreground leading-relaxed">{product.longDescription}</p>
            
            {hasSizes && (
              <div className={cn("mt-6 transition-all duration-300", showSizeSelector || (hasSizes && !selectedSize) ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden")}>
                <h3 className="text-sm font-medium text-foreground mb-2">অর্ডার করতে সাইজ সিলেক্ট করুন</h3>
                <RadioGroup
                  value={selectedSize}
                  onValueChange={setSelectedSize}
                  className={cn("flex flex-wrap gap-2", shouldShake && "animate-shake")}
                >
                  {product.sizes.map(size => (
                    <div key={size}>
                      <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                      <Label
                        htmlFor={`size-${size}`}
                        className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 px-3 transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:bg-gray-800 [&:has([data-state=checked])]:text-white [&:has([data-state=checked])]:border-gray-800"
                      >
                        {size}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => handleActionClick('order')} className="group w-full sm:flex-1" disabled={isAdding}>
                {isAdding ? "Processing..." : (
                  <>
                    Order Now <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
              <AddToCartButton 
                product={product} 
                hasSizes={hasSizes} 
                selectedSize={selectedSize}
                onAddToCartClick={() => handleActionClick('cart')} 
                isAdding={isAdding}
              />
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              {product.inventory > 0
                ? `${product.inventory} in stock`
                : "Out of stock"}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-secondary/50">
        <Recommendations productId={product.id} />
      </div>
    </>
  );
}
