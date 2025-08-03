
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { TUTORS } from '@/lib/constants';
import TutorCard from '@/components/TutorCard';
import { Award, Heart, Users } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-background gradient-bg">
      <header className="py-20 text-center container mx-auto">
        <h1 className="text-5xl font-bold font-headline text-primary">About English Excellence</h1>
        <p className="text-muted-foreground mt-4 text-lg max-w-3xl mx-auto">
          Founded by two passionate educators, our mission is to provide personalized and effective English tutoring for students worldwide.
        </p>
      </header>

      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative w-full h-[500px] rounded-lg shadow-2xl overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1522881451255-f592fa93022c?q=80&w=800&auto=format&fit=crop"
                    alt="Two tutors collaborating"
                    data-ai-hint="tutors collaborating"
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <div>
              <h2 className="text-4xl font-headline font-bold mb-4">Our Story</h2>
              <p className="text-lg text-muted-foreground mb-8">
                English Excellence was born from a shared dream between us, Jane and John. As experienced English tutors, we saw a need for a more personal, engaging, and flexible way for students to learn. We believe that with the right guidance and a supportive environment, anyone can achieve fluency and confidence in English. We combined our expertise to create this platform, focusing on interactive methods and customized lesson plans to help you succeed.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full p-3">
                    <Heart size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-semibold">Passion for Teaching</h3>
                    <p className="text-muted-foreground">We love what we do, and our passion for teaching shines through in every lesson.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full p-3">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-semibold">Student-Centered Approach</h3>
                    <p className="text-muted-foreground">Your goals are our priority. We tailor our teaching to fit your unique learning style and objectives.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full p-3">
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-semibold">Commitment to Excellence</h3>
                    <p className="text-muted-foreground">We are dedicated to providing the highest quality of English education to help you excel.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 container mx-auto">
        <h2 className="text-4xl font-headline font-bold text-center mb-12">Meet Our Founders & Tutors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {TUTORS.map(tutor => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
        </div>
      </section>

      <section className="w-full py-20 bg-primary text-center text-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-headline font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-8">Join us and unlock your potential with English Excellence.</p>
          <Link href="/courses">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 rounded-full text-lg px-10 py-6">
              Explore Courses
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
