
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import CourseCard from '@/components/CourseCard';
import { Skeleton } from '@/components/ui/skeleton';
import { COURSES_PLACEHOLDER } from '@/lib/constants';

type Module = {
  title: string;
  description: string;
  videoLink: string;
};

type Course = {
  id: string;
  title: string;
  level: string;
  ageGroup: string;
  goal: string;
  description: string;
  badge?: string;
  image: string;
  dataAiHint: string;
  modules: Module[];
  enrolledUserIds?: string[];
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        if (querySnapshot.empty) {
          // Auto-populate courses if the collection is empty
          for (const course of COURSES_PLACEHOLDER) {
            const { id, ...courseData } = course;
            await addDoc(collection(db, "courses"), courseData);
          }
          const seededSnapshot = await getDocs(collection(db, "courses"));
          const coursesList = seededSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
          setCourses(coursesList);
        } else {
          const coursesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
          setCourses(coursesList);
        }
      } catch (error) {
        console.error("Error fetching courses: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="bg-background gradient-bg">
      <header className="py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold font-headline text-primary">Our Courses</h1>
          <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">Find the perfect English course for your needs, from beginner basics to advanced specialization.</p>
        </div>
      </header>

      <div className="container mx-auto py-12">
        {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, index) => (
                    <CardSkeleton key={index} />
                ))}
            </div>
        ) : courses.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map(course => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        ) : (
            <div className="text-center text-muted-foreground p-12 bg-card rounded-lg">
                <h2 className="text-2xl font-semibold mb-2">No Courses Available</h2>
                <p>We are currently working on our course offerings. Please check back soon!</p>
            </div>
        )}
      </div>
    </div>
  );
}


const CardSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <div className="space-y-2 p-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full mt-4" />
        </div>
    </div>
);
