import { getCurrentUser } from '@/lib/getCurrentUser'
import { cookies } from 'next/headers';
import React from 'react'
import { redirect } from 'next/navigation';

const page = async () => {
  const userData = await getCurrentUser()

  if (!userData) {
    redirect('/login');
  }

  return (
    <div>page</div>
  )
}

export default page