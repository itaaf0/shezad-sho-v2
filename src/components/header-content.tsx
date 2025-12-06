
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  Home,
  ShoppingBag,
  LogIn,
  UserPlus,
  UserCircle,
  LogOut,
  Shirt,
  Menu,
  HandPlatter,
  Heart,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { CartSheet } from "./cart-sheet";
import { placeholderImages } from "@/lib/placeholder-images";
import { useEffect, useState } from "react";

const SareeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" />
    <path d="M12 2v20" />
    <path d="M4.6 4.6c-2.8 2.8-4.6 6.5-4.6 10.4" />
    <path d="M19.4 4.6c2.8 2.8 4.6 6.5 4.6 10.4" />
  </svg>
);


const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Products", icon: Package },
  { href: "/landing/panjabi-combo", label: "Panjabi & Coats", icon: Shirt },
  { href: "/landing/kashmiri-shawl", label: "Kashmiri Shawls", icon: HandPlatter },
  { href: "/landing/saree", label: "Sarees", icon: SareeIcon },
];

export function HeaderContent() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const logoImage = placeholderImages.find((p) => p.id === "logo");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="container flex h-16 items-center">
        <div className="mr-6 flex items-center space-x-2">
            {logoImage && <Image src={logoImage.imageUrl} alt="Shezad shop logo" width={90} height={36} className="object-contain" />}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
             <div className="h-8 w-8"></div>
             <div className="h-8 w-8"></div>
        </div>
      </div>
    );
  }


  return (
    <>
       <div className="flex items-center md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
             <SheetHeader className="p-4">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
            </SheetHeader>
            <div className="p-4 pt-0">
              <Link href="/" className="mb-6 flex items-center space-x-2">
                {logoImage && (
                  <Image
                    src={logoImage.imageUrl}
                    alt="Shezad shop logo"
                    width={90}
                    height={36}
                    className="object-contain"
                  />
                )}
              </Link>
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md p-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        pathname === link.href
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      <link.icon />
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                {isAuthenticated && (
                  <>
                    <SheetClose asChild>
                      <Link
                        href="/orders"
                        className={cn(
                          "flex items-center gap-2 rounded-md p-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                          pathname?.startsWith("/orders")
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        <Package className="h-5 w-5" />
                        My Orders
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/wishlist"
                        className={cn(
                          "flex items-center gap-2 rounded-md p-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                          pathname === "/wishlist"
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        <Heart className="h-5 w-5" />
                        My Wishlist
                      </Link>
                    </SheetClose>
                  </>
                )}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1 md:flex-none justify-center md:justify-start">
        <Link href="/" className="flex items-center space-x-2">
          {logoImage && (
            <Image
              src={logoImage.imageUrl}
              alt="Shezad shop logo"
              width={90}
              height={36}
              className="object-contain"
              data-ai-hint={logoImage.imageHint}
            />
          )}
        </Link>
      </div>

      <nav className="hidden md:flex items-center space-x-6 text-sm font-medium mx-auto">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === link.href
                ? "text-foreground"
                : "text-foreground/60"
            )}
          >
            {link.label}
          </Link>
        ))}
        {isAuthenticated && (
          <>
            <Link
              href="/orders"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname?.startsWith("/orders")
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              My Orders
            </Link>
            <Link
              href="/wishlist"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/wishlist"
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              My Wishlist
            </Link>
          </>
        )}
      </nav>
      <div className="flex flex-1 items-center justify-end space-x-4">
        <CartSheet>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-2 -top-2 h-5 w-5 justify-center rounded-full p-0 text-xs"
              >
                {cartCount}
              </Badge>
            )}
            <span className="sr-only">Open cart</span>
          </Button>
        </CartSheet>

        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${user.email}.png`}
                    alt={user.name || ""}
                  />
                  <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="hidden md:flex items-center space-x-2">
            <Button asChild variant="ghost">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Link>
            </Button>
            <Button asChild>
              <Link href="/signup">
                <UserPlus className="mr-2 h-4 w-4" /> Sign Up
              </Link>
            </Button>
          </div>
        )}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end" forceMount>
              {!isAuthenticated ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}
