"use client"
import { formatCurrency } from '@/lib/utils/helper'
import Link from 'next/link'
import { type } from 'os'
import React from 'react'

export type ProductSingleType = {
  id: number,
  name: string,
  image: string
  price: number,
  promotionalPrice?: number,
  heros: number,
  skins: number,
  rank: String,
  gem: number,
  link: string
}

const ProductSingle: React.FC<{
  item: ProductSingleType
}> = ({item}) => {
  return (
    <div className="w-full bg-white shadow">
      <div className="relative w-full pb-[70%] group">
        <Link href={item.link} className="absolute w-full h-full top-0 left-0 overflow-hidden">
          <img src={item.image} alt="" className='bg-full object-cover' />
          <div className="absolute w-full h-full top-0 left-0 bg-black/50 -translate-y-full group-hover:translate-y-0 transition-all">
            <div className="w-full h-full grid place-items-center">
              <button className='px-4 py-1.5 border border-white text-white hover:bg-white hover:text-gray-600 uppercase font-semibold transition-colors'>
                Xem chi tiết
              </button>
            </div>
          </div>
        </Link>

        <div className="absolute top-0 left-0 w-full flex justify-between items-start">
          <div className="px-2 py-1 bg-[#32c5d2] text-white text-sm font-semibold">
            Bảng ngọc 90 - Rank C.Thủ
          </div>

          <div className="relative px-2 py-3 w-12 bg-[#ffd424e6] text-white font-semibold text-center translate-x-1 text-sm">
            <p className='text-red-500'>50%</p>
            <p className='uppercase'>Giảm</p>
            <div className="absolute w-0 h-0 left-0 -bottom-1 border-solid
              border-r-[24px] border-l-[24px] border-b-[4px] border-t-0 border-transparent border-x-[#ffd424e6]"
            ></div>
          </div>
        </div>

        <div className="absolute w-full left-0 bottom-0 p-2 bg-[#31383c] text-white text-center font-semibold text-sm cursor-pointer">{item.name}</div>
      </div>

      <div className="text-gray-600">
        <div className="flex divide-x text-center uppercase text-gray-500 text-xs">
          <div className="w-1/2 px-2 py-3">Số tướng <span className="text-red-500">{item.heros}</span></div>
          <div className="w-1/2 px-2 py-3">Số skin <span className="text-red-500">{item.skins}</span></div>
        </div>

        <div className="p-4 pt-2 flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <span className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="M11 11h2v6h-2zm0-4h2v2h-2z"></path></svg>
            </span>
            <span>Tài khoản</span>
            <span className='text-red-500'>#{item.id}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11.707 2.293A.997.997 0 0 0 11 2H6a.997.997 0 0 0-.707.293l-3 3A.996.996 0 0 0 2 6v5c0 .266.105.52.293.707l10 10a.997.997 0 0 0 1.414 0l8-8a.999.999 0 0 0 0-1.414l-10-10zM13 19.586l-9-9V6.414L6.414 4h4.172l9 9L13 19.586z"></path><circle cx="8.353" cy="8.353" r="1.647"></circle></svg>
            </span>
            <span>Giá tiền :</span>
            <span className='text-red-500 flex space-x-2'>
              { item.promotionalPrice ? <span className='line-through'>{formatCurrency(item.promotionalPrice)}</span> : null }
              <span>{formatCurrency(item.price)}</span>
            </span>
          </div>
        </div>

        <div className="flex text-sm font-semibold border-t divide-x">
          <Link href={item.link} className="w-1/2 px-2 py-3 bg-white text-center hover:bg-rose-500 hover:text-white transition-all">Xem chi tiết</Link>
          <div className="w-1/2 px-2 py-3 bg-white text-center hover:bg-rose-500 hover:text-white transition-all">Mua ngay</div>
        </div>
      </div>
    </div>
  )
}

export default ProductSingle