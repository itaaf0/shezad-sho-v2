
"use client";

import { Button } from "@/components/ui/button";
import { type Product } from "@/lib/data";
import { ShoppingCart } from "lucide-react";

export function AddToCartButton({ 
  product, 
  hasSizes,
  selectedSize,
  onAddToCartClick,
  isAdding
}: { 
  product: Product, 
  hasSizes: boolean,
  selectedSize?: string,
  onAddToCartClick: () => void,
  isAdding: boolean
}) {

  const getButtonText = () => {
    if (isAdding) return "Adding...";
    return "Add to Cart";
  }

  return (
    <Button size="lg" onClick={onAddToCartClick} className="w-full sm:flex-1" disabled={isAdding}>
      <ShoppingCart className="mr-2 h-5 w-5" />
      {getButtonText()}
    </Button>
  );
}
