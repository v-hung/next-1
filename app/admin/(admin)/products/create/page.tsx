import AdminContentSampleCreateEdit from '@/components/admin/sample/AdminContentSampleCreateEdit'
import React from 'react'
import { COLUMNS, NAME, addEditData } from '../page'

const page = () => {
  return (
    <AdminContentSampleCreateEdit name={NAME} columns={COLUMNS} addEditData={addEditData} />
  )
}

export default page