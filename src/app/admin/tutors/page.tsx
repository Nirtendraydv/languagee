
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Edit, Trash2, Loader2, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { TUTORS_PLACEHOLDER } from '@/lib/constants';

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

// Use a separate type for the form state to handle specialties as a string
type TutorFormData = Omit<Tutor, 'specialties' | 'id'> & {
  id?: string;
  specialties: string;
};

const defaultTutor: TutorFormData = {
    name: '',
    country: '',
    experience: 0,
    rating: 5.0,
    accent: '',
    avatar: 'https://placehold.co/150x150.png',
    dataAiHint: 'person',
    bio: '',
    specialties: '',
};

export default function AdminTutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTutor, setCurrentTutor] = useState<TutorFormData | null>(null);
  const { toast } = useToast();

  const fetchTutors = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "tutors"));
      if (querySnapshot.empty) {
        for (const tutor of TUTORS_PLACEHOLDER) {
          const { id, ...tutorData } = tutor;
          await addDoc(collection(db, "tutors"), tutorData);
        }
        const seededSnapshot = await getDocs(collection(db, "tutors"));
        const tutorsList = seededSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tutor));
        setTutors(tutorsList);
      } else {
        const tutorsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tutor));
        setTutors(tutorsList);
      }
    } catch (error) {
      console.error("Error fetching tutors:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch tutors." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  const handleOpenDialog = (tutor?: Tutor) => {
    if (tutor) {
      // When editing, convert specialties array to a comma-separated string for the form
      setCurrentTutor({
        ...tutor,
        specialties: tutor.specialties.join(', '),
      });
    } else {
      // When creating, use the default form data
      setCurrentTutor(defaultTutor);
    }
    setIsDialogOpen(true);
  };


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTutor) return;

    // Convert the specialties string back to an array for Firestore, and ensure it's always a string before splitting
    const specialtiesArray = typeof currentTutor.specialties === 'string' 
        ? currentTutor.specialties.split(',').map(s => s.trim()).filter(Boolean)
        : [];
    
    const tutorDataToSave = {
      ...currentTutor,
      specialties: specialtiesArray,
    };
    
    const { id, ...saveData } = tutorDataToSave;

    try {
        if (id) {
            const tutorRef = doc(db, "tutors", id);
            await updateDoc(tutorRef, saveData as any);
            toast({ title: "Success", description: "Tutor updated successfully." });
        } else {
            await addDoc(collection(db, "tutors"), saveData);
            toast({ title: "Success", description: "Tutor added successfully." });
        }

        await fetchTutors();
        setIsDialogOpen(false);
        setCurrentTutor(null);
    } catch (error) {
        console.error("Error saving tutor:", error);
        toast({ variant: "destructive", title: "Error", description: `Failed to save tutor.` });
    }
};

  const handleDelete = async (tutorId: string) => {
    if (!window.confirm("Are you sure you want to delete this tutor?")) return;
    try {
      await deleteDoc(doc(db, "tutors", tutorId));
      toast({ title: "Success", description: "Tutor deleted successfully." });
      await fetchTutors();
    } catch (error) {
      console.error("Error deleting tutor:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to delete tutor." });
    }
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumberField = ['experience', 'rating'].includes(name);
    setCurrentTutor(prev => prev ? { ...prev, [name]: isNumberField ? Number(value) : value } : null);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Tutors</h1>
         <div className="flex items-center gap-2">
           <Button onClick={fetchTutors} variant="outline" disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Tutor
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                <DialogTitle>{currentTutor?.id ? "Edit Tutor" : "Add New Tutor"}</DialogTitle>
                </DialogHeader>
                {currentTutor && (
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" value={currentTutor.name} onChange={handleFormChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" name="country" value={currentTutor.country} onChange={handleFormChange} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" name="bio" value={currentTutor.bio} onChange={handleFormChange} required />
                        </div>
                    
                        <div className="grid grid-cols-3 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="experience">Years of Experience</Label>
                                <Input id="experience" name="experience" type="number" value={currentTutor.experience} onChange={handleFormChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rating">Rating</Label>
                                <Input id="rating" name="rating" type="number" step="0.1" value={currentTutor.rating} onChange={handleFormChange} required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="accent">Accent</Label>
                                <Input id="accent" name="accent" value={currentTutor.accent} onChange={handleFormChange} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="avatar">Avatar URL</Label>
                                <Input id="avatar" name="avatar" value={currentTutor.avatar} onChange={handleFormChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dataAiHint">Avatar AI Hint</Label>
                                <Input id="dataAiHint" name="dataAiHint" value={currentTutor.dataAiHint} onChange={handleFormChange} />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="specialties">Specialties</Label>
                            <Input 
                                id="specialties" 
                                name="specialties" 
                                value={currentTutor.specialties} 
                                onChange={handleFormChange} 
                                placeholder="e.g., Business English, Pronunciation"
                            />
                            <p className="text-sm text-muted-foreground">Enter specialties separated by commas.</p>
                        </div>

                        <div className="flex justify-end pt-4">
                        <Button type="submit">Save Tutor</Button>
                        </div>
                    </form>
                )}
            </DialogContent>
            </Dialog>
         </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tutor List</CardTitle>
          <CardDescription>Here are all the tutors available on your website.</CardDescription>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tutors.map((tutor) => (
                  <TableRow key={tutor.id}>
                    <TableCell className="font-medium">{tutor.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{tutor.country}</Badge>
                    </TableCell>
                    <TableCell>{tutor.experience} years</TableCell>
                    <TableCell>{tutor.rating.toFixed(1)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(tutor)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(tutor.id)}>
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
