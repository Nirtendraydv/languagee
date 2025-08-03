
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type ContactInfo = {
    email: string;
    phone: string;
    address: string;
}

export default function ContactPage() {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  useEffect(() => {
    const settingsRef = doc(db, "settings", "homepageConfig");
    const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.footer) {
          setContactInfo(data.footer);
        }
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching contact info:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addDoc(collection(db, "inquiries"), {
        ...values,
        createdAt: serverTimestamp(),
      });
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you shortly.",
      });
      form.reset();
    } catch (error) {
       console.error("Error sending message:", error);
       toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
      });
    }
  }

  return (
    <div className="bg-background gradient-bg py-20">
      <div className="container mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold font-headline text-primary">Get in Touch</h1>
          <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have a question about our courses, tutors, or anything else, our team is ready to answer all your questions.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-16 items-start">
            <Card>
                <CardContent className="p-8">
                    <h2 className="text-3xl font-bold font-headline mb-6">Contact Information</h2>
                    {isLoading ? (
                        <ContactInfoSkeleton />
                    ) : contactInfo ? (
                        <div className="space-y-6 text-lg">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Email</h3>
                                    <a href={`mailto:${contactInfo.email}`} className="text-muted-foreground hover:text-primary transition-colors">{contactInfo.email}</a>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <Phone className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Phone</h3>
                                    <p className="text-muted-foreground">{contactInfo.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <MapPin className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Office</h3>
                                    <p className="text-muted-foreground">{contactInfo.address}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>Contact information could not be loaded.</p>
                    )}
                     <p className="mt-8 text-muted-foreground">
                        For specific questions about our tutors, please visit the <Link href="/tutors" className="text-primary hover:underline">Tutors page</Link>.
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-8">
                    <h2 className="text-3xl font-bold font-headline mb-6">Send us a Message</h2>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Your Message</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="Tell us how we can help..."
                                className="resize-none"
                                {...field}
                                rows={6}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
                             <Send className="ml-2 h-5 w-5" />
                        </Button>
                    </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

const ContactInfoSkeleton = () => (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-48" />
            </div>
        </div>
        <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-32" />
            </div>
        </div>
        <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-64" />
            </div>
        </div>
    </div>
);
