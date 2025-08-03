
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Edit, Trash2, Loader2, RefreshCw, Link2, Youtube, Package, Package2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { COURSES_PLACEHOLDER } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Course = {
  id: string;
  title: string;
  level: string;
  ageGroup: string;
  goal: string;
  description: string;
  badge?: string;
  image: string;
  dataAiHint?: string;
  resourceLink: string;
  courseType: 'single' | 'multi-session';
  courseStructure: string;
};

const defaultCourse: Partial<Course> = {
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'education',
    resourceLink: 'https://meet.google.com/new',
    courseType: 'single',
    courseStructure: '1 session'
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course> | null>(null);
  const { toast } = useToast();

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "courses"));
      if (querySnapshot.empty) {
        // Seed initial data if the collection is empty
        for (const course of COURSES_PLACEHOLDER) {
          const { id, ...courseData } = course;
          await addDoc(collection(db, "courses"), courseData);
        }
        // Fetch again after seeding
        const seededSnapshot = await getDocs(collection(db, "courses"));
        const coursesList = seededSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        setCourses(coursesList);
      } else {
        const coursesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        setCourses(coursesList);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch courses." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCourse) return;

    try {
        const courseData = { ...currentCourse };

        if (currentCourse.id) {
            // Update existing course
            const courseRef = doc(db, "courses", currentCourse.id);
            const { id, ...updateData } = courseData;
            await updateDoc(courseRef, updateData);
            toast({ title: "Success", description: "Course updated successfully." });
        } else {
            // Add new course, ensuring all required fields have defaults
            const newCourseData = { ...defaultCourse, ...courseData };
            await addDoc(collection(db, "courses"), newCourseData);
            toast({ title: "Success", description: "Course added successfully." });
        }

        await fetchCourses();
        setIsDialogOpen(false);
        setCurrentCourse(null);
    } catch (error) {
        console.error("Error saving course:", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to save course." });
    }
};


  const handleDelete = async (courseId: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteDoc(doc(db, "courses", courseId));
      toast({ title: "Success", description: "Course deleted successfully." });
      await fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to delete course." });
    }
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentCourse(prev => prev ? { ...prev, [name]: value } : null);
  };
  
  const handleSelectChange = (name: string, value: string) => {
      setCurrentCourse(prev => prev ? { ...prev, [name]: value } : null);
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Courses</h1>
         <div className="flex items-center gap-2">
           <Button onClick={fetchCourses} variant="outline" disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setCurrentCourse(defaultCourse)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Course
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                <DialogTitle>{currentCourse?.id ? "Edit Course" : "Add New Course"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" value={currentCourse?.title || ''} onChange={handleFormChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" value={currentCourse?.description || ''} onChange={handleFormChange} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="level">Level</Label>
                        <Input id="level" name="level" value={currentCourse?.level || ''} onChange={handleFormChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ageGroup">Age Group</Label>
                        <Input id="ageGroup" name="ageGroup" value={currentCourse?.ageGroup || ''} onChange={handleFormChange} required />
                    </div>
                </div>

                 <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="courseType">Course Type</Label>
                         <Select name="courseType" value={currentCourse?.courseType || 'single'} onValueChange={(value) => handleSelectChange('courseType', value)}>
                             <SelectTrigger>
                                 <SelectValue placeholder="Select course type" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="single"><div className="flex items-center gap-2"><Package size={16}/> Single Session</div></SelectItem>
                                 <SelectItem value="multi-session"><div className="flex items-center gap-2"><Package2 size={16}/> Multi-session</div></SelectItem>
                             </SelectContent>
                         </Select>
                     </div>
                     <div className="space-y-2">
                         <Label htmlFor="courseStructure">Course Structure</Label>
                         <Input id="courseStructure" name="courseStructure" value={currentCourse?.courseStructure || ''} onChange={handleFormChange} placeholder="e.g., 4 modules, 1-hour each"/>
                     </div>
                </div>


                <div className="space-y-2">
                    <Label htmlFor="goal">Goal</Label>
                    <Input id="goal" name="goal" value={currentCourse?.goal || ''} onChange={handleFormChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="resourceLink">Class/Video Link</Label>
                     <div className="flex items-center gap-2">
                        <span className="text-muted-foreground"><Link2 size={16}/></span>
                        <Input id="resourceLink" name="resourceLink" value={currentCourse?.resourceLink || ''} onChange={handleFormChange} required placeholder="https://meet.google.com/... or https://youtube.com/..." />
                    </div>
                </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input id="image" name="image" value={currentCourse?.image || ''} onChange={handleFormChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dataAiHint">Image AI Hint</Label>
                        <Input id="dataAiHint" name="dataAiHint" value={currentCourse?.dataAiHint || ''} onChange={handleFormChange} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="badge">Badge (optional)</Label>
                    <Input id="badge" name="badge" value={currentCourse?.badge || ''} onChange={handleFormChange} placeholder="e.g., Popular, New" />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button type="submit">Save Course</Button>
                </div>
                </form>
            </DialogContent>
            </Dialog>
         </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course List</CardTitle>
          <CardDescription>Here are all the courses available on your website.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{course.level}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={course.courseType === 'single' ? 'secondary' : 'default'} className="capitalize">{course.courseType}</Badge>
                    </TableCell>
                    <TableCell>{course.goal}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setCurrentCourse(course);
                            setIsDialogOpen(true);
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(course.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    