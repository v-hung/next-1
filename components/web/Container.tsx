import React from 'react'

const Container = ({children, className, isPadding = true}: any) => {
  return (
    <div className={`w-full max-w-screen-xl mx-auto ${isPadding ? "px-4 lg:px-8" : ''} ${className}`}>{children}</div>
  )
}

export default Container