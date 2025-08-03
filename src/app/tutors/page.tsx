
"use client";

import { TUTORS } from '@/lib/constants';
import TutorCard from '@/components/TutorCard';
import { Award, Heart, Users } from 'lucide-react';
import Image from 'next/image';

export default function TutorsPage() {

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
            {TUTORS.map(tutor => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
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
                    <p className="text-muted-foreground">With just two dedicated tutors, you receive focused, one-on-one attention.</p>
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
    </div>
  );
}
