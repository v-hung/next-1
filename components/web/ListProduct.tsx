"use client"
import Link from 'next/link'
import React from 'react'
import Container from './Container'
import { CategoryState } from '@/app/(web)/page'
import { Button } from '@mui/material'
import Image from 'next/image'
import ImageNotFound from './ImageNotFound'

export type ListProductType = {
  title: string
  items: CategoryState[]
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
          <div className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4" key={i}>
            <div className="w-full bg-white shadow rounded overflow-hidden">
              <div className="relative w-full pb-[60%]">
                { v.image?.url
                  ? <Image 
                    src={v.image?.url} 
                    width={v.image.naturalWidth || 500} 
                    height={v.image.height || 500} 
                    className='bg-full object-cover'
                    alt={v.image.caption || v.image.name} 
                  />
                  : <ImageNotFound className='bg-full' />
                }
              </div>
              <div className="p-4">
                <h3 className="font-semibold uppercase text-yellow-500 text-center">{v.title}</h3>
                <div className='table mt-2 mx-auto text-sm text-gray-700'>
                  {v.accountNumber
                    ? <div className='table-row'>
                      <div className='table-cell py-1 pr-4'>Số tài khoản</div>
                      <div className='table-cell font-semibold'>{v.accountNumber}</div>
                    </div> : null
                  }
                  {v.sold
                    ? <div className='table-row'>
                      <div className='table-cell py-1 pr-4'>{v.type != "vong-quay" ? "Đã bán" : "Đã quay"}</div>
                      <div className='table-cell font-semibold'>{v.sold}</div>
                    </div> : null
                  }
                </div>

                <div className="mt-4 flex justify-center px-4">
                  <Button LinkComponent={Link} variant='outlined' fullWidth={true} href={`/shop?category=lien-quan`}>Xem tất cả</Button>
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