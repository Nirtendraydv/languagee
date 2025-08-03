"use client";

import { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { TUTORS } from '@/lib/constants';
import TutorCard from '@/components/TutorCard';
import { Slider } from '@/components/ui/slider';

export default function TutorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [country, setCountry] = useState('all');
  const [accent, setAccent] = useState('all');
  const [experience, setExperience] = useState([0]);
  const [rating, setRating] = useState([0]);

  const uniqueCountries = useMemo(() => [...new Set(TUTORS.map(t => t.country))], []);
  const uniqueAccents = useMemo(() => [...new Set(TUTORS.map(t => t.accent))], []);

  const filteredTutors = useMemo(() => {
    return TUTORS.filter(tutor => {
      return (
        tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (country === 'all' || tutor.country === country) &&
        (accent === 'all' || tutor.accent === accent) &&
        tutor.experience >= experience[0] &&
        tutor.rating >= rating[0]
      );
    });
  }, [searchTerm, country, accent, experience, rating]);

  return (
    <div className="bg-background">
      <header className="bg-primary/10 py-12">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold font-headline">Meet Our Tutors</h1>
          <p className="text-muted-foreground mt-2 text-lg">Find a certified tutor who matches your learning style.</p>
        </div>
      </header>
      
      <div className="container mx-auto py-12">
        <Card className="mb-8 p-4 md:p-6 shadow-lg bg-card/80 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
            <div className="relative md:col-span-2 lg:col-span-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Country</label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {uniqueCountries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Accent</label>
              <Select value={accent} onValueChange={setAccent}>
                <SelectTrigger>
                  <SelectValue placeholder="All Accents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accents</SelectItem>
                  {uniqueAccents.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium text-muted-foreground">Min Experience: {experience[0]}+ years</label>
                <Slider
                    defaultValue={[0]}
                    max={15}
                    step={1}
                    onValueChange={setExperience}
                />
            </div>
          </div>
        </Card>

        {filteredTutors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredTutors.map(tutor => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No tutors match your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
