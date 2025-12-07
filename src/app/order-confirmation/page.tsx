// src/app/order-confirmation/page.tsx (পুরো ফাইলটি এই কোড দিয়ে প্রতিস্থাপন করুন)

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, MapPin, DollarSign, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from 'react';
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

// ডেটা টাইপ ডিক্লেয়ারেশন (MongoDB মডেল অনুযায়ী)
interface OrderItem {
    name: string;
    variantName: string | null;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    imageUrl: string;
}

interface ShippingInfo {
    name: string;
    phone: string;
    email: string | null;
    address: string;
    city: string;
    zip: string;
}

interface OrderData {
    orderId: string;
    grandTotal: number;
    subtotal: number;
    deliveryCharge: number;
    orderStatus: string;
    paymentDetails: {
        paymentMethod: string;
        paymentStatus: string;
    };
    orderItems: OrderItem[];
    shippingInfo: ShippingInfo;
}

// মূল্য ফরম্যাট করার ফাংশন
const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
}

function OrderConfirmationContent() { 
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    const [order, setOrder] = useState<OrderData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) {
            setError("No Order ID found in URL.");
            setIsLoading(false);
            return;
        }

        const fetchOrder = async () => {
            try {
                // নতুন API রুট থেকে ডেটা ফেচ করা হচ্ছে: /api/order/order_17011000000
                const response = await fetch(`/api/order/${orderId}`);
                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || "Failed to fetch order details.");
                }

                setOrder(result.data);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    // --- লোডিং এবং এরর স্টেট ---
    if (isLoading) {
        return (
            <Card className="w-full max-w-lg text-center shadow-lg">
                <CardHeader>
                    <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
                    <CardTitle className="mt-4">Loading Order Details...</CardTitle>
                    <CardDescription>We're fetching your order information.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-full max-w-lg text-center shadow-lg">
                <CardHeader>
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                        <ShoppingBag className="h-12 w-12 text-red-600" />
                    </div>
                    <CardTitle className="text-3xl font-headline mt-4">Order Not Found</CardTitle>
                    <CardDescription className="text-red-600 pt-2">{error}</CardDescription>
                </CardHeader>
                <CardFooter className="justify-center">
                    <Button asChild>
                        <Link href="/products">Go to Homepage</Link>
                    </Button>
                </CardFooter>
            </Card>
        );
    }
    
    if (!order) {
        // যদি এরর না থাকে কিন্তু অর্ডার লোড না হয়
        return <div className="text-center text-red-500">Could not retrieve order details.</div>;
    }

    // --- সফল কনফার্মেশন স্টেট ---
    const { grandTotal, shippingInfo, orderItems, deliveryCharge, subtotal, paymentDetails } = order;

    return (
        <div className="w-full max-w-3xl space-y-8">
            <Card className="text-center shadow-lg animate-in fade-in-50 zoom-in-95 duration-500">
                <CardHeader>
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-12 w-12 text-green-600" />
                    </div>
                    <CardTitle className="text-3xl font-headline mt-4">Thank You for Your Order!</CardTitle>
                    <CardDescription className="text-muted-foreground pt-2">
                        Your order has been placed successfully. A confirmation message has been sent to your Telegram.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mt-2 text-lg bg-secondary p-4 rounded-md">
                        <p>Your Order ID:</p>
                        <p className="font-bold text-primary text-2xl tracking-wider">{orderId}</p>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <div className="flex justify-center gap-4">
                        <Button asChild>
                            <Link href="/products">Continue Shopping</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/orders">View My Orders</Link>
                        </Button>
                    </div>
                </CardFooter>
            </Card>
            
            {/* --- Order Details Section --- */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* 1. Shipping Details */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2"><MapPin className="h-5 w-5"/> Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                        <p className="font-semibold">{shippingInfo.name}</p>
                        <p>{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.zip}</p>
                        <p>Phone: <span className="font-medium">{shippingInfo.phone}</span></p>
                        {shippingInfo.email && <p>Email: {shippingInfo.email}</p>}
                    </CardContent>
                </Card>

                {/* 2. Payment Summary */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2"><DollarSign className="h-5 w-5"/> Payment Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                        <div className="flex justify-between">
                            <span>Payment Method:</span>
                            <span className="font-medium capitalize">{paymentDetails.paymentMethod === 'cod' ? 'Cash on Delivery' : paymentDetails.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Payment Status:</span>
                            <span className={`font-medium capitalize ${paymentDetails.paymentStatus === 'unpaid' ? 'text-red-500' : 'text-green-600'}`}>
                                {paymentDetails.paymentStatus}
                            </span>
                        </div>
                        <Separator className="my-2"/>
                        <div className="flex justify-between"><span>Subtotal:</span><span>{formatPrice(subtotal)} BDT</span></div>
                        <div className="flex justify-between"><span>Delivery Charge:</span><span>{formatPrice(deliveryCharge)} BDT</span></div>
                        <Separator className="my-2"/>
                        <div className="flex justify-between font-bold text-lg text-primary">
                            <span>Grand Total:</span>
                            <span>{formatPrice(grandTotal)} BDT</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 3. Product List */}
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2"><ShoppingBag className="h-5 w-5"/> Order Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {orderItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                            <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1 text-sm">
                                <p className="font-semibold">{item.name}</p>
                                {item.variantName && <p className="text-xs text-muted-foreground">{item.variantName}</p>}
                                <p className="text-xs text-muted-foreground">Qty: {item.quantity} x {formatPrice(item.unitPrice)} BDT</p>
                            </div>
                            <p className="font-bold text-base">{formatPrice(item.totalPrice)} BDT</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

// মূল এক্সপোর্ট ফাংশনটি এখন Suspense Boundary যোগ করছে
export default function OrderConfirmationPage() {
    return (
        <div className="container flex items-center justify-center py-12 md:py-20 min-h-[calc(100vh-8rem)]">
            {/* useSearchParams ব্যবহার করার জন্য Suspense অপরিহার্য */}
            <Suspense fallback={
                <Card className="w-full max-w-lg text-center shadow-lg">
                    <CardHeader>
                        <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
                        <CardTitle className="mt-4">Preparing Confirmation...</CardTitle>
                    </CardHeader>
                </Card>
            }>
                <OrderConfirmationContent />
            </Suspense>
        </div>
    )
}