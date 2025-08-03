
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, orderBy, query, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Trash2, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

type Inquiry = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date; 
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const inquiriesCollection = collection(db, 'inquiries');
      const q = query(inquiriesCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const inquiriesList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          message: data.message,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        } as Inquiry
      });
      setInquiries(inquiriesList);
    } catch (error) {
      console.error("Error fetching inquiries: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch inquiries.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [toast]);

  const handleDelete = async (inquiryId: string) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      await deleteDoc(doc(db, "inquiries", inquiryId));
      toast({ title: "Success", description: "Inquiry deleted successfully." });
      fetchInquiries();
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to delete inquiry." });
    }
  };

  return (
    <div className="p-8">
       <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Inquiries</h1>
        <Button onClick={fetchInquiries} variant="outline" disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>Here are the latest messages from your website's contact form.</CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center text-muted-foreground p-8">
              You have no new inquiries.
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Received</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell className="font-medium">{format(inquiry.createdAt, 'PPp')}</TableCell>
                  <TableCell>{inquiry.name}</TableCell>
                  <TableCell>{inquiry.email}</TableCell>
                  <TableCell className="max-w-xs">{inquiry.message}</TableCell>
                  <TableCell>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => handleDelete(inquiry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
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
