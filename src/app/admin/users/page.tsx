
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { collection, getDocs, onSnapshot, query, setDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { USERS_PLACEHOLDER } from '@/lib/constants';

type User = {
    uid: string;
    email: string;
    createdAt?: string;
};

type Course = {
  id: string;
  title: string;
  enrolledUserIds?: string[];
};

type UserWithCourses = User & {
    enrolledCourses: Course[];
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithCourses[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
      setIsLoading(true);
      try {
          const usersQuery = query(collection(db, "users"));
          const usersSnapshot = await getDocs(usersQuery);
          
          let fetchedUsers: User[];

          if (usersSnapshot.empty) {
              for (const user of USERS_PLACEHOLDER) {
                  // Use setDoc with the user's UID as the document ID
                  const userRef = doc(db, "users", user.uid);
                  await setDoc(userRef, user);
              }
              const seededSnapshot = await getDocs(usersQuery);
              fetchedUsers = seededSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
          } else {
              fetchedUsers = usersSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
          }
          
          const coursesSnapshot = await getDocs(collection(db, "courses"));
          const courses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));

          const usersWithCourses = fetchedUsers.map(user => {
              const enrolledCourses = courses.filter(course => course.enrolledUserIds?.includes(user.uid));
              return { ...user, enrolledCourses };
          });
          
          setUsers(usersWithCourses);
      } catch (error) {
          console.error("Error fetching data:", error);
          toast({ variant: "destructive", title: "Error", description: "Failed to fetch user or course data." });
      } finally {
          setIsLoading(false);
      }
  };


  useEffect(() => {
    fetchData();

    const unsubscribe = onSnapshot(collection(db, "courses"), (snapshot) => {
        fetchData(); 
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={fetchData} variant="outline" disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Registered Users</CardTitle>
          <CardDescription>View all registered users and their course enrollments.</CardDescription>
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
                  <TableHead>Email</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Enrolled Courses</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{user.uid}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {user.enrolledCourses.length > 0 ? (
                           user.enrolledCourses.map(course => (
                               <Badge key={course.id} variant="secondary">{course.title}</Badge>
                           ))
                        ) : (
                            <Badge variant="outline">Not Enrolled</Badge>
                        )}
                      </div>
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
