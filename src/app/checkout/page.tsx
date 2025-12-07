
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { placeholderImages } from "@/lib/placeholder-images";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { sendTelegramOrderMessage } from "@/ai/flows/send-telegram-message";
import { type Product } from "@/lib/data";

// src/app/checkout/page.tsx
// ... (লাইন ২৩ এর আশেপাশে)
const mockOrders: any[] = [];

// ⭐ [নতুন যোগ] বাংলাদেশি ফোন নম্বরের জন্য রেগুলার এক্সপ্রেশন
const bangladeshiPhoneRegex = /^01[3-9]\d{8}$/; // শুরু 01 দিয়ে এবং মোট 11 ডিজিট

const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zip: z.string().min(4, "Zip code is required"),
    
  // ⭐ [সংশোধিত] ফোন নম্বর ফিল্ড: 11 ডিজিটের বাংলাদেশি নম্বর নিশ্চিত করা হলো
  phone: z.string()
    .regex(bangladeshiPhoneRegex, "Invalid Bangladeshi phone number (must be 11 digits, starting with 01)"),
    
  // ⭐ [সংশোধিত] ইমেল ফিল্ড: এটিকে ঐচ্ছিক করা হলো
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
    
  paymentMethod: z.enum(["cod", "online"], {
    required_error: "You need to select a payment method.",
  }),
});

export default function CheckoutPage() {
// ...

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthLoaded } = useAuth();
  const { cartItems, cartTotal, clearCart, isCartLoaded } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  // src/app/checkout/page.tsx
