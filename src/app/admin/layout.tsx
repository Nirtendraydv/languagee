
import { ReactNode } from "react";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { MessageSquare, LayoutDashboard, User, LogOut, BookOpen, Users, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
           <div className="flex items-center gap-2 p-2">
                <LayoutDashboard className="h-7 w-7 text-primary" />
                <span className="font-headline text-2xl font-bold">Admin Panel</span>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/inquiries">
                <MessageSquare />
                <span>Inquiries</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/admin/courses">
                <BookOpen />
                <span>Courses</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/admin/tutors">
                <Users />
                <span>Tutors</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
             <SidebarMenuItem>
               <SidebarMenuButton href="/" tooltip="Logout">
                 <LogOut />
                 <span>Logout</span>
               </SidebarMenuButton>
             </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 md:hidden">
            <SidebarTrigger/>
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
