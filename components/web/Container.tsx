import React from 'react'

const Container = ({children, className}: any) => {
  return (
    <div className={`w-full max-w-screen-xl mx-auto px-4 lg:px-8 ${className}`}>{children}</div>
  )
}

export default Container