"use client"
import { Image } from '@prisma/client'
import React, { useEffect, useRef } from 'react'
import Swiper, { Navigation } from 'swiper';
// import Swiper styles
import 'swiper/css';
// import 'swiper/css/navigation';

const ImageSlide = ({images}: {images: Image[]}) => {
  const swiperEl = useRef<HTMLDivElement | null>(null)
  const swiper = useRef<Swiper | null>(null)

  useEffect(() => {
    if (swiperEl.current) {
      swiper.current = new Swiper(swiperEl.current, {
        slidesPerView: 1,
        loop: true,
        // navigation: {
        //   nextEl: '.swiper-button-next',
        //   prevEl: '.swiper-button-prev',
        // },
        // modules: [Navigation]
      })

    }

    return () => {
      if (swiper.current)
        swiper.current.destroy()
    }
  }, [])

  const nextSlide = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()
    swiper.current?.slideNext()
  }

  const prevSlide = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()
    swiper.current?.slidePrev()
  }

  useEffect(() => {
    swiper.current?.update()
  }, [images])

  return (
    <div className="w-full h-full relative select-none bg-make-transparent">
      <div className="swiper h-full" ref={swiperEl}>
        <div className="swiper-wrapper">
          {images.map((v,i) =>
            <div className='swiper-slide w-full h-full !flex flex-col' key={v.id}>
              <img src={v.url} alt="" className='my-1 w-full flex-grow min-h-0 object-contain' loading='lazy' />
              <p className="m-1 text-center text-sm">{v.name}</p>
            </div>
          )}
        </div>
        <div className="absolute top-1/2 left-2 z-10 -translate-y-1/2" onClick={prevSlide}>
          <span className="icon w-10 h-10 rounded-full hover:bg-gray-200 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path></svg>
          </span>
        </div>
        <div className="absolute top-1/2 right-2 z-10 -translate-y-1/2" onClick={nextSlide}>
          <span className="icon w-10 h-10 rounded-full hover:bg-gray-200 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path></svg>
          </span>
        </div>

        <div className="absolute w-full bottom-7 p-2 z-10 flex justify-center space-x-2 pointer-events-none">
          <span className="icon w-8 h-8 p-1 rounded bg-white border hover:bg-gray-200 cursor-pointer pointer-events-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg>
          </span>
        </div>
      </div>
    </div>
  )
}

export default ImageSlide