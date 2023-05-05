"use client"
import { useSession } from 'next-auth/react'
import React, { useRef } from 'react'
import Container from './Container'

const ContentLucky = () => {
  const {data: session} = useSession()
  console.log(session?.user)

  const wheelRef = useRef<HTMLDivElement>(null)

  const data = [
    { name: "Iphone 4", percent: 60},
    { name: "Iphone 5", percent: 50},
    { name: "Iphone 6", percent: 40},
    { name: "Iphone 7", percent: 30},
    { name: "Iphone 8", percent: 20},
    { name: "Iphone x", percent: 10}
  ]

  const size = data.length
  const rotate = 360 / size
  const skewY = 90 - rotate

  const random = () => {
    const expanded = data.flatMap(item => Array(item.percent).fill(item));
    const winner = expanded[Math.floor(Math.random() * expanded.length)];
    console.log("winner: " + winner.name);
  }

  const start = () => {
    if (!wheelRef.current) return
    
    wheelRef.current.classList.add("animate-spin")
    let a = random()
  }

  return (
    <Container className="mt-12">
      <div className="flex -mx-4 flex-wrap">
        <div className="w-full lg:w-1/2 px-4 mb-8">
          <div className="relative inline-block">
            <div ref={wheelRef} className="relative w-96 h-96 border-8 border-red-600 rounded-full overflow-hidden"
              style={{transition: 'cubic-bezier(.075, .82, .165, 1) 7s'}}
            >
              {data.map((v,i) =>
                <div
                  style={{ transform: `rotate(${rotate * i}deg) skewY(-${skewY}deg)` }}
                  className={`absolute top-0 right-0 w-1/2 h-1/2 origin-[0_100%] ${i & 1 ? 'bg-green-500' : 'bg-blue-500'}`}
                >
                  <div
                    className='absolute -left-full w-[200%] h-[200%] text-center pt-2 text-white'
                    style={{ transform: `skewY(${skewY}deg) rotate(${rotate / 2}deg)` }}
                  >{v.name}</div>
                </div>
              )}
            </div>

            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-teal-500"
              onClick={start}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 text-white">
                <span className="icon w-8 h-8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m12 3.879-7.061 7.06 2.122 2.122L12 8.121l4.939 4.94 2.122-2.122z"></path><path d="m4.939 17.939 2.122 2.122L12 15.121l4.939 4.94 2.122-2.122L12 10.879z"></path></svg>
                </span>
              </div>
              <div className="w-full h-full grid place-items-center text-white font-semibold text-sm">Quay</div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default ContentLucky