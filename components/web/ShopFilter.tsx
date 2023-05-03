"use client"
import React, { useEffect, useState } from 'react'
import Collapse from '../Collapse'
import Container from './Container'
import Dropdown from './Dropdown'

const ShopFilter = () => {
  const [isShow, setIsShow] = useState(false)
  

  return (
    <Container className="mt-12">
      <div className="flex items-center space-x-6">
        <div className="flex-grow h-[1px] bg-gray-400"></div>
        <h3 className="flex-none text-2xl font-semibold text-center">SHOP LIÊN QUÂN - BÁN ACC LIÊN QUÂN GIÁ RẺ, UY TÍN HÀNG ĐẦU VIỆT NAM</h3>
        <div className="flex-grow h-[1px] bg-gray-400"></div>
      </div>

      <div className="mt-12 flex flex-wrap space-x-4">
        <Dropdown isShow={isShow} setIsShow={setIsShow} title="Giá tiền" />
      </div>
    </Container>
  )
}

export default ShopFilter