import AdminContentSampleCreate from '@/components/admin/sample/AdminContentSampleCreate'
import React from 'react'
import { COLUMNS } from '../page'
import db from '@/lib/server/prismadb'

const addData = async (data: any) => {
  'use server'
  // await db.category.deleteMany({
  //   where: {
  //     id: {
  //       in: ids
  //     }
  //   }
  // })
}

const page = () => {
  return (
    <AdminContentSampleCreate name='Danh mục' columns={COLUMNS} addData={addData} />
  )
}

export default page