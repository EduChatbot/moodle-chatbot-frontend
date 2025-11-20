import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AnimationProvider } from "@/contexts/AnimationContext";
import { MoodleProvider } from "@/contexts/MoodleContext";
import ConditionalLayout from "@/components/ConditionalLayout";
import { Playfair_Display, Montserrat, Inter, Space_Grotesk } from 'next/font/google';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Moodle Chatbot - AI-Powered Learning Assistant",
  description: "Professional AI chatbot for Moodle courses and learning assistance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${montserrat.variable} ${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <ThemeProvider>
          <AnimationProvider>
            <MoodleProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </MoodleProvider>
          </AnimationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
