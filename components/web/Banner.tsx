"use client"
import React, { useEffect, useRef, useState } from 'react'
import Container from './Container'
import Swiper, { Navigation, Parallax } from 'swiper'
  import 'swiper/css'
  import 'swiper/css/parallax'

const Banner = () => {

  const [swiper, setSwiper] = useState<Swiper | null>(null)
  const swiperHtml = useRef(null)

  useEffect(() => {
    if (swiperHtml.current) {
      setSwiper(new Swiper(swiperHtml.current, {
        slidesPerView: 1,
        loop: true,
        modules: [Navigation, Parallax],
        parallax: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      }))
    }
  
    return () => {
      if (swiper) {
        swiper.destroy(false)
      }
    }
  }, [])
  

  return (
    <Container className="mt-8">
      <div className="w-full flex flex-col lg:flex-row lg:space-x-4">
        <div className="w-full lg:order-last lg:w-1/3 bg-stone-600 p-4 text-white">
          <h4 className="text-xl uppercase">Top nạp thẻ tháng</h4>
          <div className="flex flex-col space-y-6 mt-4 py-2">
            {new Array(5).fill(0).map((v,i) =>
              <div className="flex items-center space-x-3" key={i}>
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{i+1}</span>
                </div>
                <h5 className="font-semibold">Viet Hung</h5>
                <div className="!ml-auto px-3 py-1 rounded-full bg-orange-600 text-white">1.00.000d</div>
              </div>
            )}
          </div>
        </div>
        <div className="relative w-full lg:order-last lg:w-2/3 bg-gray-100">
          <div className="w-full min-h-[300px]"></div>
          <div className="absolute w-full h-full top-0 left-0 bg-stone-600">
            <div ref={swiperHtml}
              className="swiper w-full h-full"
            >
              <div className="swiper-wrapper">
                <div className='swiper-slide bg-purple-500 overflow-hidden'>Slide 1</div>
                <div className='swiper-slide bg-green-500 overflow-hidden'>Slide 2</div>
                <div className='swiper-slide bg-rose-500 overflow-hidden'>Slide 3</div>
                <div className='swiper-slide bg-orange-500 overflow-hidden'>Slide 4</div>
              </div>

              <div className="swiper-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <span className="icon w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-200 hover:bg-white hover:text-rose-500 p-1 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path></svg>
                </span>
              </div>
              <div className="swiper-button-next absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
                <span className="icon w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-200 hover:bg-white hover:text-rose-500 p-1 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path></svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Banner