import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Award, BookOpen } from 'lucide-react';

type Tutor = {
  id: number;
  name: string;
  country: string;
  experience: number;
  rating: number;
  accent: string;
  avatar: string;
  dataAiHint: string;
};

type TutorCardProps = {
  tutor: Tutor;
};

export default function TutorCard({ tutor }: TutorCardProps) {
  return (
    <Card className="text-center p-6 flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up bg-card/80 backdrop-blur-sm border-2 border-transparent hover:border-primary">
      <CardContent className="flex flex-col items-center flex-grow">
        <Avatar className="w-32 h-32 mb-4 border-4 border-primary/20 shadow-lg">
          <AvatarImage src={tutor.avatar} alt={tutor.name} data-ai-hint={tutor.dataAiHint} />
          <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h3 className="font-headline text-2xl font-bold text-primary">{tutor.name}</h3>
        <div className="flex items-center gap-2 text-muted-foreground text-md mt-2">
          <MapPin className="w-5 h-5" />
          <span>{tutor.country}</span>
        </div>
        <p className="text-md text-foreground font-semibold mt-4">{tutor.accent} Accent</p>
        
        <div className="flex items-center justify-center gap-8 text-md text-muted-foreground mt-6 w-full">
          <div className="flex flex-col items-center gap-1">
            <Star className="w-6 h-6 text-accent fill-current" />
            <span className="font-bold text-lg">{tutor.rating.toFixed(1)}</span>
            <span>Rating</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Award className="w-6 h-6 text-accent" />
            <span className="font-bold text-lg">{tutor.experience}</span>
            <span>Years Exp.</span>
          </div>
           <div className="flex flex-col items-center gap-1">
            <BookOpen className="w-6 h-6 text-accent" />
            <span className="font-bold text-lg">50+</span>
            <span>Courses</span>
          </div>
        </div>

      </CardContent>
      <CardFooter className="p-0 mt-6">
        <Button size="lg" className="w-full bg-primary hover:bg-primary/90 rounded-full text-lg py-6">Book a Trial Lesson</Button>
      </CardFooter>
    </Card>
  );
}
