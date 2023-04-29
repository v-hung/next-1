"use client"

import { AdminUser } from '@/stores/admin/adminUser';
import ClientOnly from 'components/ClientOnly';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import useAdminUser from 'stores/admin/adminUser';
import MenuAdmin from '../MenuAdmin';

const AdminLayout : React.FC<{
  children: React.ReactNode,
  userData: AdminUser
}> = ({children, userData}) => {

  const [setUser, setSetUser] = useState(false)
  const adminUser = useAdminUser()

  if (!setUser) {
    setSetUser(true)
    adminUser.save(userData)
  }

  return (
    <div className='w-full min-h-screen bg-gray-100 text-[#333]'>
      <MenuAdmin/>
      <div>
        {children}
      </div>
    </div>
  )
}

export default AdminLayout