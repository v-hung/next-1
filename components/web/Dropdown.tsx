"use client"
import React, { useState } from 'react'
import Collapse from '../Collapse'

export type DropdownItemType = {
  value: string
  title: string
}

type DropdownType = {
  isShow: boolean
  setIsShow: any,
  title: string
  items: DropdownItemType[]
}

const Dropdown: React.FC<DropdownType> = ({isShow, setIsShow, title, items}) => {

  const toggleShow = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    setIsShow((state: boolean) => state = !state)
  }

  const [select, setSelect] = useState(Array.isArray(items) && items.length > 0 ? items[0]?.value : "")

  const findTitle = () => {
    return items.find(v => v.value == select)?.title || ""
  }

  const changeValue = (value: string) => {
    setSelect(value)
    setIsShow(false)
  }

  return (
    <div className="relative select-none">
      <div
        className="flex items-center space-x-3 rounded bg-white py-2 px-3 border active:bg-gray-100 cursor-pointer"
        onClick={(e) => toggleShow(e)}
      >
        <span className=''>{title}</span>
        { select ? <span className='text-gray-700 font-semibold'>{findTitle()}</span> : null }
        <span className="icon w-3 h-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z"></path></svg>
        </span>
      </div>
      <div className="absolute min-w-full w-max top-full left-0 shadow select-none">
        <Collapse show={isShow} setShow={setIsShow}>
          <div className="bg-white rounded py-2 border">
            { items.map((v,i) =>
              <div 
                className="hover:bg-blue-200 px-4 py-2 cursor-pointer" key={i}
                onClick={() => changeValue(v.value)}
              >{v.title}</div>
            )}
          </div>
        </Collapse>
      </div>
    </div>
  )
}

export default Dropdown