import type { Metadata } from 'next';
import { Outfit, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'ARTEVÍA | Inmobiliaria de Lujo y Propiedades Exclusivas',
  description: 'Propiedades exclusivas en los distritos más codiciados de Lima. Experiencia, discreción y resultados.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${outfit.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased selection:bg-[#c89b5c] selection:text-white">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
