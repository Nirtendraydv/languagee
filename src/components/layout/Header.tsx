
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Globe, UserCog } from "lucide-react";
import NavItem from "./NavItem";
import { useAuth } from "../AuthProvider";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3.3 4.9s-1.4-1.1-3.2-1.4c-1.4 1.5-3.5 2.5-5.5 2.5c-4.2 0-7.6-3.4-7.6-7.6c0-1.2.3-2.3.8-3.3c-6.1-.3-11.5-3.2-15.2-7.7c-.6 1.1-.9 2.3-.9 3.6c0 2.6 1.3 4.9 3.4 6.3c-1.2-.1-2.3-.4-3.3-1c0 3.7 2.6 6.7 6.1 7.4c-1.1.3-2.3.4-3.5.1c1 3 3.8 5.1 7.1 5.2c-2.9 2.3-6.5 3.6-10.4 3.6c-.7 0-1.3-.1-1.9-.3c3.7 2.4 8.1 3.8 12.8 3.8c15.4 0 23.8-12.7 23.8-23.8c0-.4 0-.8-.1-1.2c1.6-1.2 3-2.7 4.1-4.2z" />
    </svg>
);
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" strokeWidth="2"/>
    </svg>
);

const ADMIN_EMAIL = 'admin@example.com';

type Settings = {
    siteName: string;
    socials: {
        twitter?: string;
        facebook?: string;
        instagram?: string;
    }
}

export default function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({ siteName: "LingoSphere", socials: {} });
  const { user } = useAuth();

  useEffect(() => {
    const settingsRef = doc(db, "settings", "homepageConfig");
    
    const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            setSettings({
                siteName: data.siteName || "LingoSphere",
                socials: data.socials || {}
            });
        }
    }, (error) => {
        console.error("Error fetching site settings:", error);
    });

    return () => unsubscribe();
  }, []);

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

  const isAdmin = user && user.email === ADMIN_EMAIL;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Globe className="h-7 w-7 text-primary animate-pulse" />
          <span className="font-headline text-2xl font-bold">{settings.siteName}</span>
        </Link>

        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <NavItem key={link.href} href={link.href}>
              {link.label}
            </NavItem>
          ))}
        </nav>

        <div className="flex items-center gap-2">
           <div className="hidden md:flex items-center gap-3 mr-3">
              {settings.socials?.twitter && <Link href={settings.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-[#1DA1F2] hover:opacity-80"><TwitterIcon className="w-5 h-5"/></Link>}
              {settings.socials?.facebook && <Link href={settings.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-[#1877F2] hover:opacity-80"><FacebookIcon className="w-5 h-5"/></Link>}
              {settings.socials?.instagram && <Link href={settings.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-black dark:text-white hover:opacity-80"><InstagramIcon className="w-5 h-5"/></Link>}
           </div>

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
          
          {isAdmin && (
            <Link href="/admin/inquiries">
              <Button variant="outline" size="icon" className="hidden md:flex">
                <UserCog className="h-5 w-5" />
                <span className="sr-only">Admin Dashboard</span>
              </Button>
            </Link>
          )}


          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="p-6 pb-2 text-left">
                  <SheetTitle>
                    <Link href="/" className="flex items-center gap-2" onClick={() => setSheetOpen(false)}>
                        <Globe className="h-7 w-7 text-primary" />
                        <span className="font-headline text-2xl font-bold">{settings.siteName}</span>
                    </Link>
                  </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 p-6">
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
                 {isAdmin && (
                   <Link
                      href="/admin/inquiries"
                      onClick={() => setSheetOpen(false)}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  >
                      Admin
                  </Link>
                 )}
                </nav>
                 <div className="flex items-center gap-4 mt-4">
                    {settings.socials?.twitter && <Link href={settings.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-[#1DA1F2] hover:opacity-80"><TwitterIcon className="w-6 h-6"/></Link>}
                    {settings.socials?.facebook && <Link href={settings.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-[#1877F2] hover:opacity-80"><FacebookIcon className="w-6 h-6"/></Link>}
                    {settings.socials?.instagram && <Link href={settings.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-black dark:text-white hover:opacity-80"><InstagramIcon className="w-6 h-6"/></Link>}
                </div>
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
