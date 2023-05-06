"use client"
import React, { useEffect, useState } from 'react'
import Collapse from '../../Collapse'
import Container from '../Container'
import Dropdown from '../Dropdown'
import ProductSingle, { ProductSingleType } from '../ProductSingle'

const ShopFilter = () => {
  const [isShow, setIsShow] = useState(false)
  const priceItems = [
    { title: "Tất cả", value: "all" },
    { title: "50k trở xuống", value: "1" },
    { title: "Từ 50k đến 100k", value: "2" },
    { title: "Từ 100k đến 500k", value: "3" },
    { title: "Từ 500k đến 1 triệu", value: "4" },
    { title: "Từ 1 triệu trở lên", value: "5" }
  ]

  const items: ProductSingleType[] = new Array(20).fill({
    id: 1,
    name: "Acc trắng thông tin giá siêu rẻ",
    image: "https://shopdangym.com/tep-tin/1682291015Chưa_có_tên1.png",
    price: 255000,
    promotionalPrice: 600000,
    heros: 65,
    skins: 85,
    rank: "Kim Cương",
    gem: 80,
    link: '/products/1'
  })

  return (
    <Container className="mt-12">
      <div className="flex items-center space-x-6">
        <div className="flex-grow h-[1px] bg-gray-400"></div>
        <h3 className="flex-none text-2xl font-semibold text-center">SHOP LIÊN QUÂN - BÁN ACC LIÊN QUÂN GIÁ RẺ, UY TÍN HÀNG ĐẦU VIỆT NAM</h3>
        <div className="flex-grow h-[1px] bg-gray-400"></div>
      </div>

      <div className="mt-12 flex flex-wrap space-x-4">
        <Dropdown isShow={isShow} setIsShow={setIsShow} title="Giá tiền" items={priceItems} />
      </div>

      <div className="mt-6 flex flex-wrap -mx-2">
        {items.map((v,i) => 
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4" key={i}>
            <ProductSingle item={v} />
          </div>
        )}
      </div>
      <div className="mt-12"></div>
    </Container>
  )
}

export default ShopFilter