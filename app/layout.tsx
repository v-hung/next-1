import './default.css'
import './globals.css';
import React, { Suspense } from 'react';
import MuiProvider from '@/components/MuiProvider';
import { AfterNavigationEvents, NavigationEvents } from '@/components/ProgressBar';
import { getSettingsData } from '@/lib/admin/sample';


// million-ignore
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const settings = await getSettingsData()

  return (
    <html lang='vi'>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" />
      </head>
      <body id='__next' className={`text-[#222]`}>
        <MuiProvider settings={settings}>
          {children}

          {/* <Suspense fallback={<AfterNavigationEvents/>}>
            <NavigationEvents />
          </Suspense> */}
        </MuiProvider>
      </body>
    </html>
  );
}
