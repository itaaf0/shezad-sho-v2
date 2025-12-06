
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart, type CartItem } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "./ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { placeholderImages } from "@/lib/placeholder-images";

export function CartSheet({ children }: { children: React.ReactNode }) {
  const { cartItems, cartCount, cartTotal } = useCart();

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Cart ({cartCount})</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartCount > 0 ? (
          <>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-6 px-6 py-4">
                {cartItems.map((item) => (
                  <CartItemEntry key={item.cartItemId} item={item} />
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <SheetFooter className="px-6 py-4">
              <div className="w-full space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal)} BDT</span>
                </div>
                <SheetClose asChild>
                  <Button asChild className="w-full" size="lg">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/cart">View Cart</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Your cart is empty</h3>
            <p className="text-muted-foreground">Add some products to get started.</p>
            <SheetTrigger asChild>
                <Button asChild>
                    <Link href="/products">Continue Shopping</Link>
                </Button>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CartItemEntry({ item }: { item: CartItem }) {
  const { removeFromCart, updateQuantity } = useCart();
  const productImage = placeholderImages.find(p => p.id === item.image);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
  }

  return (
    <div className="flex items-start gap-4">
      <div className="aspect-square w-20 h-20 rounded-md overflow-hidden">
        {productImage && (
             <Image
             src={productImage.imageUrl}
             alt={item.name}
             width={80}
             height={80}
             className="object-cover"
             data-ai-hint={productImage.imageHint}
           />
        )}
      </div>
      <div className="flex-1">
        <Link href={`/products/${item.id}`} className="font-semibold hover:underline">
          {item.name}
        </Link>
        {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
        <p className="text-sm text-muted-foreground">{formatPrice(item.price)} BDT</p>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => removeFromCart(item.cartItemId)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="font-semibold">{formatPrice(item.price * item.quantity)} BDT</p>
    </div>
  );
}
