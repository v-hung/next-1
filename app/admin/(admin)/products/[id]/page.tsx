import AdminContentSampleCreateEdit from '@/components/admin/sample/AdminContentSampleCreateEdit'
import React from 'react'
import { COLUMNS, NAME, addEditData, getItemData } from '../page'

type PageState = {
  params: {
    id: string
  }
}

export default async ({ params: { id } } : PageState) => {
  const data = await getItemData({id})

  if (data == null) {
    return <div className="">Không tìm thấy bản ghi</div>
  }

  return (
    <AdminContentSampleCreateEdit data={data} name={NAME} columns={COLUMNS} addEditData={addEditData} />
  )
}