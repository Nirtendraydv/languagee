
"use client";

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc, arrayUnion, query, orderBy, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

type CourseRequest = {
  id: string;
  userId: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  createdAt: Date;
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<CourseRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const requestsCollection = collection(db, 'courseRequests');
      const q = query(requestsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const requestsList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          userEmail: data.userEmail,
          courseId: data.courseId,
          courseTitle: data.courseTitle,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        } as CourseRequest
      });
      setRequests(requestsList);
    } catch (error) {
      console.error("Error fetching course requests: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch course requests.' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleApprove = async (request: CourseRequest) => {
    setIsApproving(request.id);
    try {
      // 1. Add user's ID to the course's enrolledUserIds array
      const courseRef = doc(db, "courses", request.courseId);
      await updateDoc(courseRef, {
        enrolledUserIds: arrayUnion(request.userId)
      });

      // 2. Delete the request document
      await deleteDoc(doc(db, "courseRequests", request.id));

      toast({ title: "Success", description: `${request.userEmail} has been enrolled in ${request.courseTitle}.` });
      
      // Refresh the list of requests
      await fetchRequests();
    } catch (error) {
      console.error("Error approving request:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to approve the request." });
    } finally {
      setIsApproving(null);
    }
  };

  return (
    <div className="p-8">
       <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Course Access Requests</h1>
        <Button onClick={fetchRequests} variant="outline" disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
          <CardDescription>Review and approve user requests for course enrollment.</CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center text-muted-foreground p-8">
              There are no pending course requests.
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requested On</TableHead>
                <TableHead>User Email</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{format(request.createdAt, 'PPp')}</TableCell>
                  <TableCell>{request.userEmail}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{request.courseTitle}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleApprove(request)}
                      disabled={isApproving === request.id}
                    >
                      {isApproving === request.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      <span>Approve</span>
                    </Button>
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
