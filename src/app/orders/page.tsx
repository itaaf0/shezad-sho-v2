
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { format } from 'date-fns';
import { mockOrders } from '@/app/checkout/page';
import { type Product } from "@/lib/data";

interface Order {
    id: string;
    date: string;
    items: Product[];
    total: number;
    status: 'Processing' | 'Shipped' | 'Delivered';
}

export default function OrdersPage() {
    const router = useRouter();
    const { isAuthenticated, user, isAuthLoaded } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
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
        
        if (isAuthenticated && user) {
            setIsLoading(true);
            const userOrders = mockOrders.filter(o => o.userId === user.uid);
            userOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setOrders(userOrders);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated, isAuthLoaded, user, router]);

    if (isLoading || !isAuthLoaded) {
        return <div className="container py-12">Loading your orders...</div>;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="container py-12 md:py-16">
            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold font-headline">My Orders</h1>
                <p className="text-muted-foreground mt-2">View your order history and check the status of your purchases.</p>
            </header>
            <Card>
                <CardContent className="p-0">
                    {orders.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="hidden sm:table-cell">Order ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="hidden sm:table-cell font-medium truncate max-w-xs">{order.id}</TableCell>
                                        <TableCell>{format(new Date(order.date), 'MMM dd, yyyy')}</TableCell>
                                        <TableCell>
                                            <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'} className="capitalize">{order.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{formatPrice(order.total)} BDT</TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="ghost" size="sm">
                                                <Link href={`/orders/${order.id}`}>View</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center p-12">
                            <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                            <h3 className="mt-4 text-xl font-semibold">No Orders Yet</h3>
                            <p className="mt-2 text-muted-foreground">You haven't placed any orders with us yet.</p>
                            <Button asChild className="mt-6">
                                <Link href="/products">Start Shopping</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
