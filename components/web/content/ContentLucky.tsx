"use client"
import { useSession } from 'next-auth/react'
import React, { useRef, useState } from 'react'
import Container from '../Container'

let currentRotate = 0

const ContentLucky = () => {
  const {data: session} = useSession()
  // console.log(session?.user)

  const wheelRef = useRef<HTMLDivElement>(null)
  const [spinning, setSpinning] = useState(false)

  const data = [
    { id: 1, name: "Iphone 4", percent: 60},
    { id: 2, name: "Iphone 5", percent: 50},
    { id: 3, name: "Iphone 6", percent: 40},
    { id: 4, name: "Iphone 7", percent: 30},
    { id: 5, name: "Iphone 8", percent: 20},
    { id: 6, name: "Iphone x", percent: 10}
  ]

  const size = data.length
  const rotate = 360 / size
  const skewY = 90 - rotate
  // const [currentRotate, setCurrentRotate] = useState(0)
  

  const random = () => {
    const expanded = data.flatMap(item => Array(item.percent).fill(item))
    const winner = expanded[Math.floor(Math.random() * expanded.length)]
    return winner
  }

  const start = async () => {
    if (!wheelRef.current || spinning) return

    setSpinning(true)

    document.querySelector('.anim-load')?.classList.add('load')

    await new Promise((res) => setTimeout(() => res(1), 500))
    let a = random()
    let index = data.findIndex(v => v.id == a.id)

    // setCurrentRotate((state) => state + 360 * 10)
    currentRotate += 360 * 10

    document.querySelector('.anim-load')?.classList.remove('load')
    
    wheelRef.current.style.transform = `rotate(${
      currentRotate - index * rotate - rotate / 2
    }deg)`
    
    setTimeout(() => {
      setSpinning(false)
    }, 7000);
  }

  return (
    <Container className="mt-12">
      <div className="flex -mx-4 flex-wrap">
        <div className="w-full lg:w-1/2 px-4 mb-8">
          <div className="relative inline-block">
            <div ref={wheelRef} className="relative w-96 h-96 border-4 border-red-500 rounded-full overflow-hidden"
              style={{transition: 'cubic-bezier(.075, .82, .165, 1) 7s'}}
            >
              {data.map((v,i) =>
                <div
                  key={i}
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

            <style jsx>{`
              .anim-load.load .child{
                display: block !important
              }
            `}</style>

            <div className="anim-load absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20">
              <div className="child hidden absolute w-full h-full border-4 border-white border-r-transparent z-10 rounded-full animate-spin"></div>
              <div
                className="relative w-full h-full rounded-full bg-red-500 hover:cursor-pointer"
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
      </div>
    </Container>
  )
}

export default ContentLucky