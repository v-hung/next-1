"use client"
import useModal from '@/stores/web/modal'
import React from 'react'

const BtnBuyByEWallet = ({title}: {title: string}) => {
  const modal = useModal()

  const showModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    modal.changeModalShow("recharge")
  }

  return (
    <button 
      className="bg-green-500 text-white px-6 py-2"
      onClick={(e) => showModal(e)}
    >{title}</button>
  )
}

export default BtnBuyByEWallet