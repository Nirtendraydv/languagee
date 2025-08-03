
"use client";

import Link from "next/link";
import { Globe, Mail, Phone, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { cn } from "@/lib/utils";

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


const newsletterFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
});

type Content = {
    siteName: string;
    footer: {
        address: string;
        email: string;
        phone: string;
    },
    socials: {
        twitter: string;
        facebook: string;
        instagram: string;
    }
}

export default function Footer() {
    const { toast } = useToast();
    const [content, setContent] = useState<Content | null>(null);

    const form = useForm<z.infer<typeof newsletterFormSchema>>({
        resolver: zodResolver(newsletterFormSchema),
        defaultValues: {
          email: "",
        },
    });

    useEffect(() => {
        const settingsRef = doc(db, "settings", "homepageConfig");

        const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setContent({
                    siteName: data.siteName || "LingoSphere",
                    footer: data.footer || {},
                    socials: data.socials || {}
                });
            } else {
                console.log("No such document in settings!");
            }
        }, (error) => {
            console.error("Error fetching footer content:", error);
        });

        return () => unsubscribe();
    }, []);

    const onSubmit = async (values: z.infer<typeof newsletterFormSchema>) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Newsletter subscription:", values);
        toast({
          title: "Subscribed!",
          description: "Thank you for joining our newsletter.",
        });
        form.reset();
    };


    return (
        <footer className="bg-secondary/50">
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-4 col-span-1">
                        <Link href="/" className="flex items-center gap-2">
                          <Globe className="h-7 w-7 text-primary" />
                          <span className="font-headline text-2xl font-bold">{content?.siteName || 'LingoSphere'}</span>
                        </Link>
                        <p className="text-muted-foreground">Your journey to English fluency starts here. Personalized tutoring to help you succeed.</p>
                        <div className="flex space-x-4">
                            {content?.socials?.twitter && <Link href={content.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-[#1DA1F2] hover:opacity-80"><TwitterIcon/></Link>}
                            {content?.socials?.facebook && <Link href={content.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-[#1877F2] hover:opacity-80"><FacebookIcon/></Link>}
                            {content?.socials?.instagram && <Link href={content.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-black dark:text-white hover:opacity-80"><InstagramIcon/></Link>}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-headline font-semibold">Platform</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                            <li><Link href="/courses" className="text-muted-foreground hover:text-primary">Courses</Link></li>
                            <li><Link href="/tutors" className="text-muted-foreground hover:text-primary">Tutors</Link></li>
                            <li><Link href="/#testimonials" className="text-muted-foreground hover:text-primary">Testimonials</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-headline font-semibold">Contact Us</h3>
                         <ul className="mt-4 space-y-2 text-muted-foreground">
                           <li className="flex items-center gap-2"><Mail size={16} /> <a href={`mailto:${content?.footer?.email}`} className="hover:text-primary">{content?.footer?.email}</a></li>
                           <li className="flex items-center gap-2"><Phone size={16} /> {content?.footer?.phone}</li>
                            <li className="flex items-center gap-2"><Globe size={16} /> {content?.footer?.address}</li>
                           <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact Form</Link></li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-headline font-semibold">Newsletter</h3>
                        <p className="mt-4 text-muted-foreground">Stay updated with our latest courses and offers.</p>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 flex gap-2">
                                <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="flex-grow">
                                    <FormControl>
                                        <Input placeholder="Your email" {...field} className="bg-background"/>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? "..." : <Send size={16} />}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
                <div className="mt-12 border-t pt-8 text-center text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} {content?.siteName || 'LingoSphere'}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

    