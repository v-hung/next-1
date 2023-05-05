"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import Container from './Container'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useMedia } from 'react-use';
import { useClickOutside } from '@/lib/clickOutside'
import Collapse from '../Collapse'
import { formatCurrency } from '@/lib/utils/helper'

const Header = ({className = "", user}: any) => {

  const pathname = usePathname()

  const links = [
    { name: "Trang chủ", path: "/"},
    { name: "Hướng dẫn", path: "/pages/guide"},
    { name: "Vòng quay may mắn", path: "/lucky"},
    { name: "Shop game", path: "/shop"},
    { name: "Nạp tiền", path: "/recharge"}
  ]

  // const { data: session, status } = useSession()

  const [showMenuMobile, setShowMenuMobile] = useState(false)
  const ref = useRef(null)

  // useClickOutside(ref, () => {
  //   console.log('OUTSIDE CLICKED', isWide)
  //   setShowMenuMobile((state) => state = !state)
  // });


  return (
    <div className={`sticky top-0 border-b bg-white z-50 ${className}`}>
      <Container className="relative w-full flex justify-between items-center">
        <Link href={"/"}><img src="/logo2.png" alt="Logo" className='h-12 my-2' /></Link>

        <span 
          className="icon rounded border w-8 h-8 p-1 hover:bg-gray-100 cursor-pointer lg:hidden"
          onClick={() => setShowMenuMobile(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path></svg>
        </span>

        <div className={`fixed top-0 left-0 right-0 bottom-0 lg:static lg:!pointer-events-auto
            ${showMenuMobile ? "bg-black/30" : "pointer-events-none"} transition-all
          `}
          onClick={() => setShowMenuMobile(false)}
        >
          <div ref={ref}
            className={`w-full max-w-[280px] h-full bg-white flex flex-col items-start 
              lg:flex-row lg:items-center lg:max-w-none lg:!translate-x-0
              ${!showMenuMobile ? "-translate-x-full" : ""} transition-all`
            }
          >
            <img src="/logo2.png" alt="Logo" className='h-12 mx-4 my-3 lg:hidden'  />
            { links.map((v,i) =>
              <Link href={v.path} key={i}
                className={`font-semibold border-b-2 border-transparent py-4 px-6 uppercase hover:bg-gray-100
                  lg:py-6 lg:px-3
                  ${pathname == v.path ? "text-blue-500" : ""}`}
              >{v.name}</Link>
            ) }


            <div className="!ml-6 lg:!ml-3">
              { user
                ? <AvatarUser user={user} />
                : <Link href={"/login"}
                    className="px-4 py-2 rounded-full border bg-white hover:bg-slate-800 hover:border-slate-800 hover:text-white
                      flex items-center space-x-2"
                  >
                    <span className="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m13 16 5-4-5-4v3H4v2h9z"></path><path d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"></path></svg>
                    </span>
                    <span>Đăng nhập</span>
                  </Link>
              }
            </div>
          </div>
        </div>
      </Container>
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
          <img src={user.image} alt={user.name} className="img-full" />
        </div>
        <div>
          <div className='font-semibold'>{user.name}</div>
          <div className='text-xs'>{formatCurrency(100000)}</div>
        </div>
        <span className="icon w-3 h-3 ">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z"></path></svg>
        </span>
      </div>
      <div className="absolute min-w-full w-max top-[calc(100%+.5rem)] right-0 shadow">
        <Collapse show={isShow} setShow={setIsShow}>
          <div className="bg-white rounded py-2 border">
            <Link href="/profile" className="flex items-center space-x-2 hover:bg-blue-200 px-4 py-2">
              <span className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z"></path></svg>
              </span>
              <span>Trang cá nhân</span>
            </Link>
            <div className="flex items-center space-x-2 hover:bg-blue-200 px-4 py-2 text-red-500 cursor-pointer"
              onClick={() => signOut()}
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

export default Header