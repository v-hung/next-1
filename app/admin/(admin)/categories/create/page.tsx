import AdminContentSampleCreate from '@/components/admin/sample/AdminContentSampleCreate'
import React from 'react'
import { COLUMNS } from '../page'
import db from '@/lib/server/prismadb'
import { SampleColumnsType } from '@/components/admin/sample/AdminContentSample'

const addData = async (data: any) => {
  'use server'

  try {
    const dataCreate: any = COLUMNS.filter(v => !['id', 'createdAt', 'updatedAt', 'publish']
      .includes(v.key)).reduce((cur, pre) => {
        if (pre.type == "date") {
          return { ...cur, [pre.key]: new Date(data[pre.key]) }
        }
        else if (pre.type == "image") {
          if (data[pre.key])
            return { ...cur, [pre.key]: { connect: { id: data[pre.key] } } }
          else
            return cur
        }
        else {
          return { ...cur, [pre.key]: data[pre.key] }
        }
      }, {})

    await db.category.create({
      data: dataCreate
    })
  }
  catch (error) {
    console.log({error})
    throw "Server Error"
  }
}

const page = () => {
  return (
    <AdminContentSampleCreate name='Danh mục' columns={COLUMNS} addData={addData} />
  )
}

export default page