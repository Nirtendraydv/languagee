
"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Globe, UserCog } from "lucide-react";
import NavItem from "./NavItem";
import { useAuth } from "../AuthProvider";
import { auth } from "@/lib/firebase";

export default function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { user } = useAuth();

  const handleLogout = async () => {
    await auth.signOut();
    setSheetOpen(false);
  };

  const navLinks = [
    { href: "/about", label: "About Us" },
    { href: "/courses", label: "Courses" },
    { href: "/tutors", label: "Tutors" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Globe className="h-7 w-7 text-primary animate-pulse" />
          <span className="font-headline text-2xl font-bold">English Excellence</span>
        </Link>

        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <NavItem key={link.href} href={link.href}>
              {link.label}
            </NavItem>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <Button variant="ghost" onClick={handleLogout} className="hidden md:flex">Log Out</Button>
          ) : (
            <>
              <Link href="/login" passHref>
                <Button variant="ghost" className="hidden md:flex">Log In</Button>
              </Link>
              <Link href="/signup" passHref>
                <Button className="hidden md:flex bg-primary hover:bg-primary/90">Sign Up</Button>
              </Link>
            </>
          )}
          
          <Link href="/admin/login">
            <Button variant="outline" size="icon" className="hidden md:flex">
              <UserCog className="h-5 w-5" />
              <span className="sr-only">Admin Login</span>
            </Button>
          </Link>

          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center gap-2 mb-4">
                    <Globe className="h-7 w-7 text-primary" />
                    <span className="font-headline text-2xl font-bold">English Excellence</span>
                </Link>
                <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setSheetOpen(false)}
                        className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                        {link.label}
                    </Link>
                ))}
                 <Link
                    href="/admin/login"
                    onClick={() => setSheetOpen(false)}
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                    Admin
                </Link>
                </nav>
                <div className="flex flex-col gap-3 mt-auto">
                    {user ? (
                       <Button variant="ghost" onClick={handleLogout}>Log Out</Button>
                    ) : (
                        <>
                           <Link href="/login" passHref>
                                <Button variant="ghost" onClick={() => setSheetOpen(false)}>Log In</Button>
                           </Link>
                           <Link href="/signup" passHref>
                               <Button className="bg-primary hover:bg-primary/90" onClick={() => setSheetOpen(false)}>Sign Up</Button>
                           </Link>
                        </>
                    )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
