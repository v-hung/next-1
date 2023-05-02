"use client"
import Link from 'next/link'
import React from 'react'
import Container from './Container'

export type ItemInListProductType = {
  image: string
  title: string,
  accountNumber?: number
  sold?: number
  type?: "account" | "luck"
}

export type ListProductType = {
  title: string
  items: ItemInListProductType[]
}

const ListProduct: React.FC<ListProductType> = ({
  title,
  items
}) => {
  return (
    <Container className="mt-16">
      <h3 className="text-xl font-semibold text-center uppercase md:text-2xl lg:text-3xl">{title}</h3>
      <div className="w-20 mx-auto h-0.5 bg-blue-500 mt-4 mb-8"></div>

      <div className="flex flex-wrap -mx-2">
        {items.map((v,i) => 
          <div className="w-1/4 px-2 mb-4" key={i}>
            <div className="w-full bg-white shadow rounded overflow-hidden">
              <div className="relative w-full pb-[60%]">
                <img src={v.image} alt="" className='bg-full object-cover' />
              </div>
              <div className="p-4">
                <h3 className="font-semibold uppercase text-orange-500">{v.title}</h3>
                <div className='table mt-2'>
                  {v.accountNumber
                    ? <div className='table-row'>
                      <div className='table-cell py-1 pr-4'>Số tài khoản</div>
                      <div className='table-cell font-semibold'>{v.accountNumber}</div>
                    </div> : null
                  }
                  {v.sold
                    ? <div className='table-row'>
                      <div className='table-cell py-1 pr-4'>{v.type == "account" ? "Đã bán" : "Đã quay"}</div>
                      <div className='table-cell font-semibold'>{v.sold}</div>
                    </div> : null
                  }
                </div>

                <div className="mt-4">
                  <Link href={`/shop?category=lien-quan`} 
                    className="block w-full text-center px-4 py-1.5 rounded-full bg-white
                    text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white"
                  >Xem tất cả</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}

export default ListProduct