// ... (লাইন ৪২ এর আশেপাশে)
  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      city: "",
      zip: "",
      // ⭐ [নতুন যোগ] ফোন নম্বর default value
      phone: "", 
      paymentMethod: "cod",
    },
  });
  
  useEffect(() => {
    if (isAuthLoaded && user) {
        form.reset({
            ...form.getValues(),
            name: user.name || "",
            email: user.email || "",
        });
    }
  }, [user, isAuthLoaded, form]);

  useEffect(() => {
    if (isCartLoaded && cartItems.length === 0 && !orderPlaced) {
      router.replace('/products');
    }
  }, [isCartLoaded, cartItems, router, orderPlaced]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
  }

  async function onSubmit(values: z.infer<typeof checkoutSchema>) {
    console.log("Processing order for:", values);
    
    const newOrderId = `order_${Date.now()}`;
    const orderData = {
        userId: user?.uid || null,
        id: newOrderId,
        date: new Date().toISOString(),
        items: cartItems.map(({...item}) => {
          // remove cartItemId before saving
          const { cartItemId, ...rest } = item;
          return rest;
        }),
        total: cartTotal,
        status: 'Processing',
        shippingInfo: values
    };

    mockOrders.push(orderData);
    
    try {
      await sendTelegramOrderMessage({
        orderId: newOrderId,
        customerDetails: values,
        productDetails: cartItems.map(item => {
            const productImage = placeholderImages.find(p => p.id === item.image);
            return {
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                imageUrl: productImage?.imageUrl || 'https://placehold.co/600x400',
                size: item.size,
                colorName: item.colorName,
            };
        }),
        total: cartTotal,
      });

      // src/app/checkout/page.tsx - onSubmit ফাংশনের ভেতরে

// ... (existing sendTelegramOrderMessage call এর পরে)

      // --- ⭐ MongoDB তে সেভ করার জন্য চূড়ান্ত ডেটা স্ট্রাকচার তৈরি (সংশোধিত) ⭐ ---
      
      const subtotal = cartTotal;
      const deliveryCharge = 80; // আপনি যদি ডেলিভারি চার্জ যোগ করতে চান
      const discountAmount = 0; 
      const grandTotal = subtotal + deliveryCharge; 
      
      const mongoOrderData = {
          orderId: newOrderId,
          userId: user?.uid || null,
          
          // আর্থিক বিবরণ (Financial Details)
          subtotal: subtotal,
          discountAmount: discountAmount,
          deliveryCharge: deliveryCharge,
          taxAmount: 0,
          grandTotal: grandTotal,
          
          // অর্ডারের আইটেমসমূহ (orderItems)
          orderItems: cartItems.map(item => ({
              productId: item.id,
              name: item.name,
              // variantName: Size/ColorName
              variantName: [item.size, item.colorName].filter(Boolean).join(' / ') || null, 
              unitPrice: item.price,
              quantity: item.quantity,
              totalPrice: item.price * item.quantity,
              imageUrl: placeholderImages.find(p => p.id === item.image)?.imageUrl || '/default-product.jpg', 
          })),

          // গ্রাহক ও শিপিং তথ্য (shippingInfo)
          shippingInfo: {
              name: values.name,
              phone: values.phone, // <--- এখন ফোন নম্বর যাচ্ছে
              email: values.email || null, // ইমেল ঐচ্ছিক
              address: values.address,
              city: values.city,
              zip: values.zip,
              deliveryMethod: 'Standard Courier', 
              courierName: '',
          },
          
          // পেমেন্ট তথ্য (paymentDetails)
          paymentDetails: {
              paymentMethod: values.paymentMethod,
              paymentStatus: values.paymentMethod === 'cod' ? 'unpaid' : 'pending',
          },
          
          orderStatus: 'pending',
          
          notes: '', 
      };

      // API কল: fetch('/api/order', ...)
      const mongoResponse = await fetch('/api/order', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(mongoOrderData), // সম্পূর্ণ ডেটা স্ট্রাকচার পাঠানো হচ্ছে
      });
      
      if (!mongoResponse.ok) {
          const errorResult = await mongoResponse.json();
          throw new Error(errorResult.message || 'Failed to save order to database.');
      }

      console.log('✅ Order successfully saved to MongoDB.');
      // --- ⭐ নতুন কোড ব্লক শেষ ⭐ ---
      
    // ... (rest of the try/catch block remains the same)

      clearCart();
      setOrderPlaced(true);
      router.push(`/order-confirmation?orderId=${newOrderId}`);

    } catch (error) {
      console.error("Failed to place order:", error);
    }
  }

  if (!isCartLoaded || !isAuthLoaded || (cartItems.length === 0 && !orderPlaced)) {
    return (
        <div className="container py-12 md:py-16">
            <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8">Checkout</h1>
            <div className="grid lg:grid-cols-3 lg:gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
                </div>
                <div className="lg:col-span-1 mt-8 lg:mt-0">
                    <Card className="sticky top-24">
                        <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
                        <CardContent><Skeleton className="h-20 w-full" /></CardContent>
                        <CardFooter><Skeleton className="h-12 w-full" /></CardFooter>
                    </Card>
                </div>
            </div>
      </div>
    )
  }

  return (
    <>
      <div className="container py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8">Checkout</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="zip" render={({ field }) => (
                    <FormItem><FormLabel>ZIP Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  // src/app/checkout/page.tsx
// ... (লাইন ২১৬ এর আশেপাশে)
                  <FormField control={form.control} name="zip" render={({ field }) => (
                    <FormItem><FormLabel>ZIP Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  
                {/* ⭐ [নতুন যোগ] Phone Number Field */}
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input {...field} placeholder="e.g., 017xxxxxxxx" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                {/* ⭐ [নতুন যোগ] শেষ */}
                
                   <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Email (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
// ...
                   <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="cod" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Cash on Delivery
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="online" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Online Payment (Bkash, Nagad)
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-1 mt-8 lg:mt-0">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                      {cartItems.map(item => {
                          const productImage = placeholderImages.find(p => p.id === item.image);
                          return (
                            <div key={item.cartItemId} className="flex items-center gap-4 text-sm">
                              <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
                                  {productImage && (
                                      <Image
                                          src={productImage.imageUrl}
                                          alt={item.name}
                                          fill
                                          className="object-cover"
                                      />
                                  )}
                              </div>
                              <div className="flex-1">
                                  <p className="font-semibold">{item.name}</p>
                                  {item.size && <p className="text-muted-foreground">Size: {item.size}</p>}
                                  <p className="text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-semibold">{formatPrice(item.price * item.quantity)} BDT</p>
                          </div>
                          )
                      })}
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>{formatPrice(cartTotal)} BDT</span>
                      </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Placing Order..." : `Place Order`}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
export { mockOrders };
