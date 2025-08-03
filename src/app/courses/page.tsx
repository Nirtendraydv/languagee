"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { COURSES } from '@/lib/constants';
import CourseCard from '@/components/CourseCard';

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [level, setLevel] = useState('all');
  const [ageGroup, setAgeGroup] = useState('all');
  const [goal, setGoal] = useState('all');

  const filteredCourses = useMemo(() => {
    return COURSES.filter(course => {
      return (
        (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         course.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (level === 'all' || course.level === level) &&
        (ageGroup === 'all' || course.ageGroup === ageGroup) &&
        (goal === 'all' || course.goal === goal)
      );
    });
  }, [searchTerm, level, ageGroup, goal]);

  return (
    <div className="bg-background">
      <header className="bg-primary/10 py-12">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold font-headline">Our Courses</h1>
          <p className="text-muted-foreground mt-2 text-lg">Find the perfect English course for your needs.</p>
        </div>
      </header>

      <div className="container mx-auto py-12">
        <Card className="mb-8 p-4 md:p-6 shadow-lg bg-card/80 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="relative md:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Level</label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Age Group</label>
              <Select value={ageGroup} onValueChange={setAgeGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="All Ages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ages</SelectItem>
                  <SelectItem value="Kids">Kids</SelectItem>
                  <SelectItem value="Teens">Teens</SelectItem>
                  <SelectItem value="Adults">Adults</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Goal</label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="All Goals" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Goals</SelectItem>
                  <SelectItem value="Grammar">Grammar</SelectItem>
                  <SelectItem value="Conversation">Conversation</SelectItem>
                  <SelectItem value="Business English">Business English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No courses match your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
