"use client"
import React from 'react'
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { BiArrowToBottom, BiBell, BiDownArrow, BiMenu } from "react-icons/bi";
import { toggle } from '@/redux/admin/adminMenu';
import useAdminMenu from 'stores/admin/adminMenu';
import useAdminUser from '@/stores/admin/adminUser';

const HeaderAdmin = () => {
  const adminUser = useAdminUser()
  const adminMenu = useAdminMenu()

  return (
    <div 
      className='w-full h-16 transition-all bg-white border-b'
      style={{paddingLeft: adminMenu.open ? adminMenu.width : "60px"}}
    >
      <div className="w-full h-full px-4 flex items-center space-x-4">
        <span 
          className="icon cursor-pointer w-10 h-10 p-2 rounded-full hover:bg-gray-100"
          onClick={() => adminMenu.toggle()}
        >
          <BiMenu />
        </span>

        <span className='rounded-full bg-gray-100 px-4 py-2'>Bảng điều khiển</span>

        <div className="!ml-auto"></div>
        <span className="icon relative w-10 h-10 p-2 rounded-full hover:bg-gray-100">
          <BiBell/>
          <div className="absolute w-2 h-2 rounded-full bg-orange-600 top-2 right-2"></div>
        </span>

        { adminUser.user != null
          ? <div className="flex items-center space-x-2 rounded-full p-1 pr-2 bg-gray-100 hover:bg-blue-200">
              <div className="w-10 h-10 rounded-full bg-red-600"></div>
              <div className='font-semibold'>{adminUser.user.name}</div>
              <span className="icon w-3 h-3 ">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z"></path></svg>
              </span>
            </div>
          : null
        }
      </div>
    </div>
  )
}

export default HeaderAdmin