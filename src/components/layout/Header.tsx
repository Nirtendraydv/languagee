"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Globe } from "lucide-react";
import NavItem from "./NavItem";

export default function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);

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
          <Button variant="ghost" className="hidden md:flex">Log In</Button>
          <Button className="hidden md:flex bg-primary hover:bg-primary/90">Sign Up</Button>

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
                </nav>
                <div className="flex flex-col gap-3 mt-auto">
                    <Button variant="ghost">Log In</Button>
                    <Button className="bg-primary hover:bg-primary/90">Sign Up</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
