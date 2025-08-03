
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
    const { toast } = useToast();
    const [siteName, setSiteName] = useState("English Excellence");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const settingsRef = doc(db, "settings", "siteConfig");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docSnap = await getDoc(settingsRef);
                if (docSnap.exists()) {
                    setSiteName(docSnap.data().siteName);
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
                toast({ variant: "destructive", title: "Error", description: "Failed to load settings." });
            } finally {
                setIsFetching(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await setDoc(settingsRef, { siteName });
            toast({
                title: "Settings Saved",
                description: "Your website settings have been updated.",
            });
        } catch (error) {
            console.error("Error saving settings:", error);
            toast({ variant: "destructive", title: "Error", description: "Failed to save settings." });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Website Settings</h1>
            <div className="grid gap-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>General</CardTitle>
                        <CardDescription>Update your website's basic information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isFetching ? (
                             <div className="flex justify-center items-center h-20">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : (
                            <form onSubmit={handleSave} className="space-y-6 max-w-lg">
                                <div className="space-y-2">
                                    <Label htmlFor="siteName">Website Name</Label>
                                    <Input 
                                        id="siteName" 
                                        value={siteName}
                                        onChange={(e) => setSiteName(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
