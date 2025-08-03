import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star, MapPin } from 'lucide-react';

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
    <Card className="text-center p-6 flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up">
      <CardContent className="flex flex-col items-center flex-grow">
        <Avatar className="w-24 h-24 mb-4 border-4 border-primary/20">
          <AvatarImage src={tutor.avatar} alt={tutor.name} data-ai-hint={tutor.dataAiHint} />
          <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h3 className="font-headline text-xl font-bold">{tutor.name}</h3>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
          <MapPin className="w-4 h-4" />
          <span>{tutor.country}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-accent fill-current" />
            <span>{tutor.rating.toFixed(1)}</span>
          </div>
          <div className="text-muted-foreground">|</div>
          <span>{tutor.experience} yrs exp.</span>
        </div>
        <p className="text-sm text-primary font-semibold mt-2">{tutor.accent} Accent</p>
      </CardContent>
      <CardFooter className="p-0">
        <Button className="w-full bg-primary hover:bg-primary/90">Book Trial</Button>
      </CardFooter>
    </Card>
  );
}
