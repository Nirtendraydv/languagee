"use client";

import { COURSES } from '@/lib/constants';
import CourseCard from '@/components/CourseCard';

export default function CoursesPage() {
  return (
    <div className="bg-background gradient-bg">
      <header className="py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold font-headline text-primary">Our Courses</h1>
          <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">Find the perfect English course for your needs, from beginner basics to advanced specialization.</p>
        </div>
      </header>

      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COURSES.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
