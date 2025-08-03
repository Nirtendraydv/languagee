
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function AdminSettingsPage() {
    const { toast } = useToast();
    const [siteName, setSiteName] = useState("English Excellence");
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call to save settings
        setTimeout(() => {
            console.log("Saving settings:", { siteName });
            toast({
                title: "Settings Saved",
                description: "Your website settings have been updated.",
            });
            setIsLoading(false);
        }, 1000);
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
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
