"use client"

import { AdminUser, save } from '@/redux/admin/adminUser';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import React, { useEffect } from 'react'
import MenuAdmin from '../MenuAdmin';

const AdminLayout : React.FC<{
  children: React.ReactNode,
  userData: AdminUser
}> = ({children, userData}) => {
  const user = useAppSelector((state) => state.adminUser)
  const dispatch = useAppDispatch()

  dispatch(save(userData))

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