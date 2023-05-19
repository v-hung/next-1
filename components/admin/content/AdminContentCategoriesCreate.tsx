"use client"
import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useState, FormEvent } from 'react'
import AdminFormFieldImage from '@/components/admin/form-field/AdminFormFieldImage'
import AdminFormFieldText from '../form-field/AdminFormFieldText'
import AdminFormFieldSelect from '../form-field/AdminFormFieldSelect'
import { VariantType, useSnackbar } from 'notistack'

const AdminContentCategoriesCreate = () => {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const save = async (e: FormEvent) => {
    e.preventDefault()
    if (loading) return

    try {
      setLoading(true)
      
      const { title, type, image } = Object.fromEntries(
        new FormData(e.target as HTMLFormElement),
      );

      var formData: any = new FormData()
      formData.append('title', title)
      formData.append('type', type)
      formData.append('image', image)
      
      const res = await fetch('/api/admin/categories/create', {
        method: 'post',
        body: formData
      })
      
      if (!res.ok) throw ""

      const body = await res.json()

      console.log({body})

      setError("")
      let variant: VariantType = "success"
      enqueueSnackbar('Thành công', { variant })
      
      router.back()
    } 
    catch (error) {
      setError(error as any)
      console.log({error})
      let variant: VariantType = "error"
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại sau', { variant })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={save}>
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

        <Button className='!ml-auto' disabled={true} variant="contained" color='secondary' startIcon={(
          <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>
          </span>
        )}>
          Xuất bản
        </Button>

        <Button variant="contained" type='submit'>
          Lưu
        </Button>
      </section>

      <div className="mt-6 flex flex-wrap -mx-2">
        <div className="w-full lg:w-3/4 px-2 mb-4">
          <div className="w-full p-4 bg-white rounded shadow">
            <div className="flex -mx-2 flex-wrap">
              <div className="w-1/2 px-2 mb-4">
                <AdminFormFieldText name='title' required={true} title='Tiêu đề' />
              </div>
              <div className="w-1/2 px-2 mb-4">
                <AdminFormFieldSelect name='type' required={true} title='Danh mục' list={[
                  { title: 'Game liên quân', value: "lien-quan"},
                  { title: 'Game tốc chiến', value: "toc-chien"},
                  { title: 'Game FREE FIRE', value: "free-fire"},
                  { title: 'Vòng quay may mắn', value: "vong-quay"}
                ]} />
              </div>
              <div className="w-1/2 px-2 mb-4">
                <AdminFormFieldImage name='image' required={true} />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/4 px-2 mb-4 flex flex-col space-y-4">
          <div className="w-full p-4 bg-blue-100 border border-blue-400 text-blue-600 rounded flex space-x-2 items-center text-sm">
            <span className="w-2 h-2 rounded-full bg-current"></span>
            <span className="font-semibold">Tạo mới</span>
            <span>phiên bản nháp</span>
          </div>

          <div className="w-full p-4 bg-white rounded shadow">
            <h5 className="uppercase text-sm border-b pb-2">Thông tin</h5>

            <div className="flex flex-col space-y-4 mt-4 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-600">CreatedAt</span>
                <span>now</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-600">UpdatedAt</span>
                <span>now</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      { loading ? <div className="fixed w-full h-screen top-0 left-0 grid place-items-center bg-white/60 z-[100]">
        <span className="icon animate-spin w-12 h-12">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="20" r="2"></circle><circle cx="12" cy="4" r="2"></circle><circle cx="6.343" cy="17.657" r="2"></circle><circle cx="17.657" cy="6.343" r="2"></circle><circle cx="4" cy="12" r="2.001"></circle><circle cx="20" cy="12" r="2"></circle><circle cx="6.343" cy="6.344" r="2"></circle><circle cx="17.657" cy="17.658" r="2"></circle></svg>
        </span>
      </div> : null}
    </form>
  )
}

export default AdminContentCategoriesCreate