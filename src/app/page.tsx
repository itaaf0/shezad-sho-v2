
"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useRef } from 'react';
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/data";
import { placeholderImages } from "@/lib/placeholder-images";
import { ArrowRight, Sparkles } from "lucide-react";
import { FeaturedProducts } from "./featured-products";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = React.useState([]);
  const [heroImage, setHeroImage] = React.useState(null);

  React.useEffect(() => {
    async function loadData() {
      const allProducts = await getProducts();
      setFeaturedProducts(allProducts.slice(0, 4));
      setHeroImage(placeholderImages.find(p => p.id === "hero"));
    }
    loadData();
  }, []);

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <div className="flex flex-col">
      <section className="relative w-full aspect-[21/9] flex items-center justify-center text-center">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
      </section>

      <section className="py-6 bg-secondary/50">
        <div className="container">
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              <CarouselItem className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                 <Button asChild variant="outline" size="lg" className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <Link href="/landing/panjabi-combo">
                      Panjabi & Coats
                    </Link>
                  </Button>
              </CarouselItem>
              <CarouselItem className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                 <Button asChild variant="outline" size="lg" className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <Link href="/landing/kashmiri-shawl">
                      Kashmiri Shawls
                    </Link>
                  </Button>
              </CarouselItem>
               <CarouselItem className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                 <Button asChild variant="outline" size="lg" className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <Link href="/landing/saree">
                      Sarees
                    </Link>
                  </Button>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      <section className="pt-8 pb-12 md:pb-20 lg:pb-24 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center tracking-tight sm:text-4xl font-display mb-10 bg-gradient-to-r from-accent to-primary/80 bg-clip-text text-transparent">
            New Arrivals
          </h2>
          <FeaturedProducts products={featuredProducts} />
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
