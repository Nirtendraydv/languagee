import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { BookOpen, Globe, UserCheck, Star, Zap, Award, Calendar, Users, Target } from 'lucide-react';
import FloatingLetters from '@/components/FloatingLetters';
import { TESTIMONIALS } from '@/lib/constants';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full h-[90vh] md:h-screen relative overflow-hidden flex items-center justify-center text-center text-white bg-gradient-to-br from-primary via-blue-500 to-indigo-600">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x1080.png"
            alt="World map background"
            data-ai-hint="world map"
            layout="fill"
            objectFit="cover"
            className="opacity-20"
          />
          <FloatingLetters />
        </div>
        <div className="relative z-10 p-4 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-headline font-bold mb-4 text-shadow-lg">
            Learn English Anywhere <span className="animate-pulse">🌍</span>
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto font-body">
            Join English Excellence for an immersive, fun, and effective way to master English with our dedicated tutors.
          </p>
          <Link href="/courses">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-lg px-10 py-6 animate-glow">
              Start Learning Now
            </Button>
          </Link>
        </div>
      </section>

      <section id="how-it-works" className="w-full py-20 bg-background">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-headline font-bold mb-2">How It Works</h2>
          <p className="text-muted-foreground text-lg mb-12">Three simple steps to start your English learning journey.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-2 border-transparent hover:border-primary transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-4 w-20 h-20 flex items-center justify-center">
                  <UserCheck className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl mt-4">1. Sign Up</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Create your free account in seconds and tell us about your learning goals.</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-2 border-transparent hover:border-primary transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-4 w-20 h-20 flex items-center justify-center">
                  <Globe className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl mt-4">2. Schedule a Class</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Meet our tutors and book a lesson that fits your schedule.</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-2 border-transparent hover:border-primary transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-4 w-20 h-20 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl mt-4">3. Start Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Join live classes, access resources, and track your progress anytime, anywhere.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <section id="features" className="w-full py-20 bg-background">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-headline font-bold mb-12">A Learning Experience Like No Other</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center p-4">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Target className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-headline font-semibold mb-2">Personalized Learning</h3>
              <p className="text-muted-foreground text-center">Lessons tailored to your individual goals and learning style.</p>
            </div>
            <div className="flex flex-col items-center p-4">
               <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Calendar className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-headline font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-muted-foreground text-center">Book classes at times that are convenient for you.</p>
            </div>
            <div className="flex flex-col items-center p-4">
               <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Zap className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-headline font-semibold mb-2">Interactive Classes</h3>
              <p className="text-muted-foreground text-center">Engaging, live sessions that make learning effective and fun.</p>
            </div>
            <div className="flex flex-col items-center p-4">
               <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-headline font-semibold mb-2">Dedicated Tutors</h3>
              <p className="text-muted-foreground text-center">Learn from our two passionate and experienced English tutors.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="why-us" className="w-full py-20 bg-secondary/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-headline font-bold mb-4">Why Choose English Excellence?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                We provide a comprehensive and engaging learning experience designed for success.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-semibold">Interactive Learning</h3>
                    <p className="text-muted-foreground">Our unique approach and virtual tools make learning unforgettable.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-semibold">Expert Tutors</h3>
                    <p className="text-muted-foreground">Learn from our certified, passionate, and dedicated tutors.</p>
                  </div>
                </div>
                 <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <Star size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-semibold">Personalized Path</h3>
                    <p className="text-muted-foreground">Customized lesson plans tailored to your level, goals, and interests.</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Image 
                src="https://placehold.co/600x600.png"
                alt="Happy student learning online"
                data-ai-hint="student online"
                width={600}
                height={600}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="w-full py-20 bg-background">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-headline font-bold mb-12">What Our Students Say</h2>
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
                    <Card className="h-full">
                      <CardContent className="flex flex-col items-center text-center p-6 space-y-4">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-accent fill-current" />
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

      <section className="w-full py-20 bg-primary text-center text-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-headline font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-8">Join thousands of students and unlock your potential with English Excellence.</p>
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
