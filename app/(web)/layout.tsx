import { getCurrentUser } from '@/lib/getCurrentUser'
import React from 'react'

const layout = async ({children}: any) => {
  const currentUser = await getCurrentUser()
  return (
    {children}
  )
}

export default layout