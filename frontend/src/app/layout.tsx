
import { base, heading } from "@/constants/fonts";
import { cn } from "@/lib";
import { generateMetadata } from "@/utils";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/home/navbar";
import Footer from "@/components/home/footer";
import "./globals.css";

export const metadata = generateMetadata();

export default function RootLayout({ children, }: { children: React.ReactNode; }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn( "min-h-screen bg-background text-foreground font-base antialiased dark", base.variable, heading.variable, )} >
                <Navbar />
                    {children}
                    <Toaster />
                <Footer />
            </body>
        </html>
    );
};
