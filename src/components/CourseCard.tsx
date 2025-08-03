import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Course = {
  id: number;
  title: string;
  level: string;
  ageGroup: string;
  goal: string;
  description: string;
  badge: string | null;
  image: string;
  dataAiHint: string;
};

type CourseCardProps = {
  course: Course;
};

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      <CardHeader className="p-0 relative">
        <Image
          src={course.image}
          alt={course.title}
          data-ai-hint={course.dataAiHint}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
        />
        {course.badge && (
          <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">{course.badge}</Badge>
        )}
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="secondary">{course.level}</Badge>
          <span className="text-xs text-muted-foreground">{course.goal} / {course.ageGroup}</span>
        </div>
        <CardTitle className="font-headline text-xl mb-2">{course.title}</CardTitle>
        <CardDescription>{course.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link href="#" className="w-full">
            <Button className="w-full bg-primary hover:bg-primary/90">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
