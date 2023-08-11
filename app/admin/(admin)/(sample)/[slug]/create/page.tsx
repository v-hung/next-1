import AdminContentSampleCreateEdit from '@/components/admin/sample/AdminContentSampleCreateEdit'
import React from 'react'
import { TABLES_SAMPLE } from '../table'

const page = ({
  params: { slug }
}: { 
  params: { slug: string } 
}) => {
  const table = TABLES_SAMPLE.find(v => v.slug == slug)
  const tablesName = TABLES_SAMPLE.map(v => v.table_name)

  if (table == undefined)
    return <div>Trang không tồn tại</div>

  return (
    <AdminContentSampleCreateEdit name={table.name} table_name={table.table_name} columns={table.columns} tablesName={tablesName} />
  )
}

export default page