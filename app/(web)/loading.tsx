import Container from '@/components/web/Container'
import React from 'react'

const loading = () => {
  return (
    <Container className="w-full h-full">
      <div className="w-full h-full grid place-items-center py-8">
        <span className="w-12 h-12 animate-spin flex items-center justify-center">
          <span className="icon">loading</span>
        </span>
      </div>
    </Container>
  )
}

export default loading