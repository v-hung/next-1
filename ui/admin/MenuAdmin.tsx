"use client"
import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Image from 'next/image'
import Logo from "@/public/logo.png";
import { GoDashboard } from "react-icons/go";
import Link from 'next/link';

const MenuAdmin = () => {
  const menu = useAppSelector((state) => state.menuSlide);
  const dispatch = useAppDispatch();

  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  }

  const handleMouseLeave = () => {
    setIsHover(false);
  }

  const links = [
    {
      icon: <GoDashboard size={24} />,
      name: "Trang chủ",
      path: "/"
    },
    {
      icon: <GoDashboard size={24} />,
      name: "Trang chủ",
      path: "/"
    },
    {
      icon: <GoDashboard size={24} />,
      name: "Trang chủ",
      path: "/"
    }
  ]
  
  return (
    <div 
      className='fixed h-full overscroll-y-auto transition-all bg-white border-r' 
      style={{width: isHover ? menu.width : (menu.open ? menu.width : menu.minWidth)}}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col space-y-2 px-1">
        <div className="w-full h-14 flex items-center overflow-hidden border-b">
          <div className='flex-none grid place-items-center' style={{width: menu.minWidth}}>
            <Image
              src="/logo.png"
              alt="Picture of the author"
              width={50}
              height={50}
              className='rounded w-8 h-8'
            />
          </div>
          <span className='flex-none text-xl font-bold'>Việt Hùng IT</span>
        </div>

        
        { menu.open 
          ? <div className='whitespace-nowrap text-sm font-bold px-2 text-gray-500 !mt-4'>Content Manager</div>
          : <div className="w-full h-[1px] !mt-4 bg-gray-300"></div>
        }

        {links.map(v => {
          return (
            <Link 
              className="w-full flex items-center py-3 overflow-hidden hover:bg-blue-200 rounded"
              href={v.path}
            >
              <div className='flex-none px-1 grid place-items-center' style={{width: "52px"}}>
                {v.icon}
              </div>
              <span className='flex-none font-semibold'>{v.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default MenuAdmin