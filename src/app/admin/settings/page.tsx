
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const SETTINGS_DOC_ID = "homepageConfig";

type HomepageContent = {
    siteName: string;
    hero: {
        title: string;
        subtitle: string;
        buttonText: string;
        imageUrl: string;
    };
    howItWorks: {
        title: string;
        subtitle: string;
        steps: { title: string; description: string }[];
    };
    features: {
        title: string;
        items: { title: string; description: string }[];
    };
    whyUs: {
        title: string;
        subtitle: string;
        imageUrl: string;
        points: { title: string; description: string }[];
    };
    testimonials: {
        title: string;
    };
    cta: {
        title: string;
        subtitle: string;
        buttonText: string;
    };
    footer: {
        address: string;
        email: string;
        phone: string;
    };
    socials: {
        twitter: string;
        facebook: string;
        instagram: string;
    };
};

const defaultContent: HomepageContent = {
    siteName: 'LingoSphere',
    hero: { title: 'Learn English Anywhere 🌍', subtitle: 'Join LingoSphere for an immersive, fun, and effective way to master English with our dedicated tutors.', buttonText: 'Start Learning Now', imageUrl: 'https://images.unsplash.com/photo-1453928582365-b6ad3332aab9?q=80&w=1920&auto=format&fit=crop' },
    howItWorks: {
        title: 'How It Works',
        subtitle: 'Three simple steps to start your English learning journey.',
        steps: [
            { title: '1. Sign Up', description: 'Create your free account in seconds and tell us about your learning goals.' },
            { title: '2. Schedule a Class', description: 'Meet our tutors and book a lesson that fits your schedule.' },
            { title: '3. Start Learning', description: 'Join live classes, access resources, and track your progress anytime, anywhere.' },
        ],
    },
    features: {
        title: 'A Learning Experience Like No Other',
        items: [
            { title: 'Personalized Learning', description: 'Lessons tailored to your individual goals and learning style.' },
            { title: 'Flexible Scheduling', description: 'Book classes at times that are convenient for you.' },
            { title: 'Interactive Classes', description: 'Engaging, live sessions that make learning effective and fun.' },
            { title: 'Dedicated Tutors', description: 'Learn from our two passionate and experienced English tutors.' },
        ],
    },
    whyUs: {
        title: 'Why Choose LingoSphere?',
        subtitle: 'We provide a comprehensive and engaging learning experience designed for success. Our unique approach sets us apart.',
        imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=600&auto=format&fit=crop',
        points: [
            { title: 'Interactive Learning', description: 'Our unique approach and virtual tools make learning unforgettable. We use state-of-the-art technology to create an immersive environment.' },
            { title: 'Expert Tutors', description: 'Learn from our certified, passionate, and dedicated tutors who have years of experience helping students succeed.' },
            { title: 'Personalized Path', description: 'We create customized lesson plans tailored to your specific level, goals, and interests to ensure you get the most out of every class.' },
        ],
    },
    testimonials: { title: 'What Our Students Say' },
    cta: { title: 'Ready to Start Your Journey?', subtitle: 'Join thousands of students and unlock your potential with LingoSphere.', buttonText: 'Explore Courses' },
    footer: { address: '123 Learning Lane, Education City, USA', email: 'contact@lingosphere.com', phone: '+1 (555) 123-4567' },
    socials: { twitter: 'https://twitter.com', facebook: 'https://facebook.com', instagram: 'https://instagram.com' }
};

