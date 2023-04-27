"use client"
import React from 'react'
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { BiMenu } from "react-icons/bi";
import { toggle } from '@/redux/admin/menuSlide';

const HeaderAdmin = () => {
  const menu = useAppSelector((state) => state.menuSlide);
  const dispatch = useAppDispatch();

  return (
    <div 
      className='w-full h-14 transition-all bg-white border-b'
      style={{paddingLeft: menu.open ? menu.width : menu.minWidth}}
    >
      <div className="w-full h-full px-6 flex items-center space-x-4">
        <span 
          className="icon cursor-pointer"
          onClick={() => dispatch(toggle())}
        >
          <BiMenu />
        </span>

        <span className='rounded-full bg-gray-100 px-4 py-2'>Dashboard</span>
      </div>
    </div>
  )
}

export default HeaderAdmin