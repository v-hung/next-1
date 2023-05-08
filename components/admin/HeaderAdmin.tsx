"use client"
import React, { useState } from 'react'
import { BiArrowToBottom, BiBell, BiDownArrow, BiMenu } from "react-icons/bi";
import useAdminMenu from 'stores/admin/adminMenu';
import useAdminUser from '@/stores/admin/adminUser';
import Link from 'next/link';
import Collapse from '../Collapse';
import { useStoreCustom } from '@/stores';

const HeaderAdmin = () => {
  const adminUser = useAdminUser()
  // const adminMenu = useAdminMenu()
  const adminMenu = useStoreCustom(useAdminMenu, (state) => state)

  return (
    <div className='sticky top-0 w-full h-16 bg-white border-b z-50'>
      <div className="w-full h-full px-4 flex items-center space-x-4">
        <span 
          className="icon cursor-pointer w-10 h-10 p-2 rounded-full hover:bg-gray-100"
          onClick={() => adminMenu?.toggle()}
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
          ? <AvatarUser user={adminUser.user} />
          : null
        }
      </div>
    </div>
  )
}

const AvatarUser = ({user}: any) => {

  const [isShow, setIsShow] = useState(false)

  const toggleShow = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    setIsShow((state) => state = !state)
  }
  
  return (
    <div className="relative">
      <div 
        className="flex items-center space-x-2 rounded-full p-1 pr-2 bg-gray-100 hover:bg-blue-200 cursor-pointer select-none"
        onClick={(e) => toggleShow(e)}
      >
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img src={user.image || '/storage/images/user/b1.png'} alt={user.name} className="w-full h-full object-contain" />
        </div>
        <div className='font-semibold'>{user.name}</div>
        <span className="icon w-3 h-3 ">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z"></path></svg>
        </span>
      </div>
      <div className="absolute min-w-full w-max top-[calc(100%+.5rem)] right-0 shadow">
        <Collapse show={isShow} setShow={setIsShow}>
          <div className="bg-white rounded py-2 border">
            <Link href="/admin/profile" className="flex items-center space-x-2 hover:bg-blue-200 px-4 py-2">
              <span className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z"></path></svg>
              </span>
              <span>Trang cá nhân</span>
            </Link>
            <div className="flex items-center space-x-2 hover:bg-blue-200 px-4 py-2 text-red-500 cursor-pointer"
              // onClick={() => signOut()}
            >
              <span className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16 13v-2H7V8l-5 4 5 4v-3z"></path><path d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"></path></svg>
              </span>
              <span>Đăng xuất</span>
            </div>
          </div>
        </Collapse>
      </div>
    </div>
  )
}

export default HeaderAdmin