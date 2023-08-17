import { AuthProvider } from '@/components/web/AuthProviders';
import Header from '@/components/web/Header';
import { getCurrentUser } from '@/lib/web/getCurrentUser';
import React from 'react';
import Footer from '@/components/web/Footer';
import Modal from '@/components/web/Modal';
import { Metadata, ResolvingMetadata } from 'next';
import { getSettingsData } from '@/lib/admin/sample';
import { findSettingByName } from '@/lib/admin/fields';

export async function generateMetadata(
  parent?: ResolvingMetadata
): Promise<Metadata> {
  const settings = await getSettingsData()

  const siteTitle = findSettingByName(settings, "site title")
  const siteDescription = findSettingByName(settings, "site description")
  const siteLogo = findSettingByName(settings, "site logo")
 
  return {
    title: siteTitle || "Việt Hùng It",
    description: siteDescription || 'Việt Hùng It lập trình viên web, mobile, hệ thống',
    openGraph: {
      title: siteTitle || "Việt Hùng It",
      description: siteDescription || 'Việt Hùng It lập trình viên web, mobile, hệ thống',
      images: siteLogo ? siteLogo?.url : null,
    },
  }
}

export default async function WebRootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: any
}) {
  const userData = await getCurrentUser()

  return (
    <div className={`min-h-screen flex flex-col bg-gray-100`}>
      <AuthProvider>
        <Header user={userData} />
        <div className="flex-grow flex items-stretch">
          <div className='w-full'>{children}</div>
        </div>
        {/* <div className="mt-auto"></div> */}
        <Footer />
        <Modal />
      </AuthProvider>
    </div>
  )
}
