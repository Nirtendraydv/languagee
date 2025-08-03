"use client";

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { COURSES, TUTORS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, BookOpen, Calendar, Clock, Star, Users, Target } from 'lucide-react';
import CourseCard from '@/components/CourseCard';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = parseInt(params.id as string, 10);
  const course = COURSES.find(c => c.id === courseId);

  const relatedCourses = COURSES.filter(c => c.id !== courseId && (c.level === course?.level || c.goal === course?.goal)).slice(0, 3);

  if (!course) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold">Course not found</h1>
        <Link href="/courses">
          <Button variant="link" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background gradient-bg">
      <div className="container mx-auto py-12 md:py-20">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <Link href="/courses" className="text-sm text-primary hover:underline flex items-center mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all courses
            </Link>
            <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg mb-8">
                <Image
                    src={course.image}
                    alt={course.title}
                    layout="fill"
                    objectFit="cover"
                />
                 {course.badge && (
                    <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground text-lg py-2 px-4">{course.badge}</Badge>
                )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">{course.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                    <BookOpen size={20} className="text-primary"/>
                    <span className="font-semibold">{course.level}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Users size={20} className="text-primary"/>
                    <span className="font-semibold">{course.ageGroup}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Target size={20} className="text-primary"/>
                    <span className="font-semibold">{course.goal}</span>
                </div>
            </div>

            <p className="text-lg text-foreground leading-relaxed mb-8">{course.description} This course provides in-depth training to help you achieve your goals effectively.</p>

            <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
                <h3 className="text-2xl font-bold font-headline mb-4">What you'll learn</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-inside list-disc text-muted-foreground">
                    <li>Core concepts of {course.goal}.</li>
                    <li>Advanced conversational techniques.</li>
                    <li>Practical application in real-life scenarios.</li>
                    <li>Pronunciation and accent reduction.</li>
                    <li>Effective communication strategies.</li>
                    <li>Cultural nuances in English.</li>
                </ul>
            </div>
          </div>

          <aside className="md:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Schedule a Lesson</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">Ready to start learning? Book a lesson with one of our expert tutors.</p>
                  <div className="flex flex-col gap-4 mb-6">
                    {TUTORS.map(tutor => (
                      <div key={tutor.id} className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={tutor.avatar} alt={tutor.name} />
                          <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold">{tutor.name}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="w-4 h-4 text-accent fill-current" />
                            {tutor.rating}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/tutors" className="w-full">
                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-lg py-6">
                      <Calendar className="mr-2" />
                      Meet Our Tutors
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>

        <div className="mt-20">
            <h2 className="text-3xl font-bold font-headline text-center mb-8">Related Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedCourses.map(relatedCourse => (
                    <CourseCard key={relatedCourse.id} course={relatedCourse} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
