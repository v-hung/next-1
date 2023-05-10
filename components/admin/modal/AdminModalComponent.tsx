"use client"
import useModal from '@/stores/web/modal'
import React, { useEffect, useRef, useState } from 'react'
import Zoom from '@mui/material/Zoom';
import { useClickOutside } from '@/lib/clickOutside';
import { getScrollbarWidth } from '@/lib/utils/helper';

const AdminModalComponent: React.FC<{
  children: React.ReactNode
}> = ({children}) => {
  const modal = useModal()
  const rechargeRef = useRef<HTMLDivElement>(null)

  useClickOutside(rechargeRef, () => {
    modal.changeModalShow("")
  })

  useEffect(() => {
    if (modal.modalShow == "") {
      document.body.style.overflow = null as any;
      document.body.style.paddingRight = null as any;
    }
    else {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = getScrollbarWidth() + "px"
    }
  }, [modal.modalShow])

  return (
    <div className={`fixed w-full h-full top-0 left-0 z-50 px-4 py-4 md:py-8 lg:py-12 overflow-auto flex justify-center items-start
      ${!modal.modalShow ? "pointer-events-none" : 'bg-black/80'}`}>
      <div ref={rechargeRef} className='w-full max-w'>
        <Zoom in={modal.modalShow == "recharge"}>
          <div>
            {children}
          </div>
        </Zoom>
      </div>
    </div>
  )
}

export default AdminModalComponent