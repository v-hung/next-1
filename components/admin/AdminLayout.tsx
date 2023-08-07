"use client"

import useAdminMenu from '@/stores/admin/adminMenu';
import { AdminUser } from '@/stores/admin/adminUser';
import ClientOnly from 'components/ClientOnly';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import useAdminUser from 'stores/admin/adminUser';
import HeaderAdmin from './HeaderAdmin';
import MenuAdmin from './MenuAdmin';
import { useStoreCustom } from '@/stores';
import AdminModal from './modal/AdminModal';
import { SnackbarProvider } from 'notistack';

const AdminLayout : React.FC<{
  children: React.ReactNode,
  userData?: AdminUser
}> = ({children, userData}) => {

  const willMount = useRef(true)
  const adminUser = useAdminUser()
  const adminMenu = useStoreCustom(useAdminMenu, (state) => state)
  // const adminMenu = useAdminMenu()

  if (willMount.current && userData) {
    adminUser.save(userData)
    willMount.current = false
    // if (typeof window != "undefined") {
    //   let a = JSON.parse(sessionStorage.getItem("admin-menu") as any)
    //   // console.log(a.state.open, 2)
    //   adminMenu.open = a.state.open
    // }
  }

  return (
    <ClientOnly>
      <SnackbarProvider maxSnack={3}>
        <div className='w-full min-h-screen bg-gray-100'>
          <MenuAdmin/>
          <div 
            className='w-full transition-all'
            style={{paddingLeft: adminMenu?.open ? adminMenu?.width : "60px"}}
          >
            <HeaderAdmin />
            <div className="px-8 py-4">{children}</div>
          </div>
          {/* <AdminModal /> */}
        </div>
      </SnackbarProvider>
    </ClientOnly>
  )
}

export default AdminLayout