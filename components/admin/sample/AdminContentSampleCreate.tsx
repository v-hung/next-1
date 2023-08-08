"use client"
import { Backdrop, Button, CircularProgress } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useState, FormEvent } from 'react'
import AdminFormFieldImage from '@/components/admin/form-field/AdminFormFieldImage'
import AdminFormFieldText from '../form-field/AdminFormFieldText'
import AdminFormFieldSelect from '../form-field/AdminFormFieldSelect'
import { VariantType, useSnackbar } from 'notistack'
import { SampleColumnsType } from './AdminContentSample'

export type SampleStateType = {
  data?: any | undefined,
  name: string,
  columns: SampleColumnsType[],
  addData: (data: any) => Promise<void>
}

const AdminContentSampleCreate: React.FC<SampleStateType> = ({
  data, name, columns, addData
}) => {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const save = async (e: FormEvent) => {
    e.preventDefault()
    if (loading) return

    try {
      setLoading(true)
      
      const data = Object.fromEntries(
        new FormData(e.target as HTMLFormElement),
      );

      addData(data)

      setError("")
      let variant: VariantType = "success"
      enqueueSnackbar('Thành công', { variant })
      
      router.back()
      router.refresh()
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
        <span className="material-symbols-outlined">
          arrow_left_alt
        </span>
        <span>Trở lại</span>
      </div>

      <section className="flex items-center space-x-4 mt-2">
        <div>
          <h3 className="text-2xl font-semibold">{name}</h3>
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
              {columns.filter(v => !['id', 'createdAt', 'updatedAt', 'publish'].includes(v.key)).map(column =>
                <div className="w-1/2 px-2 mb-4">
                  { column.type == 'select'
                    ? <AdminFormFieldSelect name='type' required={true} title='Danh mục' list={column.details.list} />
                    : column.type == 'image' ? <AdminFormFieldImage name='image' required={true} />
                    : <AdminFormFieldText name={column.key} required={true} title={column.label} />
                  }
                </div>
              )}
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

      <Backdrop
        sx={{ color: '#fff', zIndex: '99999' }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </form>
  )
}

export default AdminContentSampleCreate