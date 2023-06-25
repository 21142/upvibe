import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';
import { Toaster } from '@/components/ui/Toaster';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';

export const metadata = {
  title: 'upvibe',
  description: 'A Reddit like app since the real one is on fire.',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        'light bg-white text-slate-900 antialiased',
        inter.className
      )}
    >
      <body className="min-h-screen bg-slate-50 pt-12 antialiased">
        <Providers>
          {/* @ts-expect-error Navbar is a server component */}
          <Navbar />
          {authModal}

          <div className="container mx-auto h-full max-w-7xl pt-12">
            {children}
          </div>

          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
