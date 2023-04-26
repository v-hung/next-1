import '@/styles/globals.css';
import React from 'react';

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='vi'>
      <body className="overflow-y-scroll">{children}</body>
    </html>
  );
}
