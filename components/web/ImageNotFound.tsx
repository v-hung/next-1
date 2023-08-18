import React from 'react'

const ImageNotFound = ({className}: {className?: string}) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-2 bg-gray-50 text-gray-500 ${className}`}>
      <span className="icon !text-4xl">no_photography</span>
      <span className="text-sm">Không tìm thấy ảnh</span>
    </div>
  )
}

export default ImageNotFound