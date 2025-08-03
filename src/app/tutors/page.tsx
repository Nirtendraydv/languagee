"use client";

import { TUTORS } from '@/lib/constants';
import TutorCard from '@/components/TutorCard';

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {TUTORS.map(tutor => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
        </div>
      </div>
    </div>
  );
}
