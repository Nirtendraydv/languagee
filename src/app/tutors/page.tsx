
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { TUTOR_FAQ, TUTORS_PLACEHOLDER } from '@/lib/constants';
import TutorCard from '@/components/TutorCard';
import { Award, Heart, Users } from 'lucide-react';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from '@/components/ui/skeleton';

type Tutor = {
  id: string;
  name: string;
  country: string;
  experience: number;
  rating: number;
  accent: string;
  avatar: string;
  dataAiHint: string;
  bio: string;
  specialties: string[];
};

export default function TutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tutors"));
        const tutorsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tutor));
        setTutors(tutorsList);
      } catch (error) {
        console.error("Error fetching tutors: ", error);
        setTutors(TUTORS_PLACEHOLDER as Tutor[]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTutors();
  }, []);

  return (
    <div className="bg-background gradient-bg">
      <header className="py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold font-headline text-primary">Meet Our Tutors</h1>
          <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">Our passionate and experienced tutors are here to guide you on your journey to English fluency.</p>
        </div>
      </header>
      
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {isLoading ? (
              <>
                <TutorCardSkeleton />
                <TutorCardSkeleton />
              </>
            ) : (
               tutors.map(tutor => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))
            )}
        </div>
      </div>
       <section className="py-20 bg-secondary/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative w-full h-[500px] rounded-lg shadow-2xl overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1516542076529-1ea0855399f2?q=80&w=800&auto=format&fit=crop"
                    alt="Happy student learning online"
                    data-ai-hint="student online"
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <div>
              <h2 className="text-4xl font-headline font-bold mb-4">Our Teaching Philosophy</h2>
              <p className="text-lg text-muted-foreground mb-8">
               We believe in creating a supportive and dynamic learning environment where students feel empowered to speak, make mistakes, and grow. Our approach is student-centered, meaning we adapt our teaching methods to your individual learning style, pace, and goals.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full p-3">
                    <Heart size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-semibold">Supportive Environment</h3>
                    <p className="text-muted-foreground">We foster a positive space where you can build confidence without fear of judgment.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full p-3">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-semibold">Personalized Attention</h3>
                    <p className="text-muted-foreground">With our dedicated tutors, you receive focused, one-on-one attention.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full p-3">
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-semibold">Focus on Real Communication</h3>
                    <p className="text-muted-foreground">We prioritize practical, real-world language skills you can use immediately.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 container mx-auto">
        <h2 className="text-4xl font-headline font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {TUTOR_FAQ.split('\n\n').map((faq, index) => {
              const [question, answer] = faq.split('\nA: ');
              const q = question.replace('Q: ', '');
              return (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-semibold text-left">{q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    {answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </section>
    </div>
  );
}

const TutorCardSkeleton = () => (
    <div className="flex flex-col h-full bg-card/80 backdrop-blur-sm border-2 border-primary/10 rounded-xl overflow-hidden p-6 space-y-4">
        <div className="flex flex-col items-center">
            <Skeleton className="w-32 h-32 rounded-full mb-4" />
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3" />
        </div>
         <Skeleton className="h-20 w-full" />
         <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-12 w-full rounded-full" />
    </div>
);
