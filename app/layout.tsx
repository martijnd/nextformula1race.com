import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://nextformula1race.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lang will be set by the locale layout via a script or we handle it client-side
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

