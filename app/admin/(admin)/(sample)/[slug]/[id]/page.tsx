import AdminContentSampleCreateEdit from '@/components/admin/sample/AdminContentSampleCreateEdit'
import React from 'react'
import { TABLES_SAMPLE } from '../table'
import { getItemDataSample } from '@/lib/admin/sample'
import { useCurrentUserAdmin } from '@/lib/admin/helperServer'
import { checkPermissions } from '@/lib/admin/fields'

type PageState = {
  params: {
    slug: string,
    id: string
  }
}

export default async ({ params: { id, slug } } : PageState) => {
  const table = TABLES_SAMPLE.find(v => v.slug == slug)
  const tablesName = TABLES_SAMPLE.map(v => v.tableName)

  if (table == undefined)
    return <div>Trang không tồn tại</div>

  const admin = await useCurrentUserAdmin()

  if (!checkPermissions(admin?.role.permissions || [], table.tableName, "edit")) {
    return <div>Bạn không có quyền truy cập trang này</div>
  }

  const data = await getItemDataSample({id, table: table.tableName, columns: table.columns})

  if (data == null) {
    return <div className="">Không tìm thấy bản ghi</div>
  }

  return (
    <AdminContentSampleCreateEdit data={data} name={table.name} tableName={table.tableName} columns={table.columns} tablesName={tablesName} />
  )
}