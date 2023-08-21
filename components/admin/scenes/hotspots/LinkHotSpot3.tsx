"use client"

import Image from "next/image"
import { css } from "@emotion/react";
import Anim from "./Anim";

const LinkHotSpot3 = ({
  title
}: {
  title: string
}) => {

  return (
    <div className={`absolute top-0 left-0 w-0 h-0 cursor-pointer ${componentCss}`}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group">
        <div className="relative w-24 md:w-32 group overflow-hidden">
          <Image src="/images/arrow.png" alt="arrow" width={300} height={300} className="w-full" />
        </div>

        { title
          ? <div className="title">{title}</div>
          : null
        }
      </div>
    </div>
  )
}

const componentCss = css`
  .title {
    /* text-shadow: rgb(0, 0, 0) 1px 1px 4px; */
    @apply opacity-0 absolute left-1/2 top-1/2 -translate-x-1/2 px-4 py-1 transition-all duration-500 rounded whitespace-nowrap text-white group-hover:bg-stone-700 group-hover:top-full group-hover:opacity-100;
  }
`

export default LinkHotSpot3