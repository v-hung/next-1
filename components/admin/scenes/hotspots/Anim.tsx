"use client"
import '@lottiefiles/lottie-player'

const Anim = ({src}: {src: string}) => {
  return (
    // @ts-ignore
    <lottie-player             
      src={src}
      autoplay
      loop
    />
  )
}

export default Anim