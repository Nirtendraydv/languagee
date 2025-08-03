
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const inquiries = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    message: "I'm interested in the Business English course. Can you provide more details on the curriculum?",
    status: "New",
    date: "2024-07-30",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    message: "I would like to book a trial lesson for my teenage daughter. She is preparing for her exams.",
    status: "Read",
    date: "2024-07-29",
  },
  {
    id: 3,
    name: "Alex Johnson",
    email: "alex.j@example.com",
    message: "Do you offer group classes? We are a small team of 5 looking to improve our conversational skills.",
    status: "Replied",
    date: "2024-07-29",
  },
   {
    id: 4,
    name: "Maria Garcia",
    email: "maria.g@example.com",
    message: "I'm a complete beginner. Which course would you recommend for me to start with?",
    status: "New",
    date: "2024-07-31",
  },
];

export default function InquiriesPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Inquiries</h1>
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>Here are the latest messages from your website's contact form.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Received</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell className="font-medium">{inquiry.date}</TableCell>
                  <TableCell>{inquiry.name}</TableCell>
                  <TableCell>{inquiry.email}</TableCell>
                  <TableCell className="max-w-xs truncate">{inquiry.message}</TableCell>
                  <TableCell>
                     <Badge 
                        variant={inquiry.status === 'New' ? 'default' : inquiry.status === 'Read' ? 'secondary' : 'outline'}
                        className={inquiry.status === 'Replied' ? 'border-green-600 text-green-600' : ''}
                      >
                        {inquiry.status}
                      </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
