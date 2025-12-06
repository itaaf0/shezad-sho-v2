
"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { placeholderImages } from "@/lib/placeholder-images";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartCount, cartTotal } = useCart();

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
  }

  if (cartCount === 0) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground" />
        <h1 className="mt-6 text-3xl font-bold font-headline">Your Cart is Empty</h1>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8">Your Cart</h1>
      <div className="grid lg:grid-cols-3 lg:gap-12">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="flex flex-col">
                {cartItems.map((item, index) => (
                  <React.Fragment key={item.cartItemId}>
                    <div className="flex items-center gap-4 p-4">
                      <div className="relative h-24 w-24 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={placeholderImages.find(p => p.id === item.image)?.imageUrl || ''}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Link href={`/products/${item.id}`} className="font-semibold hover:underline">{item.name}</Link>
                        {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                        <p className="text-sm text-muted-foreground">{formatPrice(item.price)} BDT</p>
                         <div className="mt-2 flex items-center gap-2">
                          <div className="flex items-center border rounded-md">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}>
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="font-semibold text-lg">{formatPrice(item.price * item.quantity)} BDT</p>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive mt-2" onClick={() => removeFromCart(item.cartItemId)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {index < cartItems.length - 1 && <Separator />}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1 mt-8 lg:mt-0">
           <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)} BDT</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(cartTotal)} BDT</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
