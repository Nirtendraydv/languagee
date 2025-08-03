
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Terminal } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { collection, getDocs, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { USERS_PLACEHOLDER } from '@/lib/constants';
import { listAllAuthUsers } from '@/lib/admin-actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
      setIsLoading(true);
      setPermissionError(null);
      try {
          const { users: authUsers, error: authError } = await listAllAuthUsers();

          if (authError) {
            setPermissionError(authError);
            setUsers([]);
            setIsLoading(false);
            return;
          }

          if (authUsers.length === 0) {
              const firestoreUsersSnapshot = await getDocs(collection(db, "users"));
              if(firestoreUsersSnapshot.empty && USERS_PLACEHOLDER.length > 0) {
                  for (const user of USERS_PLACEHOLDER) {
                      await setDoc(doc(db, "users", user.uid), { email: user.email, uid: user.uid, createdAt: user.createdAt });
                  }
              }
          }
          
          const coursesSnapshot = await getDocs(collection(db, "courses"));
          const courses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));

          const firestoreUsersSnapshot = await getDocs(collection(db, "users"));
          const firestoreUsers = firestoreUsersSnapshot.docs.map(doc => doc.data() as User);

          const usersWithCourses = authUsers.map(authUser => {
              if (!authUser) return null;
              const firestoreUser = firestoreUsers.find(u => u.uid === authUser.uid);
              const enrolledCourses = courses.filter(course => course.enrolledUserIds?.includes(authUser.uid));
              
              return { 
                  uid: authUser.uid,
                  email: authUser.email || 'N/A', 
                  createdAt: firestoreUser?.createdAt,
                  enrolledCourses 
              };
          }).filter((user): user is UserWithCourses => user !== null);
          
          setUsers(usersWithCourses);

      } catch (error: any) {
          console.error("Error fetching data:", error);
          toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred while fetching user or course data." });
      } finally {
          setIsLoading(false);
      }
  }, [toast]);


  useEffect(() => {
    fetchData();

    const unsubscribe = onSnapshot(collection(db, "courses"), () => {
        if (!permissionError) {
          fetchData();
        }
    });

    return () => unsubscribe();
  }, [fetchData, permissionError]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={fetchData} variant="outline" disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
       {permissionError && (
            <Alert variant="destructive" className="mb-8">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Permission Error</AlertTitle>
              <AlertDescription>
                <p>{permissionError}</p>
                <p className="mt-2">
                This is a permissions issue in your Google Cloud project, not a bug in the app. Please follow the steps in the `INSTRUCTIONS.md` file in your project root to grant the required IAM role to your service account.
                </p>
              </AlertDescription>
            </Alert>
        )}
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
          ) : users.length === 0 && !permissionError ? (
             <div className="text-center text-muted-foreground p-8">
              No users have signed up yet.
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
