"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Logo from "@/public/logo.png";
import { GoDashboard } from "react-icons/go";
import { BiUser, BiKey, BiCog, BiCategory, BiBaguette } from "react-icons/bi";
import Link from 'next/link';
import useAdminMenu from 'stores/admin/adminMenu';
import { useStoreCustom } from '@/stores';

const MenuAdmin = () => {
  // const adminMenu = useAdminMenu()
  const adminMenu = useStoreCustom(useAdminMenu, (state) => state)

  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  }

  const handleMouseLeave = () => {
    setIsHover(false);
  }

  const managerLinks = [
    {
      icon: <GoDashboard size={24} />,
      name: "Bảng điều khiển",
      path: "/admin"
    },
    {
      icon: <BiCategory size={24} />,
      name: "Danh mục",
      path: "/admin/categories"
    },
    {
      icon: <BiBaguette size={24} />,
      name: "Sản phẩm",
      path: "/admin/products"
    }
  ]

  const generalLinks = [
    {
      icon: <BiUser size={24} />,
      name: "Người dùng",
      path: "/"
    },
    {
      icon: <BiKey size={24} />,
      name: "Quyền",
      path: "/"
    },
    {
      icon: <BiCog size={24} />,
      name: "Cài đặt",
      path: "/"
    }
  ]
  
  return (
    <div 
      className='fixed h-full transition-all bg-white border-r z-[100]' 
      style={{width: isHover ? adminMenu?.width : (adminMenu?.open ? adminMenu?.width : "60px")}}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full h-full flex flex-col space-y-2 px-1">
        <Link href={"/"} className="flex-none w-full h-16 flex items-center overflow-hidden border-b">
          <div className='flex-none grid place-items-center' style={{width: "52px"}}>
            <Image
              src="/logo.png"
              alt="Picture of the author"
              width={50}
              height={50}
              className='rounded w-8 h-8'
            />
          </div>
          <span className='flex-none text-xl font-bold'>Việt Hùng IT</span>
        </Link>

        
        <div className="flex-grow min-h-0 flex flex-col space-y-2 px-1 overflow-y-auto">
          <div className="w-full h-5 flex items-center px-2 text-gray-500 !mt-4">
            { adminMenu?.open || isHover
              ? <div className='whitespace-nowrap text-sm font-bold '>Quản lý nội dung</div>
              : <div className="w-full h-[1px] bg-gray-300"></div>
            }
          </div>
          {managerLinks.map((v,i) => {
            return (
              <Link
                className="flex-none w-full flex items-center py-3 overflow-x-hidden hover:bg-blue-200 rounded"
                href={v.path}
                key={i}
              >
                <div className='flex-none px-1 grid place-items-center' style={{width: "44px"}}>
                  {v.icon}
                </div>
                <span className='flex-none font-semibold'>{v.name}</span>
              </Link>
            )
          })}
          <div className="w-full h-5 flex items-center px-2 text-gray-500 !mt-4">
            { adminMenu?.open || isHover
              ? <div className='whitespace-nowrap text-sm font-bold '>Tổng quan</div>
              : <div className="w-full h-[1px] bg-gray-300"></div>
            }
          </div>
          {generalLinks.map((v,i) => {
            return (
              <Link
                className="flex-none w-full flex items-center py-3 overflow-x-hidden hover:bg-blue-200 rounded"
                href={v.path}
                key={i}
              >
                <div className='flex-none px-1 grid place-items-center' style={{width: "44px"}}>
                  {v.icon}
                </div>
                <span className='flex-none font-semibold'>{v.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MenuAdmin