"use client"
import {useEffect, useRef, useState} from 'react'
import { useClickOutside } from '@/lib/clickOutside';
import { getScrollbarWidth } from '@/lib/utils/helper';
import { Button, Zoom } from '@mui/material';
import { Image } from '@prisma/client';
import AdminFormFieldImageModel from './image/ImageModel';

type AdminFormFieldImageType = {
  multiple?: boolean,
  name: string
}

const AdminFormFieldImage: React.FC<AdminFormFieldImageType> = ({
  multiple = false,
  name
}) => {
  const [value, setValue] = useState("")

  const [imageChoose, setImageChoose] = useState(false)
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className='h-36 border rounded focus-within:ring-2 ring-orange-600 bg-white'>
        <input type="hidden" name={name} value={value} className='sr-only' />
        <div className="w-full h-full flex flex-col justify-center items-center cursor-pointer"
          onClick={() => setShowModal((state) => state = !state)}
        >
          { !imageChoose 
            ? <>
              <span className="icon w-10 h-10 text-orange-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 5h13v7h2V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h8v-2H4V5z"></path><path d="m8 11-3 4h11l-4-6-3 4z"></path><path d="M19 14h-2v3h-3v2h3v3h2v-3h3v-2h-3z"></path></svg>
              </span>
              <span className="mt-2 text-xs font-semibold">Bấm để thêm một tài sản hoặc kéo và thả một trong khu vực này</span>
            </>
            : <div className="w-full h-full p-2 bg-make-transparent">
              <img src="" alt="" />
            </div>
          }
        </div>
      </div>

      <AdminFormFieldImageModel show={showModal} setShow={setShowModal} />
    </>
  )
}

export default AdminFormFieldImage