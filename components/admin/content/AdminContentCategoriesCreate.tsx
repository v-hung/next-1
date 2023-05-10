"use client"
import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import React from 'react'
import AdminFormFieldImage from '@/components/admin/form-field/AdminFormFieldImage'

const AdminContentCategoriesCreate = () => {
  const router = useRouter()
  return (
    <>
      <div className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 bg-transparent cursor-pointer"
        onClick={() => router.back()}
      >
        <span className="icon w-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12.707 17.293 8.414 13H18v-2H8.414l4.293-4.293-1.414-1.414L4.586 12l6.707 6.707z"></path></svg>
        </span> 
        <span>Back</span>
      </div>

      <section className="flex items-center space-x-4 mt-2">
        <div>
          <h3 className="text-2xl font-semibold">Danh mục</h3>
          <p className="text-sm text-gray-600 mt-1">10 bản ghi</p>
        </div>

        <Button className='!ml-auto' variant="contained" color='secondary' startIcon={(
          <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>
          </span>
        )}>
          Xuất bản
        </Button>

        <Button variant="contained">
          Lưu
        </Button>
      </section>

      <div className="mt-6 flex flex-wrap -mx-2">
        <div className="w-full lg:w-3/4 px-2 mb-4">
          <div className="w-full p-4 bg-white rounded shadow">
            <AdminFormFieldImage name='asdfsf' />
          </div>
        </div>
        <div className="w-full lg:w-1/4 px-2 mb-4">
          <div className="w-full p-4 bg-blue-100 border border-blue-400 text-blue-600 rounded">
            fsdaf
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminContentCategoriesCreate