"use client"

import useAdminMenu from '@/stores/admin/adminMenu';
import { AdminUser } from '@/stores/admin/adminUser';
import ClientOnly from 'components/ClientOnly';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import useAdminUser from 'stores/admin/adminUser';
import HeaderAdmin from '../HeaderAdmin';
import MenuAdmin from '../MenuAdmin';

const AdminLayout : React.FC<{
  children: React.ReactNode,
  userData: AdminUser
}> = ({children, userData}) => {

  const [setUser, setSetUser] = useState(false)
  const adminUser = useAdminUser()
  const adminMenu = useAdminMenu()

  if (!setUser) {
    setSetUser(true)
    adminUser.save(userData)
  }

  return (
    <div className='w-full min-h-screen bg-gray-100 text-[#333]'>
      <MenuAdmin/>
      <div 
        className='w-full transition-all'
        style={{paddingLeft: adminMenu.open ? adminMenu.width : "60px"}}
      >
        <HeaderAdmin />
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

export default AdminLayout