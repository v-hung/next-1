import { AuthProvider } from '@/components/web/AuthProviders';
import Header from '@/components/web/Header';
import { getCurrentUser } from '@/lib/getCurrentUser';
import React from 'react';
import { Roboto } from 'next/font/google'
import Banner from '@/components/web/Banner';

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
})

export default async function WebRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`text-[#333] min-h-screen bg-gray-100 ${roboto.className}`}>
      <AuthProvider>
        <Header />
        {children}
      </AuthProvider>
    </div>
  )
}
