"use client"
import {useEffect, useRef, useState} from 'react'
import { useClickOutside } from '@/lib/clickOutside';
import { getScrollbarWidth } from '@/lib/utils/helper';
import { Button, Zoom } from '@mui/material';
import { Image } from '@prisma/client';
import AdminFormFieldImageModel from './image/ImageModel';
import { register } from 'swiper/element/bundle';
register()

type AdminFormFieldImageType = {
  multiple?: boolean,
  name: string
  required?: boolean
}

const AdminFormFieldImage: React.FC<AdminFormFieldImageType> = ({
  multiple = false,
  name,
  required = false
}) => {
  const [value, setValue] = useState<string>("")
  const [showModal, setShowModal] = useState(false)
  const [images, setImages] = useState<Image[]>([])

  useEffect(() => {
    setValue(multiple ? JSON.stringify(images.map(v => v.id)) : images.length > 0 ? images[0].id : "")
  }, [images])

  return (
    <>
      <p className="text-sm font-semibold mb-1">Ảnh { required && <span className="text-red-500">*</span> }</p>
      <div className='h-40 border rounded bg-white'>
        <input type="hidden" name={name} value={value} className='sr-only' required={required} />
        <div className="w-full h-full flex flex-col justify-center items-center cursor-pointer"
          onClick={() => setShowModal((state) => state = !state)}
        >
          { images.length > 0
            ? <Slide images={images} />
            : <>
              <span className="icon w-10 h-10 text-orange-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 5h13v7h2V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h8v-2H4V5z"></path><path d="m8 11-3 4h11l-4-6-3 4z"></path><path d="M19 14h-2v3h-3v2h3v3h2v-3h3v-2h-3z"></path></svg>
              </span>
              <span className="mt-2 text-xs font-semibold">Bấm để thêm một tài sản hoặc kéo và thả một trong khu vực này</span>
            </>
          }
        </div>
      </div>

      <AdminFormFieldImageModel show={showModal} setShow={setShowModal} multiple={multiple} data={images} setData={setImages} />
    </>
  )
}

const Slide = ({images}: {images: Image[]}) => {
  const swiperElRef = useRef<any>(null);

  useEffect(() => {
    // listen for Swiper events using addEventListener
    swiperElRef.current.addEventListener('progress', (e: any) => {
      const [swiper, progress] = e.detail;
      // console.log(progress);
    });

    swiperElRef.current.addEventListener('slidechange', (e: any) => {
      // console.log('slide changed');
    });
  }, []);

  const nextSlide = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()
    swiperElRef.current.swiper.slideNext()
  }

  const prevSlide = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()
    swiperElRef.current.swiper.slidePrev()
  }

  useEffect(() => {
    swiperElRef.current.swiper.update()
  }, [images])

  return (
    <div className="w-full h-full relative select-none bg-make-transparent">
      <swiper-container
        ref={swiperElRef}
        slides-per-view="1"
        loop={true}
        // navigation={true}
        // navigation={{
        //   nextEl: '.swiper-button-next',
        //   prevEl: '.swiper-button-prev',
        //   disabledClass
        // }}
        style={{width: '100%', height: '100%'}}
      >
        {images.map((v,i) =>
          <swiper-slide key={v.id}>
            <div className="w-full h-full flex flex-col p-1 ">
              <img src={v.url} alt="" className='w-full flex-grow min-h-0 object-contain' />
              <p className="mt-1 text-center text-sm">{v.name}</p>
            </div>
          </swiper-slide>
        )}
      </swiper-container>
      <div className="absolute top-1/2 left-2 z-10 -translate-y-1/2" onClick={(e) => prevSlide(e)}>
        <span className="icon w-8 h-8 rounded-full hover:bg-gray-200 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path></svg>
        </span>
      </div>
      <div className="absolute top-1/2 right-2 z-10 -translate-y-1/2" onClick={(e) => nextSlide(e)}>
        <span className="icon w-8 h-8 rounded-full hover:bg-gray-200 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path></svg>
        </span>
      </div>

      <div className="absolute w-full bottom-7 p-2 z-10 flex justify-center space-x-2 pointer-events-none">
        <span className="icon w-8 h-8 p-1 rounded bg-white border hover:bg-gray-200 cursor-pointer pointer-events-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg>
        </span>
      </div>
    </div>
  )
}

export default AdminFormFieldImage