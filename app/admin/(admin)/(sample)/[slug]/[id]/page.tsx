import AdminContentSampleCreateEdit from '@/components/admin/sample/AdminContentSampleCreateEdit'
import React from 'react'
import { TABLES_SAMPLE } from '../table'
import { getItemDataSample } from '@/lib/server/sample'

type PageState = {
  params: {
    slug: string,
    id: string
  }
}

export default async ({ params: { id, slug } } : PageState) => {
  const table = TABLES_SAMPLE.find(v => v.slug == slug)

  if (table == undefined)
    return <div>Trang không tồn tại</div>

  const data = await getItemDataSample({id, table: table.table_name, columns: table.columns})

  if (data == null) {
    return <div className="">Không tìm thấy bản ghi</div>
  }

  return (
    <AdminContentSampleCreateEdit data={data} name={table.name} table_name={table.table_name} columns={table.columns} />
  )
}