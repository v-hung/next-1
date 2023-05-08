"use client"

import useAdminMenu from '@/stores/admin/adminMenu';
import { AdminUser } from '@/stores/admin/adminUser';
import ClientOnly from 'components/ClientOnly';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import useAdminUser from 'stores/admin/adminUser';
import HeaderAdmin from '../HeaderAdmin';
import MenuAdmin from '../MenuAdmin';
import { useStoreCustom } from '@/stores';

const AdminLayout : React.FC<{
  children: React.ReactNode,
  userData?: AdminUser
}> = ({children, userData}) => {

  const willMount = useRef(true)
  const adminUser = useAdminUser()
  const adminMenu = useStoreCustom(useAdminMenu, (state) => state)

  // useEffect(() => {
    if (willMount.current && userData) {
      adminUser.save(userData)
    }
    willMount.current = false
  // }, [])

  return (
    <div className='w-full min-h-screen bg-gray-100'>
      <MenuAdmin/>
      <div 
        className='w-full transition-all'
        style={{paddingLeft: adminMenu?.open ? adminMenu?.width : "60px"}}
      >
        <HeaderAdmin />
        <div className="px-8 py-4">{children}</div>
      </div>
    </div>
  )
}

export default AdminLayout