export default function AdminSettingsPage() {
    const { toast } = useToast();
    const [content, setContent] = useState<HomepageContent | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const settingsRef = doc(db, "settings", SETTINGS_DOC_ID);

    useEffect(() => {
        const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Ensure all fields from defaultContent exist on the fetched data
                const completeData = { ...defaultContent, ...data };
                setContent(completeData);
            } else {
                 setDoc(settingsRef, defaultContent).then(() => {
                     setContent(defaultContent);
                     console.log("Default settings created.");
                 }).catch(error => {
                     console.error("Error creating default settings:", error);
                     toast({ variant: "destructive", title: "Error", description: "Could not create default settings." });
                 });
            }
            setIsFetching(false);
        }, (error) => {
             console.error("Error with settings snapshot:", error);
            toast({ variant: "destructive", title: "Error", description: "Failed to load real-time settings." });
            setIsFetching(false);
        });

        return () => unsubscribe();
    }, [toast]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content) return;
        setIsLoading(true);

        try {
            await setDoc(settingsRef, content, { merge: true });
            toast({
                title: "Settings Saved",
                description: "Your homepage content has been updated.",
            });
        } catch (error) {
            console.error("Error saving settings:", error);
            toast({ variant: "destructive", title: "Error", description: "Failed to save settings." });
        } finally {
            setIsLoading(false);
        }
    }
    
    const handleInputChange = (section: keyof HomepageContent | 'siteName', field: string, value: string) => {
        setContent(prev => {
            if (!prev) return null;
            if (section === 'siteName') {
                return { ...prev, siteName: value };
            }
            const currentSection = prev[section];
            if (typeof currentSection === 'object' && currentSection !== null) {
                return {
                    ...prev,
                    [section]: {
                        ...currentSection,
                        [field]: value
                    }
                };
            }
            return prev;
        });
    };
    

    const handleNestedArrayChange = (sectionKey: 'howItWorks' | 'features' | 'whyUs', arrayKey: 'steps' | 'items' | 'points', index: number, field: 'title' | 'description', value: string) => {
        setContent(prev => {
            if (!prev) return null;
    
            const newContent = JSON.parse(JSON.stringify(prev));
    
            if (newContent[sectionKey] && newContent[sectionKey][arrayKey] && newContent[sectionKey][arrayKey][index]) {
                newContent[sectionKey][arrayKey][index][field] = value;
            }
    
            return newContent;
        });
    };

    if (isFetching || !content) {
        return (
            <div className="p-8 flex justify-center items-center h-[80vh]">
                <Loader2 className="h-12 w-12 animate-spin" />
            </div>
        )
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Homepage Content</h1>
                <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save All Changes"}
                </Button>
            </div>
            <form onSubmit={handleSave}>
                <Accordion type="multiple" defaultValue={['site', 'hero', 'footer']} className="space-y-4">
                    
                    <AccordionItem value="site">
                        <AccordionTrigger className="text-xl font-headline">Site Details</AccordionTrigger>
                        <AccordionContent>
                             <CardContent className="space-y-4 pt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="siteName">Site Name</Label>
                                    <Input id="siteName" value={content.siteName} onChange={e => handleInputChange('siteName', 'siteName', e.target.value)} />
                                </div>
                            </CardContent>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="hero">
                        <AccordionTrigger className="text-xl font-headline">Hero Section</AccordionTrigger>
                        <AccordionContent>
                             <CardContent className="space-y-4 pt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="hero-title">Title</Label>
                                    <Input id="hero-title" value={content.hero.title} onChange={e => handleInputChange('hero', 'title', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hero-subtitle">Subtitle</Label>
                                    <Textarea id="hero-subtitle" value={content.hero.subtitle} onChange={e => handleInputChange('hero', 'subtitle', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hero-buttonText">Button Text</Label>
                                    <Input id="hero-buttonText" value={content.hero.buttonText} onChange={e => handleInputChange('hero', 'buttonText', e.target.value)} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="hero-imageUrl">Background Image URL</Label>
                                    <Input id="hero-imageUrl" value={content.hero.imageUrl} onChange={e => handleInputChange('hero', 'imageUrl', e.target.value)} />
                                </div>
                            </CardContent>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="how-it-works">
                        <AccordionTrigger className="text-xl font-headline">"How It Works" Section</AccordionTrigger>
                        <AccordionContent>
                             <CardContent className="space-y-4 pt-6">
                                <div className="space-y-2">
                                    <Label>Section Title</Label>
                                    <Input value={content.howItWorks.title} onChange={e => handleInputChange('howItWorks', 'title', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Section Subtitle</Label>
                                    <Textarea value={content.howItWorks.subtitle} onChange={e => handleInputChange('howItWorks', 'subtitle', e.target.value)} />
                                </div>
                                <Label>Steps</Label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                   {content.howItWorks.steps.map((step, index) => (
                                       <div key={index} className="p-4 border rounded-lg space-y-2">
                                           <Label>Step {index + 1} Title</Label>
                                           <Input value={step.title} onChange={e => handleNestedArrayChange('howItWorks', 'steps', index, 'title', e.target.value)} />
                                           <Label>Step {index + 1} Description</Label>
                                           <Textarea value={step.description} onChange={e => handleNestedArrayChange('howItWorks', 'steps', index, 'description', e.target.value)} />
                                       </div>
                                   ))}
                                </div>
                            </CardContent>
                        </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="features">
                        <AccordionTrigger className="text-xl font-headline">Features Section</AccordionTrigger>
                        <AccordionContent>
                             <CardContent className="space-y-4 pt-6">
                                <div className="space-y-2">
                                    <Label>Section Title</Label>
                                    <Input value={content.features.title} onChange={e => handleInputChange('features', 'title', e.target.value)} />
                                </div>
                                <Label>Feature Items</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   {content.features.items.map((item, index) => (
                                       <div key={index} className="p-4 border rounded-lg space-y-2">
                                           <Label>Feature {index + 1} Title</Label>
                                           <Input value={item.title} onChange={e => handleNestedArrayChange('features', 'items', index, 'title', e.target.value)} />
                                           <Label>Feature {index + 1} Description</Label>
                                           <Textarea value={item.description} onChange={e => handleNestedArrayChange('features', 'items', index, 'description', e.target.value)} />
                                       </div>
                                   ))}
                                </div>
                            </CardContent>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="why-us">
                        <AccordionTrigger className="text-xl font-headline">"Why Us" Section</AccordionTrigger>
                        <AccordionContent>
                             <CardContent className="space-y-4 pt-6">
                                <div className="space-y-2">
                                    <Label>Section Title</Label>
                                    <Input value={content.whyUs.title} onChange={e => handleInputChange('whyUs', 'title', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Section Subtitle</Label>
                                    <Textarea value={content.whyUs.subtitle} onChange={e => handleInputChange('whyUs', 'subtitle', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Image URL</Label>
                                    <Input value={content.whyUs.imageUrl} onChange={e => handleInputChange('whyUs', 'imageUrl', e.target.value)} />
                                </div>
                                <Label>Points</Label>
                                <div className="space-y-4">
                                   {content.whyUs.points.map((point, index) => (
                                       <div key={index} className="p-4 border rounded-lg space-y-2">
                                           <Label>Point {index + 1} Title</Label>
                                           <Input value={point.title} onChange={e => handleNestedArrayChange('whyUs', 'points', index, 'title', e.target.value)} />
                                           <Label>Point {index + 1} Description</Label>
                                           <Textarea value={point.description} onChange={e => handleNestedArrayChange('whyUs', 'points', index, 'description', e.target.value)} />
                                       </div>
                                   ))}
                                </div>
                            </CardContent>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="testimonials">
                        <AccordionTrigger className="text-xl font-headline">Testimonials Section</AccordionTrigger>
                        <AccordionContent>
                             <CardContent className="space-y-4 pt-6">
                                <div className="space-y-2">
                                    <Label>Section Title</Label>
                                    <Input value={content.testimonials.title} onChange={e => handleInputChange('testimonials', 'title', e.target.value)} />
                                </div>
                             </CardContent>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="cta">
                        <AccordionTrigger className="text-xl font-headline">Call to Action Section</AccordionTrigger>
                        <AccordionContent>
                             <CardContent className="space-y-4 pt-6">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input value={content.cta.title} onChange={e => handleInputChange('cta', 'title', e.target.value)} />
                                </div>
                                 <div className="space-y-2">
                                    <Label>Subtitle</Label>
                                    <Textarea value={content.cta.subtitle} onChange={e => handleInputChange('cta', 'subtitle', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Button Text</Label>
                                    <Input value={content.cta.buttonText} onChange={e => handleInputChange('cta', 'buttonText', e.target.value)} />
                                </div>
                             </CardContent>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="socials">
                        <AccordionTrigger className="text-xl font-headline">Social Media</AccordionTrigger>
                        <AccordionContent>
                             <CardContent className="space-y-4 pt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="social-twitter">Twitter (X) URL</Label>
                                    <Input id="social-twitter" value={content.socials?.twitter || ''} onChange={e => handleInputChange('socials', 'twitter', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="social-facebook">Facebook URL</Label>
                                    <Input id="social-facebook" value={content.socials?.facebook || ''} onChange={e => handleInputChange('socials', 'facebook', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="social-instagram">Instagram URL</Label>
                                    <Input id="social-instagram" value={content.socials?.instagram || ''} onChange={e => handleInputChange('socials', 'instagram', e.target.value)} />
                                </div>
                             </CardContent>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="footer">
                        <AccordionTrigger className="text-xl font-headline">Footer Details</AccordionTrigger>
                        <AccordionContent>
                             <CardContent className="space-y-4 pt-6">
                                <div className="space-y-2">
                                    <Label>Address</Label>
                                    <Input value={content.footer.address} onChange={e => handleInputChange('footer', 'address', e.target.value)} />
                                </div>
                                 <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input type="email" value={content.footer.email} onChange={e => handleInputChange('footer', 'email', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input value={content.footer.phone} onChange={e => handleInputChange('footer', 'phone', e.target.value)} />
                                </div>
                             </CardContent>
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
            </form>
        </div>
    );
}
