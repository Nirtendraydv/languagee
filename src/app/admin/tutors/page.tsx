
"use client";

import { TUTORS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Edit, Trash2 } from "lucide-react";

export default function AdminTutorsPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Tutors</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Tutor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tutor List</CardTitle>
          <CardDescription>Here are all the tutors on your website.</CardDescription>
        </CardHeader>
        <CardContent>
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
              {TUTORS.map((tutor) => (
                <TableRow key={tutor.id}>
                  <TableCell className="font-medium flex items-center gap-3">
                     <Avatar className="w-8 h-8">
                        <AvatarImage src={tutor.avatar} alt={tutor.name} />
                        <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {tutor.name}
                  </TableCell>
                  <TableCell>{tutor.country}</TableCell>
                  <TableCell>{tutor.experience} years</TableCell>
                  <TableCell>{tutor.rating}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
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
        </CardContent>
      </Card>
    </div>
  );
}
