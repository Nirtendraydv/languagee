
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { BookOpen, Globe, UserCheck, Star, Zap, Award, Calendar, Users, Target } from 'lucide-react';
import FloatingLetters from '@/components/FloatingLetters';
import { TESTIMONIALS } from '@/lib/constants';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

type HomepageContent = {
    hero: { title: string; subtitle: string; buttonText: string; imageUrl: string; };
    howItWorks: { title: string; subtitle: string; steps: { title: string; description: string; }[]; };
    features: { title: string; items: { title: string; description: string; }[]; };
    whyUs: { title: string; subtitle: string; imageUrl: string; points: { title: string; description: string; }[]; };
    testimonials: { title: string; };
    cta: { title: string; subtitle: string; buttonText: string; };
};

const iconMap: { [key: string]: React.ElementType } = {
  '1. Sign Up': UserCheck,
  '2. Schedule a Class': Globe,
  '3. Start Learning': BookOpen,
  'Personalized Learning': Target,
  'Flexible Scheduling': Calendar,
  'Interactive Classes': Zap,
  'Dedicated Tutors': Users,
  'Interactive Learning': Zap,
  'Expert Tutors': Award,
  'Personalized Path': Star,
};


export default function Home() {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, "settings", "homepageConfig");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data() as HomepageContent);
        } else {
          console.log("No homepage config found!");
        }
      } catch (error) {
        console.error("Error fetching homepage content:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (isLoading || !content) {
    return <HomepageSkeleton />;
  }

  return (
    <div className="flex flex-col items-center">
      <section className="w-full h-[90vh] md:h-screen relative overflow-hidden flex items-center justify-center text-center text-white bg-gradient-to-br from-primary via-blue-500 to-indigo-600">
        <div className="absolute inset-0">
          <Image
            src={content.hero.imageUrl}
            alt="Person learning on a laptop"
            data-ai-hint="laptop learning"
            layout="fill"
            objectFit="cover"
            className="opacity-20"
            priority
          />
          <FloatingLetters />
        </div>
        <div className="relative z-10 p-4 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-headline font-bold mb-4 text-shadow-lg">
            {content.hero.title}
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto font-body">
            {content.hero.subtitle}
          </p>
          <Link href="/courses">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full text-lg px-10 py-6 animate-glow">
              {content.hero.buttonText}
            </Button>
          </Link>
        </div>
      </section>

      <section id="how-it-works" className="w-full py-20 bg-background">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-headline font-bold mb-2">{content.howItWorks.title}</h2>
          <p className="text-muted-foreground text-lg mb-12">{content.howItWorks.subtitle}</p>
          <div className="grid md:grid-cols-3 gap-8">
            {content.howItWorks.steps.map((step, index) => {
               const Icon = iconMap[step.title] || BookOpen;
               return (
                <Card key={index} className="text-center p-6 border-2 border-transparent hover:border-primary transition-all duration-300 transform hover:-translate-y-2">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-20 h-20 flex items-center justify-center">
                      <Icon className="w-10 h-10 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-2xl mt-4">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{step.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
      
      <section id="features" className="w-full py-20 bg-secondary/50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-headline font-bold mb-12">{content.features.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.features.items.map((item, index) => {
              const Icon = iconMap[item.title] || Zap;
              return (
                <div key={index} className="flex flex-col items-center p-4">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-headline font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-center">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="why-us" className="w-full py-20 bg-background">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-headline font-bold mb-4">{content.whyUs.title}</h2>
              <p className="text-lg text-muted-foreground mb-8">
                {content.whyUs.subtitle}
              </p>
              <div className="space-y-6">
                {content.whyUs.points.map((point, index) => {
                  const Icon = iconMap[point.title] || Star;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="bg-primary text-primary-foreground rounded-full p-2">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-headline font-semibold">{point.title}</h3>
                        <p className="text-muted-foreground">{point.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="relative w-full h-[500px] rounded-lg shadow-2xl overflow-hidden">
              <Image 
                src={content.whyUs.imageUrl}
                alt="Two people discussing and learning"
                data-ai-hint="people learning"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="w-full py-20 bg-secondary/50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-headline font-bold mb-12">{content.testimonials.title}</h2>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {TESTIMONIALS.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2">
                  <div className="p-1">
                    <Card className="h-full bg-background">
                      <CardContent className="flex flex-col items-center text-center p-6 space-y-4">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-muted-foreground italic">&quot;{testimonial.quote}&quot;</p>
                        <div className="font-semibold font-headline">{testimonial.name}</div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      <section className="w-full py-20 bg-primary text-center text-primary-foreground">
        <div className="container mx-auto">
          <h2 className="text-4xl font-headline font-bold mb-4">{content.cta.title}</h2>
          <p className="text-lg mb-8">{content.cta.subtitle}</p>
          <Link href="/courses">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 rounded-full text-lg px-10 py-6">
              {content.cta.buttonText}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

const HomepageSkeleton = () => (
  <div className="flex flex-col items-center w-full">
    {/* Hero Skeleton */}
    <div className="w-full h-screen bg-muted flex items-center justify-center">
      <div className="space-y-4 text-center">
        <Skeleton className="h-16 w-96 mx-auto" />
        <Skeleton className="h-8 w-[500px] mx-auto" />
        <Skeleton className="h-14 w-48 mx-auto rounded-full" />
      </div>
    </div>
    
    {/* Sections Skeleton */}
    <div className="container mx-auto py-20 space-y-20">
      <div className="text-center space-y-4">
          <Skeleton className="h-12 w-80 mx-auto" />
          <Skeleton className="h-6 w-[450px] mx-auto" />
          <div className="grid md:grid-cols-3 gap-8 pt-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
      </div>
       <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <Skeleton className="h-12 w-96" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/5" />
          <div className="space-y-4 pt-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    </div>
  </div>
);
