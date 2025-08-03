
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
import { FacebookIcon, InstagramIcon, TwitterIcon } from "../SocialIcons";

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
