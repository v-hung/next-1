"use client"
import { Backdrop, Button, CircularProgress } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useState, FormEvent } from 'react'
import AdminFormFieldImage from '@/components/admin/form-field/AdminFormFieldImage'
import AdminFormFieldText from '../form-field/AdminFormFieldText'
import AdminFormFieldSelect from '../form-field/AdminFormFieldSelect'
import { VariantType, useSnackbar } from 'notistack'
import moment from 'moment'
import AdminFormFieldRelation from '../form-field/AdminFormFieldRelation'
import { AddEditDataSampleState, SampleColumnsType, addEditDataSample } from '@/lib/server/sample'
import AdminFormFieldPermissions from '../form-field/AdminFormFieldPermissions'

export type SampleStateType = {
  data?: any | undefined,
  name: string,
  tableName: string,
  tablesName: string[],
  columns: SampleColumnsType[],
}

const AdminContentSampleCreateEdit: React.FC<SampleStateType> = ({
  data, name, columns, tableName, tablesName
}) => {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(false)

  const save = async (e: FormEvent) => {
    e.preventDefault()
    if (loading) return

    try {
      setLoading(true)
      
      const formData = Object.fromEntries(
        new FormData(e.target as HTMLFormElement),
      )

      await addEditDataSample({data: formData, edit: data != undefined, table: tableName, columns})

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
      { data
        ? <input type={columns.find(v => v.key == "id")?.type == "int" ? 'number': 'string'} readOnly={true} className='sr-only' name="id" value={data.id || ''} />
        : null
      }

      <div className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 bg-transparent cursor-pointer"
        onClick={() => router.back()}
      >
        <span className="material-symbols-outlined">
          arrow_left_alt
        </span>
        <span>Trở lại</span>
      </div>

      <section className="flex items-center space-x-4 mt-2">
        <div className='mr-auto'>
          <h3 className="text-2xl font-semibold">{name}</h3>
        </div>

        { data && typeof data.publish !== 'undefined'
          ? <Button disabled={!data} variant="contained" color={(data ? data.publish == 'publish' : false) ? 'black' : 'secondary'} startIcon={(
            <span className="material-symbols-outlined">
              {(data ? data.publish == 'publish' : false) ? 'remove' : 'check'}
            </span>
          )}>
            {(data ? data.publish == 'publish' : false) ? 'Nháp' : 'Xuất bản'}
          </Button>
          : null
        }

        <Button variant="contained" type='submit'>
          Lưu
        </Button>
      </section>

      <div className="mt-6 flex flex-wrap -mx-2">
        <div className="w-full lg:w-3/4 px-2 mb-4">
          <div className="w-full p-4 bg-white rounded shadow">
            <div className="flex -mx-2 flex-wrap">
              {columns.filter(v => !['id', 'createdAt', 'updatedAt', 'publish'].includes(v.key)).map(column =>
                <div className="px-2 mb-4" key={column.key} style={{ width: column.col ? `${(12 / column.col) * 100}%` : '50%' }}>
                  { column.type == 'select'
                    ? <AdminFormFieldSelect 
                        defaultValue={data ? data[column.key] : undefined} 
                        name={column.key} 
                        required={column.required} 
                        label={column.label}
                        list={column.details.list} 
                      />
                    : column.type == 'image' ? 
                      <AdminFormFieldImage 
                        defaultValue={data ? data[column.key] : undefined} 
                        multiple={column.details.multiple}
                        name={column.key}
                        label={column.label}
                        tableName={tableName}
                        required={column.required} 
                      />
                    : column.type == 'int' ? 
                      <AdminFormFieldText 
                        number={true} 
                        defaultValue={data ? data[column.key] : undefined} 
                        name={column.key} 
                        required={column.required} 
                        label={column.label} 
                      />
                    : column.type == 'relation' ? 
                      <AdminFormFieldRelation
                        defaultValue={data ? data[column.key] : undefined} 
                        tableName={column.details.tableNameRelation}
                        name={column.key} 
                        required={column.required} 
                        titleRelation={column.details.title}
                        label={column.label} 
                      />
                    : column.type == 'permissions' ? 
                      <AdminFormFieldPermissions
                        defaultValue={data ? data[column.key] : undefined} 
                        name={column.key}
                        tablesName={tablesName}
                        label={column.label} 
                      />
                    : <AdminFormFieldText 
                        defaultValue={data ? data[column.key] : undefined} 
                        name={column.key} 
                        required={column.required} 
                        label={column.label} 
                      />
                  }
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/4 px-2 mb-4 flex flex-col space-y-4">
          { data && typeof data.publish !== 'undefined'
            ? <div className={`w-full p-4 border rounded flex space-x-2 items-center text-sm
              ${(data ? data.publish == 'publish' : false) ? 'bg-purple-100 border-purple-400 text-purple-600' : 'bg-blue-100 border-blue-400 text-blue-600'}
            `}>
              <span className="w-2 h-2 rounded-full bg-current"></span>
              <span className="font-semibold">{data ? 'Chỉnh sửa' : 'Tạo mới'}</span>
              <span>phiên bản {(data ? data.publish == 'publish' : false) ? 'xuất bản' : 'nháp'}</span>
            </div>
            : null
          }

          <div className="w-full p-4 bg-white rounded shadow">
            <h5 className="uppercase text-sm border-b pb-2">Thông tin</h5>

            <div className="flex flex-col space-y-4 mt-4 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Thời gian tạo</span>
                <span>{data ? moment(data.createdAt).format('YYYY-MM-DD HH:mm:ss') : 'now'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Thời gian cập nhập</span>
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