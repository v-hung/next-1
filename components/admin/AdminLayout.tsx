"use client"

import useAdminMenu from '@/stores/admin/adminMenu';
import ClientOnly from 'components/ClientOnly';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import useAdminUser from 'stores/admin/adminUser';
import HeaderAdmin from './HeaderAdmin';
import MenuAdmin from './MenuAdmin';
import { useStoreCustom } from '@/stores';
import { SnackbarProvider } from 'notistack';
import { AdminUserType } from '@/lib/admin/helperServer';

const AdminLayout : React.FC<{
  children: React.ReactNode,
  userData: NonNullable<AdminUserType>
}> = ({children, userData}) => {

  const adminMenu = useStoreCustom(useAdminMenu, (state) => state)

  return (
    <ClientOnly>
      <SnackbarProvider maxSnack={3} autoHideDuration={3000} anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}>
        <div className='w-full min-h-screen bg-gray-100'>
          <MenuAdmin permissions={userData.role.permissions}/>
          <div 
            className='w-full transition-all'
            style={{paddingLeft: adminMenu?.open ? adminMenu?.width : "60px"}}
          >
            <HeaderAdmin adminUser={userData} />
            <div className="px-8 py-4">{children}</div>
          </div>
        </div>
      </SnackbarProvider>
    </ClientOnly>
  )
}

export default AdminLayout