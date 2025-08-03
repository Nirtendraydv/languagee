import Link from "next/link";
import { Globe } from "lucide-react";

// Dummy social media icons for demonstration
const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3.3 4.9s-1.4-1.1-3.2-1.4c-1.4 1.5-3.5 2.5-5.5 2.5c-4.2 0-7.6-3.4-7.6-7.6c0-1.2.3-2.3.8-3.3c-6.1-.3-11.5-3.2-15.2-7.7c-.6 1.1-.9 2.3-.9 3.6c0 2.6 1.3 4.9 3.4 6.3c-1.2-.1-2.3-.4-3.3-1c0 3.7 2.6 6.7 6.1 7.4c-1.1.3-2.3.4-3.5.1c1 3 3.8 5.1 7.1 5.2c-2.9 2.3-6.5 3.6-10.4 3.6c-.7 0-1.3-.1-1.9-.3c3.7 2.4 8.1 3.8 12.8 3.8c15.4 0 23.8-12.7 23.8-23.8c0-.4 0-.8-.1-1.2c1.6-1.2 3-2.7 4.1-4.2z" />
    </svg>
);
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);


export default function Footer() {
    return (
        <footer className="bg-secondary/50">
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="space-y-4 col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2">
                          <Globe className="h-7 w-7 text-primary" />
                          <span className="font-headline text-2xl font-bold">LingoSphere</span>
                        </Link>
                        <p className="text-muted-foreground">Learn English Anywhere.</p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary"><TwitterIcon/></Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary"><FacebookIcon/></Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary"><InstagramIcon/></Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-headline font-semibold">Platform</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link href="/courses" className="text-muted-foreground hover:text-primary">Courses</Link></li>
                            <li><Link href="/tutors" className="text-muted-foreground hover:text-primary">Tutors</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-headline font-semibold">Resources</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link href="#" className="text-muted-foreground hover:text-primary">Blog</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary">Help Center</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t pt-8 text-center text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} LingoSphere. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
