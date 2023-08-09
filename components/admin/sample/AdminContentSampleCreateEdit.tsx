"use client"
import { Backdrop, Button, CircularProgress } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useState, FormEvent } from 'react'
import AdminFormFieldImage from '@/components/admin/form-field/AdminFormFieldImage'
import AdminFormFieldText from '../form-field/AdminFormFieldText'
import AdminFormFieldSelect from '../form-field/AdminFormFieldSelect'
import { VariantType, useSnackbar } from 'notistack'
import { SampleColumnsType } from './AdminContentSample'
import moment from 'moment'
import AdminFormFieldRelation from '../form-field/AdminFormFieldRelation'

export type SampleStateType = {
  data?: any | undefined,
  name: string,
  columns: SampleColumnsType[],
  addEditData: (data: any, edit: boolean) => Promise<void>
}

const AdminContentSampleCreateEdit: React.FC<SampleStateType> = ({
  data, name, columns, addEditData
}) => {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(false)

  const save = async (e: FormEvent) => {
    e.preventDefault()
    if (loading) return

    try {
      setLoading(true)
      
      const data = Object.fromEntries(
        new FormData(e.target as HTMLFormElement),
      );

      await addEditData(data, data != undefined)

      let variant: VariantType = "success"
      enqueueSnackbar('Thành công', { variant })
      
      router.back()
      router.refresh()
    } 
    catch (error) {
      console.log({error})
      let variant: VariantType = "error"
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại sau', { variant })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={save}>
      <input type="hidden" name="id" value={data.id || ''} />

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

        <Button className='!ml-auto' disabled={!data} variant="contained" color={(data ? data.publish == 'publish' : false) ? 'black' : 'secondary'} startIcon={(
          <span className="material-symbols-outlined">
            {(data ? data.publish == 'publish' : false) ? 'remove' : 'check'}
          </span>
        )}>
          {(data ? data.publish == 'publish' : false) ? 'Nháp' : 'Xuất bản'}
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
                <div className="w-1/2 px-2 mb-4" key={column.key}>
                  { column.type == 'select'
                    ? <AdminFormFieldSelect 
                        defaultValue={data ? data[column.key] : undefined} 
                        name={column.key} 
                        required={column.required} 
                        title='Danh mục' 
                        list={column.details.list} 
                      />
                    : column.type == 'image' ? 
                      <AdminFormFieldImage 
                        defaultValue={data ? data[column.key] : undefined} 
                        multiple={column.details.multiple}
                        name={column.key} 
                        required={column.required} 
                      />
                    : column.type == 'int' ? 
                      <AdminFormFieldText 
                        number={true} 
                        defaultValue={data ? data[column.key] : undefined} 
                        name={column.key} 
                        required={column.required} 
                        title={column.label} 
                      />
                    : column.type == 'relation' ? 
                      <AdminFormFieldRelation
                        defaultValue={data ? data[column.key] : undefined} 
                        api={column.details.api}
                        name={column.key} 
                        required={column.required} 
                        title={column.label} 
                      />
                    : <AdminFormFieldText 
                        defaultValue={data ? data[column.key] : undefined} 
                        name={column.key} 
                        required={column.required} 
                        title={column.label} 
                      />
                  }
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/4 px-2 mb-4 flex flex-col space-y-4">
          <div className={`w-full p-4 border rounded flex space-x-2 items-center text-sm
            ${(data ? data.publish == 'publish' : false) ? 'bg-purple-100 border-purple-400 text-purple-600' : 'bg-blue-100 border-blue-400 text-blue-600'}
          `}>
            <span className="w-2 h-2 rounded-full bg-current"></span>
            <span className="font-semibold">{data ? 'Chỉnh sửa' : 'Tạo mới'}</span>
            <span>phiên bản {(data ? data.publish == 'publish' : false) ? 'xuất bản' : 'nháp'}</span>
          </div>

          <div className="w-full p-4 bg-white rounded shadow">
            <h5 className="uppercase text-sm border-b pb-2">Thông tin</h5>

            <div className="flex flex-col space-y-4 mt-4 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">CreatedAt</span>
                <span>{data ? moment(data.createdAt).format('YYYY-MM-DD HH:mm:ss') : 'now'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">UpdatedAt</span>
                <span>{data ? moment(data.updatedAt).format('YYYY-MM-DD HH:mm:ss') : 'now'}</span>
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

export default AdminContentSampleCreateEdit