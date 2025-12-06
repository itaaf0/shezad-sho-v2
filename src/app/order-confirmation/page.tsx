
"use client";

import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrderConfirmationPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="container flex items-center justify-center py-20 min-h-[calc(100vh-8rem)]">
            <Card className="w-full max-w-lg text-center shadow-lg animate-in fade-in-50 zoom-in-95 duration-500">
                <CardHeader>
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 animate-pulse">
                      <CheckCircle2 className="h-12 w-12 text-green-600" />
                    </div>
                    <CardTitle className="text-3xl font-headline mt-4">Thank You for Your Order!</CardTitle>
                    <CardDescription className="text-muted-foreground pt-2">
                        Your order has been placed successfully. A confirmation message has been sent to your Telegram.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {orderId && (
                        <div className="mt-2 text-sm bg-secondary p-4 rounded-md">
                            <p>Your Order ID is:</p>
                            <p className="font-semibold text-primary text-lg tracking-wider">{orderId}</p>
                        </div>
                    )}
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
        </div>
    )
}
