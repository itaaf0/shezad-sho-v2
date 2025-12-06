
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { placeholderImages } from '@/lib/placeholder-images';
import { format } from 'date-fns';
import { mockOrders } from '@/app/checkout/page';
import { type Product } from '@/lib/data';

interface Order {
    id: string;
    date: string;
    items: Product[];
    total: number;
    status: 'Processing' | 'Shipped' | 'Delivered';
    shippingInfo: {
        name: string;
        address: string;
        city: string;
        zip: string;
    };
}

export default function OrderDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const orderId = Array.isArray(params.id) ? params.id[0] : params.id;
    const { isAuthenticated, isAuthLoaded } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const formatPrice = (price: number) => {
        return price.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });
    }

    useEffect(() => {
        if (isAuthLoaded && !isAuthenticated) {
            router.push('/login');
            return;
        }

        setIsLoading(true);
        const foundOrder = mockOrders.find(o => o.id === orderId);
        if (foundOrder) {
            setOrder(foundOrder);
        } else {
            console.log("No such document!");
            // Optionally redirect if order not found
            // router.push('/orders');
        }
        setIsLoading(false);
        
    }, [isAuthenticated, isAuthLoaded, router, orderId]);

    if (isLoading || !isAuthLoaded) {
        return <div className="container py-12">Loading order details...</div>;
    }
    
    if (!order) {
        return <div className="container py-12">Order not found.</div>;
    }

    return (
        <div className="container py-12 md:py-16">
            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold font-headline">Order Details</h1>
                <p className="text-muted-foreground mt-2">
                    Order <span className="text-primary font-semibold">{order.id}</span> placed on {format(new Date(order.date), 'MMMM dd, yyyy')}
                </p>
            </header>
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Items Ordered</CardTitle>
                        </CardHeader>
                        <CardContent className="divide-y">
                            {order.items.map((item, index) => (
                                <div key={`${item.id}-${index}`} className="flex items-center gap-4 py-4">
                                    <Image
                                        src={placeholderImages.find(p => p.id === item.image)?.imageUrl || ''}
                                        alt={item.name}
                                        width={64}
                                        height={64}
                                        className="rounded-md bg-muted object-cover"
                                    />
                                    <div className="flex-1">
                                        <Link href={`/products/${item.id}`} className="font-semibold hover:underline">{item.name}</Link>
                                        {'size' in item && <p className="text-sm text-muted-foreground">Size: {(item as any).size}</p>}
                                        <p className="text-sm text-muted-foreground">Qty: {(item as any).quantity}</p>
                                    </div>
                                    <p className="font-semibold">{formatPrice(item.price * (item as any).quantity)} BDT</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatPrice(order.total)} BDT</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>0.00 BDT</span>
                            </div>
                            <Separator className="my-2"/>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{formatPrice(order.total)} BDT</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-muted-foreground">Status</span>
                                <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'} className="capitalize">{order.status}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Shipping Address</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            <p className="font-semibold text-foreground">{order.shippingInfo.name}</p>
                            <p>{order.shippingInfo.address}</p>
                            <p>{order.shippingInfo.city}, {order.shippingInfo.zip}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
