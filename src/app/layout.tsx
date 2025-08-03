
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { AiTutorSidebar } from '@/components/AiTutorSidebar';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: 'English Excellence - Learn English Anywhere',
  description: 'An online English tutoring platform with a modern, interactive, and immersive learning experience.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased flex flex-col'
        )}
      >
        <AuthProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <AiTutorSidebar />
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
