
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, BookOpen, Calendar, Target, Users, Loader2, Link as LinkIcon, Star, Tv, FileVideo, Youtube, Lock, Sparkles } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import CourseCard from '@/components/CourseCard';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, where, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';

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
  modules: Module[];
  enrolledUserIds?: string[];
};

type Tutor = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user, isLoading: isAuthLoading } = useAuth();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  
  const isEnrolled = course?.enrolledUserIds?.includes(user?.uid || '') || false;

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;
      setIsLoading(true);
      try {
        const courseRef = doc(db, 'courses', courseId);
        const courseSnap = await getDoc(courseRef);

        if (courseSnap.exists()) {
          const courseData = { id: courseSnap.id, ...courseSnap.data() } as Course;
          setCourse(courseData);
          
          if (user) {
              const q = query(collection(db, "courseRequests"), where("userId", "==", user.uid), where("courseId", "==", courseId));
              const requestSnapshot = await getDocs(q);
              setHasRequested(!requestSnapshot.empty);
          }

          const relatedQuery = query(
            collection(db, 'courses'),
            where('level', '==', courseData.level),
            where('__name__', '!=', courseId),
            limit(3)
          );
          const relatedSnapshot = await getDocs(relatedQuery);
          const relatedList = relatedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
          setRelatedCourses(relatedList);

        } else {
          console.log("No such course!");
        }

        const tutorsQuery = query(collection(db, 'tutors'), limit(2));
        const tutorsSnapshot = await getDocs(tutorsQuery);
        const tutorsList = tutorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tutor));
        setTutors(tutorsList);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourseData();
  }, [courseId, user]);


  const handleRequestAccess = async () => {
      if (!user || !course) return;
      setIsRequesting(true);
      try {
          await addDoc(collection(db, "courseRequests"), {
              userId: user.uid,
              userEmail: user.email,
              courseId: course.id,
              courseTitle: course.title,
              createdAt: serverTimestamp(),
              status: "pending",
          });
          toast({
              title: "Request Sent!",
              description: "Your request to join this course has been sent. An admin will review it shortly.",
          });
          setHasRequested(true);
      } catch (error) {
          console.error("Error sending request:", error);
          toast({
              variant: "destructive",
              title: "Error",
              description: "There was a problem sending your request. Please try again.",
          });
      } finally {
          setIsRequesting(false);
      }
  }

  if (isLoading || isAuthLoading) {
    return (
      <div className="container mx-auto py-20 text-center flex justify-center items-center h-[80vh]">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

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
  
  const getLinkIcon = (link: string) => {
    if (link.includes('youtube.com') || link.includes('youtu.be')) {
      return <Youtube className="mr-2 text-red-500" />;
    }
    if (link.includes('drive.google.com')) {
      return <FileVideo className="mr-2 text-blue-500" />;
    }
    return <LinkIcon className="mr-2" />;
  };


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
                    src={course.image || 'https://placehold.co/800x400.png'}
                    alt={course.title}
                    fill
                    style={{objectFit: 'cover'}}
                />
                 {course.badge && (
                    <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground text-lg py-2 px-4">{course.badge}</Badge>
                )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">{course.title}</h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 text-muted-foreground">
                <div className="flex items-center gap-2" title="Level">
                    <BookOpen size={20} className="text-primary"/>
                    <span className="font-semibold">{course.level}</span>
                </div>
                 <div className="flex items-center gap-2" title="Age Group">
                    <Users size={20} className="text-primary"/>
                    <span className="font-semibold">{course.ageGroup}</span>
                </div>
                 <div className="flex items-center gap-2" title="Learning Goal">
                    <Target size={20} className="text-primary"/>
                    <span className="font-semibold">{course.goal}</span>
                </div>
                <div className="flex items-center gap-2" title="Modules">
                    <Tv size={20} className="text-primary"/>
                    <span className="font-semibold">{course.modules?.length || 0} Modules</span>
                </div>
            </div>

            <p className="text-lg text-foreground leading-relaxed mb-8">{course.description}</p>

            <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
                <h3 className="text-2xl font-bold font-headline mb-4">Course Content</h3>
                 {course.modules && course.modules.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full" defaultValue={isEnrolled ? "item-0" : ""}>
                        {course.modules.map((module, index) => (
                             <AccordionItem key={index} value={`item-${index}`} disabled={!isEnrolled}>
                                <AccordionTrigger className="text-lg font-semibold hover:no-underline disabled:opacity-70 disabled:cursor-not-allowed">
                                    <div className="flex items-center">
                                        {!isEnrolled && <Lock className="w-4 h-4 mr-3 shrink-0" />}
                                        <span className="text-primary mr-4">{(index + 1).toString().padStart(2, '0')}</span>
                                        {module.title}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4">
                                    <p className="text-muted-foreground">{module.description}</p>
                                     <a href={module.videoLink} target="_blank" rel="noopener noreferrer">
                                        <Button size="sm" variant="outline">
                                            {getLinkIcon(module.videoLink)}
                                            Watch Video
                                        </Button>
                                    </a>
                                </AccordionContent>
                             </AccordionItem>
                        ))}
                    </Accordion>
                 ) : (
                    <p className="text-muted-foreground">No modules available for this course yet. Please check back later!</p>
                 )}
            </div>
            
          </div>

          <aside className="md:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-xl">
                 {isEnrolled ? (
                    <>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Ready to Level Up?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4 text-sm">Book a one-on-one lesson with our expert tutors to practice what you've learned.</p>
                        <div className="flex flex-col gap-4 mb-6">
                            {tutors.slice(0, 2).map(tutor => (
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
                    </>
                 ) : (
                    <>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Start Learning Now</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4 text-sm">Enroll in this course to gain access to all modules and video content.</p>
                         {!user ? (
                           <Link href="/signup" className="w-full">
                                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-lg py-6">
                                    <Sparkles className="mr-2" />
                                    Sign Up to Enroll
                                </Button>
                            </Link>
                         ) : (
                            <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-lg py-6" onClick={handleRequestAccess} disabled={isRequesting || hasRequested}>
                                {isRequesting ? <Loader2 className="h-6 w-6 animate-spin"/> : <Sparkles className="mr-2" />}
                                {hasRequested ? 'Request Sent!' : 'Request Access'}
                            </Button>
                         )}
                        <p className="text-xs text-muted-foreground text-center mt-2">An admin will grant you access after your request.</p>
                    </CardContent>
                    </>
                 )}
              </Card>
            </div>
          </aside>
        </div>

        {relatedCourses.length > 0 && (
            <div className="mt-20">
                <h2 className="text-3xl font-bold font-headline text-center mb-8">Related Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {relatedCourses.map(relatedCourse => (
                        <CourseCard key={relatedCourse.id} course={relatedCourse} />
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
