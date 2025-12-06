
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/orders');
        }
    }, [isAuthenticated, router]);

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        await login(values.email, values.password);
    }

    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="container flex items-center justify-center py-20 min-h-[calc(100vh-8rem)]">
            <Card className="w-full max-w-sm">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
                            <CardDescription>Enter your credentials to access your account.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                             <FormField control={form.control} name="password" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
                            </Button>
                            <p className="text-sm text-muted-foreground">
                                Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
                            </p>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    )
}
