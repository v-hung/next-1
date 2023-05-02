"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import Container from './Container'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useMedia } from 'react-use';
import { useClickOutside } from '@/lib/clickOutside'



const Header = () => {

  const pathname = usePathname()

  const links = [
    { name: "Trang chủ", path: "/"},
    { name: "Hướng dẫn", path: "/guide"},
    { name: "Vòng quay may mắn", path: "/luck"},
    { name: "Shop game", path: "/shop"},
    { name: "Nạp tiền", path: "/recharge"}
  ]

  const { data: session, status } = useSession()

  const [showMenuMobile, setShowMenuMobile] = useState(false)
  const ref = useRef(null)

  // useClickOutside(ref, () => {
  //   console.log('OUTSIDE CLICKED', isWide)
  //   setShowMenuMobile((state) => state = !state)
  // });


  return (
    <div className="sticky border-b bg-white">
      <Container className="relative w-full flex justify-between items-center">
        <img src="/logo2.png" alt="Logo" className='h-12 my-2' />

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
              { status === "authenticated"
                ? <div className="px-4 py-2 rounded-full">{session.user?.name}</div>
                : <Link href={"/auth/login"}
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

export default Header