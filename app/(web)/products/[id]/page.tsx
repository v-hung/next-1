import ClientOnly from '@/components/ClientOnly';
import BtnBuyByEWallet from '@/components/web/BtnBuyByEWallet';
import Container from '@/components/web/Container'
import ProductSlideImage from '@/components/web/ProductSlideImage';
import Link from 'next/link';
import React from 'react'

type PageType = {
  params: { id: string };
}

const page = ({params}: PageType) => {

  const images = [
    "https://shopdangym.com/tep-tin/16830692411.png", 
    "https://shopdangym.com/tep-tin/1683069241z4312532869626_db857926804b0331810f8a9a9e52170c.jpg",
    "https://shopdangym.com/tep-tin/1683069241z4312532869631_6d734762271fbd90d39195538a1515d2.jpg"  
  ]

  return (
    <Container className="mt-12">
      <h3 className="mt-6 text-xl md:text-2xl lg:text-3xl font-bold text-center">
        THÔNG TIN TÀI KHOẢN 
        <span className='text-red-500'> #19854</span>
      </h3>
      <div className="w-20 h-0.5 mx-auto bg-[#32c5d2] my-8"></div>
      <p className="text-center">Để Xem thêm chi tiết về tài khoản vui lòng kéo xuống bên dưới.</p>

      <div className="mt-12 flex flex-wrap">
        <div className="w-full lg:w-1/3 font-bold">
          <div className="flex items-center space-x-2">
            <div className="flex-grow h-[1px] bg-gray-400"></div>
            <span className="icon w-20 h-20 flex-none text-[#32c5d2]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z"></path></svg>
            </span>
            <div className="flex-grow h-[1px] bg-gray-400"></div>
          </div>
          <div className="mt-8 text-red-500 text-center text-xl">#19854</div>
          <div className="mt-4 text-center text-xl uppercase">Liên quân rẻ</div>
        </div>

        <div className="w-full lg:w-1/3 font-bold">
          <div className="flex items-center space-x-2">
            <div className="flex-grow h-[1px] bg-gray-400"></div>
            <span className="icon w-20 h-20 flex-none text-[#32c5d2]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21 4H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm-1 11a3 3 0 0 0-3 3H7a3 3 0 0 0-3-3V9a3 3 0 0 0 3-3h10a3 3 0 0 0 3 3v6z"></path><path d="M12 8c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"></path></svg>
            </span>
            <div className="flex-grow h-[1px] bg-gray-400"></div>
          </div>
          <div className="mt-8 text-center text-xl">GIÁ CARD: <span className='text-red-500'>450,000 VNĐ</span></div>
          <div className="mt-4 text-center text-xl">VÍ ĐIỆN TỬ: <span className='text-red-500'>382,500 VNĐ</span></div>
        </div>

        <div className="w-full lg:w-1/3 font-bold">
          <div className="flex items-center space-x-2">
            <div className="flex-grow h-[1px] bg-gray-400"></div>
            <span className="icon w-20 h-20 flex-none text-[#32c5d2]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21 4H2v2h2.3l3.521 9.683A2.004 2.004 0 0 0 9.7 17H18v-2H9.7l-.728-2H18c.4 0 .762-.238.919-.606l3-7A.998.998 0 0 0 21 4z"></path><circle cx="10.5" cy="19.5" r="1.5"></circle><circle cx="16.5" cy="19.5" r="1.5"></circle></svg>
            </span>
            <div className="flex-grow h-[1px] bg-gray-400"></div>
          </div>
          <div className="mt-8 flex flex-col space-y-2 items-center text-sm uppercase">
            <Link href="/recharge" className="bg-sky-500 text-white px-6 py-2">Mua ngay</Link>
            <BtnBuyByEWallet title='Mua bằng ví điện tử' />
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap -mx-2">
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
          <div className="flex items-center">
            <div className="flex-grow h-[1px] bg-[#32c5d2]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#32c5d2]"></div>
            <div className="flex-grow h-[1px] bg-[#32c5d2]"></div>
          </div>
          <div className="mt-6 text-center text-sm font-semibold uppercase">rank <span className='text-red-500'>Cao thủ</span></div>
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
          <div className="flex items-center">
            <div className="flex-grow h-[1px] bg-[#32c5d2]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#32c5d2]"></div>
            <div className="flex-grow h-[1px] bg-[#32c5d2]"></div>
          </div>
          <div className="mt-6 text-center text-sm font-semibold uppercase">Số tướng <span className='text-red-500'>90</span></div>
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
          <div className="flex items-center">
            <div className="flex-grow h-[1px] bg-[#32c5d2]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#32c5d2]"></div>
            <div className="flex-grow h-[1px] bg-[#32c5d2]"></div>
          </div>
          <div className="mt-6 text-center text-sm font-semibold uppercase">Trang phục <span className='text-red-500'>116</span></div>
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
          <div className="flex items-center">
            <div className="flex-grow h-[1px] bg-[#32c5d2]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#32c5d2]"></div>
            <div className="flex-grow h-[1px] bg-[#32c5d2]"></div>
          </div>
          <div className="mt-6 text-center text-sm font-semibold uppercase">Bậc ngọc <span className='text-red-500'>80</span></div>
        </div>
      </div>

      <div className="mt-12 border-t ">
        <div className="py-6 text-lg text-center font-semibold text-[#32c5d2]">Hình ảnh chi tiết của tài khoản LQ RẺ<span className='text-red-500'> #19854</span></div>
        <div className="flex items-center">
          <div className="flex-grow h-[1px] bg-[#32c5d2]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#32c5d2]"></div>
          <div className="flex-grow h-[1px] bg-[#32c5d2]"></div>
        </div>
      </div>

      <div className="mt-6">
        <ClientOnly>
          <ProductSlideImage images={images} />
        </ClientOnly>
      </div>

      <div className="mt-12"></div>
    </Container>
  )
}

export default page