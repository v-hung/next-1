"use client"
import React, { useState, useEffect } from 'react'
import Container from './Container'
import useAppConfig from '@/stores/web/appConfig'

const Footer = ({className}: any) => {
  const appConfig = useAppConfig()
  
  const [hostname, setHostname] = useState("")

  useEffect(() => setHostname(window.location.hostname), [])

  return (
    <div className={`bg-slate-600 text-white ${className}`}>
      <Container className="pt-12">
        <div className="flex -mx-4">
          <div className="w-full md:w-1/2 mb-8 px-4">
            <h3 className="text-xl uppercase font-bold">Về <span className="text-sky-500">{appConfig.name}</span></h3>
            <p className="mt-4 text-gray-300">Shop bán acc LIÊN QUÂN, TỐC CHIẾN, FREE FIRE Uy Tín - Giá Rẻ - Chất Lượng. Giao dịch tự động 24/24</p>

            <div className="mt-6 flex flex-col divide-y text-gray-300 divide-slate-500">
              <p className='hover:text-sky-500 cursor-pointer font-semibold py-2'>Liên Hệ Làm CTV</p>
              <p className='hover:text-sky-500 cursor-pointer font-semibold py-2'>Facebook Admin</p>
              <p className='hover:text-sky-500 cursor-pointer font-semibold py-2'>Privacy Policy</p>
              <p className='hover:text-sky-500 cursor-pointer font-semibold py-2'>Terms of Service</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 mb-8 px-4">
            <h3 className="text-xl uppercase font-bold">CHÚNG TÔI Ở ĐÂY</h3>
            <p className="mt-4 text-gray-300">Chúng tôi làm việc một cách chuyên nghiệp, uy tín, nhanh chóng và luôn đặt quyền lợi của bạn lên hàng đầu</p>

            <div className="mt-6 flex space-x-4">
              <span className="icon w-8 h-8 bg-gray-800 p-1 hover:bg-gray-900 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path></svg>
              </span>
              <span className="icon w-8 h-8 bg-gray-800 p-1 hover:bg-gray-900 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21.593 7.203a2.506 2.506 0 0 0-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.404a2.56 2.56 0 0 0-1.766 1.778c-.413 1.566-.417 4.814-.417 4.814s-.004 3.264.406 4.814c.23.857.905 1.534 1.763 1.765 1.582.43 7.83.437 7.83.437s6.265.007 7.831-.403a2.515 2.515 0 0 0 1.767-1.763c.414-1.565.417-4.812.417-4.812s.02-3.265-.407-4.831zM9.996 15.005l.005-6 5.207 3.005-5.212 2.995z"></path></svg>
              </span>
            </div>

            <div className="mt-6 flex flex-col space-y-4">
              <div className="flex space-x-2 font-semibold">
                <span className="icon text-sky-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className='rotate-90'><path d="m20.487 17.14-4.065-3.696a1.001 1.001 0 0 0-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 0 0 .043-1.391L6.859 3.513a1 1 0 0 0-1.391-.087l-2.17 1.861a1 1 0 0 0-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 0 0 .648-.291l1.86-2.171a.997.997 0 0 0-.085-1.39z"></path></svg>
                </span>
                <a href={`call:${appConfig.phone}`}>{appConfig.phone}</a>
                <span>{hostname}</span>
              </div>
              <div className="flex space-x-2 font-semibold">
                <span className="icon text-sky-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z"></path></svg>
                </span>
                <span>Làm việc từ 8h đến 23h hằng ngày</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Container isPadding="false">
        <div className="py-6 text-center border-t">{new Date().getFullYear()} © {hostname}</div>
      </Container>
    </div>
  )
}

export default Footer