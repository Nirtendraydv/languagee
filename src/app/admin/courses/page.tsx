
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Edit, Trash2, Loader2, RefreshCw, Link2, Youtube, Package, Package2, GripVertical, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
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
  dataAiHint?: string;
  modules: Module[];
};

const defaultCourse: Partial<Course> = {
    title: '',
    description: '',
    level: '',
    ageGroup: '',
    goal: '',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'education',
    modules: [{ title: '', description: '', videoLink: '' }],
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
    if (!currentCourse || !currentCourse.title) return;

    try {
        const courseData = { ...currentCourse };
        
        // Ensure modules is an array
        if (!Array.isArray(courseData.modules)) {
            courseData.modules = [];
        }

        if (currentCourse.id) {
            // Update existing course
            const courseRef = doc(db, "courses", currentCourse.id);
            const { id, ...updateData } = courseData;
            await updateDoc(courseRef, updateData);
            toast({ title: "Success", description: "Course updated successfully." });
        } else {
            // Add new course
            await addDoc(collection(db, "courses"), courseData);
            toast({ title: "Success", description: "Course added successfully." });
        }

        await fetchCourses();
        setIsDialogOpen(false);
        setCurrentCourse(null);
    } catch (error) {
        console.error("Error saving course:", error);
        toast({ variant: "destructive", title: "Error", description: `Failed to save course. ${error instanceof Error ? error.message : ''}` });
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
  
  const handleModuleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentCourse(prev => {
      if (!prev || !prev.modules) return prev;
      const newModules = [...prev.modules];
      newModules[index] = { ...newModules[index], [name]: value };
      return { ...prev, modules: newModules };
    });
  };

  const addModule = () => {
    setCurrentCourse(prev => {
        if (!prev) return prev;
        const newModules = prev.modules ? [...prev.modules] : [];
        newModules.push({ title: '', description: '', videoLink: '' });
        return { ...prev, modules: newModules };
    });
  };

  const removeModule = (index: number) => {
    setCurrentCourse(prev => {
      if (!prev || !prev.modules) return prev;
      const newModules = prev.modules.filter((_, i) => i !== index);
      return { ...prev, modules: newModules };
    });
  };


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
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                <DialogTitle>{currentCourse?.id ? "Edit Course" : "Add New Course"}</DialogTitle>
                </DialogHeader>
                {currentCourse && (
                    <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" value={currentCourse.title || ''} onChange={handleFormChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Overall Description</Label>
                        <Textarea id="description" name="description" value={currentCourse.description || ''} onChange={handleFormChange} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="level">Level</Label>
                            <Input id="level" name="level" value={currentCourse.level || ''} onChange={handleFormChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ageGroup">Age Group</Label>
                            <Input id="ageGroup" name="ageGroup" value={currentCourse.ageGroup || ''} onChange={handleFormChange} required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="goal">Goal</Label>
                        <Input id="goal" name="goal" value={currentCourse.goal || ''} onChange={handleFormChange} required />
                    </div>
                   
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="image">Image URL</Label>
                            <Input id="image" name="image" value={currentCourse.image || ''} onChange={handleFormChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dataAiHint">Image AI Hint</Label>
                            <Input id="dataAiHint" name="dataAiHint" value={currentCourse.dataAiHint || ''} onChange={handleFormChange} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="badge">Badge (optional)</Label>
                        <Input id="badge" name="badge" value={currentCourse.badge || ''} onChange={handleFormChange} placeholder="e.g., Popular, New" />
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-lg font-semibold">Course Modules</h3>
                        {currentCourse.modules?.map((module, index) => (
                            <div key={index} className="space-y-3 p-4 border rounded-lg relative">
                                <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeModule(index)}>
                                    <X className="h-4 w-4"/>
                                </Button>
                                <div className="space-y-2">
                                    <Label htmlFor={`module-title-${index}`}>Module {index + 1} Title</Label>
                                    <Input id={`module-title-${index}`} name="title" value={module.title} onChange={(e) => handleModuleChange(index, e)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`module-description-${index}`}>Module Description</Label>
                                    <Textarea id={`module-description-${index}`} name="description" value={module.description} onChange={(e) => handleModuleChange(index, e)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`module-videoLink-${index}`}>Module Video Link</Label>
                                    <Input id={`module-videoLink-${index}`} name="videoLink" value={module.videoLink} onChange={(e) => handleModuleChange(index, e)} required placeholder="https://youtube.com/... or https://drive.google.com/..." />
                                </div>
                            </div>
                        ))}
                         <Button type="button" variant="outline" onClick={addModule}>
                            <Plus className="mr-2 h-4 w-4"/> Add Module
                        </Button>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit">Save Course</Button>
                    </div>
                    </form>
                )}
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
                  <TableHead>Modules</TableHead>
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
                      <Badge variant={'secondary'} className="capitalize">{course.modules?.length || 0} Modules</Badge>
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
