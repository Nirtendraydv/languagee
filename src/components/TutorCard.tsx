
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Award, BookOpen, MessageCircle, CheckCircle, BarChart } from 'lucide-react';
import { Badge } from './ui/badge';
import Link from 'next/link';

type Tutor = {
  id: string;
  name: string;
  country: string;
  experience: number;
  rating: number;
  accent: string;
  avatar: string;
  dataAiHint: string;
  bio: string;
  specialties: string[];
};

type TutorCardProps = {
  tutor: Tutor;
};

export default function TutorCard({ tutor }: TutorCardProps) {
  return (
    <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up bg-card/80 backdrop-blur-sm border-2 border-primary/10 rounded-xl overflow-hidden">
        <CardHeader className="p-0">
            <div className="bg-primary/10 p-6 flex flex-col items-center text-center">
                <Avatar className="w-32 h-32 mb-4 border-4 border-white shadow-lg">
                    <AvatarImage src={tutor.avatar} alt={tutor.name} data-ai-hint={tutor.dataAiHint} />
                    <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="font-headline text-3xl font-bold text-primary">{tutor.name}</CardTitle>
                <div className="flex items-center gap-2 text-muted-foreground text-md mt-2">
                    <MapPin className="w-5 h-5" />
                    <span>From {tutor.country}</span>
                </div>
                 <div className="flex items-center justify-center gap-8 text-md text-foreground mt-4 w-full">
                    <div className="flex flex-col items-center gap-1">
                        <Star className="w-7 h-7 text-accent fill-current" />
                        <span className="font-bold text-lg">{tutor.rating.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground">Rating</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Award className="w-7 h-7 text-accent" />
                        <span className="font-bold text-lg">{tutor.experience}+</span>
                        <span className="text-sm text-muted-foreground">Years</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <BarChart className="w-7 h-7 text-accent" />
                        <span className="font-bold text-lg">{tutor.accent}</span>
                        <span className="text-sm text-muted-foreground">Accent</span>
                    </div>
                </div>
            </div>
        </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardDescription className="text-center text-md mb-6">{tutor.bio}</CardDescription>
        
        <div>
            <h4 className="font-headline text-lg font-semibold mb-3 text-center">Specialties</h4>
            <div className="flex flex-wrap justify-center gap-2">
                {tutor.specialties.map(specialty => (
                    <Badge key={specialty} variant="secondary" className="text-md py-1 px-3">
                        <CheckCircle className="w-4 h-4 mr-1.5"/>
                        {specialty}
                    </Badge>
                ))}
            </div>
        </div>

      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link href="/contact" className="w-full">
            <Button size="lg" className="w-full bg-primary hover:bg-primary/90 rounded-full text-lg py-6">
                <MessageCircle className="mr-2"/>
                Book a Trial Lesson
            </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
